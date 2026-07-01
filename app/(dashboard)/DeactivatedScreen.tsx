'use client';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function DeactivatedScreen() {
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/sign-in');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-6">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m0-6v.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>
        <h1 className="font-display font-light text-2xl text-gray-900 dark:text-white mb-2">
          Account <em className="italic text-amber-600 dark:text-amber-400">Deactivated</em>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8">
          Your account has been temporarily deactivated. Please contact the Khorshid Community admin to reactivate your account.
        </p>
        <button
          onClick={signOut}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 px-5 py-2.5 rounded-md transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>
    </div>
  );
}
