'use client';
import { useState, useRef, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import PageHero from '@/app/components/PageHero';
import { SITE_CONFIG } from '@/lib/constants';

export default function ContactClient() {
  const t = useTranslations('contact');
  const locale = useLocale();
  const isFa = locale === 'fa';

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const subjects = t.raw('subjects') as string[];
  const faqItems = t.raw('faqItems') as Array<{ q: string; a: string }>;

  useEffect(() => {
    return () => { if (successTimerRef.current) clearTimeout(successTimerRef.current); };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, lang: locale }),
      });
      const data = await response.json();
      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        if (successTimerRef.current) clearTimeout(successTimerRef.current);
        successTimerRef.current = setTimeout(() => setSubmitted(false), 5000);
      } else {
        setError(data.error || t('errorTitle'));
      }
    } catch {
      setError(t('errorTitle'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const inputClass = 'w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40 transition-all duration-200';
  const labelClass = 'block text-xs font-semibold uppercase tracking-[0.1em] text-gray-500 mb-2';

  const contactMethods = [
    { title: t('callTitle'), info: SITE_CONFIG.phone, detail: t('callDetail'), action: t('callAction'), link: `tel:${SITE_CONFIG.phone.replace(/\D/g, '')}`, icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg> },
    { title: t('emailTitle'), info: SITE_CONFIG.email, detail: t('emailDetail'), action: t('emailAction'), link: `mailto:${SITE_CONFIG.email}`, icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
    { title: t('visitTitle'), info: SITE_CONFIG.address, detail: t('visitDetail'), action: t('visitAction'), link: '#map', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
  ];

  const officeHours = [
    { day: t('monday'), hours: SITE_CONFIG.officeHours.weekdays, closed: false },
    { day: t('saturday'), hours: SITE_CONFIG.officeHours.saturday, closed: false },
    { day: t('sunday'), hours: SITE_CONFIG.officeHours.sunday, closed: true },
  ];

  return (
    <div className="bg-surface">
      <PageHero
        image="/images/contact-hero.jpg"
        badge={t('badge')}
        title={
          isFa
            ? <><span>{t('heroTitle').split(' ')[0]} </span><em className="italic text-accent-muted">{t('heroTitle').split(' ').slice(1).join(' ')}</em></>
            : <>Get in <em className="italic text-accent-muted">Touch</em></>
        }
        subtitle={t('heroSubtitle')}
      />

      {/* Contact Methods */}
      <section className="py-20 bg-surface">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-3 text-accent-dark font-semibold uppercase text-[11px] tracking-[0.2em] mb-4">
              <span className="w-10 h-px bg-accent" />{t('reachOverline')}<span className="w-10 h-px bg-accent" />
            </span>
            <h2 className="font-display font-light text-4xl md:text-5xl text-gray-900">
              {isFa
                ? <><span>همیشه در </span><em className="italic text-brand-900">دسترس</em><span> هستیم</span></>
                : <>We're Always <em className="italic text-brand-900">Available</em></>
              }
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {contactMethods.map((item) => (
              <a
                key={item.title}
                href={item.link}
                className="group bg-surface rounded-2xl p-8 border border-gray-100 hover:border-accent/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1.5 flex flex-col relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent/0 via-accent to-accent/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
                <div className="w-16 h-16 bg-gradient-to-br from-brand-900 to-brand-800 rounded-2xl flex items-center justify-center text-accent mb-6 shadow-lg group-hover:shadow-[0_0_20px_rgba(251,191,36,0.2)] transition-shadow duration-300">
                  {item.icon}
                </div>
                <h3 className="font-display font-semibold text-xl text-gray-900 mb-1">{item.title}</h3>
                <p className="text-gray-700 text-sm font-medium mb-1" dir="ltr">{item.info}</p>
                <p className="text-gray-400 text-xs mb-6">{item.detail}</p>
                <div className="mt-auto flex items-center gap-1.5 text-accent-dark font-semibold text-sm group-hover:gap-3 transition-all duration-200">
                  {item.action}
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Info */}
      <section className="py-20 bg-surface-alt dot-grid">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-5 gap-10 items-start">

            {/* Contact Form */}
            <div className="lg:col-span-3 bg-surface rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-br from-brand-900 via-brand-950 to-brand-950 px-8 py-9 relative overflow-hidden">
                <div className="absolute -top-10 right-0 w-52 h-36 rounded-full bg-accent/10 blur-[60px] pointer-events-none" />
                <div className="relative z-10">
                  <span className="inline-flex items-center gap-3 text-accent/80 font-semibold uppercase text-[11px] tracking-[0.2em] mb-4">
                    <span className="w-6 h-px bg-accent/50" />{t('formOverline')}
                  </span>
                  <h2 className="font-display font-light text-3xl text-white">
                    {isFa
                      ? <><span>اینجاییم تا </span><em className="italic text-accent-muted">کمک کنیم</em></>
                      : <>We're Here to <em className="italic text-accent-muted">Help</em></>
                    }
                  </h2>
                  <p className="text-brand-300 text-sm mt-2">{t('formSubtitle')}</p>
                </div>
              </div>

              <div className="p-8">
                {submitted && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <div>
                      <p className="font-semibold text-green-800 text-sm">{t('successTitle')}</p>
                      <p className="text-green-600 text-xs mt-0.5">{t('successBody')}</p>
                    </div>
                  </div>
                )}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <p className="font-semibold text-red-800 text-sm">{error}</p>
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>{t('nameLabel')}</label>
                      <input type="text" name="name" required value={formData.name} onChange={handleChange} className={inputClass} placeholder={t('namePlaceholder')} />
                    </div>
                    <div>
                      <label className={labelClass}>{t('emailLabel')}</label>
                      <input type="email" name="email" required value={formData.email} onChange={handleChange} className={inputClass} placeholder={t('emailPlaceholder')} dir="ltr" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>{t('phoneLabel')}</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputClass} placeholder={t('phonePlaceholder')} dir="ltr" />
                    </div>
                    <div>
                      <label className={labelClass}>{t('subjectLabel')}</label>
                      <select name="subject" required value={formData.subject} onChange={handleChange} className={inputClass}>
                        <option value="">{t('subjectPlaceholder')}</option>
                        {subjects.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>{t('messageLabel')}</label>
                    <textarea name="message" rows={5} required value={formData.message} onChange={handleChange} className={inputClass} placeholder={t('messagePlaceholder')} />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-shimmer w-full bg-accent hover:bg-accent-hover text-brand-950 font-semibold py-4 rounded-xl transition-all duration-300 text-sm tracking-wide shadow-[0_4px_15px_rgba(251,191,36,0.25)] hover:shadow-[0_4px_25px_rgba(251,191,36,0.45)] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                        {t('submittingBtn')}
                      </span>
                    ) : t('submitBtn')}
                  </button>
                </form>
                <p className="text-xs text-gray-400 mt-5 text-center">{t('privacyNote')}</p>
              </div>
            </div>

            {/* Info column */}
            <div className="lg:col-span-2 space-y-5">
              {/* Map */}
              <div id="map" className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm h-64 relative">
                <iframe
                  className="w-full h-full"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d214590.30839483513!2d-117.27547648186774!3d32.71573319765668!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80d9530fad921e4b%3A0xd3a21fdfd15df79!2sSan%20Diego%2C%20CA!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Khorshid Community location in San Diego, CA"
                />
              </div>

              {/* Hours */}
              <div className="bg-surface rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 bg-brand-50 border-b border-gray-100 flex items-center gap-3">
                  <div className="w-8 h-8 bg-brand-900 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <h3 className="font-display font-semibold text-gray-900">{t('hoursTitle')}</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-2.5 mb-6">
                    {officeHours.map(({ day, hours, closed }) => (
                      <div key={day} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                        <span className="text-gray-500 text-sm">{day}</span>
                        <span className={`text-sm font-semibold font-sans${closed ? ' text-accent-dark' : ' text-gray-900'}`} dir="ltr">{hours}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-5 border-t border-gray-100 space-y-3">
                    <a href={`tel:${SITE_CONFIG.phone.replace(/\D/g, '')}`} className="flex items-center gap-3 text-sm text-gray-600 hover:text-accent-dark transition-colors group">
                      <div className="w-7 h-7 bg-brand-50 group-hover:bg-accent-light rounded-lg flex items-center justify-center shrink-0 transition-colors">
                        <svg className="w-3.5 h-3.5 text-brand-700 group-hover:text-accent-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      </div>
                      <span dir="ltr">{SITE_CONFIG.phone}</span>
                    </a>
                    <a href={`mailto:${SITE_CONFIG.email}`} className="flex items-center gap-3 text-sm text-gray-600 hover:text-accent-dark transition-colors group break-all">
                      <div className="w-7 h-7 bg-brand-50 group-hover:bg-accent-light rounded-lg flex items-center justify-center shrink-0 transition-colors">
                        <svg className="w-3.5 h-3.5 text-brand-700 group-hover:text-accent-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      </div>
                      <span dir="ltr">{SITE_CONFIG.email}</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Membership CTA */}
              <div className="bg-gradient-to-br from-brand-900 via-brand-950 to-brand-950 rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="absolute -top-10 right-0 w-40 h-28 rounded-full bg-accent/10 blur-[50px] pointer-events-none" />
                <div className="relative z-10">
                  <span className="inline-flex items-center gap-2 text-accent/80 font-semibold uppercase text-[10px] tracking-[0.2em] mb-3">
                    <span className="w-4 h-px bg-accent/50" />{t('membershipOverline')}
                  </span>
                  <h3 className="font-display font-light text-2xl text-white mb-2">
                    {isFa
                      ? <><span>بخشی از </span><em className="italic text-accent-muted">خانواده ما</em><span> شوید</span></>
                      : <>Become Part of <em className="italic text-accent-muted">Our Family</em></>
                    }
                  </h3>
                  <p className="text-brand-300 text-sm mb-5 leading-relaxed">{t('membershipBody')}</p>
                  <Link href="/events" className="btn-shimmer inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover text-brand-950 font-semibold rounded-full text-sm transition-all">
                    {t('membershipCta')}
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-brand-950">
        <div className="absolute -top-48 -left-48 w-[700px] h-[700px] rounded-full bg-accent/5 blur-[140px] pointer-events-none" />
        <div className="container mx-auto px-6 max-w-5xl relative z-10">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-3 text-accent/80 font-semibold uppercase text-[11px] tracking-[0.2em] mb-5">
              <span className="w-10 h-px bg-accent/50" />{t('faqOverline')}<span className="w-10 h-px bg-accent/50" />
            </span>
            <h2 className="font-display font-light text-4xl md:text-5xl text-white">
              {isFa
                ? <><span>سوالات </span><em className="italic text-accent-muted">متداول</em></>
                : <>Frequently Asked <em className="italic text-accent-muted">Questions</em></>
              }
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {faqItems.map((faq) => (
              <div key={faq.q} className="group bg-white/5 backdrop-blur-sm rounded-2xl p-7 border border-white/10 hover:border-accent/30 hover:bg-white/8 transition-all duration-300">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 bg-accent/15 border border-accent/20 rounded-xl flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-accent/25 transition-colors">
                    <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <h3 className="font-display font-semibold text-white leading-snug">{faq.q}</h3>
                </div>
                <p className="text-brand-300 text-sm leading-relaxed pl-11">{faq.a}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-brand-400 text-sm mt-10">
            {t('faqFooter')}{' '}
            <a href="#" className="text-accent font-semibold hover:text-accent-hover transition-colors">{t('faqFooterLink')}</a>
            {' '}{t('faqFooterSuffix')}
          </p>
        </div>
      </section>
    </div>
  );
}
