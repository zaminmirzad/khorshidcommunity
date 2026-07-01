'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Send = {
  id: string;
  subject: string;
  body: string;
  audience: string;
  recipient_count: number;
  sent_at: string;
};

const AUDIENCE_OPTIONS = [
  { value: 'all', label: 'All Members' },
  { value: 'paid', label: 'Paid Members Only' },
];

export default function NewsletterPage() {
  const [sends, setSends] = useState<Send[]>([]);
  const [memberCount, setMemberCount] = useState<number | null>(null);
  const [paidCount, setPaidCount] = useState<number | null>(null);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({ subject: '', body: '', audience: 'all' });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [showCompose, setShowCompose] = useState(false);

  useEffect(() => {
    async function load() {
      const [historyRes, supabase] = [fetch('/api/admin/newsletter'), createClient()];
      const [{ data: hist }, { count: total }, { data: paid }] = await Promise.all([
        historyRes.then((r) => r.json()).then((d) => ({ data: d })),
        supabase.from('members').select('*', { count: 'exact', head: true }),
        supabase.from('payments').select('member_id').eq('status', 'paid'),
      ]);
      setSends(Array.isArray(hist) ? hist : []);
      setMemberCount(total ?? 0);
      const uniquePaid = new Set((paid ?? []).map((p: { member_id: string }) => p.member_id)).size;
      setPaidCount(uniquePaid);
    }
    load();
  }, []);

  const recipientCount = form.audience === 'paid' ? (paidCount ?? 0) : (memberCount ?? 0);

  async function handleSend() {
    setSending(true);
    setError('');
    setSuccess('');
    const res = await fetch('/api/admin/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    setSending(false);
    setConfirmOpen(false);
    if (!res.ok) { setError(json.error ?? 'Failed to send.'); return; }
    setShowCompose(false);
    setForm({ subject: '', body: '', audience: 'all' });
    setSuccess(`Sent to ${json.recipient_count} member${json.recipient_count !== 1 ? 's' : ''}.`);
    const updated = await fetch('/api/admin/newsletter').then((r) => r.json());
    setSends(Array.isArray(updated) ? updated : []);
  }

  const totalSent = sends.reduce((sum, s) => sum + s.recipient_count, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-2">
            <span className="w-4 h-px bg-accent" />Communications
          </span>
          <h1 className="font-display font-light text-3xl sm:text-4xl text-gray-900 dark:text-white">
            <em className="italic text-brand-900 dark:text-brand-300">Newsletter</em>
          </h1>
        </div>
        <button
          onClick={() => { setShowCompose(true); setError(''); setSuccess(''); }}
          className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-brand-950 font-semibold px-5 py-2.5 rounded-md text-sm transition-all shadow-[0_4px_12px_rgba(251,191,36,0.25)]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Compose
        </button>
      </div>

      {success && (
        <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 px-4 py-3 rounded-md">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          {success}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'All Members', value: memberCount ?? '—', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, color: 'bg-brand-50 dark:bg-brand-950/50 text-brand-600' },
          { label: 'Paid Members', value: paidCount ?? '—', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>, color: 'bg-green-50 dark:bg-green-950/30 text-green-600' },
          { label: 'Campaigns Sent', value: sends.length, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>, color: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600' },
          { label: 'Total Delivered', value: totalSent.toLocaleString(), icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5l7 7-7 7" /></svg>, color: 'bg-purple-50 dark:bg-purple-950/30 text-purple-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm p-5">
            <div className={`w-10 h-10 rounded-md flex items-center justify-center mb-3 ${s.color}`}>{s.icon}</div>
            <div className="font-display text-2xl font-light text-gray-900 dark:text-white leading-none mb-0.5">{s.value}</div>
            <div className="text-xs text-gray-400 dark:text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className={`grid gap-6 ${showCompose ? 'lg:grid-cols-5' : 'lg:grid-cols-1'}`}>
        {showCompose && (
          <div className="lg:col-span-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
              <div>
                <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500 mb-1">
                  <span className="w-4 h-px bg-accent" />Compose
                </span>
                <h2 className="font-display font-light text-xl text-gray-900 dark:text-white">Send Newsletter</h2>
              </div>
              <button onClick={() => { setShowCompose(false); setError(''); setSuccess(''); setForm({ subject: '', body: '', audience: 'all' }); }} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">Subject Line</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="July Community Update…"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">Audience</label>
                <select
                  value={form.audience}
                  onChange={(e) => setForm({ ...form, audience: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all"
                >
                  {AUDIENCE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label} ({o.value === 'paid' ? (paidCount ?? '…') : (memberCount ?? '…')})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">Message</label>
                <textarea
                  rows={8}
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  placeholder="Write your newsletter content here…"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm text-gray-900 dark:text-white placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all"
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button
                onClick={() => {
                  if (!form.subject.trim() || !form.body.trim()) { setError('Subject and message are required.'); return; }
                  setError('');
                  setConfirmOpen(true);
                }}
                className="w-full bg-accent hover:bg-accent-hover text-brand-950 font-semibold py-3 rounded-md text-sm transition-all shadow-[0_4px_12px_rgba(251,191,36,0.25)]"
              >
                Send to {recipientCount} member{recipientCount !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        )}

        <div className={showCompose ? 'lg:col-span-2' : ''}>
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-50 dark:border-gray-800">
            <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500 mb-1">
              <span className="w-4 h-px bg-accent" />History
            </span>
            <h2 className="font-display font-light text-xl text-gray-900 dark:text-white">Past Sends</h2>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {sends.length === 0 ? (
              <div className="py-12 text-center text-gray-400 dark:text-gray-500 text-sm">No newsletters sent yet.</div>
            ) : sends.map((s) => (
              <div key={s.id} className="px-6 py-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-0.5 leading-snug">{s.subject}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">
                  {new Date(s.sent_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · {s.recipient_count.toLocaleString()} recipients
                </p>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${s.audience === 'paid' ? 'bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400' : 'bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300'}`}>
                  {s.audience === 'paid' ? 'Paid members' : 'All members'}
                </span>
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-2xl p-6 max-w-md w-full">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Confirm Send</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              You are about to send <span className="font-semibold text-gray-900 dark:text-white">&quot;{form.subject}&quot;</span> to{' '}
              <span className="font-semibold text-gray-900 dark:text-white">{recipientCount} member{recipientCount !== 1 ? 's' : ''}</span>.
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400 mb-5">This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmOpen(false)} className="flex-1 px-4 py-2.5 rounded-md border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                Cancel
              </button>
              <button onClick={handleSend} disabled={sending} className="flex-1 px-4 py-2.5 rounded-md bg-accent hover:bg-accent-hover disabled:opacity-60 text-brand-950 text-sm font-semibold transition-all">
                {sending ? 'Sending…' : 'Confirm Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
