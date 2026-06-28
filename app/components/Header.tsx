'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { NAV_LINKS } from '@/lib/nav';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-[10px] shadow-[0_4px_20px_rgba(0,0,0,0.1)]'
          : 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">

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
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-700 text-[15px] font-medium hover:text-accent transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <Link
          href="/contact"
          className="hidden md:inline-block btn-shimmer bg-accent hover:bg-accent-hover text-brand-950 px-5 lg:px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 shrink-0"
        >
          Join Us
        </Link>

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
        <div className="md:hidden flex flex-col gap-1 px-4 pb-6 pt-2 bg-white border-t border-gray-100 animate-[slideDown_0.25s_ease]">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="px-4 py-3.5 text-gray-700 text-base font-medium rounded-xl hover:bg-accent-light hover:text-accent-dark transition-all duration-200"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            className="mt-2 block text-center bg-accent hover:bg-accent-hover text-brand-950 px-6 py-3.5 rounded-full text-base font-semibold transition-colors"
          >
            Join Our Community
          </Link>
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
