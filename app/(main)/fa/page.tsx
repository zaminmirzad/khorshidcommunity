// app/fa/page.tsx
// FIXES APPLIED:
// [SEO] JSON-LD @type expanded to include NonProfit + areaServed
// [Bug] Newsletter form wired up with state handler (no design change)
// NOTE: This page is served under app/fa/layout.tsx which sets lang="fa" dir="rtl"

'use client';
import Link from 'next/link';
import Script from 'next/script';
import { useState } from 'react';

export default function PersianHome() {
  // FIX (Bug): Newsletter form now has state and a submit handler
  const [email, setEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setNewsletterStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, lang: 'fa' }),
      });
      if (res.ok) {
        setNewsletterStatus('success');
        setEmail('');
      } else {
        setNewsletterStatus('error');
      }
    } catch {
      setNewsletterStatus('error');
    }
  };

  // FIX (SEO): @type expanded to Organization + NonProfit; areaServed added
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["Organization", "NonProfit"],
    "name": "کمیونیتی خورشید",
    "alternateName": "کمیونیتی هزاره‌های سن دیگو",
    "url": "https://khorshidcommunity.org/fa",
    "logo": "https://khorshidcommunity.org/logo.png",
    "sameAs": [
      "https://www.instagram.com/khorshidcommunity",
      "https://www.facebook.com/khorshidcommunity"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "San Diego",
      "addressRegion": "CA",
      "addressCountry": "US"
    },
    "areaServed": "San Diego, CA",
    "nonprofitStatus": "Nonprofit501c3",
    "description": "مرکز فرهنگی فارسی و هزاره در سن دیگو - برگزاری جشن‌های نوروز، کلاس‌های زبان فارسی، و حمایت از جامعه هزاره",
    "foundingDate": "1998",
    "keywords": "کمیونیتی خورشید سن دیگو, فرهنگ هزاره, جامعه فارسی سن دیگو, نوروز"
  };

  return (
    <>
      <Script
        id="json-ld-schema-fa"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950/90 via-blue-900/85 to-blue-950/90 z-10" />
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/images/hero-section.jpg')",
              backgroundPosition: "center"
            }}
          />
        </div>

        <div className="relative z-20 container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 lg:py-32 text-center text-white" dir="rtl">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6 md:mb-8 text-xs sm:text-sm font-semibold tracking-wide bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-400 rounded-full animate-pulse"></span>
            تأسیس ۱۹۹۸ • سازمان غیرانتفاعی
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-3 sm:mb-4 md:mb-6 tracking-tight">
            <span className="text-yellow-400">کمیونیتی</span>
            <span className="text-blue-300">خورشید</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl max-w-4xl mx-auto mb-4 sm:mb-6 md:mb-8 text-blue-100 leading-relaxed px-2">
            حفظ فرهنگ ما، متحد کردن نسل‌ها، ساختن آینده‌ای پویا
          </p>

          <p className="text-sm sm:text-base md:text-lg text-gray-200 max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-12 px-4">
            به ۵٬۲۰۰ عضو در کمیونیتی خورشید سن دیگو بپیوندید. رویدادهای فرهنگی فارسی، جشن‌های نوروز،
            کلاس‌های زبان، و حمایت از جامعه هزاره و ایرانی.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-5 justify-center px-4">
            <Link
              href="/fa/events"
              className="group inline-flex items-center justify-center px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg font-semibold text-blue-900 bg-yellow-400 rounded-xl hover:bg-yellow-500 transition-all duration-300 shadow-2xl hover:shadow-xl transform hover:-translate-y-0.5"
            >
              رویدادهای پیش‌رو
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:-translate-x-1 transition-transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/fa/about"
              className="inline-flex items-center justify-center px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg font-semibold text-white bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-300 border border-white/30"
            >
              داستان ما را کشف کنید
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 mt-8 sm:mt-10 md:mt-12 lg:mt-16">
            <div className="text-center px-2 sm:px-3 md:px-4">
              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">۵٬۲۰۰+</div>
              <div className="text-xs sm:text-sm text-yellow-300">زندگی‌های تحت تأثیر</div>
            </div>
            <div className="w-px h-6 sm:h-8 md:h-10 lg:h-12 bg-white/30"></div>
            <div className="text-center px-2 sm:px-3 md:px-4">
              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">۴۸</div>
              <div className="text-xs sm:text-sm text-yellow-300">رویداد سالانه</div>
            </div>
            <div className="w-px h-6 sm:h-8 md:h-10 lg:h-12 bg-white/30"></div>
            <div className="text-center px-2 sm:px-3 md:px-4">
              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">۳۵۰+</div>
              <div className="text-xs sm:text-sm text-yellow-300">داوطلب فعال</div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
          <div className="w-5 h-7 sm:w-6 sm:h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-1.5 sm:w-1.5 sm:h-2 bg-yellow-400 rounded-full mt-1.5 sm:mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Mission Statement Banner */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-6 text-center max-w-4xl" dir="rtl">
          <span className="text-yellow-600 font-semibold uppercase text-sm tracking-wide">هدف ما</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-6">
            یک جامعه. یک خانواده. یک آینده.
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            کمیونیتی خورشید نسل‌ها را پیوند می‌دهد، میراث هزاره و فارسی را حفظ می‌کند، و افراد را
            از طریق ارتباط، فرهنگ و اقدام همراهی توانمند می‌سازد.
          </p>
        </div>
      </section>

      {/* Newsletter CTA */}
      {/* FIX (Bug): Form now has state + submit handler */}
      <section className="py-20 bg-blue-950">
        <div className="container mx-auto px-6 text-center max-w-3xl" dir="rtl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">به خبرنامه ما بپیوندید</h2>
          <p className="text-blue-200 mb-8 text-lg">از رویدادها، برنامه‌ها و اخبار جامعه مطلع شوید</p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="ایمیل خود را وارد کنید"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-6 py-3 rounded-xl border-0 focus:ring-2 focus:ring-yellow-500 outline-none text-right"
            />
            <button
              type="submit"
              disabled={newsletterStatus === 'loading'}
              className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-semibold rounded-xl transition-all disabled:opacity-70"
            >
              {newsletterStatus === 'loading' ? '...' : 'عضویت'}
            </button>
          </form>
          {newsletterStatus === 'success' && (
            <p className="text-green-400 text-sm mt-4">✅ با موفقیت ثبت شدید!</p>
          )}
          {newsletterStatus === 'error' && (
            <p className="text-red-400 text-sm mt-4">مشکلی پیش آمد. لطفاً دوباره تلاش کنید.</p>
          )}
        </div>
      </section>
    </>
  );
}