'use client';
import { useState } from 'react';

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${checked ? 'bg-accent' : 'bg-gray-200 dark:bg-gray-700'}`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    eventReminders: true,
    newEvents: true,
    newsletter: false,
    communityUpdates: true,
  });
  const [privacy, setPrivacy] = useState({
    showProfile: true,
    showEvents: false,
  });
  const [passwordSaved, setPasswordSaved] = useState(false);

  function handlePasswordSave(e: React.FormEvent) {
    e.preventDefault();
    setPasswordSaved(true);
    setTimeout(() => setPasswordSaved(false), 2500);
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
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-50 dark:border-gray-800">
            <h2 className="font-semibold text-gray-900 dark:text-white">Notifications</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Choose what updates you want to receive.</p>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {[
              { key: 'eventReminders' as const, label: 'Event Reminders', desc: '24-hour reminders before registered events' },
              { key: 'newEvents' as const, label: 'New Events', desc: 'Notify me when new events are posted' },
              { key: 'newsletter' as const, label: 'Monthly Newsletter', desc: 'Community news and highlights' },
              { key: 'communityUpdates' as const, label: 'Community Updates', desc: 'Important announcements from Khorshid' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{label}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{desc}</p>
                </div>
                <Toggle checked={notifications[key]} onChange={(v) => setNotifications((n) => ({ ...n, [key]: v }))} />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-50 dark:border-gray-800">
            <h2 className="font-semibold text-gray-900 dark:text-white">Privacy</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Control what other members can see.</p>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {[
              { key: 'showProfile' as const, label: 'Public Profile', desc: 'Allow other members to view your profile' },
              { key: 'showEvents' as const, label: 'Show Events Attended', desc: 'Display your event history on your profile' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{label}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{desc}</p>
                </div>
                <Toggle checked={privacy[key]} onChange={(v) => setPrivacy((p) => ({ ...p, [key]: v }))} />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-50 dark:border-gray-800">
            <h2 className="font-semibold text-gray-900 dark:text-white">Change Password</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Use a strong, unique password.</p>
          </div>
          <form onSubmit={handlePasswordSave} className="p-6 space-y-4">
            {['Current Password', 'New Password', 'Confirm New Password'].map((label) => (
              <div key={label}>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">{label}</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm focus:outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
              </div>
            ))}
            <div className="flex items-center justify-between pt-2">
              {passwordSaved && (
                <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400 text-sm font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Password updated
                </span>
              )}
              {!passwordSaved && <div />}
              <button
                type="submit"
                className="bg-accent hover:bg-accent-hover text-brand-950 font-semibold px-6 py-2.5 rounded-xl text-sm transition-all duration-200 shadow-[0_4px_12px_rgba(251,191,36,0.25)] hover:shadow-[0_4px_18px_rgba(251,191,36,0.4)]"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-50 dark:border-gray-800">
            <h2 className="font-semibold text-gray-900 dark:text-white">Connected Accounts</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Sign in faster with your existing accounts.</p>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {[
              {
                name: 'Google',
                icon: <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>,
                connected: true,
                account: 'ahmad.karimi@gmail.com',
              },
              {
                name: 'GitHub',
                icon: <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>,
                connected: false,
                account: null,
              },
            ].map(({ name, icon, connected, account }) => (
              <div key={name} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg border border-gray-100 dark:border-gray-700 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                    {icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{name}</p>
                    {account && <p className="text-xs text-gray-400 dark:text-gray-500">{account}</p>}
                    {!connected && <p className="text-xs text-gray-400 dark:text-gray-500">Not connected</p>}
                  </div>
                </div>
                <button className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 ${
                  connected
                    ? 'text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/30 border border-red-100 dark:border-red-900/50 hover:border-red-200 dark:hover:border-red-800'
                    : 'text-brand-900 dark:text-brand-300 hover:text-white bg-brand-50 dark:bg-brand-950/50 hover:bg-brand-900 border border-brand-100 dark:border-brand-900/50 hover:border-brand-900'
                }`}>
                  {connected ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
