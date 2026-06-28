'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);

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
        <Link href="/" className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors group font-medium">
          <svg className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to site
        </Link>
      </div>

      {/* Centered form */}
      <div className="flex-1 flex items-center justify-center px-6 pb-12 relative z-10">
        <div className="w-full max-w-[420px]">

          {/* Glass card */}
          <div className="bg-white/85 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-300/40 border border-white/80 p-8 sm:p-10">

            <div className="mb-8">
              <span className="inline-flex items-center gap-2.5 text-accent-dark font-semibold uppercase text-[10px] tracking-[0.2em] mb-4">
                <span className="w-5 h-px bg-accent" />Sign In
              </span>
              <h1 className="font-display font-light text-4xl text-gray-900 leading-tight">
                Welcome<br /><em className="italic text-brand-900">back</em>
              </h1>
            </div>

            <form className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-[11px] text-accent-dark hover:text-accent font-semibold transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword
                      ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    }
                  </button>
                </div>
              </div>

              {/* Remember */}
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-amber-400" />
                <span className="text-sm text-gray-500 select-none group-hover:text-gray-700 transition-colors">
                  Remember me for 30 days
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                className="btn-shimmer w-full bg-accent hover:bg-accent-hover text-brand-950 font-semibold py-4 rounded-2xl transition-all duration-300 text-sm tracking-wide shadow-[0_8px_30px_rgba(251,191,36,0.3)] hover:shadow-[0_8px_40px_rgba(251,191,36,0.5)] hover:-translate-y-0.5"
              >
                Sign In →
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <span className="flex-1 h-px bg-gray-100" />
              <span className="text-[11px] text-gray-400 font-medium">or continue with</span>
              <span className="flex-1 h-px bg-gray-100" />
            </div>

            {/* OAuth */}
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: 'Google',
                  icon: (
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  ),
                },
                {
                  label: 'GitHub',
                  icon: (
                    <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                    </svg>
                  ),
                },
              ].map(({ label, icon }) => (
                <button
                  key={label}
                  className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-2xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
                >
                  {icon}{label}
                </button>
              ))}
            </div>

            <p className="mt-7 text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <Link href="/sign-up" className="text-accent-dark font-semibold hover:text-accent transition-colors">
                Sign up free
              </Link>
            </p>
          </div>

          <p className="mt-5 text-center text-xs text-gray-400">
            By signing in you agree to our{' '}
            <span className="text-gray-500 cursor-pointer hover:underline">Terms</span>
            {' '}&{' '}
            <span className="text-gray-500 cursor-pointer hover:underline">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
}
