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
  const adminId = await verifyAdmin();
  if (!adminId) return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });

  const { title, description, date, location, capacity, is_free, product_id } = await request.json();
  if (!title || !date) return NextResponse.json({ error: 'Missing title or date.' }, { status: 400 });

  const admin = createAdminClient();
  const { data, error } = await admin.from('events').insert({
    title, description: description ?? null, date, location: location ?? null,
    capacity: capacity ? Number(capacity) : null,
    is_free: is_free ?? true,
    product_id: product_id ?? null,
    created_by: adminId,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(request: Request) {
  const adminId = await verifyAdmin();
  if (!adminId) return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });

  const { id, ...updates } = await request.json();
  const admin = createAdminClient();
  const { error } = await admin.from('events').update(updates).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
