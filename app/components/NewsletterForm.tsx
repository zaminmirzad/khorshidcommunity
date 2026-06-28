'use client';
import { useState } from 'react';

interface NewsletterLabels {
  placeholder: string;
  submit: string;
  submitting: string;
  success: string;
  error: string;
}

const EN_LABELS: NewsletterLabels = {
  placeholder: 'Your email address',
  submit: 'Subscribe',
  submitting: 'Subscribing...',
  success: "You're subscribed! Thank you.",
  error: 'Something went wrong. Please try again.',
};

interface Props {
  lang?: string;
  labels?: NewsletterLabels;
  inputClassName?: string;
}

export default function NewsletterForm({ lang, labels = EN_LABELS, inputClassName }: Props) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, ...(lang && { lang }) }),
      });
      setStatus(res.ok ? 'success' : 'error');
      if (res.ok) setEmail('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
        <input
          type="email"
          placeholder={labels.placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={`flex-1 px-6 py-3 rounded-xl border-0 focus:ring-2 focus:ring-accent outline-none ${inputClassName ?? ''}`}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn-shimmer px-8 py-3 bg-accent hover:bg-accent-hover text-brand-950 font-semibold rounded-xl transition-all disabled:opacity-70"
        >
          {status === 'loading' ? labels.submitting : labels.submit}
        </button>
      </form>
      {status === 'success' && (
        <p className="text-green-400 text-sm mt-4">{labels.success}</p>
      )}
      {status === 'error' && (
        <p className="text-red-400 text-sm mt-4">{labels.error}</p>
      )}
    </div>
  );
}
