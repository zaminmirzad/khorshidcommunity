'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/reset-password`,
    });

    setLoading(false);
    if (error) {
      setError('Something went wrong. Please try again.');
      return;
    }
    setSent(true);
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
        <Link href="/sign-in" className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors group font-medium">
          <svg className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to sign in
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 pb-12 relative z-10">
        <div className="w-full max-w-[420px]">
          <div className="bg-white/85 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-300/40 border border-white/80 p-8 sm:p-10">

            {sent ? (
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center mx-auto mb-5">
                  <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="font-display font-light text-2xl text-gray-900 mb-2">Check your email</h2>
                <p className="text-sm text-gray-400 mb-6">
                  We sent a password reset link to <span className="font-medium text-gray-600">{email}</span>. It expires in 1 hour.
                </p>
                <Link href="/sign-in" className="text-sm font-semibold text-accent-dark hover:text-accent transition-colors">
                  ← Back to sign in
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <span className="inline-flex items-center gap-2.5 text-accent-dark font-semibold uppercase text-[10px] tracking-[0.2em] mb-4">
                    <span className="w-5 h-px bg-accent" />Password Reset
                  </span>
                  <h1 className="font-display font-light text-4xl text-gray-900 leading-tight">
                    Forgot your<br /><em className="italic text-brand-900">password?</em>
                  </h1>
                  <p className="text-sm text-gray-400 mt-3">Enter your email and we'll send you a reset link.</p>
                </div>

                {error && (
                  <div className="mb-4 px-4 py-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 mb-2">Email Address</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-shimmer w-full bg-accent hover:bg-accent-hover disabled:opacity-60 disabled:cursor-not-allowed text-brand-950 font-semibold py-4 rounded-2xl transition-all duration-300 text-sm tracking-wide shadow-[0_8px_30px_rgba(251,191,36,0.3)] hover:shadow-[0_8px_40px_rgba(251,191,36,0.5)] hover:-translate-y-0.5"
                  >
                    {loading ? 'Sending…' : 'Send Reset Link →'}
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
