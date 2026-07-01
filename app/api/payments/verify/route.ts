import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';
import { createClient, createAdminClient } from '@/lib/supabase/server';

const resend = new Resend(process.env.RESEND_API_KEY);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  const { sessionId } = await request.json();
  if (!sessionId) return NextResponse.json({ error: 'Missing session ID.' }, { status: 400 });

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch {
    return NextResponse.json({ error: 'Invalid session.' }, { status: 400 });
  }

  if (session.payment_status !== 'paid') return NextResponse.json({ paid: false });

  const adminClient = createAdminClient();
  const { member_id, product_id, stripe_price_id, fee_assignment_id } = session.metadata ?? {};
  if (!member_id) return NextResponse.json({ error: 'Missing metadata.' }, { status: 400 });

  // ── Subscription checkout ─────────────────────────────────────────────────
  if (session.mode === 'subscription' && session.subscription) {
    const subscriptionId = session.subscription as string;
    const customerId = session.customer as string;

    // Ensure member_subscriptions row exists (webhook may not have fired yet)
    const { data: existingSub } = await adminClient
      .from('member_subscriptions')
      .select('id')
      .eq('stripe_subscription_id', subscriptionId)
      .maybeSingle();

    if (!existingSub) {
      const sub = await stripe.subscriptions.retrieve(subscriptionId);
      const item = sub.items.data[0];
      await adminClient.from('member_subscriptions').upsert({
        member_id,
        stripe_subscription_id: subscriptionId,
        stripe_customer_id: customerId,
        status: sub.status,
        current_period_start: item ? new Date(item.current_period_start * 1000).toISOString() : null,
        current_period_end: item ? new Date(item.current_period_end * 1000).toISOString() : null,
        cancel_at_period_end: sub.cancel_at_period_end,
        cancel_at: sub.cancel_at ? new Date(sub.cancel_at * 1000).toISOString() : null,
      }, { onConflict: 'stripe_subscription_id' });

      await adminClient.from('members').update({ stripe_customer_id: customerId }).eq('id', member_id);
    }

    // Ensure payment history record exists
    const { data: existingPayment } = await adminClient
      .from('payments')
      .select('id')
      .eq('stripe_session_id', session.id)
      .maybeSingle();

    if (!existingPayment && session.amount_total && session.amount_total > 0) {
      const { data: fee } = await adminClient.from('fees').select('name').eq('id', product_id).maybeSingle();
      await adminClient.from('payments').insert({
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

    return NextResponse.json({ paid: true });
  }

  // ── One-time payment ──────────────────────────────────────────────────────
  const { data: existing } = await adminClient
    .from('payments')
    .select('id')
    .eq('stripe_session_id', session.id)
    .maybeSingle();

  if (existing) return NextResponse.json({ paid: true });

  const { data: fee } = await adminClient
    .from('fees')
    .select('name')
    .eq('id', product_id)
    .maybeSingle();

  const now = new Date().toISOString();

  const { error: insertError } = await adminClient.from('payments').insert({
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

  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

  if (fee_assignment_id) {
    await adminClient.from('fee_assignments').update({ paid: true, paid_at: now }).eq('id', fee_assignment_id);
  }

  try {
    const { data: member } = await adminClient.from('members').select('full_name, email').eq('id', member_id).single();
    if (member?.email) {
      const amount = session.amount_total ?? 0;
      const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: session.currency ?? 'usd' }).format(amount / 100);
      await resend.emails.send({
        from: 'Khorshid Community <noreply@khorshidcommunity.com>',
        to: [member.email],
        subject: 'Payment Confirmed — Khorshid Community',
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
            <div style="background:linear-gradient(135deg,#1e3a8a 0%,#1e1b4b 100%);color:white;padding:24px;border-radius:10px 10px 0 0;text-align:center">
              <h2 style="margin:0 0 4px">Khorshid Community</h2>
              <p style="margin:0;opacity:0.8;font-size:14px">Payment Confirmation</p>
            </div>
            <div style="background:#f9fafb;padding:30px;border-radius:0 0 10px 10px;border:1px solid #e5e7eb">
              <p style="color:#111827;font-size:16px">Dear ${member.full_name},</p>
              <p style="color:#374151">Thank you — your payment has been received and your account has been updated.</p>
              <div style="background:white;border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin:20px 0">
                <p style="margin:0 0 8px;color:#6b7280;font-size:13px;text-transform:uppercase;letter-spacing:0.05em">Payment Details</p>
                <p style="margin:0 0 4px;color:#111827"><strong>${fee?.name ?? 'Payment'}</strong></p>
                <p style="margin:0;color:#16a34a;font-size:20px;font-weight:600">${fmt}</p>
              </div>
              <p style="color:#374151">If you have any questions, please contact us at <a href="mailto:noreply@khorshidcommunity.com" style="color:#1e3a8a">noreply@khorshidcommunity.com</a>.</p>
            </div>
            <p style="text-align:center;color:#9ca3af;font-size:12px;margin-top:16px">© ${new Date().getFullYear()} Khorshid Community</p>
          </div>`,
      });
    }
  } catch {}

  return NextResponse.json({ paid: true });
}
