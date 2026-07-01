import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createAdminClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

function toISO(unix: number) {
  return new Date(unix * 1000).toISOString();
}

function subPeriod(sub: Stripe.Subscription) {
  const item = sub.items.data[0];
  return {
    current_period_start: item ? toISO(item.current_period_start) : null,
    current_period_end: item ? toISO(item.current_period_end) : null,
  };
}

function invoiceSubId(invoice: Stripe.Invoice): string | null {
  const sub = invoice.parent?.subscription_details?.subscription;
  if (!sub) return null;
  return typeof sub === 'string' ? sub : sub.id;
}

function invoicePriceId(invoice: Stripe.Invoice): string | null {
  const line = invoice.lines.data[0];
  const price = line?.pricing?.price_details?.price;
  if (!price) return null;
  return typeof price === 'string' ? price : price.id;
}

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');
  if (!sig) return NextResponse.json({ error: 'Missing signature.' }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 });
  }

  const admin = createAdminClient();

  switch (event.type) {

    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const { member_id, product_id, stripe_price_id, fee_assignment_id } = session.metadata ?? {};
      if (!member_id) break;

      // ── One-time payment ──────────────────────────────────────────────────
      if (session.mode === 'payment' && session.amount_total) {
        const { data: existing } = await admin
          .from('payments')
          .select('id')
          .eq('stripe_session_id', session.id)
          .maybeSingle();

        if (!existing) {
          const { data: fee } = await admin.from('fees').select('name').eq('id', product_id).maybeSingle();
          const now = new Date().toISOString();

          await admin.from('payments').insert({
            member_id,
            product_id: product_id ?? null,
            fee_assignment_id: fee_assignment_id ?? null,
            stripe_session_id: session.id,
            stripe_price_id: stripe_price_id ?? null,
            amount: session.amount_total,
            currency: session.currency ?? 'usd',
            description: fee?.name ?? 'Payment',
            status: 'paid',
            paid_at: now,
          });

          if (fee_assignment_id) {
            await admin.from('fee_assignments').update({ paid: true, paid_at: now }).eq('id', fee_assignment_id);
          }
        }
        break;
      }

      // ── Subscription checkout ─────────────────────────────────────────────
      if (session.mode === 'subscription' && session.subscription) {
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        // Persist Stripe customer ID so portal route can use it
        await admin.from('members').update({ stripe_customer_id: customerId }).eq('id', member_id);

        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        const period = subPeriod(sub);

        await admin.from('member_subscriptions').upsert({
          member_id,
          stripe_subscription_id: subscriptionId,
          stripe_customer_id: customerId,
          status: sub.status,
          current_period_start: period.current_period_start,
          current_period_end: period.current_period_end,
          cancel_at_period_end: sub.cancel_at_period_end,
          cancel_at: sub.cancel_at ? toISO(sub.cancel_at) : null,
        }, { onConflict: 'stripe_subscription_id' });

        // Record first payment in history if Stripe charged immediately
        if (session.amount_total && session.amount_total > 0) {
          const { data: existing } = await admin
            .from('payments')
            .select('id')
            .eq('stripe_session_id', session.id)
            .maybeSingle();

          if (!existing) {
            const { data: fee } = await admin.from('fees').select('name').eq('id', product_id).maybeSingle();
            await admin.from('payments').insert({
              member_id,
              product_id: product_id ?? null,
              stripe_session_id: session.id,
              stripe_price_id: stripe_price_id ?? null,
              amount: session.amount_total,
              currency: session.currency ?? 'usd',
              description: fee ? `${fee.name} — Monthly` : 'Monthly Subscription',
              status: 'paid',
              paid_at: new Date().toISOString(),
            });
          }
        }
      }
      break;
    }

    // ── Recurring invoice paid ────────────────────────────────────────────────
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId = invoiceSubId(invoice);
      if (!subscriptionId) break;
      // Skip first invoice — already recorded via checkout.session.completed
      if (invoice.billing_reason === 'subscription_create') break;

      const { data: memberSub } = await admin
        .from('member_subscriptions')
        .select('member_id')
        .eq('stripe_subscription_id', subscriptionId)
        .single();

      if (memberSub && invoice.amount_paid > 0) {
        const { data: existing } = await admin
          .from('payments')
          .select('id')
          .eq('stripe_session_id', invoice.id)
          .maybeSingle();

        if (!existing) {
          const priceId = invoicePriceId(invoice);
          const { data: fee } = priceId
            ? await admin.from('fees').select('name').eq('stripe_price_id', priceId).maybeSingle()
            : { data: null };

          const paidAt = invoice.status_transitions?.paid_at
            ? toISO(invoice.status_transitions.paid_at)
            : new Date().toISOString();

          await admin.from('payments').insert({
            member_id: memberSub.member_id,
            stripe_session_id: invoice.id,
            stripe_price_id: priceId,
            amount: invoice.amount_paid,
            currency: invoice.currency,
            description: fee ? `${fee.name} — Monthly` : 'Monthly Subscription',
            status: 'paid',
            paid_at: paidAt,
          });
        }
      }
      break;
    }

    // ── Recurring invoice failed ──────────────────────────────────────────────
    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId = invoiceSubId(invoice);
      if (!subscriptionId) break;
      await admin
        .from('member_subscriptions')
        .update({ status: 'past_due' })
        .eq('stripe_subscription_id', subscriptionId);
      break;
    }

    // ── Subscription changed ──────────────────────────────────────────────────
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription;
      const period = subPeriod(sub);
      await admin
        .from('member_subscriptions')
        .update({
          status: sub.status,
          current_period_start: period.current_period_start,
          current_period_end: period.current_period_end,
          cancel_at_period_end: sub.cancel_at_period_end,
          cancel_at: sub.cancel_at ? toISO(sub.cancel_at) : null,
          cancelled_at: sub.status === 'canceled'
            ? (sub.canceled_at ? toISO(sub.canceled_at) : new Date().toISOString())
            : null,
        })
        .eq('stripe_subscription_id', sub.id);
      break;
    }

    // ── Subscription cancelled ────────────────────────────────────────────────
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      await admin
        .from('member_subscriptions')
        .update({
          status: 'canceled',
          cancelled_at: sub.canceled_at ? toISO(sub.canceled_at) : new Date().toISOString(),
        })
        .eq('stripe_subscription_id', sub.id);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
