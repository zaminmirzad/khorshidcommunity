'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import PageHero from '@/app/components/PageHero';
import { SITE_CONFIG, SOCIAL_LINKS } from '@/lib/constants';

const SUBJECTS = [
  'General Inquiry',
  'Volunteer Opportunities',
  'Event Participation',
  'Partnership/Collaboration',
  'Donation Support',
  'Membership Questions',
  'Media/Press',
];

const FAQS = [
  { q: 'How can I become a member?', a: 'Simply fill out the contact form or visit us during office hours. Membership is free and open to all.' },
  { q: 'Are events free to attend?', a: 'Most events are free for members. Some special events may have a nominal fee to cover costs.' },
  { q: 'How can I volunteer?', a: "We're always looking for volunteers! Select 'Volunteer Opportunities' in the form above." },
  { q: 'Do you offer language classes?', a: 'Yes! We offer Persian language classes for all levels. Check our events page for schedules.' },
];

const inputClass = 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200';
const labelClass = 'block text-xs font-semibold uppercase tracking-[0.08em] text-gray-500 mb-2';

export default function ContactClient() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        if (successTimerRef.current) clearTimeout(successTimerRef.current);
        successTimerRef.current = setTimeout(() => setSubmitted(false), 5000);
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Failed to send message. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-[#faf8f4]">
      <PageHero
        image="/images/contact-hero.jpg"
        badge="We're Here"
        title={<>Get in <em className="italic text-amber-300">Touch</em></>}
        subtitle="We'd love to hear from you — reach out anytime and we'll respond within 24 hours."
      />

      <div className="container mx-auto px-6 py-20 max-w-7xl">

        {/* Quick contact cards */}
        <div className="grid sm:grid-cols-3 gap-5 mb-20">
          {[
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              ),
              title: 'Call Us',
              info: SITE_CONFIG.phone,
              detail: 'Mon–Fri · 9AM–6PM',
              action: 'Call Now',
              link: `tel:${SITE_CONFIG.phone.replace(/\D/g, '')}`,
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              ),
              title: 'Email Us',
              info: SITE_CONFIG.email,
              detail: 'Response within 24h',
              action: 'Send Email',
              link: `mailto:${SITE_CONFIG.email}`,
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ),
              title: 'Visit Us',
              info: SITE_CONFIG.address,
              detail: 'See office hours below',
              action: 'Get Directions',
              link: '#map',
            },
          ].map((item) => (
            <a
              key={item.title}
              href={item.link}
              className="group bg-white rounded-2xl p-7 border border-gray-100 hover:border-amber-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 bg-blue-900 group-hover:bg-blue-800 rounded-2xl flex items-center justify-center text-amber-400 mb-5 transition-colors">
                {item.icon}
              </div>
              <h3 className="font-display font-semibold text-xl text-gray-900 mb-1">{item.title}</h3>
              <p className="text-gray-700 text-sm font-medium mb-1">{item.info}</p>
              <p className="text-gray-400 text-xs mb-4">{item.detail}</p>
              <span className="inline-flex items-center gap-1 text-amber-600 font-semibold text-xs group-hover:gap-2 transition-all">
                {item.action}
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </a>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-2 gap-10">

          {/* ── Contact Form ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-950 to-blue-900 px-8 py-8">
              <span className="inline-flex items-center gap-3 text-amber-400/80 font-semibold uppercase text-[11px] tracking-[0.2em] mb-4">
                <span className="w-6 h-px bg-amber-400/50" />
                Send a Message
              </span>
              <h2 className="font-display font-light text-3xl text-white">
                We're Here to <em className="italic text-amber-300">Help</em>
              </h2>
              <p className="text-blue-300 text-sm mt-2">Fill out the form and we'll respond within 24 hours.</p>
            </div>

            <div className="p-8">
              {submitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-green-800 text-sm">Message Sent Successfully!</p>
                    <p className="text-green-600 text-xs mt-0.5">Thank you for reaching out. We'll respond shortly.</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-red-800 text-sm">Something went wrong</p>
                    <p className="text-red-600 text-xs mt-0.5">{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Full Name *</label>
                    <input type="text" name="name" required value={formData.name} onChange={handleChange} className={inputClass} placeholder="Your name" />
                  </div>
                  <div>
                    <label className={labelClass}>Email Address *</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleChange} className={inputClass} placeholder="you@example.com" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Phone Number</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputClass} placeholder="(619) 000-0000" />
                  </div>
                  <div>
                    <label className={labelClass}>Subject *</label>
                    <select name="subject" required value={formData.subject} onChange={handleChange} className={inputClass}>
                      <option value="">Select a topic</option>
                      {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Message *</label>
                  <textarea name="message" rows={5} required value={formData.message} onChange={handleChange} className={inputClass} placeholder="Tell us how we can help..." />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-shimmer w-full bg-amber-400 hover:bg-amber-500 text-blue-950 font-semibold py-3.5 rounded-xl transition-all duration-300 shadow-sm hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending...
                    </span>
                  ) : 'Send Message'}
                </button>
              </form>
              <p className="text-xs text-gray-400 mt-5 text-center">By submitting, you agree to our privacy policy.</p>
            </div>
          </div>

          {/* ── Map & Info ── */}
          <div className="space-y-6">
            {/* Map */}
            <div id="map" className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm h-72">
              <iframe
                className="w-full h-full"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d214590.30839483513!2d-117.27547648186774!3d32.71573319765668!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80d9530fad921e4b%3A0xd3a21fdfd15df79!2sSan%20Diego%2C%20CA!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Khorshid Community location in San Diego, CA"
              />
            </div>

            {/* Office Hours */}
            <div className="bg-white rounded-2xl border border-gray-100 p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-blue-900 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-display font-semibold text-xl text-gray-900">Office Hours</h3>
              </div>
              <div className="space-y-3 text-sm">
                {[
                  { day: 'Monday – Friday', hours: SITE_CONFIG.officeHours.weekdays, highlight: false },
                  { day: 'Saturday', hours: SITE_CONFIG.officeHours.saturday, highlight: false },
                  { day: 'Sunday', hours: SITE_CONFIG.officeHours.sunday, highlight: true },
                ].map((row) => (
                  <div key={row.day} className="flex justify-between items-center py-2.5 border-b border-gray-50 last:border-0">
                    <span className="text-gray-500">{row.day}</span>
                    <span className={`font-semibold ${row.highlight ? 'text-amber-600' : 'text-gray-900'}`}>{row.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location details */}
            <div className="bg-white rounded-2xl border border-gray-100 p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-blue-900 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-display font-semibold text-xl text-gray-900">Our Location</h3>
              </div>
              <div className="space-y-3 text-sm text-gray-600">
                <p>{SITE_CONFIG.address}</p>
                <a href={`tel:${SITE_CONFIG.phone.replace(/\D/g, '')}`} className="block hover:text-amber-600 transition-colors">
                  {SITE_CONFIG.phone}
                </a>
                <a href={`mailto:${SITE_CONFIG.email}`} className="block hover:text-amber-600 transition-colors break-all">
                  {SITE_CONFIG.email}
                </a>
              </div>
            </div>

            {/* Social */}
            <div className="bg-gradient-to-br from-blue-950 to-[#0a1628] rounded-2xl p-7 text-white">
              <h3 className="font-display font-semibold text-xl mb-2">Follow Us</h3>
              <p className="text-blue-300 text-sm mb-6">Stay connected for events and community updates.</p>
              <div className="grid grid-cols-2 gap-3">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow Khorshid Community on ${social.name}`}
                    className="flex items-center gap-3 py-3 px-4 bg-white/8 hover:bg-white/15 rounded-xl transition-all duration-200 group"
                  >
                    <span className="text-xl">{social.icon}</span>
                    <span className="text-sm font-medium group-hover:text-amber-300 transition-colors">{social.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── FAQs ── */}
        <div className="mt-24">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-3 text-amber-600 font-semibold uppercase text-[11px] tracking-[0.2em] mb-5">
              <span className="w-10 h-px bg-amber-400" />
              Quick Answers
              <span className="w-10 h-px bg-amber-400" />
            </span>
            <h2 className="font-display font-light text-4xl md:text-5xl text-gray-900">
              Frequently Asked <em className="italic text-blue-900">Questions</em>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {FAQS.map((faq) => (
              <div key={faq.q} className="group bg-white rounded-2xl p-7 border border-gray-100 hover:border-amber-200 hover:shadow-md transition-all duration-300">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-7 h-7 bg-amber-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-display font-semibold text-gray-900 leading-snug">{faq.q}</h3>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed pl-10">{faq.a}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-400 text-sm mt-8">
            Still have questions?{' '}
            <Link href="/contact#" className="text-amber-600 font-semibold hover:underline">Use the form above</Link>
            {' '}or call us directly.
          </p>
        </div>
      </div>
    </div>
  );
}
