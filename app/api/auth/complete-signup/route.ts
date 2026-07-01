import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const { fullName } = await request.json();

  if (!fullName?.trim()) {
    return NextResponse.json({ error: 'Full name is required.' }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  const admin = createAdminClient();

  // Avoid duplicate member records
  const { data: existing } = await admin.from('members').select('id').eq('user_id', user.id).single();
  if (existing) {
    return NextResponse.json({ ok: true });
  }

  const { error: insertError } = await admin.from('members').insert({
    user_id: user.id,
    email: user.email,
    full_name: fullName.trim(),
  });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
