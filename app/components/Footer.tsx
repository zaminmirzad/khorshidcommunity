import Link from 'next/link';
import Image from 'next/image';
import { NAV_LINKS } from '@/lib/nav';
import { SITE_CONFIG, SOCIAL_LINKS } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[#09111f] via-blue-950 to-[#09111f] text-gray-400 pt-20 pb-8">
      {/* Top accent */}
      <div className="flex items-center gap-0 mb-16">
        <span className="flex-1 h-px bg-white/5" />
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mx-3" />
        <span className="flex-1 h-px bg-white/5" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-5">
              <Image
                src="/images/logo.jpg"
                alt="Khorshid Community logo"
                width={48}
                height={48}
                className="rounded-xl object-cover"
              />
              <div>
                <span className="font-display text-xl font-semibold text-amber-400">Khorshid</span>
                <span className="font-display text-xl font-semibold text-white">Community</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-gray-500">
              Uniting hearts, preserving heritage, and building a vibrant future together since {SITE_CONFIG.foundingYear}.
            </p>
            <div className="flex gap-3 mt-6">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow Khorshid Community on ${social.name}`}
                  className="text-xl hover:scale-110 hover:opacity-80 transition-all duration-200 inline-block"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-[0.15em] mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-amber-400 transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-3 h-px bg-gray-600 group-hover:bg-amber-400 group-hover:w-5 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-[0.15em] mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-2.5 text-gray-500">
                <span className="mt-0.5 shrink-0">📍</span>
                {SITE_CONFIG.address}
              </li>
              <li>
                <a href={`tel:${SITE_CONFIG.phone.replace(/\D/g, '')}`} className="flex items-center gap-2.5 text-gray-500 hover:text-amber-400 transition-colors duration-200">
                  <span>📞</span>
                  {SITE_CONFIG.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE_CONFIG.email}`} className="flex items-center gap-2.5 text-gray-500 hover:text-amber-400 transition-colors duration-200">
                  <span>✉️</span>
                  {SITE_CONFIG.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Office Hours */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-[0.15em] mb-6">Office Hours</h4>
            <ul className="text-sm space-y-3 text-gray-500">
              <li className="flex justify-between">
                <span>Mon – Fri</span>
                <span className="text-gray-300">{SITE_CONFIG.officeHours.weekdays}</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday</span>
                <span className="text-gray-300">{SITE_CONFIG.officeHours.saturday}</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span className="text-gray-300">{SITE_CONFIG.officeHours.sunday}</span>
              </li>
            </ul>
            <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/8">
              <p className="text-xs text-gray-500">Nonprofit 501(c)(3)</p>
              <p className="text-xs text-amber-400 font-semibold mt-0.5">{SITE_CONFIG.name}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-600">
          <p>© {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.</p>
          <p>Built with care for our community.</p>
        </div>
      </div>
    </footer>
  );
}
