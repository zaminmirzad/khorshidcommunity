import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient, createAdminClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  let productId: string | null = null;
  let assignmentId: string | null = null;
  try { ({ productId, assignmentId } = await request.json()); } catch {}

  const { data: member } = await supabase.from('members').select('id, email, full_name').eq('user_id', user.id).single();
  if (!member) return NextResponse.json({ error: 'Member not found.' }, { status: 404 });

  const admin = createAdminClient();
  const query = admin.from('fees').select('id, stripe_price_id, name, amount').eq('active', true);
  const { data: fee } = productId
    ? await query.eq('id', productId).single()
    : await query.eq('is_public', true).order('created_at').limit(1).single();

  if (!fee) return NextResponse.json({ error: 'Fee not found.' }, { status: 404 });

  try {
    const price = await stripe.prices.retrieve(fee.stripe_price_id);
    const mode = price.type === 'recurring' ? 'subscription' : 'payment';

    const metadata: Record<string, string> = {
      member_id: member.id,
      product_id: fee.id,
      stripe_price_id: fee.stripe_price_id,
    };
    if (assignmentId) metadata.fee_assignment_id = assignmentId;

    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [{ price: fee.stripe_price_id, quantity: 1 }],
      customer_email: member.email,
      metadata,
      success_url: `${process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL}/dashboard/membership?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL}/dashboard/membership?payment=cancelled`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
