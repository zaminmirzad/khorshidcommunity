'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from '@/app/hooks/useTheme';
import { createClient } from '@/lib/supabase/client';

type Props = {
  children: React.ReactNode;
  memberName: string;
  joinedAt: string;
  isAdmin: boolean;
  unreadAnnouncements: number;
  pendingFeeCount: number;
};

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Overview', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM14 5a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" /></svg> },
  { href: '/dashboard/membership', label: 'My Payments', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg> },
  { href: '/dashboard/events', label: 'My Events', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
  { href: '/dashboard/profile', label: 'Profile', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
  { href: '/dashboard/settings', label: 'Settings', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
];

function SidebarContent({ memberName, joinedAt, isAdmin, unreadAnnouncements, pendingFeeCount, onNav, dark, toggleTheme }: { memberName: string; joinedAt: string; isAdmin: boolean; unreadAnnouncements: number; pendingFeeCount: number; onNav?: () => void; dark: boolean; toggleTheme: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const initial = memberName ? memberName[0].toUpperCase() : 'M';
  const joinedYear = new Date(joinedAt).getFullYear();
  const [confirmSignOut, setConfirmSignOut] = useState(false);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/sign-in');
    router.refresh();
  }

  return (
    <>
    {confirmSignOut && (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setConfirmSignOut(false)} />
        <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-100 dark:border-gray-800 p-6 w-full max-w-sm">
          <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-1">Sign out?</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">You'll need to sign in again to access your account.</p>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setConfirmSignOut(false)} className="px-4 py-2 rounded-md text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Cancel</button>
            <button onClick={signOut} className="px-5 py-2 rounded-md text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors">Sign Out</button>
          </div>
        </div>
      </div>
    )}
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800">
      <div className="px-5 py-5 border-b border-gray-100 dark:border-gray-800">
        <Link href="/" className="flex items-center gap-3 group w-fit">
          <Image src="/images/logo.jpg" alt="Khorshid Community" width={36} height={36} className="rounded-sm object-cover ring-1 ring-gray-200 dark:ring-gray-700 group-hover:ring-accent/60 transition-all duration-200" />
          <div className="flex flex-col leading-none">
            <span className="font-display text-base font-semibold text-brand-700 dark:text-brand-300">Khorshid</span>
            <span className="font-display text-base font-semibold text-gray-900 dark:text-white">Community</span>
          </div>
        </Link>
      </div>

      <div className="px-5 pt-6 pb-2">
        <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
          <span className="w-4 h-px bg-accent" />Member Portal
        </span>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const badge = item.href === '/dashboard' && unreadAnnouncements > 0
            ? unreadAnnouncements
            : item.href === '/dashboard/membership' && pendingFeeCount > 0
            ? pendingFeeCount
            : null;
          return (
            <Link key={item.href} href={item.href} onClick={onNav}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 group ${isActive ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white'}`}
            >
              <span className={`shrink-0 transition-colors ${isActive ? 'text-accent' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`}>{item.icon}</span>
              {item.label}
              <span className="ml-auto flex items-center gap-1.5 shrink-0">
                {badge !== null && (
                  <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-brand-950 text-[10px] font-bold flex items-center justify-center">
                    {badge > 9 ? '9+' : badge}
                  </span>
                )}
                {isActive && badge === null && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 pb-3 space-y-0.5">
        {isAdmin && (
          <Link href="/admin" onClick={onNav} className="flex items-center gap-2 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 text-xs font-medium transition-colors px-3 py-2.5 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/60">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            Admin Panel
          </Link>
        )}
        <button onClick={() => setConfirmSignOut(true)} className="w-full flex items-center gap-2 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 text-xs font-medium transition-colors px-3 py-2.5 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/60">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Sign Out
        </button>
      </div>

      <div className="px-4 py-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center shrink-0">
            <span className="font-display text-sm font-semibold text-gray-600 dark:text-gray-300">{initial}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-900 dark:text-white text-sm font-semibold leading-none mb-0.5 truncate">{memberName}</p>
            <p className="text-gray-400 dark:text-gray-500 text-[11px] truncate">Member since {joinedYear}</p>
          </div>
          <button onClick={toggleTheme} className="p-1.5 rounded-sm text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shrink-0" aria-label="Toggle dark mode">
            {dark
              ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M18.364 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" /></svg>
              : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            }
          </button>
        </div>
      </div>
    </div>
    </>
  );
}

export default function DashboardShell({ children, memberName, joinedAt, isAdmin, unreadAnnouncements, pendingFeeCount }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { dark, toggle } = useTheme();

  return (
    <div className={dark ? 'dark' : ''} suppressHydrationWarning>
      <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
        <div className="hidden lg:block lg:w-64 lg:fixed lg:inset-y-0 shrink-0">
          <SidebarContent memberName={memberName} joinedAt={joinedAt} isAdmin={isAdmin} unreadAnnouncements={unreadAnnouncements} pendingFeeCount={pendingFeeCount} dark={dark} toggleTheme={toggle} />
        </div>

        {sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 lg:hidden transform transition-transform duration-300 ease-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <SidebarContent memberName={memberName} joinedAt={joinedAt} isAdmin={isAdmin} unreadAnnouncements={unreadAnnouncements} pendingFeeCount={pendingFeeCount} onNav={() => setSidebarOpen(false)} dark={dark} toggleTheme={toggle} />
        </div>

        <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
          <header className="lg:hidden sticky top-0 z-30 h-14 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center px-4 shrink-0">
            <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-1 text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 rounded-sm transition-colors" aria-label="Open menu">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </header>
          <main className="flex-1 p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
