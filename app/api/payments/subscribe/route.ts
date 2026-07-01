import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient, createAdminClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  let priceId: string | null = null;
  try { ({ priceId } = await request.json()); } catch {}
  if (!priceId) return NextResponse.json({ error: 'Missing priceId.' }, { status: 400 });

  const { data: member } = await supabase
    .from('members')
    .select('id, email, full_name, stripe_customer_id')
    .eq('user_id', user.id)
    .single();
  if (!member) return NextResponse.json({ error: 'Member not found.' }, { status: 404 });

  const admin = createAdminClient();

  // Block if already subscribed
  const { data: existingSub } = await admin
    .from('member_subscriptions')
    .select('status')
    .eq('member_id', member.id)
    .in('status', ['active', 'trialing', 'past_due'])
    .maybeSingle();
  if (existingSub) {
    return NextResponse.json({ error: 'You already have an active subscription.' }, { status: 400 });
  }

  // Verify the fee exists and is a subscription type
  const { data: fee } = await admin
    .from('fees')
    .select('id, name')
    .eq('stripe_price_id', priceId)
    .eq('is_subscription', true)
    .eq('active', true)
    .single();
  if (!fee) return NextResponse.json({ error: 'Subscription fee not found.' }, { status: 404 });

  try {
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: {
        member_id: member.id,
        product_id: fee.id,
        stripe_price_id: priceId,
      },
      success_url: `${process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL}/dashboard/membership?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL}/dashboard/membership?payment=cancelled`,
    };

    if (member.stripe_customer_id) {
      sessionParams.customer = member.stripe_customer_id;
    } else {
      sessionParams.customer_email = member.email;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
