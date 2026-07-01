import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createAdminClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const { member_id, product_id, stripe_price_id, fee_assignment_id } = session.metadata ?? {};

    if (member_id && session.amount_total) {
      const adminClient = createAdminClient();

      const { data: existing } = await adminClient
        .from('payments')
        .select('id')
        .eq('stripe_session_id', session.id)
        .maybeSingle();

      if (!existing) {
        const { data: fee } = await adminClient.from('fees').select('name').eq('id', product_id).single();
        const now = new Date().toISOString();

        await adminClient.from('payments').insert({
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
          await adminClient.from('fee_assignments').update({ paid: true, paid_at: now }).eq('id', fee_assignment_id);
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
