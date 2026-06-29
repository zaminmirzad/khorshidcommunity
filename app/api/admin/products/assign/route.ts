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

export async function POST(request: Request) {
  const adminMemberId = await verifyAdmin();
  if (!adminMemberId) return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });

  const { product_id, member_ids, note } = await request.json();
  if (!product_id || !member_ids?.length) {
    return NextResponse.json({ error: 'Missing product_id or member_ids.' }, { status: 400 });
  }

  const rows = member_ids.map((member_id: string) => ({
    member_id, product_id, assigned_by: adminMemberId, note: note ?? null,
  }));

  const admin = createAdminClient();
  const { error } = await admin.from('member_products').upsert(rows, { onConflict: 'member_id,product_id' });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!await verifyAdmin()) return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  const { product_id, member_id } = await request.json();
  const admin = createAdminClient();
  const { error } = await admin.from('member_products').delete().eq('product_id', product_id).eq('member_id', member_id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
