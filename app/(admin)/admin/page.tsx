import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  const now = new Date().toISOString();

  const [
    { count: totalMembers },
    { count: pendingRequests },
    { count: unreadMessages },
    { data: revenueRows },
    { count: upcomingEvents },
    { count: totalEvents },
    { data: recentMembers },
    { data: recentPayments },
  ] = await Promise.all([
    supabase.from('members').select('*', { count: 'exact', head: true }),
    supabase.from('membership_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('contact_submissions').select('*', { count: 'exact', head: true }).eq('status', 'unread'),
    supabase.from('payments').select('amount').eq('status', 'paid'),
    supabase.from('events').select('*', { count: 'exact', head: true }).eq('active', true).gt('date', now),
    supabase.from('events').select('*', { count: 'exact', head: true }),
    supabase.from('members').select('full_name, email, joined_at, role').order('joined_at', { ascending: false }).limit(5),
    supabase.from('payments').select('amount, description, paid_at, members(full_name)').eq('status', 'paid').order('paid_at', { ascending: false }).limit(5),
  ]);

  const totalRevenue = (revenueRows ?? []).reduce((sum, p) => sum + (p.amount ?? 0), 0);

  const STATS = [
    {
      label: 'Total Members',
      value: (totalMembers ?? 0).toLocaleString(),
      change: 'Registered',
      positive: true,
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
      color: 'bg-brand-50 dark:bg-brand-950/50 text-brand-600',
      href: '/admin/members',
    },
    {
      label: 'Total Revenue',
      value: `$${(totalRevenue / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: 'All time',
      positive: true,
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      color: 'bg-green-50 dark:bg-green-950/30 text-green-600',
      href: '/admin/payments',
    },
    {
      label: 'Upcoming Events',
      value: (upcomingEvents ?? 0).toLocaleString(),
      change: `${totalEvents ?? 0} total`,
      positive: true,
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
      color: 'bg-purple-50 dark:bg-purple-950/30 text-purple-600',
      href: '/admin/events',
    },
    {
      label: 'Pending Requests',
      value: (pendingRequests ?? 0).toLocaleString(),
      change: (pendingRequests ?? 0) > 0 ? 'Needs attention' : 'All clear',
      positive: (pendingRequests ?? 0) === 0,
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
      color: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600',
      href: '/admin/requests',
    },
    {
      label: 'Unread Messages',
      value: (unreadMessages ?? 0).toLocaleString(),
      change: (unreadMessages ?? 0) > 0 ? 'Needs attention' : 'All clear',
      positive: (unreadMessages ?? 0) === 0,
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
      color: 'bg-sky-50 dark:bg-sky-950/30 text-sky-600',
      href: '/admin/messages',
    },
  ];

  type RecentPayment = {
    amount: number;
    description: string;
    paid_at: string;
    members: { full_name: string } | null;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display font-light text-3xl sm:text-4xl text-gray-900 dark:text-white">
          Admin <em className="italic text-brand-900 dark:text-brand-300">Overview</em>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1.5 text-sm">Here&apos;s a summary of your community.</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
        {STATS.map((s) => (
          <Link key={s.label} href={s.href}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm hover:shadow-md transition-all duration-200 group">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>{s.icon}</div>
              <svg className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-gray-400 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
            <div className="font-display text-2xl font-light text-gray-900 dark:text-white leading-none mb-1">{s.value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{s.label}</div>
            <div className={`text-xs font-medium ${s.positive ? 'text-green-600 dark:text-green-400' : 'text-amber-500 dark:text-amber-400'}`}>{s.change}</div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50 dark:border-gray-800">
            <div>
              <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500 mb-1"><span className="w-4 h-px bg-accent" />Members</span>
              <h2 className="font-display font-light text-xl text-gray-900 dark:text-white">Recent Sign-ups</h2>
            </div>
            <Link href="/admin/members" className="text-sm text-accent-dark font-semibold hover:text-accent transition-colors">View all →</Link>
          </div>
          <div className="overflow-x-auto">
            {recentMembers && recentMembers.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50 dark:border-gray-800">
                    <th className="text-left text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 px-6 py-3">Member</th>
                    <th className="text-left text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 px-6 py-3">Joined</th>
                    <th className="text-left text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 px-6 py-3">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {recentMembers.map((m) => (
                    <tr key={m.email} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-brand-50 dark:bg-brand-950/50 border border-brand-100 dark:border-brand-900/50 flex items-center justify-center shrink-0">
                            <span className="font-display text-xs font-semibold text-brand-700 dark:text-brand-300">{m.full_name[0]}</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{m.full_name}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{m.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(m.joined_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${m.role === 'admin' ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400' : 'bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400'}`}>
                          {m.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-12 text-center text-gray-400 dark:text-gray-500 text-sm">No members yet.</div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50 dark:border-gray-800">
            <div>
              <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500 mb-1"><span className="w-4 h-px bg-accent" />Payments</span>
              <h2 className="font-display font-light text-xl text-gray-900 dark:text-white">Recent Payments</h2>
            </div>
            <Link href="/admin/payments" className="text-sm text-accent-dark font-semibold hover:text-accent transition-colors">View all →</Link>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {recentPayments && recentPayments.length > 0 ? (
              (recentPayments as unknown as RecentPayment[]).map((p, i) => (
                <div key={i} className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-green-50 dark:bg-green-950/40 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{p.members?.full_name ?? 'Unknown'}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{p.description}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">${(p.amount / 100).toFixed(2)}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{new Date(p.paid_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-gray-400 dark:text-gray-500 text-sm">No payments yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
