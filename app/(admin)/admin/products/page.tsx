'use client';
import { useEffect, useState } from 'react';

type StripePrice = {
  stripe_price_id: string;
  stripe_product_id: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
  is_recurring: boolean;
};

type Product = StripePrice & {
  id: string;
  active: boolean;
  is_subscription: boolean;
  created_at: string;
};

type Member = { id: string; full_name: string; email: string };

function fmt(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount / 100);
}

type Assignment = {
  id: string;
  label: string | null;
  note: string | null;
  assigned_at: string;
  members: { id: string; full_name: string; email: string } | null;
};

type RowProps = {
  p: Product;
  toggleActive: (p: Product) => void;
  setAssignModal: (p: Product) => void;
};

function ProductRow({ p, toggleActive, setAssignModal }: RowProps) {
  const [expanded, setExpanded] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[] | null>(null);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [assignError, setAssignError] = useState('');
  const [confirmUnassign, setConfirmUnassign] = useState<string | null>(null);

  async function loadAssignments() {
    setLoadingAssignments(true);
    setAssignError('');
    const res = await fetch(`/api/admin/products/assign?product_id=${p.id}`);
    const json = await res.json();
    if (!res.ok || !Array.isArray(json)) {
      setAssignError(json?.error ?? 'Failed to load assignments.');
      setAssignments([]);
    } else {
      setAssignments(json);
    }
    setLoadingAssignments(false);
  }

  async function toggleExpand() {
    if (!expanded) setExpanded(true);
    await loadAssignments();
  }

  async function unassign(assignmentId: string) {
    setConfirmUnassign(null);
    await fetch('/api/admin/products/assign', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assignment_id: assignmentId }),
    });
    setAssignments((prev) => prev?.filter((a) => a.id !== assignmentId) ?? null);
  }

  const pending = assignments?.length ?? 0;

  return (
    <div>
      <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{p.name}</p>
            {p.is_subscription && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.12em] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                Monthly
              </span>
            )}
          </div>
          {p.description && <p className="text-xs text-gray-400 dark:text-gray-500">{p.description}</p>}
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {fmt(p.amount, p.currency)}{p.is_subscription ? ' / month' : ''} · {p.stripe_price_id}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {p.is_subscription ? (
            <span className="text-xs text-gray-400 dark:text-gray-500 px-3 py-1.5 border border-dashed border-gray-200 dark:border-gray-700 rounded-sm">
              Global — no assignment needed
            </span>
          ) : (
            <>
              <button
                onClick={toggleExpand}
                className={`text-xs font-semibold px-3 py-1.5 rounded-sm border transition-all ${expanded ? 'border-brand-300 dark:border-brand-700 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300' : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
              >
                {loadingAssignments ? 'Loading…' : expanded ? `Pending · ${pending}` : 'Pending'}
              </button>
              <button onClick={() => setAssignModal(p)} className="text-xs font-semibold px-3 py-1.5 rounded-sm bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-900/50 transition-colors">
                Assign
              </button>
            </>
          )}
          <button onClick={() => toggleActive(p)} className={`text-xs font-semibold px-3 py-1.5 rounded-sm border transition-all ${p.active ? 'border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30' : 'border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/30'}`}>
            {p.active ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-50 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/30">
          {assignments === null || loadingAssignments ? (
            <p className="px-6 py-4 text-xs text-gray-400">Loading…</p>
          ) : assignError ? (
            <p className="px-6 py-4 text-xs text-red-500">{assignError}</p>
          ) : assignments.length === 0 ? (
            <p className="px-6 py-4 text-xs text-gray-400 dark:text-gray-500">No pending assignments.</p>
          ) : (
            <div className="px-6 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500 mb-3">
                {assignments.length} pending · awaiting payment
              </p>
              <div className="space-y-2">
                {assignments.map((a) => {
                  const name = a.members?.full_name ?? '—';
                  const initials = name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
                  return (
                    <div key={a.id} className="flex items-center gap-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-md px-4 py-3">
                      <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center shrink-0">
                        <span className="text-[11px] font-bold text-brand-700 dark:text-brand-300">{initials}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">{name}</span>
                          {a.label && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400">{a.label}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span className="text-xs text-gray-400 dark:text-gray-500">{a.members?.email}</span>
                          {a.note && <span className="text-xs text-gray-400 dark:text-gray-500">· {a.note}</span>}
                          <span className="text-xs text-gray-300 dark:text-gray-600">· {new Date(a.assigned_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      </div>
                      {confirmUnassign === a.id ? (
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs text-gray-500 dark:text-gray-400">Remove?</span>
                          <button onClick={() => unassign(a.id)} className="text-xs font-semibold px-3 py-1.5 rounded-sm bg-red-600 hover:bg-red-700 text-white transition-colors">Yes</button>
                          <button onClick={() => setConfirmUnassign(null)} className="text-xs font-semibold px-3 py-1.5 rounded-sm border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">No</button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmUnassign(a.id)} className="text-xs font-semibold px-3 py-1.5 rounded-sm border border-red-200 dark:border-red-900 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors shrink-0">
                          Unassign
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stripePrices, setStripePrices] = useState<StripePrice[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [savingPriceId, setSavingPriceId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState('');
  const [pageError, setPageError] = useState('');
  const [inactiveOpen, setInactiveOpen] = useState(false);
  const [assignModal, setAssignModal] = useState<Product | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [assignNote, setAssignNote] = useState('');
  const [assignLabel, setAssignLabel] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [pendingMemberIds, setPendingMemberIds] = useState<Set<string>>(new Set());
  const [assignResult, setAssignResult] = useState<{ assigned: number; skipped: number } | null>(null);
  const [memberSearch, setMemberSearch] = useState('');

  async function loadProducts() {
    const res = await fetch('/api/admin/products');
    setProducts(await res.json());
    setLoading(false);
  }

  async function loadMembers() {
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();
    const { data } = await supabase.from('members').select('id, full_name, email').order('full_name');
    setMembers(data ?? []);
  }

  useEffect(() => { loadProducts(); loadMembers(); }, []);

  async function importFromStripe() {
    setImporting(true);
    const res = await fetch('/api/admin/stripe-prices');
    setStripePrices(await res.json());
    setImporting(false);
    setShowImport(true);
  }

  async function saveProduct(price: StripePrice) {
    setSavingPriceId(price.stripe_price_id);
    setSaveError('');
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...price, is_subscription: price.is_recurring }),
    });
    const json = await res.json();
    setSavingPriceId(null);
    if (!res.ok) { setSaveError(json.error ?? 'Failed to save fee.'); return; }
    await loadProducts();
  }

  async function toggleActive(product: Product) {
    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !product.active }),
    });
    if (!res.ok) {
      const { error } = await res.json();
      setPageError(error ?? 'Failed to update fee.');
      return;
    }
    await loadProducts();
  }

  async function openAssignModal(p: Product) {
    setAssignModal(p);
    setSelectedMembers([]);
    setAssignNote('');
    setAssignLabel('');
    setAssignResult(null);
    setPendingMemberIds(new Set());
    setMemberSearch('');
    const res = await fetch(`/api/admin/products/assign?product_id=${p.id}`);
    const json = await res.json();
    const ids = new Set<string>(
      Array.isArray(json) ? json.map((a: Assignment) => a.members?.id).filter((id): id is string => !!id) : []
    );
    setPendingMemberIds(ids);
  }

  async function assignProduct() {
    if (!assignModal || !selectedMembers.length) return;
    setAssigning(true);
    setAssignResult(null);
    const res = await fetch('/api/admin/products/assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: assignModal.id, member_ids: selectedMembers, note: assignNote, label: assignLabel }),
    });
    const json = await res.json();
    setAssigning(false);
    if (res.ok) {
      setAssignResult({ assigned: json.assigned ?? selectedMembers.length, skipped: json.skipped ?? 0 });
      setSelectedMembers([]);
      setAssignNote('');
      setAssignLabel('');
      // Refresh pending IDs so the list stays accurate
      const r2 = await fetch(`/api/admin/products/assign?product_id=${assignModal.id}`);
      const j2 = await r2.json();
      setPendingMemberIds(new Set(Array.isArray(j2) ? j2.map((a: Assignment) => a.members?.id).filter((id): id is string => !!id) : []));
    }
  }

  const alreadySaved = (stripe_price_id: string) => products.some((p) => p.stripe_price_id === stripe_price_id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-2">
            <span className="w-4 h-px bg-accent" />Payments
          </span>
          <h1 className="font-display font-light text-3xl sm:text-4xl text-gray-900 dark:text-white">
            <em className="italic text-brand-900 dark:text-brand-300">Fees</em>
          </h1>
        </div>
        <button
          onClick={importFromStripe}
          disabled={importing}
          className="flex items-center gap-2 bg-accent hover:bg-accent-hover disabled:opacity-60 text-brand-950 font-semibold px-5 py-2.5 rounded-md text-sm transition-all shadow-[0_4px_12px_rgba(251,191,36,0.25)]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
          {importing ? 'Fetching…' : 'Import from Stripe'}
        </button>
      </div>

      {pageError && (
        <div className="flex items-center justify-between gap-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md text-sm">
          <span>{pageError}</span>
          <button onClick={() => setPageError('')} className="text-red-400 hover:text-red-600 shrink-0">✕</button>
        </div>
      )}

      {showImport && (
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-accent/30 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50 dark:border-gray-800">
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white text-sm">Stripe Prices — select to add</h2>
              {saveError && <p className="text-xs text-red-500 mt-0.5">{saveError}</p>}
            </div>
            <button onClick={() => { setShowImport(false); setSaveError(''); }} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {stripePrices.map((price) => {
              const saved = alreadySaved(price.stripe_price_id);
              const saving = savingPriceId === price.stripe_price_id;
              return (
                <div key={price.stripe_price_id} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{price.name}</p>
                      {price.is_recurring && (
                        <span className="text-[10px] font-bold uppercase tracking-[0.12em] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
                          Monthly
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      {fmt(price.amount, price.currency)}{price.is_recurring ? ' / month' : ''} · {price.stripe_price_id}
                    </p>
                    {price.description && <p className="text-xs text-gray-400 dark:text-gray-500">{price.description}</p>}
                  </div>
                  <button
                    onClick={() => saveProduct(price)}
                    disabled={saved || saving}
                    className={`text-xs font-semibold px-4 py-2 rounded-md transition-all ${saved ? 'bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 cursor-default' : saving ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-wait' : 'bg-brand-900 dark:bg-brand-800 text-white hover:bg-brand-800 dark:hover:bg-brand-700'}`}
                  >
                    {saved ? '✓ Added' : saving ? 'Saving…' : 'Add'}
                  </button>
                </div>
              );
            })}
            {stripePrices.length === 0 && <p className="px-6 py-8 text-sm text-gray-400 text-center">No active prices found in Stripe.</p>}
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">{products.filter((p) => p.active).length} active fee{products.filter((p) => p.active).length !== 1 ? 's' : ''}</p>
        </div>
        {loading ? (
          <div className="py-12 text-center text-gray-400 text-sm">Loading…</div>
        ) : products.filter((p) => p.active).length === 0 && products.length === 0 ? (
          <div className="py-12 text-center text-gray-400 dark:text-gray-500 text-sm">No fees yet. Import from Stripe to get started.</div>
        ) : (
          <>
            <div className="divide-y divide-gray-50 dark:divide-gray-800">
              {products.filter((p) => p.active).length === 0 && (
                <div className="py-8 text-center text-gray-400 dark:text-gray-500 text-sm">No active fees.</div>
              )}
              {products.filter((p) => p.active).map((p) => (
                <ProductRow key={p.id} p={p} toggleActive={toggleActive} setAssignModal={openAssignModal} />
              ))}
            </div>

            {products.filter((p) => !p.active).length > 0 && (
              <div className="border-t border-gray-100 dark:border-gray-800">
                <button
                  onClick={() => setInactiveOpen((v) => !v)}
                  className="w-full flex items-center justify-between px-6 py-3 text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <span className="font-medium">Inactive · {products.filter((p) => !p.active).length}</span>
                  <svg className={`w-4 h-4 transition-transform duration-200 ${inactiveOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {inactiveOpen && (
                  <div className="divide-y divide-gray-50 dark:divide-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
                    {products.filter((p) => !p.active).map((p) => (
                      <ProductRow key={p.id} p={p} toggleActive={toggleActive} setAssignModal={openAssignModal} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {assignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setAssignModal(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">Assign: {assignModal.name}</h3>
              <button onClick={() => setAssignModal(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500">Select Members</label>
                <button
                  type="button"
                  onClick={() => {
                    const available = members.filter((m) => !pendingMemberIds.has(m.id)).map((m) => m.id);
                    setSelectedMembers(selectedMembers.length === available.length ? [] : available);
                  }}
                  className="text-[11px] font-semibold text-brand-700 dark:text-brand-300 hover:underline"
                >
                  {selectedMembers.length === members.filter((m) => !pendingMemberIds.has(m.id)).length ? 'Deselect all' : 'Select all'}
                </button>
              </div>
              <div className="relative mb-2">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input
                  type="text"
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  placeholder="Search by name…"
                  className="w-full pl-8 pr-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-sm text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all"
                />
              </div>
              <div className="max-h-44 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md divide-y divide-gray-50 dark:divide-gray-800">
                {members.filter((m) => m.full_name.toLowerCase().includes(memberSearch.toLowerCase())).map((m) => {
                  const isPending = pendingMemberIds.has(m.id);
                  return (
                    <label key={m.id} className={`flex items-center gap-3 px-4 py-3 ${isPending ? 'opacity-50 cursor-not-allowed bg-gray-50/50 dark:bg-gray-800/30' : 'hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer'}`}>
                      <input
                        type="checkbox"
                        disabled={isPending}
                        checked={selectedMembers.includes(m.id)}
                        onChange={(e) => setSelectedMembers(e.target.checked ? [...selectedMembers, m.id] : selectedMembers.filter((id) => id !== m.id))}
                        className="rounded border-gray-300 text-accent focus:ring-accent/30 disabled:cursor-not-allowed"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{m.full_name}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {m.email}
                          {isPending && <span className="ml-2 text-amber-600 dark:text-amber-400 font-medium">· pending payment</span>}
                        </p>
                      </div>
                    </label>
                  );
                })}
                {members.filter((m) => m.full_name.toLowerCase().includes(memberSearch.toLowerCase())).length === 0 && (
                  <p className="px-4 py-3 text-xs text-gray-400 dark:text-gray-500">No members match "{memberSearch}"</p>
                )}
              </div>
            </div>
            {assignResult && (
              <div className={`text-xs px-3 py-2 rounded-sm ${assignResult.skipped > 0 ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400' : 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400'}`}>
                {assignResult.assigned > 0 && <span>Assigned to {assignResult.assigned} member{assignResult.assigned !== 1 ? 's' : ''}. </span>}
                {assignResult.skipped > 0 && <span>{assignResult.skipped} skipped — already pending.</span>}
              </div>
            )}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">Cycle / Label <span className="normal-case font-normal text-gray-300 dark:text-gray-600 tracking-normal">optional</span></label>
              <input
                type="text"
                value={assignLabel}
                onChange={(e) => setAssignLabel(e.target.value)}
                placeholder="e.g. 2024–2025"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">Note <span className="normal-case font-normal text-gray-300 dark:text-gray-600 tracking-normal">optional</span></label>
              <input
                type="text"
                value={assignNote}
                onChange={(e) => setAssignNote(e.target.value)}
                placeholder="e.g. Plot section B, row 4"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setAssignModal(null)} className="px-4 py-2 rounded-md text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Cancel</button>
              <button
                onClick={assignProduct}
                disabled={assigning || selectedMembers.length === 0}
                className="px-5 py-2 rounded-md text-sm font-semibold bg-accent hover:bg-accent-hover disabled:opacity-60 text-brand-950 transition-all shadow-[0_4px_12px_rgba(251,191,36,0.25)]"
              >
                {assigning ? 'Assigning…' : `Assign to ${selectedMembers.length} member${selectedMembers.length !== 1 ? 's' : ''}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
