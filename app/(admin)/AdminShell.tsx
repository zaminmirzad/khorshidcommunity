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
  pendingCount: number;
};

const NAV_ITEMS = [
  { href: '/admin', label: 'Overview', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM14 5a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" /></svg> },
  { href: '/admin/members', label: 'Members', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
  { href: '/admin/requests', label: 'Requests', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>, pendingBadge: true },
  { href: '/admin/events', label: 'Events', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
  { href: '/admin/messages', label: 'Messages', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
  { href: '/admin/gallery', label: 'Gallery', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
  { href: '/admin/newsletter', label: 'Newsletter', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg> },
];

function SidebarContent({ memberName, pendingCount, onNav }: { memberName: string; pendingCount: number; onNav?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const initial = memberName ? memberName[0].toUpperCase() : 'A';

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/sign-in');
    router.refresh();
  }

  return (
    <div className="flex flex-col h-full bg-[#0f1629] relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-red-500/4 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 -left-12 w-48 h-48 rounded-full bg-brand-400/6 blur-[60px] pointer-events-none" />

      <div className="px-5 py-5 border-b border-white/8 relative z-10">
        <Link href="/" className="flex items-center gap-3 group w-fit mb-3">
          <Image src="/images/logo.jpg" alt="Khorshid Community" width={34} height={34} className="rounded-lg object-cover ring-1 ring-white/20 group-hover:ring-accent/40 transition-all duration-200" />
          <div className="flex flex-col leading-none">
            <span className="font-display text-sm font-semibold text-accent">Khorshid</span>
            <span className="font-display text-sm font-semibold text-white">Community</span>
          </div>
        </Link>
        <div className="inline-flex items-center gap-1.5 bg-red-500/15 border border-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-[0.2em] px-2.5 py-1 rounded-lg">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          Admin Panel
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 relative z-10 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const badge = item.pendingBadge && pendingCount > 0 ? pendingCount : null;
          return (
            <Link key={item.href} href={item.href} onClick={onNav}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive ? 'bg-white/10 text-white' : 'text-brand-400 hover:bg-white/6 hover:text-brand-100'}`}
            >
              <span className={`shrink-0 transition-colors ${isActive ? 'text-accent' : 'text-brand-600 group-hover:text-brand-300'}`}>{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {badge && <span className="w-5 h-5 rounded-full bg-amber-500 text-brand-950 text-[10px] font-bold flex items-center justify-center shrink-0">{badge}</span>}
              {isActive && !badge && <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 pb-2 relative z-10 space-y-0.5">
        <Link href="/dashboard" className="flex items-center gap-2 text-brand-600 hover:text-brand-300 text-xs font-medium transition-colors px-3 py-2.5 rounded-xl hover:bg-white/5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Member Dashboard
        </Link>
        <button onClick={signOut} className="w-full flex items-center gap-2 text-red-500/70 hover:text-red-400 text-xs font-medium transition-colors px-3 py-2.5 rounded-xl hover:bg-white/5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Sign Out
        </button>
      </div>

      <div className="px-4 py-4 border-t border-white/8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-800 to-red-900 border border-red-500/30 flex items-center justify-center shrink-0">
            <span className="font-display text-sm font-semibold text-red-300">{initial}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold leading-none mb-0.5 truncate">{memberName}</p>
            <p className="text-red-400 text-[11px] truncate">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ThemeToggle({ dark, toggle }: { dark: boolean; toggle: () => void }) {
  return (
    <button onClick={toggle} className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-gray-800 transition-colors" aria-label="Toggle dark mode">
      {dark
        ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M18.364 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" /></svg>
        : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
      }
    </button>
  );
}

export default function AdminShell({ children, memberName, pendingCount }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { dark, toggle } = useTheme();
  const initial = memberName ? memberName[0].toUpperCase() : 'A';

  return (
    <div className={dark ? 'dark' : ''} suppressHydrationWarning>
      <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
        <div className="hidden lg:block lg:w-64 lg:fixed lg:inset-y-0 shrink-0">
          <SidebarContent memberName={memberName} pendingCount={pendingCount} />
        </div>

        {sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-brand-950/70 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 lg:hidden transform transition-transform duration-300 ease-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <SidebarContent memberName={memberName} pendingCount={pendingCount} onNav={() => setSidebarOpen(false)} />
        </div>

        <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
          <header className="sticky top-0 z-30 h-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center gap-4 px-6 shrink-0">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-1 text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 rounded-lg transition-colors" aria-label="Open menu">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div className="flex-1" />
            <div className="flex items-center gap-3">
              <ThemeToggle dark={dark} toggle={toggle} />
              <span className="hidden sm:inline-flex items-center gap-1.5 bg-red-50 dark:bg-red-950/50 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />Admin
              </span>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-800 to-red-900 border border-red-200 dark:border-red-900 flex items-center justify-center">
                <span className="font-display text-xs font-semibold text-red-300">{initial}</span>
              </div>
            </div>
          </header>
          <main className="flex-1 p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
