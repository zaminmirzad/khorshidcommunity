'use client';
import { useState } from 'react';

const PAST_SENDS = [
  { subject: 'June Community Update', sent: 'Jun 1, 2026', recipients: 3083, opens: '62%', clicks: '18%' },
  { subject: 'Nowruz 2026 — Thank You!', sent: 'Mar 22, 2026', recipients: 2941, opens: '74%', clicks: '31%' },
  { subject: 'Summer Festival Registration Now Open', sent: 'May 15, 2026', recipients: 3012, opens: '68%', clicks: '27%' },
  { subject: 'April Events & Programs', sent: 'Apr 1, 2026', recipients: 2978, opens: '59%', clicks: '14%' },
];

export default function NewsletterPage() {
  const [sent, setSent] = useState(false);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-2">
          <span className="w-4 h-px bg-accent" />Communications
        </span>
        <h1 className="font-display font-light text-3xl sm:text-4xl text-gray-900 dark:text-white">
          <em className="italic text-brand-900 dark:text-brand-300">Newsletter</em>
        </h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Subscribers', value: '3,104', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, color: 'bg-brand-50 dark:bg-brand-950/50 text-brand-600' },
          { label: 'Avg Open Rate', value: '65.7%', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>, color: 'bg-green-50 dark:bg-green-950/30 text-green-600' },
          { label: 'Avg Click Rate', value: '22.5%', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>, color: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600' },
          { label: 'Emails Sent', value: '48', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>, color: 'bg-purple-50 dark:bg-purple-950/30 text-purple-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>{s.icon}</div>
            <div className="font-display text-2xl font-light text-gray-900 dark:text-white leading-none mb-0.5">{s.value}</div>
            <div className="text-xs text-gray-400 dark:text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-50 dark:border-gray-800">
            <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500 mb-1">
              <span className="w-4 h-px bg-accent" />Compose
            </span>
            <h2 className="font-display font-light text-xl text-gray-900 dark:text-white">Send Newsletter</h2>
          </div>
          <form onSubmit={handleSend} className="p-6 space-y-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">Subject Line</label>
              <input
                type="text"
                placeholder="July Community Update…"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">Audience</label>
              <select className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all">
                <option>All Subscribers (3,104)</option>
                <option>Active Members Only</option>
                <option>Event Registrants</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">Message</label>
              <textarea
                rows={8}
                placeholder="Write your newsletter content here…"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none focus:outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all"
              />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button type="button" className="flex-1 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-medium py-3 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                Save Draft
              </button>
              <button
                type="submit"
                className="flex-1 bg-accent hover:bg-accent-hover text-brand-950 font-semibold py-3 rounded-xl text-sm transition-all shadow-[0_4px_12px_rgba(251,191,36,0.25)]"
              >
                {sent ? '✓ Sent!' : 'Send Newsletter'}
              </button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-50 dark:border-gray-800">
            <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500 mb-1">
              <span className="w-4 h-px bg-accent" />History
            </span>
            <h2 className="font-display font-light text-xl text-gray-900 dark:text-white">Past Sends</h2>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {PAST_SENDS.map((s) => (
              <div key={s.subject} className="px-6 py-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-0.5 leading-snug">{s.subject}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">{s.sent} · {s.recipients.toLocaleString()} recipients</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">{s.opens} open</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">{s.clicks} click</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
