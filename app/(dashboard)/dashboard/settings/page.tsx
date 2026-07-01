'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function SettingsPage() {
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);

  async function handlePasswordSave(e: React.FormEvent) {
    e.preventDefault();
    setPwError('');
    if (pwForm.next !== pwForm.confirm) { setPwError('New passwords do not match.'); return; }
    if (pwForm.next.length < 8) { setPwError('Password must be at least 8 characters.'); return; }

    setPwSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) { setPwError('Unable to verify session.'); setPwSaving(false); return; }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email: user.email, password: pwForm.current });
    if (signInError) { setPwError('Current password is incorrect.'); setPwSaving(false); return; }

    const { error } = await supabase.auth.updateUser({ password: pwForm.next });
    setPwSaving(false);
    if (error) { setPwError(error.message); return; }

    setPwForm({ current: '', next: '', confirm: '' });
    setPwSuccess(true);
    setTimeout(() => setPwSuccess(false), 3000);
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-2">
          <span className="w-4 h-px bg-accent" />Account
        </span>
        <h1 className="font-display font-light text-3xl sm:text-4xl text-gray-900 dark:text-white">
          <em className="italic text-brand-900 dark:text-brand-300">Settings</em>
        </h1>
      </div>

      <div className="max-w-2xl space-y-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-50 dark:border-gray-800">
            <h2 className="font-semibold text-gray-900 dark:text-white">Change Password</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Use a strong, unique password.</p>
          </div>
          <form onSubmit={handlePasswordSave} className="p-6 space-y-4">
            {([
              { label: 'Current Password', key: 'current' as const },
              { label: 'New Password', key: 'next' as const },
              { label: 'Confirm New Password', key: 'confirm' as const },
            ]).map(({ label, key }) => (
              <div key={key}>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">{label}</label>
                <input
                  type="password"
                  value={pwForm[key]}
                  onChange={(e) => setPwForm((f) => ({ ...f, [key]: e.target.value }))}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-white text-sm focus:outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
              </div>
            ))}
            {pwError && <p className="text-sm text-red-500">{pwError}</p>}
            <div className="flex items-center justify-between pt-2">
              {pwSuccess ? (
                <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400 text-sm font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Password updated
                </span>
              ) : <div />}
              <button
                type="submit"
                disabled={pwSaving}
                className="bg-accent hover:bg-accent-hover disabled:opacity-60 text-brand-950 font-semibold px-6 py-2.5 rounded-md text-sm transition-all duration-200 shadow-[0_4px_12px_rgba(251,191,36,0.25)] hover:shadow-[0_4px_18px_rgba(251,191,36,0.4)]"
              >
                {pwSaving ? 'Updating…' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
