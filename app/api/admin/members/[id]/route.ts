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

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const adminId = await verifyAdmin();
  if (!adminId) return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });

  const { id } = await params;

  if (id === adminId) {
    return NextResponse.json({ error: 'You cannot change your own role.' }, { status: 400 });
  }

  const { role } = await request.json();
  if (role !== 'admin' && role !== 'member') {
    return NextResponse.json({ error: 'Invalid role.' }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin.from('members').update({ role }).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
