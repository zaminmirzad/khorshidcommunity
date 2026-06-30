import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const { id } = await request.json();

  if (!id) return NextResponse.json({ error: 'Missing id.' }, { status: 400 });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  const { data: member } = await supabase.from('members').select('role').eq('user_id', user.id).single();
  if (!member || member.role !== 'admin') return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });

  const { error } = await supabase
    .from('membership_requests')
    .update({ status: 'rejected', reviewed_at: new Date().toISOString() })
    .eq('id', id);

  if (error) return NextResponse.json({ error: 'Update failed.' }, { status: 500 });

  return NextResponse.json({ ok: true });
}
