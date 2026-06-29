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

  const { title, body } = await request.json();
  if (!title || !body) return NextResponse.json({ error: 'Missing title or body.' }, { status: 400 });

  const admin = createAdminClient();
  const { data, error } = await admin
    .from('announcements')
    .insert({ title, body, created_by: adminMemberId })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
