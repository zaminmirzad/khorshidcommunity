'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Props = {
  fullName: string;
  email: string;
  phone: string;
  joinedYear: number;
};

export default function ProfileForm({ fullName, email, phone, joinedYear }: Props) {
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(fullName);
  const [phoneVal, setPhoneVal] = useState(phone);
  const initial = fullName ? fullName[0].toUpperCase() : 'M';

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError('Not authenticated.'); setSaving(false); return; }
    const { error: err } = await supabase
      .from('members')
      .update({ full_name: name.trim(), phone: phoneVal.trim() || null, updated_at: new Date().toISOString() })
      .eq('user_id', user.id);
    setSaving(false);
    if (err) { setError('Failed to save. Please try again.'); return; }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 text-center">
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 border-4 border-white dark:border-gray-800 shadow-lg flex items-center justify-center mx-auto">
              <span className="font-display text-4xl font-light text-accent">{initial}</span>
            </div>
          </div>
          <h2 className="font-semibold text-gray-900 dark:text-white text-lg leading-none mb-0.5">{name || fullName}</h2>
          <p className="text-gray-400 dark:text-gray-500 text-sm mb-4">{email}</p>
          <div className="inline-flex items-center gap-1.5 bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 text-xs font-semibold px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />Active Member
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Membership Details</h3>
          {[
            { label: 'Member Since', value: String(joinedYear) },
            { label: 'Membership Type', value: 'Free' },
          ].map((d) => (
            <div key={d.label} className="flex items-center justify-between">
              <span className="text-xs text-gray-400 dark:text-gray-500">{d.label}</span>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">{d.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-50 dark:border-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-white">Personal Information</h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Update your name and phone number.</p>
          </div>
          <form onSubmit={handleSave} className="p-6 space-y-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-400 dark:text-gray-500 text-sm cursor-not-allowed"
              />
              <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">Email cannot be changed after account creation.</p>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">Phone Number <span className="normal-case text-gray-300 dark:text-gray-600 font-normal tracking-normal">optional</span></label>
              <input
                type="tel"
                value={phoneVal}
                onChange={(e) => setPhoneVal(e.target.value)}
                placeholder="+1 (619) 555-0000"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex items-center justify-between pt-2">
              {saved && (
                <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400 text-sm font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Changes saved
                </span>
              )}
              {!saved && <div />}
              <button
                type="submit"
                disabled={saving}
                className="bg-accent hover:bg-accent-hover disabled:opacity-60 text-brand-950 font-semibold px-6 py-2.5 rounded-xl text-sm transition-all duration-200 shadow-[0_4px_12px_rgba(251,191,36,0.25)] hover:shadow-[0_4px_18px_rgba(251,191,36,0.4)]"
              >
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-red-100 dark:border-red-900/40 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-red-50 dark:border-red-900/30">
            <h3 className="font-semibold text-red-700 dark:text-red-400">Danger Zone</h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">These actions are permanent and cannot be undone.</p>
          </div>
          <div className="px-6 py-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Delete account</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Permanently remove your account and all data.</p>
            </div>
            <button className="text-sm text-red-600 dark:text-red-400 font-semibold hover:text-red-700 dark:hover:text-red-300 border border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 px-4 py-2 rounded-xl transition-all duration-200">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
