'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Request = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  message: string | null;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
};

const STATUS_FILTERS = ['all', 'pending', 'approved', 'rejected'] as const;
type Filter = typeof STATUS_FILTERS[number];

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [filter, setFilter] = useState<Filter>('pending');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  async function fetchRequests() {
    const supabase = createClient();
    const { data } = await supabase
      .from('membership_requests')
      .select('*')
      .order('submitted_at', { ascending: false });
    setRequests(data ?? []);
    setLoading(false);
  }

  useEffect(() => { fetchRequests(); }, []);

  async function handleApprove(req: Request) {
    setActionLoading(req.id);
    const res = await fetch('/api/membership/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: req.id, email: req.email, fullName: req.full_name }),
    });
    if (res.ok) {
      setRequests((prev) => prev.map((r) => r.id === req.id ? { ...r, status: 'approved' } : r));
    }
    setActionLoading(null);
  }

  async function handleReject(req: Request) {
    setActionLoading(req.id);
    const res = await fetch('/api/membership/reject', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: req.id }),
    });
    if (res.ok) {
      setRequests((prev) => prev.map((r) => r.id === req.id ? { ...r, status: 'rejected' } : r));
    }
    setActionLoading(null);
  }

  const filtered = filter === 'all' ? requests : requests.filter((r) => r.status === filter);
  const pendingCount = requests.filter((r) => r.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div>
        <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-2">
          <span className="w-4 h-px bg-accent" />Membership
        </span>
        <h1 className="font-display font-light text-3xl sm:text-4xl text-gray-900 dark:text-white">
          <em className="italic text-brand-900 dark:text-brand-300">Requests</em>
        </h1>
        {pendingCount > 0 && (
          <p className="text-sm text-amber-600 dark:text-amber-400 mt-1.5 font-medium">{pendingCount} pending review</p>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${filter === f ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
          >
            {f}
            {f === 'pending' && pendingCount > 0 && (
              <span className="ml-1.5 bg-amber-500 text-brand-950 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{pendingCount}</span>
            )}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-400 dark:text-gray-500 text-sm">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400 dark:text-gray-500 text-sm">No {filter === 'all' ? '' : filter} requests.</div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {filtered.map((req) => {
              const isExpanded = expanded === req.id;
              const isActioning = actionLoading === req.id;
              return (
                <div key={req.id} className="px-6 py-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-50 dark:bg-brand-950/50 border border-brand-100 dark:border-brand-900/50 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="font-display text-sm font-semibold text-brand-700 dark:text-brand-300">{req.full_name[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">{req.full_name}</p>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                          req.status === 'pending' ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400' :
                          req.status === 'approved' ? 'bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400' :
                          'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400'
                        }`}>{req.status}</span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{req.email}{req.phone ? ` · ${req.phone}` : ''}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        {new Date(req.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {req.message && (
                        <button onClick={() => setExpanded(isExpanded ? null : req.id)} className="text-xs text-accent-dark hover:text-accent font-medium mt-1.5 transition-colors">
                          {isExpanded ? 'Hide message ↑' : 'View message ↓'}
                        </button>
                      )}
                      {isExpanded && req.message && (
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 leading-relaxed">{req.message}</p>
                      )}
                    </div>
                    {req.status === 'pending' && (
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleApprove(req)}
                          disabled={isActioning}
                          className="inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-colors"
                        >
                          {isActioning ? '…' : (
                            <>
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                              Approve
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleReject(req)}
                          disabled={isActioning}
                          className="inline-flex items-center gap-1.5 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 disabled:opacity-50 text-xs font-semibold px-3.5 py-2 rounded-xl transition-colors"
                        >
                          {isActioning ? '…' : 'Reject'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
