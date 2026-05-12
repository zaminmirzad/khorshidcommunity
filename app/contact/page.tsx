// app/contact/page.tsx - Modern Professional Contact Page
'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setLoading(false);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative h-[40vh] min-h-[300px] bg-gradient-to-r from-amber-900 via-orange-800 to-amber-900 flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557425955-df376b33d09e?q=80&w=2070')] bg-cover bg-center mix-blend-overlay" />
        <div className="relative z-10 text-center px-6">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Get in Touch</h1>
          <p className="text-xl max-w-2xl mx-auto text-amber-100">We'd love to hear from you — reach out anytime</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20 max-w-7xl">
        
        {/* Quick Contact Bar */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {[
            { icon: "📞", title: "Call Us", info: "+1 (555) 678-2345", detail: "Mon-Fri, 9AM-6PM", action: "Call Now", link: "tel:+15556782345" },
            { icon: "✉️", title: "Email Us", info: "hello@khorshidcommunity.org", detail: "Response within 24h", action: "Send Email", link: "mailto:hello@khorshidcommunity.org" },
            { icon: "📍", title: "Visit Us", info: "123 Unity Avenue", detail: "Los Angeles, CA 90012", action: "Get Directions", link: "#map" },
          ].map((item, idx) => (
            <a key={idx} href={item.link} className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-5xl mb-3">{item.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">{item.title}</h3>
              <p className="text-gray-600 font-medium">{item.info}</p>
              <p className="text-sm text-gray-400 mb-3">{item.detail}</p>
              <span className="inline-block text-amber-600 font-semibold text-sm group-hover:underline">{item.action} →</span>
            </a>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Contact Form - Left Column */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            <div className="mb-8">
              <span className="text-amber-600 font-semibold tracking-wide uppercase text-sm">Send a Message</span>
              <h2 className="text-3xl font-bold text-gray-900 mt-2">We're Here to Help</h2>
              <div className="w-20 h-1 bg-amber-500 rounded-full mt-3"></div>
              <p className="text-gray-600 mt-4">Fill out the form below and our team will get back to you within 24 hours.</p>
            </div>

            {submitted && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">✅</div>
                  <div>
                    <p className="font-semibold text-green-800">Message Sent Successfully!</p>
                    <p className="text-green-600 text-sm">Thank you for reaching out. We'll respond shortly.</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Subject *</label>
                  <select
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all bg-white"
                  >
                    <option value="">Select a topic</option>
                    <option>General Inquiry</option>
                    <option>Volunteer Opportunities</option>
                    <option>Event Participation</option>
                    <option>Partnership/Collaboration</option>
                    <option>Donation Support</option>
                    <option>Membership Questions</option>
                    <option>Media/Press</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Message *</label>
                <textarea
                  name="message"
                  rows={5}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Send Message →'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-400">By submitting, you agree to our privacy policy and consent to be contacted.</p>
            </div>
          </div>

          {/* Right Column - Map & Info */}
          <div className="space-y-8">
            {/* Google Maps Embed */}
            <div className="bg-gray-100 rounded-3xl overflow-hidden shadow-xl h-80">
              <iframe 
                className="w-full h-full"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.876278293346!2d-118.2436849!3d34.0522342!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c75a1d3c6b8d%3A0x2c8c4b6c8b4c6b8d!2sLos%20Angeles%2C%20CA!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus" 
                allowFullScreen 
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Office Hours */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🕒</div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">Office Hours</h3>
                  <div className="space-y-2 text-gray-700">
                    <div className="flex justify-between">
                      <span>Monday - Friday:</span>
                      <span className="font-semibold">10:00 AM – 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday:</span>
                      <span className="font-semibold">11:00 AM – 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday:</span>
                      <span className="font-semibold text-amber-600">Closed (Open for events)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Address */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">📍 Our Location</h3>
              <div className="space-y-3 text-gray-600">
                <p className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>123 Unity Avenue, Suite 200<br />Los Angeles, CA 90012</span>
                </p>
                <p className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>+1 (555) 678-2345</span>
                </p>
                <p className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>hello@khorshidcommunity.org</span>
                </p>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4">🌐 Connect With Us</h3>
              <p className="text-gray-300 mb-4">Follow us on social media for updates, events, and community highlights.</p>
              <div className="flex gap-4">
                {[
                  { name: "Instagram", icon: "📷", color: "hover:bg-pink-600" },
                  { name: "Facebook", icon: "📘", color: "hover:bg-blue-600" },
                  { name: "YouTube", icon: "▶️", color: "hover:bg-red-600" },
                  { name: "LinkedIn", icon: "🔗", color: "hover:bg-blue-700" },
                ].map((social, idx) => (
                  <button key={idx} className={`flex-1 py-2 bg-white/10 rounded-xl ${social.color} transition-all hover:scale-105`}>
                    <div className="text-2xl">{social.icon}</div>
                    <div className="text-xs mt-1">{social.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <span className="text-amber-600 font-semibold tracking-wide uppercase text-sm">Quick Answers</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Frequently Asked Questions</h2>
            <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full mt-4"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { q: "How can I become a member?", a: "Simply fill out the contact form or visit us during office hours. Membership is free and open to all." },
              { q: "Are events free to attend?", a: "Most events are free for members. Some special events may have a nominal fee to cover costs." },
              { q: "How can I volunteer?", a: "We're always looking for volunteers! Select 'Volunteer Opportunities' in the form above." },
              { q: "Do you offer language classes?", a: "Yes! We offer Persian language classes for all levels. Check our events page for schedules." },
            ].map((faq, idx) => (
              <div key={idx} className="bg-gray-50 rounded-2xl p-6 hover:shadow-md transition-all">
                <h3 className="font-bold text-gray-800 mb-2">❓ {faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Contact Banner */}
        <div className="mt-12 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 text-center border border-red-100">
          <p className="text-gray-700">
            <span className="font-bold text-red-600">⚠️ Emergency or crisis support?</span> Call our 24/7 helpline at 
            <a href="tel:+18005551234" className="text-amber-700 font-bold ml-1">1-800-555-1234</a>
          </p>
        </div>
      </div>
    </div>
  );
}