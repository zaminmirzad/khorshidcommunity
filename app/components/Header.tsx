'use client';
import Image from 'next/image';
import NextLink from 'next/link';
import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { NAV_LINKS } from '@/lib/nav';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const t = useTranslations('header');
  const tNav = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const navKeys: Array<keyof typeof NAV_LINKS[0] & string> = [];
  const NAV_KEYS = [
    { key: 'home', href: '/' },
    { key: 'events', href: '/events' },
    { key: 'about', href: '/about' },
    { key: 'gallery', href: '/gallery' },
    { key: 'contact', href: '/contact' },
  ] as const;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 768) setIsOpen(false); };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const switchLocale = (nextLocale: 'en' | 'fa') => {
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <header
      dir="ltr"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-[10px] shadow-[0_4px_20px_rgba(0,0,0,0.1)]'
          : 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)]'
      }`}
    >
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center${locale === 'fa' ? ' font-persian' : ''}`}>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Image
            src="/images/logo.jpg"
            alt="Khorshid Community logo"
            width={45}
            height={45}
            className="rounded-xl object-cover"
            priority
          />
          <span>
            <span className="font-display text-xl sm:text-[22px] font-semibold text-accent-hover">Khorshid</span>
            <span className="font-display text-xl sm:text-[22px] font-semibold text-brand-900">Community</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 lg:gap-8 items-center absolute left-1/2 -translate-x-1/2">
          {NAV_KEYS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-700 text-[15px] font-medium hover:text-accent transition-colors duration-200"
            >
              {tNav(link.key)}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          {/* Language switcher */}
          <div className="flex items-center rounded-full border border-gray-200 text-[11px] font-semibold overflow-hidden mr-1">
            <button
              onClick={() => switchLocale('en')}
              className={`px-2.5 py-1.5 transition-colors ${locale === 'en' ? 'bg-brand-950 text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}
            >
              EN
            </button>
            <button
              onClick={() => switchLocale('fa')}
              className={`px-2.5 py-1.5 transition-colors font-persian ${locale === 'fa' ? 'bg-brand-950 text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}
            >
              فا
            </button>
          </div>
          <NextLink href="/sign-in" className="text-gray-600 hover:text-gray-900 px-4 py-2.5 rounded-full text-sm font-medium transition-colors duration-200">
            {t('signIn')}
          </NextLink>
          <Link href="/join" className="btn-shimmer bg-accent hover:bg-accent-hover text-brand-950 px-5 lg:px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200">
            {t('joinUs')}
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-gray-700 text-2xl w-11 h-11 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
        >
          {isOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile dropdown */}
      {isOpen && (
        <div className={`md:hidden flex flex-col gap-1 px-4 pb-6 pt-2 bg-white border-t border-gray-100 animate-[slideDown_0.25s_ease]${locale === 'fa' ? ' font-persian' : ''}`}>
          {NAV_KEYS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="px-4 py-3.5 text-gray-700 text-base font-medium rounded-xl hover:bg-accent-light hover:text-accent-dark transition-all duration-200"
            >
              {tNav(link.key)}
            </Link>
          ))}
          <div className="flex items-center gap-2 px-2 py-2.5">
            <button
              onClick={() => { switchLocale('en'); setIsOpen(false); }}
              className={`flex-1 text-center text-sm font-semibold py-2.5 rounded-xl border transition-colors ${locale === 'en' ? 'bg-brand-950 text-white border-brand-950' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              English
            </button>
            <button
              onClick={() => { switchLocale('fa'); setIsOpen(false); }}
              className={`flex-1 text-center text-sm font-semibold py-2.5 rounded-xl border transition-colors font-persian ${locale === 'fa' ? 'bg-brand-950 text-white border-brand-950' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              فارسی
            </button>
          </div>
          <div className="mt-2 flex flex-col gap-2">
            <NextLink href="/sign-in" onClick={() => setIsOpen(false)} className="block text-center border border-gray-200 text-gray-700 px-6 py-3.5 rounded-full text-base font-medium hover:bg-gray-50 transition-colors">
              {t('signIn')}
            </NextLink>
            <Link href="/join" onClick={() => setIsOpen(false)} className="block text-center bg-accent hover:bg-accent-hover text-brand-950 px-6 py-3.5 rounded-full text-base font-semibold transition-colors">
              {t('joinCommunity')}
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  );
}
