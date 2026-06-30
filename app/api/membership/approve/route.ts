import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const { id, email, fullName } = await request.json();

  if (!id || !email) {
    return NextResponse.json({ error: 'Missing fields.' }, { status: 400 });
  }

  // Verify the caller is an authenticated admin
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  const { data: member } = await supabase.from('members').select('role').eq('user_id', user.id).single();
  if (!member || member.role !== 'admin') return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });

  // Send invite via Supabase Admin client
  const adminClient = createAdminClient();
  const { error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/sign-up`,
    data: { full_name: fullName },
  });

  if (inviteError) {
    console.error('Invite error:', inviteError);
    return NextResponse.json({ error: 'Failed to send invite.' }, { status: 500 });
  }

  // Mark request as approved
  const { error: updateError } = await supabase
    .from('membership_requests')
    .update({ status: 'approved', reviewed_at: new Date().toISOString() })
    .eq('id', id);

  if (updateError) {
    console.error('Update error:', updateError);
    return NextResponse.json({ error: 'Invite sent but status update failed.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
