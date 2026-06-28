'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/app/hooks/useTheme';

const NAV_ITEMS = [
  {
    href: '/dashboard',
    label: 'Overview',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM14 5a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" /></svg>,
  },
  {
    href: '/dashboard/events',
    label: 'My Events',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  },
  {
    href: '/dashboard/profile',
    label: 'Profile',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  },
  {
    href: '/dashboard/settings',
    label: 'Settings',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  },
];

function SidebarContent({ onNav }: { onNav?: () => void }) {
  const pathname = usePathname();
  return (
    <div className="flex flex-col h-full bg-brand-950 relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-accent/6 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 -left-12 w-48 h-48 rounded-full bg-brand-400/8 blur-[60px] pointer-events-none" />

      <div className="px-5 py-5 border-b border-white/8 relative z-10">
        <Link href="/" className="flex items-center gap-3 group w-fit">
          <Image src="/images/logo.jpg" alt="Khorshid Community" width={36} height={36} className="rounded-lg object-cover ring-1 ring-white/20 group-hover:ring-accent/40 transition-all duration-200" />
          <div className="flex flex-col leading-none">
            <span className="font-display text-base font-semibold text-accent">Khorshid</span>
            <span className="font-display text-base font-semibold text-white">Community</span>
          </div>
        </Link>
      </div>

      <div className="px-5 pt-6 pb-2 relative z-10">
        <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-600">
          <span className="w-4 h-px bg-brand-700" />Member Portal
        </span>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-0.5 relative z-10">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNav}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive ? 'bg-white/10 text-white' : 'text-brand-400 hover:bg-white/6 hover:text-brand-100'}`}
            >
              <span className={`shrink-0 transition-colors ${isActive ? 'text-accent' : 'text-brand-500 group-hover:text-brand-300'}`}>{item.icon}</span>
              {item.label}
              {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent shrink-0" />}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-white/8 relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-700 to-brand-800 border border-accent/30 flex items-center justify-center shrink-0">
            <span className="font-display text-sm font-semibold text-accent">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold leading-none mb-0.5 truncate">Ahmad Karimi</p>
            <p className="text-brand-500 text-[11px] truncate">Member since 2021</p>
          </div>
        </div>
        <Link href="/sign-in" className="flex items-center gap-2 text-brand-600 hover:text-brand-300 text-xs font-medium transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Sign out
        </Link>
      </div>
    </div>
  );
}

function ThemeToggle({ dark, toggle }: { dark: boolean; toggle: () => void }) {
  return (
    <button
      onClick={toggle}
      className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-gray-800 transition-colors"
      aria-label="Toggle dark mode"
    >
      {dark
        ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M18.364 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" /></svg>
        : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
      }
    </button>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { dark, toggle } = useTheme();

  return (
    <div className={dark ? 'dark' : ''} suppressHydrationWarning>
      <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
        <div className="hidden lg:block lg:w-64 lg:fixed lg:inset-y-0 shrink-0">
          <SidebarContent />
        </div>

        {sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-brand-950/70 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 lg:hidden transform transition-transform duration-300 ease-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <SidebarContent onNav={() => setSidebarOpen(false)} />
        </div>

        <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
          <header className="sticky top-0 z-30 h-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center gap-4 px-6 shrink-0">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-1 text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 rounded-lg transition-colors" aria-label="Open menu">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <ThemeToggle dark={dark} toggle={toggle} />
              <button className="relative p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent border-2 border-white dark:border-gray-900" />
              </button>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-700 to-brand-800 border border-brand-100 dark:border-brand-900 flex items-center justify-center cursor-pointer">
                <span className="font-display text-xs font-semibold text-accent">A</span>
              </div>
            </div>
          </header>
          <main className="flex-1 p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
