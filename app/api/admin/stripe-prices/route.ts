import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  const { data: member } = await supabase.from('members').select('role').eq('user_id', user.id).single();
  if (!member || member.role !== 'admin') return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });

  const prices = await stripe.prices.list({ active: true, expand: ['data.product'], limit: 100 });

  const result = prices.data.map((price) => {
    const product = price.product as Stripe.Product;
    return {
      stripe_price_id: price.id,
      stripe_product_id: product.id,
      name: product.name,
      description: product.description ?? '',
      amount: price.unit_amount ?? 0,
      currency: price.currency,
    };
  });

  return NextResponse.json(result);
}
