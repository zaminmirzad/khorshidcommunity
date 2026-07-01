import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const { email, fullName } = await request.json();

  if (!email || !fullName) {
    return NextResponse.json({ error: 'Email and full name are required.' }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  const { data: member } = await supabase.from('members').select('role').eq('user_id', user.id).single();
  if (!member || member.role !== 'admin') return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });

  const adminClient = createAdminClient();
  const { error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    data: { full_name: fullName },
  });

  if (inviteError) {
    return NextResponse.json({ error: inviteError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
