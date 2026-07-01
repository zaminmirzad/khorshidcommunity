import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  const { data: caller } = await supabase.from('members').select('role').eq('user_id', user.id).single();
  if (!caller || caller.role !== 'admin') return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });

  const { memberId, productId, assignmentId, amount, currency, description } = await request.json();
  if (!memberId || !amount) return NextResponse.json({ error: 'Missing fields.' }, { status: 400 });

  const adminClient = createAdminClient();

  const { data: fee } = productId
    ? await adminClient.from('fees').select('name, stripe_price_id').eq('id', productId).maybeSingle()
    : { data: null };

  const now = new Date().toISOString();

  const { error } = await adminClient.from('payments').insert({
    member_id: memberId,
    product_id: productId ?? null,
    fee_assignment_id: assignmentId ?? null,
    stripe_session_id: `manual_${Date.now()}`,
    stripe_price_id: fee?.stripe_price_id ?? null,
    amount: Math.round(amount * 100),
    currency: currency ?? 'usd',
    description: description || fee?.name || 'Manual payment',
    status: 'paid',
    paid_at: now,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (assignmentId) {
    await adminClient.from('fee_assignments').update({ paid: true, paid_at: now }).eq('id', assignmentId);
  }

  return NextResponse.json({ ok: true });
}
