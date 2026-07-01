import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as 'recovery' | 'invite' | 'email' | 'magiclink' | null;
  const next = searchParams.get('next') ?? '/dashboard';

  const supabase = await createClient();

  async function redirectForUser(userId: string) {
    if (type === 'recovery') return `${origin}/reset-password`;
    const { data: member } = await supabase.from('members').select('id').eq('user_id', userId).single();
    return member ? `${origin}${next}` : `${origin}/sign-up`;
  }

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.session) {
      return NextResponse.redirect(await redirectForUser(data.session.user.id));
    }
  }

  if (token_hash && type) {
    const { data, error } = await supabase.auth.verifyOtp({ token_hash, type });
    if (!error && data.session) {
      return NextResponse.redirect(await redirectForUser(data.session.user.id));
    }
  }

  return NextResponse.redirect(`${origin}/sign-in?error=invalid_link`);
}
