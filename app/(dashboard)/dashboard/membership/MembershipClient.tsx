'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Product = {
  id: string;
  name: string;
  description: string | null;
  amount: number;
  currency: string;
  source: 'public' | 'assigned';
  note?: string | null;
  label?: string | null;
  assignmentId?: string | null;
};

type PaymentRow = {
  id: string;
  description: string;
  amount: number;
  currency: string;
  paid_at: string;
};

type Props = {
  products: Product[];
  hasFees: boolean;
  payments: PaymentRow[];
  paymentStatus?: string;
  sessionId?: string;
};

function fmt(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount / 100);
}

function PayBtn({ productId, assignmentId }: { productId: string; assignmentId?: string | null }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handlePay() {
    setLoading(true);
    setError('');
    const res = await fetch('/api/payments/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, assignmentId }),
    });
    const { url, error: err } = await res.json();
    if (err || !url) { setLoading(false); setError(err ?? 'Could not start checkout. Please try again.'); return; }
    // Remember which assignment is being paid so we only show "Confirming" on that card
    sessionStorage.setItem('pending_payment_id', assignmentId ?? productId);
    window.location.href = url;
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handlePay}
        disabled={loading}
        className="flex items-center gap-2 bg-accent hover:bg-accent-hover disabled:opacity-60 text-brand-950 font-semibold px-5 py-2.5 rounded-md text-sm transition-all duration-200 shadow-[0_4px_15px_rgba(251,191,36,0.3)] hover:shadow-[0_4px_20px_rgba(251,191,36,0.5)]"
      >
        {loading ? 'Redirecting…' : 'Pay →'}
      </button>
      {error && <p className="text-xs text-red-500 text-right">{error}</p>}
    </div>
  );
}

export default function MembershipClient({ products, hasFees, payments, paymentStatus, sessionId }: Props) {
  const router = useRouter();
  const paymentPending = paymentStatus === 'success';
  const [verifying, setVerifying] = useState(paymentPending);
  const [verifyError, setVerifyError] = useState(false);
  // ID of the specific assignment/product being confirmed — only that card shows "Confirming"
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  useEffect(() => {
    if (!paymentPending || !sessionId) {
      setVerifying(false);
      return;
    }

    // Read which assignment was being paid before the Stripe redirect
    const pendingId = sessionStorage.getItem('pending_payment_id');
    if (pendingId) {
      setConfirmingId(pendingId);
      sessionStorage.removeItem('pending_payment_id');
    }

    let attempts = 0;
    const MAX = 6;

    async function tryVerify() {
      try {
        const res = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });
        const { paid } = await res.json();
        if (paid) { router.refresh(); return; }
      } catch {}

      attempts++;
      if (attempts < MAX) {
        setTimeout(tryVerify, 3000);
      } else {
        setVerifying(false);
        setConfirmingId(null);
        setVerifyError(true);
      }
    }

    tryVerify();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const allPaid = hasFees && products.length === 0;

  return (
    <div className="space-y-6">
      <div>
        <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-2">
          <span className="w-4 h-px bg-accent" />Payments
        </span>
        <h1 className="font-display font-light text-3xl sm:text-4xl text-gray-900 dark:text-white">
          My <em className="italic text-brand-900 dark:text-brand-300">Payments</em>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1.5 text-sm">Your payment history and fees available to you.</p>
      </div>

      {paymentStatus === 'success' && !verifyError && (
        <div className="flex items-center gap-3 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 px-5 py-4 rounded-lg text-sm font-medium">
          <svg className="w-5 h-5 shrink-0 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          <span>{verifying ? 'Payment successful — updating your account…' : 'Payment successful — thank you!'}</span>
        </div>
      )}
      {verifyError && (
        <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 px-5 py-4 rounded-lg text-sm">
          <svg className="w-5 h-5 shrink-0 mt-0.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
          <span>Your payment was received by Stripe but we couldn't update your account automatically. Please contact support — your payment will be applied manually.</span>
        </div>
      )}
      {paymentStatus === 'cancelled' && (
        <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 px-5 py-4 rounded-lg text-sm font-medium">
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          Payment cancelled — no charge was made.
        </div>
      )}

      {!hasFees ? (
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm p-12 text-center">
          <p className="text-gray-400 dark:text-gray-500 text-sm">No fees available yet. Check back soon.</p>
        </div>
      ) : allPaid && !verifying ? (
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-green-50 dark:bg-green-950/40 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <p className="font-medium text-gray-900 dark:text-white text-sm">You're all set</p>
          <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">All payments have been completed.</p>
        </div>
      ) : products.length > 0 ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {products.map((product) => {
            const cardId = product.assignmentId ?? product.id;
            const isConfirming = verifying && confirmingId === cardId;
            return (
            <div key={cardId} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm p-6 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug">{product.name}</h3>
                    {product.source === 'assigned' && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300">Assigned</span>
                    )}
                  </div>
                  {product.label && <p className="text-xs font-medium text-accent mb-1">{product.label}</p>}
                  {product.description && <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">{product.description}</p>}
                  {product.note && <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 leading-relaxed italic">{product.note}</p>}
                </div>
              </div>
              <div className="mt-auto flex items-center justify-between">
                <span className="font-display text-2xl font-light text-gray-900 dark:text-white">{fmt(product.amount, product.currency)}</span>
                {isConfirming
                  ? <div className="text-xs text-gray-400 dark:text-gray-500 font-medium px-1">Confirming…</div>
                  : <PayBtn productId={product.id} assignmentId={product.assignmentId} />
                }
              </div>
            </div>
            );
          })}
        </div>
      ) : null}

      {payments.length > 0 && (
        <div>
          <h2 className="font-display font-light text-xl text-gray-900 dark:text-white mb-3">Payment History</h2>
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50 dark:border-gray-800">
                    {['Date', 'Description', 'Amount'].map((h) => (
                      <th key={h} className="text-left text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 px-6 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {payments.map((p) => (
                    <tr key={p.id}>
                      <td className="px-6 py-3.5 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {new Date(p.paid_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', second: '2-digit' })}
                      </td>
                      <td className="px-6 py-3.5 text-sm text-gray-700 dark:text-gray-300">{p.description}</td>
                      <td className="px-6 py-3.5 text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                        {fmt(p.amount, p.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
