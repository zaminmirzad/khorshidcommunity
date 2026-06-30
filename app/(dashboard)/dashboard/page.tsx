import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import PayButton from './PayButton';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function daysAgo(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
}

function formatDays(days: number): string {
  if (days < 30) return `${days} day${days !== 1 ? 's' : ''}`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months !== 1 ? 's' : ''}`;
  const years = Math.floor(days / 365);
  return `${years} year${years !== 1 ? 's' : ''}`;
}

type Payment = {
  id: string;
  amount: number;
  currency: string;
  description: string;
  status: string;
  paid_at: string;
};

type Props = {
  searchParams: Promise<{ payment?: string }>;
};

export default async function DashboardOverviewPage({ searchParams }: Props) {
  const { payment } = await searchParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');

  const { data: member } = await supabase
    .from('members')
    .select('id, full_name, joined_at, role')
    .eq('user_id', user.id)
    .single();

  if (!member) redirect('/sign-in');

  const [{ data: payments }, { data: announcements }, { data: myRegs }] = await Promise.all([
    supabase.from('payments').select('*').eq('member_id', member.id).order('paid_at', { ascending: false }),
    supabase.from('announcements').select('id, title, body, created_at').eq('active', true).order('created_at', { ascending: false }).limit(5),
    supabase.from('event_registrations').select('event_id, events!inner(id, title, date, location, capacity)').eq('member_id', member.id).eq('status', 'registered'),
  ]);

  type RegWithEvent = {
    event_id: string;
    events: { id: string; title: string; date: string; location: string | null; capacity: number | null };
  };

  const allRegs = (myRegs ?? []) as unknown as RegWithEvent[];
  const nowDate = new Date();
  const upcomingRegs = allRegs.filter((r) => new Date(r.events.date) >= nowDate).sort((a, b) => new Date(a.events.date).getTime() - new Date(b.events.date).getTime()).slice(0, 3);
  const eventsAttended = allRegs.filter((r) => new Date(r.events.date) < nowDate).length;

  const firstName = member.full_name.split(' ')[0];
  const daysAsMember = daysAgo(member.joined_at);
  const joinedYear = new Date(member.joined_at).getFullYear();
  const joinedFormatted = new Date(member.joined_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const hasPaid = (payments ?? []).some((p: Payment) => p.status === 'paid');

  const STATS = [
    { label: 'Days as Member', value: daysAsMember.toLocaleString(), change: formatDays(daysAsMember), positive: true, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>, color: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600' },
    { label: 'Payments Made', value: String((payments ?? []).length), change: hasPaid ? 'All paid' : 'None yet', positive: hasPaid, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>, color: 'bg-green-50 dark:bg-green-950/30 text-green-600' },
    { label: 'Upcoming Events', value: String(upcomingRegs.length), change: upcomingRegs.length > 0 ? `Next: ${new Date(upcomingRegs[0].events.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : 'None registered', positive: upcomingRegs.length > 0, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, color: 'bg-brand-50 dark:bg-brand-950/50 text-brand-600' },
    { label: 'Events Attended', value: String(eventsAttended), change: eventsAttended > 0 ? 'Great participation!' : 'Register for events', positive: eventsAttended > 0, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>, color: 'bg-purple-50 dark:bg-purple-950/30 text-purple-600' },
  ];

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="space-y-8">
      {payment === 'success' && (
        <div className="flex items-center gap-3 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 px-5 py-4 rounded-2xl text-sm font-medium">
          <svg className="w-5 h-5 shrink-0 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          Payment successful — thank you for your membership contribution!
        </div>
      )}
      {payment === 'cancelled' && (
        <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 px-5 py-4 rounded-2xl text-sm font-medium">
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          Payment cancelled — no charge was made.
        </div>
      )}

      <div>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-1">{today}</p>
        <h1 className="font-display font-light text-3xl sm:text-4xl text-gray-900 dark:text-white">
          {greeting()}, <em className="italic text-brand-900 dark:text-brand-300">{firstName}</em>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1.5 text-sm">Here&apos;s what&apos;s happening in your community.</p>
      </div>

      {announcements && announcements.length > 0 && (
        <div className="space-y-2">
          {announcements.map((a: { id: string; title: string; body: string; created_at: string }) => (
            <div key={a.id} className="flex gap-4 bg-brand-50 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-900/50 rounded-2xl px-5 py-4">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-900 dark:text-brand-200">{a.title}</p>
                <p className="text-sm text-brand-700 dark:text-brand-400 mt-0.5 leading-relaxed">{a.body}</p>
                <p className="text-xs text-brand-500 dark:text-brand-600 mt-1">{new Date(a.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <div key={s.label} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>{s.icon}</div>
            </div>
            <div className="font-display text-3xl font-light text-gray-900 dark:text-white leading-none mb-1">{s.value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{s.label}</div>
            <div className={`text-xs font-medium ${s.positive ? 'text-green-600 dark:text-green-400' : 'text-amber-500 dark:text-amber-400'}`}>{s.change}</div>
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
            {upcomingRegs.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <p className="text-sm text-gray-400 dark:text-gray-500 mb-3">You haven&apos;t registered for any upcoming events.</p>
                <Link href="/dashboard/events" className="text-sm font-semibold text-accent-dark hover:text-accent transition-colors">Browse events →</Link>
              </div>
            ) : upcomingRegs.map((reg) => {
              const d = new Date(reg.events.date);
              return (
                <div key={reg.event_id} className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/50 border border-brand-100 dark:border-brand-900/50 flex flex-col items-center justify-center shrink-0">
                    <span className="font-bold text-brand-900 dark:text-brand-300 text-lg leading-none">{d.getDate()}</span>
                    <span className="text-brand-500 dark:text-brand-500 text-[10px] uppercase tracking-wide">{d.toLocaleDateString('en-US', { month: 'short' })}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug group-hover:text-brand-900 dark:group-hover:text-brand-300 transition-colors">{reg.events.title}</h3>
                    {reg.events.location && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{reg.events.location}</p>}
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-50 dark:border-gray-800">
            <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500 mb-1"><span className="w-4 h-px bg-accent" />History</span>
            <h2 className="font-display font-light text-xl text-gray-900 dark:text-white">Recent Activity</h2>
          </div>
          <div className="px-6 py-4 space-y-4">
            {(payments ?? []).slice(0, 3).map((p: Payment) => (
              <div key={p.id} className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-green-400 dark:bg-green-600 mt-1.5 shrink-0" />
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-snug">{p.description} — ${(p.amount / 100).toFixed(2)}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{new Date(p.paid_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>
            ))}
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
            <p className="text-brand-400 text-sm">Active since {joinedYear} · {hasPaid ? 'Paid membership' : 'Free membership'}</p>
          </div>
          {!hasPaid && <PayButton />}
          {hasPaid && (
            <div className="shrink-0 flex items-center gap-2 bg-green-500/20 border border-green-500/30 text-green-300 font-semibold px-5 py-2.5 rounded-xl text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Membership Paid
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
