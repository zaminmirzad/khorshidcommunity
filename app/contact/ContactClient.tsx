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
    <div className="bg-white">
      <PageHero
        image="/images/contact-hero.jpg"
        title="Get in Touch"
        subtitle="We'd love to hear from you — reach out anytime"
      />

      <div className="container mx-auto px-4 sm:px-6 py-20 max-w-7xl">

        {/* Quick contact cards */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-20">
          {[
            { icon: '📞', title: 'Call Us', info: SITE_CONFIG.phone, detail: 'Mon–Fri, 9AM–6PM', action: 'Call Now', link: `tel:${SITE_CONFIG.phone.replace(/\D/g, '')}` },
            { icon: '✉️', title: 'Email Us', info: SITE_CONFIG.email, detail: 'Response within 24h', action: 'Send Email', link: `mailto:${SITE_CONFIG.email}` },
            { icon: '📍', title: 'Visit Us', info: SITE_CONFIG.address, detail: '', action: 'Get Directions', link: '#map' },
          ].map((item) => (
            <a key={item.title} href={item.link} className="group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-5xl mb-3">{item.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">{item.title}</h3>
              <p className="text-gray-600 font-medium">{item.info}</p>
              {item.detail && <p className="text-sm text-gray-400 mb-3">{item.detail}</p>}
              <span className="inline-block text-yellow-600 font-semibold text-sm group-hover:underline">{item.action} →</span>
            </a>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12">

          {/* Contact Form */}
          <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-100">
            <div className="mb-8">
              <span className="text-yellow-600 font-semibold tracking-wide uppercase text-sm">Send a Message</span>
              <h2 className="text-3xl font-bold text-gray-900 mt-2">We're Here to Help</h2>
              <div className="w-20 h-1 bg-yellow-500 rounded-full mt-3" />
              <p className="text-gray-600 mt-4">Fill out the form below and our team will get back to you within 24 hours.</p>
            </div>

            {submitted && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="font-semibold text-green-800">Message Sent Successfully!</p>
                  <p className="text-green-600 text-sm">Thank you for reaching out. We'll respond shortly.</p>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                <span className="text-2xl">❌</span>
                <div>
                  <p className="font-semibold text-red-800">Error</p>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Full Name *</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Email Address *</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all" placeholder="john@example.com" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all" placeholder="(619) 000-0000" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Subject *</label>
                  <select name="subject" required value={formData.subject} onChange={handleChange} className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all bg-white">
                    <option value="">Select a topic</option>
                    {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Message *</label>
                <textarea name="message" rows={5} required value={formData.message} onChange={handleChange} className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all resize-none" placeholder="Tell us how we can help you..." />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-blue-900 font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </span>
                ) : 'Send Message →'}
              </button>
            </form>

            <p className="text-xs text-gray-400 mt-6 text-center">By submitting, you agree to our privacy policy and consent to be contacted.</p>
          </div>

          {/* Map & Info */}
          <div className="space-y-8">
            <div id="map" className="bg-gray-100 rounded-3xl overflow-hidden shadow-xl h-80">
              <iframe
                className="w-full h-full"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d214590.30839483513!2d-117.27547648186774!3d32.71573319765668!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80d9530fad921e4b%3A0xd3a21fdfd15df79!2sSan%20Diego%2C%20CA!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Khorshid Community location in San Diego, CA"
              />
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 shadow-lg">
              <div className="flex items-start gap-4">
                <span className="text-4xl">🕒</span>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">Office Hours</h3>
                  <div className="space-y-2 text-gray-700">
                    <div className="flex justify-between gap-4"><span>Monday – Friday:</span><span className="font-semibold">{SITE_CONFIG.officeHours.weekdays}</span></div>
                    <div className="flex justify-between gap-4"><span>Saturday:</span><span className="font-semibold">{SITE_CONFIG.officeHours.saturday}</span></div>
                    <div className="flex justify-between gap-4"><span>Sunday:</span><span className="font-semibold text-yellow-600">{SITE_CONFIG.officeHours.sunday}</span></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">📍 Our Location</h3>
              <div className="space-y-3 text-gray-600 text-sm">
                <p>{SITE_CONFIG.address}</p>
                <p>
                  <a href={`tel:${SITE_CONFIG.phone.replace(/\D/g, '')}`} className="hover:text-yellow-600 transition-colors">{SITE_CONFIG.phone}</a>
                </p>
                <p>
                  <a href={`mailto:${SITE_CONFIG.email}`} className="hover:text-yellow-600 transition-colors">{SITE_CONFIG.email}</a>
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-900 to-blue-950 rounded-3xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4">🌐 Connect With Us</h3>
              <p className="text-blue-200 mb-4">Follow us on social media for updates, events, and community highlights.</p>
              <div className="flex gap-3">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow Khorshid Community on ${social.name}`}
                    className="flex-1 py-2 bg-white/10 rounded-xl hover:bg-white/20 transition-all hover:scale-105 text-center"
                  >
                    <div className="text-2xl">{social.icon}</div>
                    <div className="text-xs mt-1">{social.name}</div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <span className="text-yellow-600 font-semibold tracking-wide uppercase text-sm">Quick Answers</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Frequently Asked Questions</h2>
            <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full mt-4" />
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {FAQS.map((faq) => (
              <div key={faq.q} className="bg-gray-50 rounded-2xl p-6 hover:shadow-md transition-all">
                <h3 className="font-bold text-gray-800 mb-2">❓ {faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
