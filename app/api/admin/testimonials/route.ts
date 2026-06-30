import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: member } = await supabase.from('members').select('role').eq('user_id', user.id).single();
  return member?.role === 'admin' ? true : null;
}

export async function GET() {
  const admin = createAdminClient();
  const { data } = await admin.from('testimonials').select('*').order('sort_order').order('created_at');
  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  if (!await verifyAdmin()) return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  const body = await request.json();
  if (!body.name || !body.quote) return NextResponse.json({ error: 'Name and quote are required.' }, { status: 400 });
  const admin = createAdminClient();
  const { data, error } = await admin.from('testimonials').insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(request: Request) {
  if (!await verifyAdmin()) return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  const { id, ...updates } = await request.json();
  const admin = createAdminClient();
  const { error } = await admin.from('testimonials').update(updates).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!await verifyAdmin()) return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  const { id } = await request.json();
  const admin = createAdminClient();
  const { error } = await admin.from('testimonials').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
