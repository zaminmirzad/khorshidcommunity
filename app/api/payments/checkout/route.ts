import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  let productId: string | null = null;
  try { ({ productId } = await request.json()); } catch {}

  const { data: member } = await supabase.from('members').select('id, email, full_name').eq('user_id', user.id).single();
  if (!member) return NextResponse.json({ error: 'Member not found.' }, { status: 404 });

  const query = supabase.from('products').select('id, stripe_price_id, name, amount').eq('active', true);
  const { data: product } = productId
    ? await query.eq('id', productId).single()
    : await query.eq('is_public', true).order('created_at').limit(1).single();

  if (!product) return NextResponse.json({ error: 'Product not found.' }, { status: 404 });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: product.stripe_price_id, quantity: 1 }],
      customer_email: member.email,
      metadata: { member_id: member.id, product_id: product.id, stripe_price_id: product.stripe_price_id },
      success_url: `${process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL}/dashboard/membership?payment=success`,
      cancel_url: `${process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL}/dashboard/membership?payment=cancelled`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
