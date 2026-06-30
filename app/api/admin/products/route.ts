import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data: member } = await supabase.from('members').select('role').eq('user_id', user.id).single();
  return member?.role === 'admin';
}

export async function GET() {
  if (!await verifyAdmin()) return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  const admin = createAdminClient();
  const { data } = await admin.from('products').select('*').order('created_at', { ascending: false });
  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  if (!await verifyAdmin()) return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });

  const body = await request.json();
  const { name, description, stripe_price_id, stripe_product_id, amount, currency } = body;
  if (!name || !stripe_price_id || !amount) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin.from('products').insert({
    name, description, stripe_price_id, stripe_product_id, amount, currency: currency ?? 'usd',
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
