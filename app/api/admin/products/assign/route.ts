import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: member } = await supabase.from('members').select('id, role').eq('user_id', user.id).single();
  if (!member || member.role !== 'admin') return null;
  return member.id;
}

export async function GET(request: Request) {
  if (!await verifyAdmin()) return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  const { searchParams } = new URL(request.url);
  const product_id = searchParams.get('product_id');
  if (!product_id) return NextResponse.json({ error: 'Missing product_id.' }, { status: 400 });
  const admin = createAdminClient();
  const { data, error } = await admin
    .from('fee_assignments')
    .select('id, label, note, assigned_at, paid, members!member_id(id, full_name, email)')
    .eq('product_id', product_id)
    .eq('paid', false)
    .order('assigned_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  const adminMemberId = await verifyAdmin();
  if (!adminMemberId) return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });

  const { product_id, member_ids, note, label } = await request.json();
  if (!product_id || !member_ids?.length) {
    return NextResponse.json({ error: 'Missing product_id or member_ids.' }, { status: 400 });
  }

  const admin = createAdminClient();

  // Skip members who already have an unpaid assignment for this fee
  const { data: existing } = await admin
    .from('fee_assignments')
    .select('member_id')
    .eq('product_id', product_id)
    .eq('paid', false)
    .in('member_id', member_ids);

  const alreadyPending = new Set((existing ?? []).map((e: { member_id: string }) => e.member_id));
  const toAssign = (member_ids as string[]).filter((id) => !alreadyPending.has(id));

  if (toAssign.length === 0) {
    return NextResponse.json({ ok: true, assigned: 0, skipped: member_ids.length });
  }

  const rows = toAssign.map((member_id: string) => ({
    member_id,
    product_id,
    assigned_by: adminMemberId,
    note: note ?? null,
    label: label ?? null,
    paid: false,
  }));

  const { error } = await admin.from('fee_assignments').insert(rows);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, assigned: toAssign.length, skipped: alreadyPending.size });
}

export async function DELETE(request: Request) {
  if (!await verifyAdmin()) return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  const { assignment_id } = await request.json();
  if (!assignment_id) return NextResponse.json({ error: 'Missing assignment_id.' }, { status: 400 });
  const admin = createAdminClient();
  const { error } = await admin.from('fee_assignments').delete().eq('id', assignment_id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
