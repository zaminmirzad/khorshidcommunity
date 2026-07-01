'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Submission = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  submitted_at: string;
  resolved_at: string | null;
};

const FILTERS = ['all', 'unread', 'read', 'resolved'] as const;

const STATUS_COLORS: Record<string, string> = {
  unread: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400',
  read: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400',
  resolved: 'bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400',
};

export default function MessagesPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<typeof FILTERS[number]>('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('submitted_at', { ascending: false });
      setSubmissions(data ?? []);
      setLoading(false);
    }
    load();
  }, []);

  async function updateStatus(id: string, status: string) {
    const supabase = createClient();
    await supabase.from('contact_submissions').update({
      status,
      resolved_at: status === 'resolved' ? new Date().toISOString() : null,
    }).eq('id', id);
    setSubmissions((prev) => prev.map((s) => s.id === id ? { ...s, status } : s));
  }

  async function handleExpand(s: Submission) {
    const next = expanded === s.id ? null : s.id;
    setExpanded(next);
    if (next && s.status === 'unread') await updateStatus(s.id, 'read');
  }

  const filtered = filter === 'all' ? submissions : submissions.filter((s) => s.status === filter);
  const unreadCount = submissions.filter((s) => s.status === 'unread').length;

  return (
    <div className="space-y-6">
      <div>
        <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-2">
          <span className="w-4 h-px bg-accent" />Inbox
        </span>
        <div className="flex items-center gap-3">
          <h1 className="font-display font-light text-3xl sm:text-4xl text-gray-900 dark:text-white">
            <em className="italic text-brand-900 dark:text-brand-300">Messages</em>
          </h1>
          {unreadCount > 0 && (
            <span className="bg-amber-400 text-brand-950 text-xs font-bold px-2 py-0.5 rounded-full">{unreadCount}</span>
          )}
        </div>
      </div>

      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-md w-fit">
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-sm text-sm font-medium capitalize transition-all ${filter === f ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="py-12 text-center text-gray-400 text-sm">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-gray-400 dark:text-gray-500 text-sm">No messages.</div>
        ) : (
          filtered.map((s) => (
            <div key={s.id} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
              <button className="w-full text-left px-6 py-4 flex items-start justify-between gap-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors" onClick={() => handleExpand(s)}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className={`text-sm font-semibold ${s.status === 'unread' ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>{s.name}</p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[s.status]}`}>{s.status}</span>
                  </div>
                  <p className={`text-sm truncate ${s.status === 'unread' ? 'font-medium text-gray-700 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500'}`}>{s.subject}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    {s.email} · {new Date(s.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <svg className={`w-5 h-5 text-gray-300 dark:text-gray-600 shrink-0 mt-0.5 transition-transform ${expanded === s.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>

              {expanded === s.id && (
                <div className="px-6 pb-5 border-t border-gray-50 dark:border-gray-800 pt-4 space-y-4">
                  {s.phone && <p className="text-xs text-gray-500 dark:text-gray-400">Phone: {s.phone}</p>}
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-md p-4">
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{s.message}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <a href={`mailto:${s.email}?subject=Re: ${encodeURIComponent(s.subject)}`}
                      className="text-xs font-semibold px-4 py-2 rounded-md bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-900/50 transition-colors">
                      Reply by email
                    </a>
                    {s.status !== 'resolved' && (
                      <button onClick={() => updateStatus(s.id, 'resolved')}
                        className="text-xs font-semibold px-4 py-2 rounded-md bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors">
                        Mark resolved
                      </button>
                    )}
                    {s.status === 'resolved' && (
                      <button onClick={() => updateStatus(s.id, 'read')}
                        className="text-xs font-semibold px-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        Reopen
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
