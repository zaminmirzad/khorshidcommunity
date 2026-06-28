'use client';
import { useState } from 'react';

export default function ProfilePage() {
  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-2">
          <span className="w-4 h-px bg-accent" />Account
        </span>
        <h1 className="font-display font-light text-3xl sm:text-4xl text-gray-900 dark:text-white">
          My <em className="italic text-brand-900 dark:text-brand-300">Profile</em>
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 text-center">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 border-4 border-white dark:border-gray-800 shadow-lg flex items-center justify-center mx-auto">
                <span className="font-display text-4xl font-light text-accent">A</span>
              </div>
              <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-500 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </button>
            </div>
            <h2 className="font-semibold text-gray-900 dark:text-white text-lg leading-none mb-0.5">Ahmad Karimi</h2>
            <p className="text-gray-400 dark:text-gray-500 text-sm mb-4">ahmad.karimi@email.com</p>
            <div className="inline-flex items-center gap-1.5 bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 text-xs font-semibold px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />Active Member
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Membership Details</h3>
            {[
              { label: 'Member Since', value: '2021' },
              { label: 'Membership Type', value: 'Free' },
              { label: 'Events Attended', value: '24' },
              { label: 'Community Points', value: '480 pts' },
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
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Update your personal details here.</p>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">First Name</label>
                  <input
                    type="text"
                    defaultValue="Ahmad"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">Last Name</label>
                  <input
                    type="text"
                    defaultValue="Karimi"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">Email Address</label>
                <input
                  type="email"
                  defaultValue="ahmad.karimi@email.com"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">Phone Number</label>
                <input
                  type="tel"
                  defaultValue="+1 (619) 555-0198"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">City</label>
                <input
                  type="text"
                  defaultValue="San Diego, CA"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">Bio <span className="normal-case text-gray-300 dark:text-gray-600 font-normal tracking-normal">optional</span></label>
                <textarea
                  rows={3}
                  defaultValue="Community member passionate about Persian culture and bringing people together."
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm resize-none focus:outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
              </div>

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
                  className="bg-accent hover:bg-accent-hover text-brand-950 font-semibold px-6 py-2.5 rounded-xl text-sm transition-all duration-200 shadow-[0_4px_12px_rgba(251,191,36,0.25)] hover:shadow-[0_4px_18px_rgba(251,191,36,0.4)]"
                >
                  Save Changes
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
    </div>
  );
}
