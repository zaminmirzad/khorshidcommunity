'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Payment = {
  id: string;
  amount: number;
  currency: string;
  description: string;
  status: string;
  paid_at: string;
  stripe_session_id: string;
  members: { full_name: string; email: string } | null;
  products: { name: string } | null;
};

function fmt(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount / 100);
}

function exportCSV(payments: Payment[]) {
  const rows = [
    ['Date', 'Member', 'Email', 'Product', 'Amount', 'Status', 'Session ID'],
    ...payments.map((p) => [
      new Date(p.paid_at).toLocaleDateString('en-US'),
      p.members?.full_name ?? '',
      p.members?.email ?? '',
      p.products?.name ?? p.description,
      fmt(p.amount, p.currency),
      p.status,
      p.stripe_session_id,
    ]),
  ];
  const csv = rows.map((r) => r.map((v) => `"${v}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `payments-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from('payments')
        .select('*, members(full_name, email), products(name)')
        .order('paid_at', { ascending: false });
      setPayments(data ?? []);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = payments.filter((p) => {
    const q = search.toLowerCase();
    return (
      !q ||
      p.members?.full_name.toLowerCase().includes(q) ||
      p.members?.email.toLowerCase().includes(q) ||
      (p.products?.name ?? p.description).toLowerCase().includes(q)
    );
  });

  const totalRevenue = filtered.reduce((sum, p) => sum + (p.status === 'paid' ? p.amount : 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-2">
            <span className="w-4 h-px bg-accent" />Finance
          </span>
          <h1 className="font-display font-light text-3xl sm:text-4xl text-gray-900 dark:text-white">
            <em className="italic text-brand-900 dark:text-brand-300">Payments</em>
          </h1>
        </div>
        <button
          onClick={() => exportCSV(filtered)}
          className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Export CSV
        </button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Revenue', value: fmt(totalRevenue, 'usd'), icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, color: 'bg-green-50 dark:bg-green-950/30 text-green-600' },
          { label: 'Total Payments', value: String(filtered.length), icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>, color: 'bg-brand-50 dark:bg-brand-950/50 text-brand-600' },
          { label: 'Unique Members', value: String(new Set(payments.map((p) => p.members?.email)).size), icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, color: 'bg-purple-50 dark:bg-purple-950/30 text-purple-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${s.color}`}>{s.icon}</div>
            <div className="font-display text-2xl font-light text-gray-900 dark:text-white mb-1">{s.value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <input type="text" placeholder="Search by member or product…" value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all" />
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">{filtered.length} payment{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        {loading ? (
          <div className="py-12 text-center text-gray-400 text-sm">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-gray-400 dark:text-gray-500 text-sm">No payments found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50 dark:border-gray-800">
                  {['Date', 'Member', 'Product', 'Amount', 'Status'].map((h) => (
                    <th key={h} className="text-left text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 px-6 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-3.5 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {new Date(p.paid_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-3.5">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{p.members?.full_name ?? '—'}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{p.members?.email ?? ''}</p>
                    </td>
                    <td className="px-6 py-3.5 text-sm text-gray-600 dark:text-gray-300">{p.products?.name ?? p.description}</td>
                    <td className="px-6 py-3.5 text-sm font-semibold text-gray-900 dark:text-white">{fmt(p.amount, p.currency)}</td>
                    <td className="px-6 py-3.5">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 capitalize">{p.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
