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

  function resolveRedirect(t: typeof type, fallback: string) {
    if (t === 'recovery') return `${origin}/reset-password`;
    if (t === 'invite') return `${origin}/sign-up`;
    return `${origin}${fallback}`;
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(resolveRedirect(type, next));
    }
  }

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type });
    if (!error) {
      return NextResponse.redirect(resolveRedirect(type, next));
    }
  }

  return NextResponse.redirect(`${origin}/sign-in?error=invalid_link`);
}
