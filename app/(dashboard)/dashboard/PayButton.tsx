'use client';
import { useState } from 'react';

export default function PayButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handlePay() {
    setLoading(true);
    setError('');
    const res = await fetch('/api/payments/checkout', { method: 'POST' });
    const { url, error } = await res.json();
    if (error || !url) {
      setError(error ?? 'Could not start checkout. Please try again.');
      setLoading(false);
      return;
    }
    window.location.href = url;
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        onClick={handlePay}
        disabled={loading}
        className="shrink-0 bg-accent hover:bg-accent-hover disabled:opacity-60 text-brand-950 font-semibold px-5 py-2.5 rounded-xl text-sm transition-all duration-200 shadow-[0_4px_15px_rgba(251,191,36,0.3)] hover:shadow-[0_4px_20px_rgba(251,191,36,0.5)]"
      >
        {loading ? 'Redirecting…' : 'Pay Membership'}
      </button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
