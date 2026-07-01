'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
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
  fees: { name: string } | null;
};

type Member = {
  id: string;
  full_name: string;
  email: string;
  joined_at: string;
  avatar_url: string | null;
  paid: boolean;
  payments: { description: string; amount: number; currency: string; paid_at: string }[];
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
      p.fees?.name ?? p.description,
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

function RecordForm({ member, products, onDone }: {
  member: Member;
  products: { id: string; name: string; amount: number; currency: string }[];
  onDone: () => void;
}) {
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');
  const [productId, setProductId] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!amount || isNaN(parseFloat(amount))) { setError('Enter a valid amount.'); return; }
    setSaving(true);
    setError('');
    const res = await fetch('/api/admin/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        memberId: member.id,
        productId: productId || null,
        amount: parseFloat(amount),
        currency: 'usd',
        description: desc || undefined,
      }),
    });
    setSaving(false);
    if (res.ok) { onDone(); }
    else { const { error: e } = await res.json(); setError(e ?? 'Failed to record.'); }
  }

  return (
    <form onSubmit={submit} className="mt-3 bg-gray-50 dark:bg-gray-800/60 rounded-md p-4 space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-1.5">Amount (USD)</label>
          <input
            type="number" step="0.01" min="0.01" required
            value={amount} onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-1.5">Product (optional)</label>
          <select
            value={productId} onChange={(e) => {
              setProductId(e.target.value);
              const p = products.find((x) => x.id === e.target.value);
              if (p && !amount) setAmount(String(p.amount / 100));
            }}
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all"
          >
            <option value="">No specific product</option>
            {products.map((p) => <option key={p.id} value={p.id}>{p.name} — {fmt(p.amount, p.currency)}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-1.5">Note (optional)</label>
        <input
          type="text"
          value={desc} onChange={(e) => setDesc(e.target.value)}
          placeholder="e.g. Paid by bank transfer"
          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all"
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={saving}
          className="bg-accent hover:bg-accent-hover disabled:opacity-60 text-brand-950 font-semibold px-4 py-2 rounded-sm text-xs transition-all">
          {saving ? 'Recording…' : 'Record Payment'}
        </button>
        <button type="button" onClick={onDone}
          className="px-4 py-2 rounded-sm text-xs font-semibold border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function PaymentsPage() {
  const [tab, setTab] = useState<'payments' | 'members'>('payments');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [products, setProducts] = useState<{ id: string; name: string; amount: number; currency: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [memberFilter, setMemberFilter] = useState<'all' | 'paid' | 'unpaid'>('all');
  const [recording, setRecording] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const supabase = createClient();
    const [{ data: pays }, { data: mems }, { data: prods }] = await Promise.all([
      supabase.from('payments').select('*, members(full_name, email), fees(name)').order('paid_at', { ascending: false }),
      supabase.from('members').select('id, full_name, email, joined_at, avatar_url').order('joined_at', { ascending: false }),
      supabase.from('fees').select('id, name, amount, currency').eq('active', true),
    ]);
    const payMap: Record<string, { description: string; amount: number; currency: string; paid_at: string }[]> = {};
    for (const p of pays ?? []) {
      const mid = (p as unknown as { member_id: string }).member_id;
      if (!payMap[mid]) payMap[mid] = [];
      payMap[mid].push({ description: p.description, amount: p.amount, currency: p.currency, paid_at: p.paid_at });
    }
    setPayments(pays ?? []);
    setMembers((mems ?? []).map((m) => ({ ...m, avatar_url: m.avatar_url ?? null, paid: !!(payMap[m.id]?.length), payments: payMap[m.id] ?? [] })));
    setProducts(prods ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const totalRevenue = payments.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amount, 0);

  const filteredPayments = payments.filter((p) => {
    const q = search.toLowerCase();
    return !q || p.members?.full_name.toLowerCase().includes(q) || p.members?.email.toLowerCase().includes(q) || (p.fees?.name ?? p.description).toLowerCase().includes(q);
  });

  const filteredMembers = members.filter((m) => {
    const q = search.toLowerCase();
    const matchSearch = !q || m.full_name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q);
    const matchFilter = memberFilter === 'all' || (memberFilter === 'paid' ? m.paid : !m.paid);
    return matchSearch && matchFilter;
  });

  const paidCount = members.filter((m) => m.paid).length;

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
        {tab === 'payments' && (
          <button onClick={() => exportCSV(filteredPayments)}
            className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-md border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Export CSV
          </button>
        )}
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Revenue', value: fmt(totalRevenue, 'usd'), icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, color: 'bg-green-50 dark:bg-green-950/30 text-green-600' },
          { label: 'Members Paid', value: `${paidCount} / ${members.length}`, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, color: 'bg-brand-50 dark:bg-brand-950/50 text-brand-600' },
          { label: 'Total Transactions', value: String(payments.length), icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>, color: 'bg-purple-50 dark:bg-purple-950/30 text-purple-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-md flex items-center justify-center mb-4 ${s.color}`}>{s.icon}</div>
            <div className="font-display text-2xl font-light text-gray-900 dark:text-white mb-1">{s.value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <input type="text" placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all" />
        </div>
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-md">
          {(['payments', 'members'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-sm text-sm font-medium capitalize transition-all ${tab === t ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {tab === 'payments' && (
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">{filteredPayments.length} payment{filteredPayments.length !== 1 ? 's' : ''}</p>
          </div>
          {loading ? (
            <div className="py-12 text-center text-gray-400 text-sm">Loading…</div>
          ) : filteredPayments.length === 0 ? (
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
                  {filteredPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-3.5 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {new Date(p.paid_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', second: '2-digit' })}
                      </td>
                      <td className="px-6 py-3.5">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{p.members?.full_name ?? '—'}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{p.members?.email ?? ''}</p>
                      </td>
                      <td className="px-6 py-3.5 text-sm text-gray-600 dark:text-gray-300">{p.fees?.name ?? p.description}</td>
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
      )}

      {tab === 'members' && (
        <div className="space-y-3">
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-md w-fit">
            {(['all', 'paid', 'unpaid'] as const).map((f) => (
              <button key={f} onClick={() => setMemberFilter(f)}
                className={`px-4 py-1.5 rounded-sm text-sm font-medium capitalize transition-all ${memberFilter === f ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>
                {f}
                {f === 'unpaid' && members.filter((m) => !m.paid).length > 0 && (
                  <span className="ml-1.5 bg-amber-500 text-brand-950 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{members.filter((m) => !m.paid).length}</span>
                )}
              </button>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
            {loading ? (
              <div className="py-12 text-center text-gray-400 text-sm">Loading…</div>
            ) : filteredMembers.length === 0 ? (
              <div className="py-12 text-center text-gray-400 dark:text-gray-500 text-sm">No members found.</div>
            ) : (
              <div className="divide-y divide-gray-50 dark:divide-gray-800">
                {filteredMembers.map((m) => (
                  <div key={m.id} className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-full bg-brand-50 dark:bg-brand-950/50 border border-brand-100 dark:border-brand-900/50 flex items-center justify-center shrink-0 overflow-hidden">
                        {m.avatar_url
                          ? <Image src={m.avatar_url} alt={m.full_name} width={36} height={36} className="object-cover w-full h-full" />
                          : <span className="font-display text-sm font-semibold text-brand-700 dark:text-brand-300">{m.full_name[0]}</span>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{m.full_name}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{m.email}</p>
                        {m.paid && m.payments.length > 0 && (
                          <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">
                            Last paid {new Date(m.payments[0].paid_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', second: '2-digit' })} · {fmt(m.payments[0].amount, m.payments[0].currency)}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        {m.paid ? (
                          <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-900/50">
                            Paid
                          </span>
                        ) : (
                          <>
                            <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50">
                              Unpaid
                            </span>
                            <button
                              onClick={() => setRecording(recording === m.id ? null : m.id)}
                              className="text-xs font-semibold px-3 py-1.5 rounded-sm bg-accent hover:bg-accent-hover text-brand-950 transition-all"
                            >
                              Record Payment
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    {recording === m.id && (
                      <RecordForm
                        member={m}
                        products={products}
                        onDone={() => { setRecording(null); load(); }}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
