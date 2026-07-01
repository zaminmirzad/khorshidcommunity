'use client';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

async function resolveDestination(userId: string, next: string, supabase: ReturnType<typeof createClient>) {
  const { data: member } = await supabase.from('members').select('id').eq('user_id', userId).single();
  return member ? next : '/sign-up';
}

function AuthCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');

  useEffect(() => {
    async function handle() {
      const supabase = createClient();
      const code = searchParams.get('code');
      const token_hash = searchParams.get('token_hash');
      const type = searchParams.get('type');
      const next = searchParams.get('next') ?? '/dashboard';

      // PKCE flow (forgot password)
      if (code) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        if (error || !data.session) { setError('Invalid or expired link.'); return; }
        if (type === 'recovery') { router.replace('/reset-password'); return; }
        router.replace(await resolveDestination(data.session.user.id, next, supabase));
        return;
      }

      // OTP token-hash flow
      if (token_hash && type) {
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash,
          type: type as Parameters<typeof supabase.auth.verifyOtp>[0]['type'],
        });
        if (error || !data.session) { setError('Invalid or expired link.'); return; }
        if (type === 'recovery') { router.replace('/reset-password'); return; }
        router.replace(await resolveDestination(data.session.user.id, next, supabase));
        return;
      }

      // Implicit / hash flow — Supabase sends #access_token=xxx&refresh_token=xxx
      const hash = typeof window !== 'undefined' ? window.location.hash.substring(1) : '';
      const hashParams = new URLSearchParams(hash);
      const access_token = hashParams.get('access_token');
      const refresh_token = hashParams.get('refresh_token');
      const hashType = hashParams.get('type');

      if (access_token && refresh_token) {
        const { data, error } = await supabase.auth.setSession({ access_token, refresh_token });
        if (error || !data.session) { setError('Invalid or expired link.'); return; }
        if (hashType === 'recovery') { router.replace('/reset-password'); return; }
        router.replace(await resolveDestination(data.session.user.id, next, supabase));
        return;
      }

      // Fallback: session may already be set
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.replace(await resolveDestination(data.session.user.id, next, supabase));
        return;
      }

      setError('Invalid or expired link.');
    }

    handle();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{error}</p>
          <a href="/sign-in" className="text-sm font-semibold text-accent-dark hover:text-accent transition-colors">
            Back to sign in
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-400 dark:text-gray-500">Verifying…</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <AuthCallbackInner />
    </Suspense>
  );
}
