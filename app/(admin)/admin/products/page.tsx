'use client';
import { useEffect, useState } from 'react';

type StripePrice = {
  stripe_price_id: string;
  stripe_product_id: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
};

type Product = StripePrice & {
  id: string;
  active: boolean;
  is_public: boolean;
  created_at: string;
};

type Member = { id: string; full_name: string; email: string };

function fmt(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount / 100);
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
  const [assignModal, setAssignModal] = useState<Product | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [assignNote, setAssignNote] = useState('');
  const [assigning, setAssigning] = useState(false);

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
      body: JSON.stringify(price),
    });
    const json = await res.json();
    setSavingPriceId(null);
    if (!res.ok) { setSaveError(json.error ?? 'Failed to save product.'); return; }
    await loadProducts();
  }

  async function togglePublic(product: Product) {
    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_public: !product.is_public }),
    });
    if (!res.ok) {
      const { error } = await res.json();
      alert(error ?? 'Failed to update product.');
      return;
    }
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
      alert(error ?? 'Failed to update product.');
      return;
    }
    await loadProducts();
  }

  async function deleteProduct(id: string) {
    if (!confirm('Remove this product? This will not delete it from Stripe.')) return;
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  async function assignProduct() {
    if (!assignModal || !selectedMembers.length) return;
    setAssigning(true);
    await fetch('/api/admin/products/assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: assignModal.id, member_ids: selectedMembers, note: assignNote }),
    });
    setAssigning(false);
    setAssignModal(null);
    setSelectedMembers([]);
    setAssignNote('');
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
            <em className="italic text-brand-900 dark:text-brand-300">Products</em>
          </h1>
        </div>
        <button
          onClick={importFromStripe}
          disabled={importing}
          className="flex items-center gap-2 bg-accent hover:bg-accent-hover disabled:opacity-60 text-brand-950 font-semibold px-5 py-2.5 rounded-xl text-sm transition-all shadow-[0_4px_12px_rgba(251,191,36,0.25)]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
          {importing ? 'Fetching…' : 'Import from Stripe'}
        </button>
      </div>

      {showImport && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-accent/30 shadow-sm overflow-hidden">
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
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{price.name}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{fmt(price.amount, price.currency)} · {price.stripe_price_id}</p>
                    {price.description && <p className="text-xs text-gray-400 dark:text-gray-500">{price.description}</p>}
                  </div>
                  <button
                    onClick={() => saveProduct(price)}
                    disabled={saved || saving}
                    className={`text-xs font-semibold px-4 py-2 rounded-xl transition-all ${saved ? 'bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 cursor-default' : saving ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-wait' : 'bg-brand-900 dark:bg-brand-800 text-white hover:bg-brand-800 dark:hover:bg-brand-700'}`}
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

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">{products.length} product{products.length !== 1 ? 's' : ''}</p>
        </div>
        {loading ? (
          <div className="py-12 text-center text-gray-400 text-sm">Loading…</div>
        ) : products.length === 0 ? (
          <div className="py-12 text-center text-gray-400 dark:text-gray-500 text-sm">No products yet. Import from Stripe to get started.</div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {products.map((p) => (
              <div key={p.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{p.name}</p>
                    {!p.active && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400">Inactive</span>}
                    {p.is_public && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400">Public</span>}
                    {!p.is_public && p.active && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400">Private</span>}
                  </div>
                  {p.description && <p className="text-xs text-gray-400 dark:text-gray-500">{p.description}</p>}
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{fmt(p.amount, p.currency)} · {p.stripe_price_id}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  <button
                    onClick={() => togglePublic(p)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    {p.is_public ? 'Make private' : 'Make public'}
                  </button>
                  <button
                    onClick={() => { setAssignModal(p); setSelectedMembers([]); setAssignNote(''); }}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-900/50 transition-colors"
                  >
                    Assign to member
                  </button>
                  <button
                    onClick={() => toggleActive(p)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    {p.active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {assignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setAssignModal(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">Assign: {assignModal.name}</h3>
              <button onClick={() => setAssignModal(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">Select Members</label>
              <div className="max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-xl divide-y divide-gray-50 dark:divide-gray-800">
                {members.map((m) => (
                  <label key={m.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(m.id)}
                      onChange={(e) => setSelectedMembers(e.target.checked ? [...selectedMembers, m.id] : selectedMembers.filter((id) => id !== m.id))}
                      className="rounded border-gray-300 text-accent focus:ring-accent/30"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{m.full_name}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{m.email}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">Note <span className="normal-case font-normal text-gray-300 dark:text-gray-600 tracking-normal">optional</span></label>
              <input
                type="text"
                value={assignNote}
                onChange={(e) => setAssignNote(e.target.value)}
                placeholder="e.g. Workshop fee for July session"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setAssignModal(null)} className="px-4 py-2 rounded-xl text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Cancel</button>
              <button
                onClick={assignProduct}
                disabled={assigning || selectedMembers.length === 0}
                className="px-5 py-2 rounded-xl text-sm font-semibold bg-accent hover:bg-accent-hover disabled:opacity-60 text-brand-950 transition-all shadow-[0_4px_12px_rgba(251,191,36,0.25)]"
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
