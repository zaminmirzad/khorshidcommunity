import Link from 'next/link';
import Image from 'next/image';
import { NAV_LINKS } from '@/lib/nav';
import { SITE_CONFIG, SOCIAL_LINKS } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] text-gray-400 px-4 sm:px-6 pt-14 pb-8 mt-20">
      <div className="max-w-7xl mx-auto">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/images/logo.jpg"
                alt="Khorshid Community logo"
                width={50}
                height={50}
                className="rounded-xl object-cover"
              />
              <div>
                <span className="text-xl font-bold text-yellow-400">Khorshid</span>
                <span className="text-xl font-bold text-white">Community</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed">
              Uniting hearts, preserving heritage, and building a vibrant future together since {SITE_CONFIG.foundingYear}.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-base font-semibold mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-yellow-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-base font-semibold mb-5">Contact Us</h4>
            <ul className="space-y-3 text-sm leading-relaxed">
              <li>📍 {SITE_CONFIG.address}</li>
              <li>
                <a href={`tel:${SITE_CONFIG.phone.replace(/\D/g, '')}`} className="hover:text-yellow-400 transition-colors duration-200">
                  📞 {SITE_CONFIG.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE_CONFIG.email}`} className="hover:text-yellow-400 transition-colors duration-200">
                  ✉️ {SITE_CONFIG.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Social + Hours */}
          <div>
            <h4 className="text-white text-base font-semibold mb-5">Follow Us</h4>
            <div className="flex gap-3 mb-6">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow Khorshid Community on ${social.name}`}
                  className="text-2xl hover:scale-110 transition-transform duration-200 inline-block"
                >
                  {social.icon}
                </a>
              ))}
            </div>
            <h4 className="text-white text-base font-semibold mb-3">Office Hours</h4>
            <ul className="text-sm space-y-1">
              <li>Mon–Fri: {SITE_CONFIG.officeHours.weekdays}</li>
              <li>Sat: {SITE_CONFIG.officeHours.saturday}</li>
              <li>Sun: {SITE_CONFIG.officeHours.sunday}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-8 text-center text-sm">
          <p>© {new Date().getFullYear()} KhorshidCommunity. All rights reserved. | Built with ❤️ for the community</p>
        </div>
      </div>
    </footer>
  );
}
