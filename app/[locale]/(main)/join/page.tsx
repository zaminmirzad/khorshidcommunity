'use client';
import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function JoinPage() {
  const t = useTranslations('join');
  const locale = useLocale();
  const isRTL = locale === 'fa';

  const [form, setForm] = useState({ fullName: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting');

    const res = await fetch('/api/membership/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    setStatus(res.ok ? 'success' : 'error');
  }

  if (status === 'success') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-green-100 border border-green-200 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-display text-3xl text-gray-900 mb-3">{t('successTitle')}</h2>
          <p className="text-gray-500 leading-relaxed mb-8">{t('successBody')}</p>
          <Link href="/" className="inline-flex items-center gap-2 text-accent-dark font-semibold hover:text-accent transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRTL ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'} />
            </svg>
            {t('successBack')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="py-20 px-6">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <span className="inline-flex items-center gap-2.5 text-accent-dark font-semibold uppercase text-[10px] tracking-[0.2em] mb-4">
            <span className="w-5 h-px bg-accent" />{t('badge')}
          </span>
          <h1 className="font-display font-light text-4xl md:text-5xl text-gray-900 leading-tight mb-4">
            {t('title')}
          </h1>
          <p className="text-gray-500 text-base leading-relaxed max-w-lg">
            {t('subtitle')}
          </p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/60 border border-gray-100 p-8 md:p-10">

          {status === 'error' && (
            <div className="mb-6 px-4 py-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {t('error')}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Full name */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 mb-2">
                {t('fullName')}
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder={t('fullNamePlaceholder')}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all duration-200"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 mb-2">
                {t('email')}
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder={t('emailPlaceholder')}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all duration-200"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 mb-2 flex items-center gap-2">
                {t('phone')}
                <span className="normal-case tracking-normal text-gray-300 font-normal">— {t('phoneOptional')}</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder={t('phonePlaceholder')}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all duration-200"
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 mb-2">
                {t('message')}
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={5}
                placeholder={t('messagePlaceholder')}
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all duration-200 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="btn-shimmer w-full bg-accent hover:bg-accent-hover disabled:opacity-60 disabled:cursor-not-allowed text-brand-950 font-semibold py-4 rounded-2xl transition-all duration-300 text-sm tracking-wide shadow-[0_8px_30px_rgba(251,191,36,0.3)] hover:shadow-[0_8px_40px_rgba(251,191,36,0.5)] hover:-translate-y-0.5"
            >
              {status === 'submitting' ? t('submitting') : t('submit')}
            </button>

          </form>
        </div>
      </div>
    </section>
  );
}
