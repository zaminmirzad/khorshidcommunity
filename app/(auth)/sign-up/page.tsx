'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const STRENGTH_RULES = [
  { label: 'Min 8 chars', test: (v: string) => v.length >= 8 },
  { label: 'Uppercase',   test: (v: string) => /[A-Z]/.test(v) },
  { label: 'Number',      test: (v: string) => /[0-9]/.test(v) },
  { label: 'Symbol',      test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

function PasswordStrength({ value }: { value: string }) {
  const score = STRENGTH_RULES.filter((r) => r.test(value)).length;
  const barColors = ['bg-red-400', 'bg-orange-400', 'bg-amber-400', 'bg-green-500'];
  const labels = ['Weak', 'Fair', 'Good', 'Strong'];
  if (!value) return null;
  return (
    <div className="mt-2.5 space-y-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < score ? barColors[score - 1] : 'bg-gray-200'}`} />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-x-3 gap-y-0.5">
          {STRENGTH_RULES.map((r) => (
            <span key={r.label} className={`flex items-center gap-1 text-[10px] transition-colors ${r.test(value) ? 'text-green-600' : 'text-gray-400'}`}>
              <span className="text-[9px]">{r.test(value) ? '✓' : '○'}</span>{r.label}
            </span>
          ))}
        </div>
        {score > 0 && (
          <span className={`text-[10px] font-semibold ml-2 shrink-0 ${score <= 1 ? 'text-red-500' : score === 2 ? 'text-orange-500' : score === 3 ? 'text-amber-600' : 'text-green-600'}`}>
            {labels[score - 1]}
          </span>
        )}
      </div>
    </div>
  );
}

export default function SignUpPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    const score = STRENGTH_RULES.filter((r) => r.test(password)).length;
    if (score < 2) {
      setError('Please choose a stronger password.');
      return;
    }

    setLoading(true);
    const supabase = createClient();

    // Update password for the invite session
    const { data: { user }, error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError || !user) {
      setError(updateError?.message ?? 'Something went wrong. Please try your invite link again.');
      setLoading(false);
      return;
    }

    // Create the member record via server route (requires service role)
    const res = await fetch('/api/auth/complete-signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName }),
    });
    const json = await res.json();

    if (!res.ok) {
      setError(json.error ?? 'Profile setup failed. Please contact support.');
      setLoading(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-brand-50/40 via-surface to-surface relative overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-accent/5 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-brand-200/20 blur-[140px] pointer-events-none" />

      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-6 relative z-10">
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/images/logo.jpg"
            alt="Khorshid Community"
            width={36}
            height={36}
            className="rounded-lg object-cover ring-1 ring-gray-200 group-hover:ring-accent/40 transition-all duration-200"
          />
          <span className="font-display font-semibold text-gray-900 text-lg">
            Khorshid<span className="text-accent">.</span>
          </span>
        </Link>
      </div>

      {/* Centered form */}
      <div className="flex-1 flex items-center justify-center px-6 pb-12 relative z-10">
        <div className="w-full max-w-[440px]">

          <div className="bg-white/85 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-300/40 border border-white/80 p-8 sm:p-10">

            <div className="mb-7">
              <span className="inline-flex items-center gap-2.5 text-accent-dark font-semibold uppercase text-[10px] tracking-[0.2em] mb-4">
                <span className="w-5 h-px bg-accent" />Invitation Accepted
              </span>
              <h1 className="font-display font-light text-4xl text-gray-900 leading-tight">
                Set up your<br /><em className="italic text-brand-900">account</em>
              </h1>
              <p className="text-sm text-gray-500 mt-3">Welcome to Khorshid Community. Complete your profile to get started.</p>
            </div>

            {error && (
              <div className="mb-4 px-4 py-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full name */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 mb-2">Full Name</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 mb-2">Create Password</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all duration-200"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showPassword
                      ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    }
                  </button>
                </div>
                <PasswordStrength value={password} />
              </div>

              {/* Confirm */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 mb-2">Confirm Password</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </div>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    required
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Re-enter your password"
                    className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all duration-200"
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showConfirm
                      ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    }
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-shimmer w-full bg-accent hover:bg-accent-hover disabled:opacity-60 disabled:cursor-not-allowed text-brand-950 font-semibold py-4 rounded-2xl transition-all duration-300 text-sm tracking-wide shadow-[0_8px_30px_rgba(251,191,36,0.3)] hover:shadow-[0_8px_40px_rgba(251,191,36,0.5)] hover:-translate-y-0.5"
              >
                {loading ? 'Setting up your account…' : 'Complete Setup →'}
              </button>
            </form>
          </div>

          <p className="mt-5 text-center text-xs text-gray-400">
            This page is for invited members only.
          </p>
        </div>
      </div>
    </div>
  );
}
