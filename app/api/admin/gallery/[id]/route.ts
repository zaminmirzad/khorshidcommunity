import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: member } = await supabase.from('members').select('role').eq('user_id', user.id).single();
  if (!member || member.role !== 'admin') return null;
  return user.id;
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const adminId = await verifyAdmin();
  if (!adminId) return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });

  const { id } = await params;
  const updates = await request.json();
  const admin = createAdminClient();

  const { error } = await admin.from('gallery_items').update(updates).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const adminId = await verifyAdmin();
  if (!adminId) return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });

  const { id } = await params;
  const admin = createAdminClient();

  const { data: item } = await admin.from('gallery_items').select('storage_path').eq('id', id).single();
  if (item?.storage_path) {
    await admin.storage.from('gallery').remove([item.storage_path]);
  }

  const { error } = await admin.from('gallery_items').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
