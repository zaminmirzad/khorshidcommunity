import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: member } = await supabase.from('members').select('role').eq('user_id', user.id).single();
  return member?.role === 'admin' ? true : null;
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await verifyAdmin()) return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  const { id } = await params;
  const updates = await request.json();
  const admin = createAdminClient();
  const { error } = await admin.from('team_members').update(updates).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await verifyAdmin()) return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  const { id } = await params;
  const admin = createAdminClient();
  const { data: item } = await admin.from('team_members').select('storage_path').eq('id', id).single();
  if (item?.storage_path) await admin.storage.from('team').remove([item.storage_path]);
  const { error } = await admin.from('team_members').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
