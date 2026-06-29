import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  const { productId } = await request.json();
  if (!productId) return NextResponse.json({ error: 'Missing productId.' }, { status: 400 });

  const [{ data: member }, { data: product }] = await Promise.all([
    supabase.from('members').select('id, email, full_name').eq('user_id', user.id).single(),
    supabase.from('products').select('id, stripe_price_id, name, amount').eq('id', productId).eq('active', true).single(),
  ]);

  if (!member) return NextResponse.json({ error: 'Member not found.' }, { status: 404 });
  if (!product) return NextResponse.json({ error: 'Product not found.' }, { status: 404 });

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price: product.stripe_price_id, quantity: 1 }],
    customer_email: member.email,
    metadata: { member_id: member.id, product_id: product.id, stripe_price_id: product.stripe_price_id },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/membership?payment=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/membership?payment=cancelled`,
  });

  return NextResponse.json({ url: session.url });
}
