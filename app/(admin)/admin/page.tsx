import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  const [
    { count: totalMembers },
    { count: pendingRequests },
    { data: recentMembers },
  ] = await Promise.all([
    supabase.from('members').select('*', { count: 'exact', head: true }),
    supabase.from('membership_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('members').select('full_name, email, joined_at, role').order('joined_at', { ascending: false }).limit(5),
  ]);

  const STATS = [
    { label: 'Total Members', value: totalMembers ?? 0, change: 'Registered members', positive: true, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, color: 'bg-brand-50 dark:bg-brand-950/50 text-brand-600', href: '/admin/members' },
    { label: 'Pending Requests', value: pendingRequests ?? 0, change: 'Awaiting review', positive: (pendingRequests ?? 0) === 0, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>, color: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600', href: '/admin/requests' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display font-light text-3xl sm:text-4xl text-gray-900 dark:text-white">
          Admin <em className="italic text-brand-900 dark:text-brand-300">Overview</em>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1.5 text-sm">Here's a summary of your community.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {STATS.map((s) => (
          <Link key={s.label} href={s.href} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm hover:shadow-md transition-all duration-200 group">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>{s.icon}</div>
              <svg className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-gray-400 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
            <div className="font-display text-3xl font-light text-gray-900 dark:text-white leading-none mb-1">{s.value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{s.label}</div>
            <div className={`text-xs font-medium ${s.positive ? 'text-green-600 dark:text-green-400' : 'text-amber-500 dark:text-amber-400'}`}>{s.change}</div>
          </Link>
        ))}
      </div>

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
                  <th className="text-left text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 px-6 py-3 hidden sm:table-cell">Email</th>
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
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{m.full_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 hidden sm:table-cell">
                      <span className="text-sm text-gray-500 dark:text-gray-400">{m.email}</span>
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
    </div>
  );
}
