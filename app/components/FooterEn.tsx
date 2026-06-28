import Link from 'next/link';
import Image from 'next/image';
import { NAV_LINKS } from '@/lib/nav';
import { SITE_CONFIG, SOCIAL_LINKS } from '@/lib/constants';
import SocialIcon from './SocialIcon';

export default function FooterEn() {
  return (
    <footer className="bg-gradient-to-b from-brand-950 via-brand-950 to-[#0a1228] text-brand-400 relative overflow-hidden">
      {/* Glow orbs */}
      <div className="absolute top-0 left-1/4 w-[800px] h-56 rounded-full bg-brand-400/8 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-48 rounded-full bg-accent/5 blur-[120px] pointer-events-none" />

      {/* ── Pre-footer CTA band ───────────────────────────────────────────── */}
      <div className="border-b border-white/8 relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-14 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="font-display font-light italic text-3xl md:text-4xl text-white leading-snug">
              Ready to be part of <em className="text-accent-muted not-italic">our story?</em>
            </p>
            <p className="text-brand-400 text-sm mt-2">Join 5,000+ members celebrating Hazara and Persian heritage.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link href="/contact" className="btn-shimmer inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover text-brand-950 font-semibold rounded-full transition-all duration-300 text-sm whitespace-nowrap">
              Get Involved
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
            <Link href="/events" className="inline-flex items-center px-6 py-3 rounded-full border border-white/20 hover:border-accent/40 hover:text-accent text-white text-sm font-semibold transition-all duration-300 whitespace-nowrap">
              View Events
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main columns ──────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-5 group">
              <div className="relative">
                <Image
                  src="/images/logo.jpg"
                  alt="Khorshid Community logo"
                  width={52}
                  height={52}
                  className="rounded-2xl object-cover ring-1 ring-white/10 group-hover:ring-accent/40 transition-all duration-300"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-xl font-semibold text-accent leading-none">Khorshid</span>
                <span className="font-display text-xl font-semibold text-white leading-none">Community</span>
              </div>
            </Link>

            <div className="w-8 h-px bg-accent/50 mb-4" />

            <p className="font-display font-light italic text-brand-300 text-base leading-relaxed mb-4">
              "Uniting hearts, preserving heritage,<br className="hidden sm:block" /> building futures."
            </p>
            <p className="text-sm leading-relaxed text-brand-500">
              Serving the Hazara and Persian community in San Diego since {SITE_CONFIG.foundingYear}.
            </p>

            <div className="flex items-center gap-2 mt-5">
              <span className="px-2.5 py-1 rounded-lg bg-accent/10 border border-accent/20 text-accent text-[10px] font-semibold tracking-wide uppercase">
                501(c)(3) Nonprofit
              </span>
            </div>

            {SOCIAL_LINKS.length > 0 && (
              <div className="flex gap-3 mt-5">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow Khorshid Community on ${social.name}`}
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/6 text-brand-400 hover:bg-accent hover:text-brand-950 transition-all duration-200"
                  >
                    <SocialIcon name={social.name} className="w-4 h-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <div className="flex items-center gap-2.5 mb-6">
              <span className="w-5 h-0.5 bg-accent rounded-full" />
              <h4 className="text-white text-xs font-semibold uppercase tracking-[0.15em]">Explore</h4>
            </div>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-400 hover:text-accent transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-3 h-px bg-brand-700 group-hover:bg-accent group-hover:w-5 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="flex items-center gap-2.5 mb-6">
              <span className="w-5 h-0.5 bg-accent rounded-full" />
              <h4 className="text-white text-xs font-semibold uppercase tracking-[0.15em]">Contact</h4>
            </div>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 text-brand-400">
                <svg className="w-4 h-4 mt-0.5 shrink-0 text-accent/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="leading-snug">{SITE_CONFIG.address}</span>
              </li>
              <li>
                <a href={`tel:${SITE_CONFIG.phone.replace(/\D/g, '')}`} className="flex items-center gap-3 text-brand-400 hover:text-accent transition-colors duration-200 group">
                  <svg className="w-4 h-4 shrink-0 text-accent/60 group-hover:text-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {SITE_CONFIG.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE_CONFIG.email}`} className="flex items-center gap-3 text-brand-400 hover:text-accent transition-colors duration-200 group break-all">
                  <svg className="w-4 h-4 shrink-0 text-accent/60 group-hover:text-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {SITE_CONFIG.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Office Hours */}
          <div>
            <div className="flex items-center gap-2.5 mb-6">
              <span className="w-5 h-0.5 bg-accent rounded-full" />
              <h4 className="text-white text-xs font-semibold uppercase tracking-[0.15em]">Office Hours</h4>
            </div>
            <ul className="text-sm space-y-3">
              {[
                { day: 'Mon – Fri', hours: SITE_CONFIG.officeHours.weekdays },
                { day: 'Saturday', hours: SITE_CONFIG.officeHours.saturday },
                { day: 'Sunday',   hours: SITE_CONFIG.officeHours.sunday },
              ].map(({ day, hours }) => (
                <li key={day} className="flex justify-between items-center border-b border-white/5 pb-3 last:border-0 last:pb-0">
                  <span className="text-brand-500">{day}</span>
                  <span className="text-brand-200 font-medium">{hours}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 p-4 rounded-2xl bg-white/4 border border-white/8 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] text-brand-500 uppercase tracking-wider">Registered</p>
                <p className="text-xs text-accent font-semibold">{SITE_CONFIG.name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ──────────────────────────────────────────────────── */}
        <div className="border-t border-white/8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-brand-600">
            © {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <span className="w-1 h-1 rounded-full bg-accent/40" />
            <span className="text-xs text-brand-600 italic font-display">Built with care for our community.</span>
            <span className="w-1 h-1 rounded-full bg-accent/40" />
          </div>
          <a
            href="#top"
            aria-label="Back to top"
            className="group flex items-center gap-2 text-xs text-brand-500 hover:text-accent transition-colors duration-200"
          >
            <svg className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
