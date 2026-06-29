import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const UPCOMING_EVENTS = [
  { title: 'Summer Cultural Festival', date: 'Jul 12, 2026', day: '12', month: 'Jul', location: 'Balboa Park, San Diego', category: 'Festival', spots: '42 spots left' },
  { title: 'Persian Language Workshop', date: 'Jul 19, 2026', day: '19', month: 'Jul', location: 'Khorshid Community Center', category: 'Education', spots: '8 spots left' },
  { title: 'Community Dinner & Gathering', date: 'Aug 2, 2026', day: '2', month: 'Aug', location: 'La Jolla Cove Pavilion', category: 'Social', spots: 'Open' },
];

const ACTIVITY = [
  { text: 'You joined Khorshid Community', isJoin: true },
];

const CATEGORY_COLORS: Record<string, string> = {
  Festival: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400',
  Education: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400',
  Social: 'bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400',
};

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function daysAgo(dateStr: string): number {
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function formatDays(days: number): string {
  if (days < 30) return `${days} day${days !== 1 ? 's' : ''}`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months !== 1 ? 's' : ''}`;
  const years = Math.floor(days / 365);
  return `${years} year${years !== 1 ? 's' : ''}`;
}

export default async function DashboardOverviewPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');

  const { data: member } = await supabase
    .from('members')
    .select('full_name, joined_at, role')
    .eq('user_id', user.id)
    .single();

  if (!member) redirect('/sign-in');

  const firstName = member.full_name.split(' ')[0];
  const daysAsMember = daysAgo(member.joined_at);
  const joinedYear = new Date(member.joined_at).getFullYear();
  const joinedFormatted = new Date(member.joined_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const STATS = [
    { label: 'Days as Member', value: daysAsMember.toLocaleString(), change: formatDays(daysAsMember), positive: true, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>, color: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600' },
    { label: 'Upcoming Events', value: '3', change: 'Next: Jul 12', positive: true, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, color: 'bg-green-50 dark:bg-green-950/30 text-green-600' },
    { label: 'Events Attended', value: '—', change: 'Coming soon', positive: true, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>, color: 'bg-brand-50 dark:bg-brand-950/50 text-brand-600' },
    { label: 'Community Points', value: '—', change: 'Coming soon', positive: true, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, color: 'bg-purple-50 dark:bg-purple-950/30 text-purple-600' },
  ];

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-1">{today}</p>
        <h1 className="font-display font-light text-3xl sm:text-4xl text-gray-900 dark:text-white">
          {greeting()}, <em className="italic text-brand-900 dark:text-brand-300">{firstName}</em>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1.5 text-sm">Here&apos;s what&apos;s happening in your community.</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <div key={s.label} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>{s.icon}</div>
            </div>
            <div className="font-display text-3xl font-light text-gray-900 dark:text-white leading-none mb-1">{s.value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{s.label}</div>
            <div className={`text-xs font-medium ${s.positive ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>{s.change}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50 dark:border-gray-800">
            <div>
              <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500 mb-1"><span className="w-4 h-px bg-accent" />Schedule</span>
              <h2 className="font-display font-light text-xl text-gray-900 dark:text-white">Upcoming Events</h2>
            </div>
            <Link href="/dashboard/events" className="text-sm text-accent-dark font-semibold hover:text-accent transition-colors">View all →</Link>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {UPCOMING_EVENTS.map((event) => (
              <div key={event.title} className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors group">
                <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/50 border border-brand-100 dark:border-brand-900/50 flex flex-col items-center justify-center shrink-0">
                  <span className="font-bold text-brand-900 dark:text-brand-300 text-lg leading-none">{event.day}</span>
                  <span className="text-brand-500 dark:text-brand-500 text-[10px] uppercase tracking-wide">{event.month}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug group-hover:text-brand-900 dark:group-hover:text-brand-300 transition-colors">{event.title}</h3>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${CATEGORY_COLORS[event.category]}`}>{event.category}</span>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{event.location}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{event.date} · {event.spots}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-50 dark:border-gray-800">
            <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500 mb-1"><span className="w-4 h-px bg-accent" />History</span>
            <h2 className="font-display font-light text-xl text-gray-900 dark:text-white">Recent Activity</h2>
          </div>
          <div className="px-6 py-4 space-y-4">
            <div className="flex gap-3">
              <div className="w-2 h-2 rounded-full bg-brand-200 dark:bg-brand-700 mt-1.5 shrink-0" />
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-snug">You joined Khorshid Community</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{joinedFormatted}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-brand-950 via-brand-900 to-brand-950 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-accent/8 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-brand-400/10 blur-[60px] pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-accent/70 mb-3"><span className="w-4 h-px bg-accent/50" />Membership</span>
            <h3 className="font-display font-light text-2xl text-white mb-1">Community <em className="italic text-accent-muted">Member</em></h3>
            <p className="text-brand-400 text-sm">Active since {joinedYear} · Free membership</p>
          </div>
          <Link href="/dashboard/profile" className="shrink-0 bg-accent hover:bg-accent-hover text-brand-950 font-semibold px-5 py-2.5 rounded-xl text-sm transition-all duration-200 shadow-[0_4px_15px_rgba(251,191,36,0.3)] hover:shadow-[0_4px_20px_rgba(251,191,36,0.5)]">
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
