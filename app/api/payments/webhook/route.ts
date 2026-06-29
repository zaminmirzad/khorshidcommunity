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
    const { member_id } = session.metadata ?? {};

    if (member_id && session.amount_total) {
      const adminClient = createAdminClient();
      await adminClient.from('payments').insert({
        member_id,
        stripe_session_id: session.id,
        amount: session.amount_total,
        currency: session.currency ?? 'usd',
        description: 'Annual Membership',
        status: 'paid',
        paid_at: new Date().toISOString(),
      });
    }
  }

  return NextResponse.json({ received: true });
}
