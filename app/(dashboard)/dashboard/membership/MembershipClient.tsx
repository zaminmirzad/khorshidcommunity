'use client';
import { useState } from 'react';

type Product = {
  id: string;
  name: string;
  description: string | null;
  amount: number;
  currency: string;
  source: 'public' | 'assigned';
  note?: string | null;
};

type Props = {
  products: Product[];
  paidProductIds: string[];
  paymentStatus?: string;
};

function fmt(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount / 100);
}

function PayBtn({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false);

  async function handlePay() {
    setLoading(true);
    const res = await fetch('/api/payments/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });
    const { url, error } = await res.json();
    if (error || !url) { setLoading(false); alert('Could not start checkout. Please try again.'); return; }
    window.location.href = url;
  }

  return (
    <button
      onClick={handlePay}
      disabled={loading}
      className="flex items-center gap-2 bg-accent hover:bg-accent-hover disabled:opacity-60 text-brand-950 font-semibold px-5 py-2.5 rounded-xl text-sm transition-all duration-200 shadow-[0_4px_15px_rgba(251,191,36,0.3)] hover:shadow-[0_4px_20px_rgba(251,191,36,0.5)]"
    >
      {loading ? 'Redirecting…' : 'Pay ' + '→'}
    </button>
  );
}

export default function MembershipClient({ products, paidProductIds, paymentStatus }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-2">
          <span className="w-4 h-px bg-accent" />Account
        </span>
        <h1 className="font-display font-light text-3xl sm:text-4xl text-gray-900 dark:text-white">
          My <em className="italic text-brand-900 dark:text-brand-300">Membership</em>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1.5 text-sm">Payments and membership products available to you.</p>
      </div>

      {paymentStatus === 'success' && (
        <div className="flex items-center gap-3 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 px-5 py-4 rounded-2xl text-sm font-medium">
          <svg className="w-5 h-5 shrink-0 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          Payment successful — thank you!
        </div>
      )}
      {paymentStatus === 'cancelled' && (
        <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 px-5 py-4 rounded-2xl text-sm font-medium">
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          Payment cancelled — no charge was made.
        </div>
      )}

      {products.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-12 text-center">
          <p className="text-gray-400 dark:text-gray-500 text-sm">No products available yet. Check back soon.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {products.map((product) => {
            const paid = paidProductIds.includes(product.id);
            return (
              <div key={product.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug">{product.name}</h3>
                      {product.source === 'assigned' && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300">Assigned</span>
                      )}
                    </div>
                    {product.description && <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">{product.description}</p>}
                    {product.note && <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 leading-relaxed italic">{product.note}</p>}
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between">
                  <span className="font-display text-2xl font-light text-gray-900 dark:text-white">{fmt(product.amount, product.currency)}</span>
                  {paid ? (
                    <div className="flex items-center gap-1.5 bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 text-xs font-semibold px-3 py-2 rounded-xl border border-green-100 dark:border-green-900/50">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                      Paid
                    </div>
                  ) : (
                    <PayBtn productId={product.id} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
