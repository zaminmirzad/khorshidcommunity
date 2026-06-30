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
  const { data } = await admin.from('site_stats').select('*').order('sort_order');
  return NextResponse.json(data ?? []);
}

export async function PATCH(request: Request) {
  if (!await verifyAdmin()) return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  const { id, ...updates } = await request.json();
  const admin = createAdminClient();
  const { error } = await admin.from('site_stats').update(updates).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
