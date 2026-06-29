'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);
    if (error) { setError(error.message); return; }
    await supabase.auth.signOut();
    setDone(true);
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-brand-50/40 via-surface to-surface relative overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-accent/5 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-brand-200/20 blur-[140px] pointer-events-none" />

      <div className="flex items-center justify-between px-8 py-6 relative z-10">
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image src="/images/logo.jpg" alt="Khorshid Community" width={36} height={36} className="rounded-lg object-cover ring-1 ring-gray-200 group-hover:ring-accent/40 transition-all duration-200" />
          <span className="font-display font-semibold text-gray-900 text-lg">Khorshid<span className="text-accent">.</span></span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 pb-12 relative z-10">
        <div className="w-full max-w-[420px]">
          <div className="bg-white/85 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-300/40 border border-white/80 p-8 sm:p-10">

            {done ? (
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center mx-auto mb-5">
                  <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="font-display font-light text-2xl text-gray-900 mb-2">Password updated</h2>
                <p className="text-sm text-gray-400 mb-6">Your password has been changed. You can now sign in.</p>
                <a
                  href="/sign-in"
                  className="btn-shimmer inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover text-brand-950 font-semibold rounded-2xl transition-all text-sm shadow-[0_8px_30px_rgba(251,191,36,0.3)]"
                >
                  Go to sign in →
                </a>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <span className="inline-flex items-center gap-2.5 text-accent-dark font-semibold uppercase text-[10px] tracking-[0.2em] mb-4">
                    <span className="w-5 h-px bg-accent" />New Password
                  </span>
                  <h1 className="font-display font-light text-4xl text-gray-900 leading-tight">
                    Reset your<br /><em className="italic text-brand-900">password</em>
                  </h1>
                </div>

                {error && (
                  <div className="mb-4 px-4 py-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 mb-2">New Password</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword
                          ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                          : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        }
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 mb-2">Confirm Password</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-shimmer w-full bg-accent hover:bg-accent-hover disabled:opacity-60 disabled:cursor-not-allowed text-brand-950 font-semibold py-4 rounded-2xl transition-all duration-300 text-sm tracking-wide shadow-[0_8px_30px_rgba(251,191,36,0.3)] hover:shadow-[0_8px_40px_rgba(251,191,36,0.5)] hover:-translate-y-0.5"
                  >
                    {loading ? 'Updating…' : 'Update Password →'}
                  </button>
                </form>
              </>
            )}
          </div>

          <p className="mt-5 text-center text-xs text-gray-400">Access is by invitation only.</p>
        </div>
      </div>
    </div>
  );
}
