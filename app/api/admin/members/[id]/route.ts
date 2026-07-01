import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

async function verifyAdmin(selfCheck?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: member } = await supabase.from('members').select('id, role').eq('user_id', user.id).single();
  if (!member || member.role !== 'admin') return null;
  if (selfCheck && member.id === selfCheck) return null;
  return member.id;
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const adminId = await verifyAdmin(id);
  if (!adminId) return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });

  const body = await request.json();
  const admin = createAdminClient();

  if ('role' in body) {
    if (body.role !== 'admin' && body.role !== 'member') {
      return NextResponse.json({ error: 'Invalid role.' }, { status: 400 });
    }
    const { error } = await admin.from('members').update({ role: body.role }).eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  if ('active' in body) {
    const { error } = await admin.from('members').update({ active: !!body.active }).eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  if ('subscription_exempt' in body) {
    const { error } = await admin.from('members').update({ subscription_exempt: !!body.subscription_exempt }).eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'Nothing to update.' }, { status: 400 });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const adminId = await verifyAdmin(id);
  if (!adminId) return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });

  const admin = createAdminClient();

  // Get the auth user_id before deleting the member row
  const { data: member } = await admin.from('members').select('user_id').eq('id', id).single();
  if (!member) return NextResponse.json({ error: 'Member not found.' }, { status: 404 });

  const { error: memberError } = await admin.from('members').delete().eq('id', id);
  if (memberError) return NextResponse.json({ error: memberError.message }, { status: 500 });

  const { error: authError } = await admin.auth.admin.deleteUser(member.user_id);
  if (authError) return NextResponse.json({ error: authError.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
