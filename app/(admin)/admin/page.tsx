import Link from 'next/link';

const STATS = [
  { label: 'Total Members', value: '5,248', change: '+38 this month', positive: true, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, color: 'bg-brand-50 dark:bg-brand-950/50 text-brand-600', href: '/admin/members' },
  { label: 'Events This Month', value: '6', change: '2 upcoming', positive: true, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>, color: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600', href: '/admin/events' },
  { label: 'Unread Messages', value: '4', change: '2 need reply', positive: false, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>, color: 'bg-red-50 dark:bg-red-950/30 text-red-600', href: '/admin/messages' },
  { label: 'Newsletter Subscribers', value: '3,104', change: '+21 this week', positive: true, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>, color: 'bg-purple-50 dark:bg-purple-950/30 text-purple-600', href: '/admin/newsletter' },
];

const RECENT_MEMBERS = [
  { name: 'Farida Ahmadi', email: 'farida@email.com', joined: '2 hours ago', status: 'Active' },
  { name: 'Navid Hosseini', email: 'navid@email.com', joined: '5 hours ago', status: 'Active' },
  { name: 'Sahar Karimi', email: 'sahar@email.com', joined: 'Yesterday', status: 'Pending' },
  { name: 'Khalid Rahimi', email: 'khalid@email.com', joined: '2 days ago', status: 'Active' },
  { name: 'Leila Moradi', email: 'leila@email.com', joined: '3 days ago', status: 'Active' },
];

const RECENT_MESSAGES = [
  { name: 'Sara Ahmadi', subject: 'Question about Nowruz event', time: '1h ago', read: false },
  { name: 'Reza Tehrani', subject: 'Membership inquiry', time: '3h ago', read: false },
  { name: 'Mina Hashemi', subject: 'Volunteering opportunities', time: '6h ago', read: false },
  { name: 'Ali Karimi', subject: 'Event feedback — Summer Festival', time: 'Yesterday', read: false },
];

const UPCOMING_EVENTS = [
  { title: 'Summer Cultural Festival', date: 'Jul 12', registered: 142, capacity: 200, status: 'Active' },
  { title: 'Persian Language Workshop', date: 'Jul 19', registered: 22, capacity: 30, status: 'Almost Full' },
  { title: 'Community Dinner & Gathering', date: 'Aug 2', registered: 67, capacity: 150, status: 'Active' },
];

export default function AdminOverviewPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-1">Saturday, June 28, 2026</p>
        <h1 className="font-display font-light text-3xl sm:text-4xl text-gray-900 dark:text-white">
          Admin <em className="italic text-brand-900 dark:text-brand-300">Overview</em>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1.5 text-sm">Here's a summary of your community today.</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <Link key={s.label} href={s.href} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm hover:shadow-md transition-all duration-200 group">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>{s.icon}</div>
              <svg className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-gray-400 dark:group-hover:text-gray-400 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
            <div className="font-display text-3xl font-light text-gray-900 dark:text-white leading-none mb-1">{s.value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{s.label}</div>
            <div className={`text-xs font-medium ${s.positive ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>{s.change}</div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50 dark:border-gray-800">
            <div>
              <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500 mb-1"><span className="w-4 h-px bg-accent" />Events</span>
              <h2 className="font-display font-light text-xl text-gray-900 dark:text-white">Upcoming Events</h2>
            </div>
            <Link href="/admin/events" className="text-sm text-accent-dark font-semibold hover:text-accent transition-colors">Manage →</Link>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {UPCOMING_EVENTS.map((event) => {
              const pct = Math.round((event.registered / event.capacity) * 100);
              return (
                <div key={event.title} className="px-6 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{event.title}</h3>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{event.date} · {event.registered}/{event.capacity} registered</p>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ml-3 ${event.status === 'Almost Full' ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400' : 'bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400'}`}>
                      {event.status}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${pct >= 80 ? 'bg-amber-400' : 'bg-brand-500'}`} style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">{pct}% capacity</p>
                </div>
              );
            })}
          </div>
          <div className="px-6 py-4 border-t border-gray-50 dark:border-gray-800">
            <Link href="/admin/events" className="inline-flex items-center gap-2 bg-brand-950 hover:bg-brand-900 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Create New Event
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50 dark:border-gray-800">
            <div>
              <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500 mb-1"><span className="w-4 h-px bg-accent" />Inbox</span>
              <h2 className="font-display font-light text-xl text-gray-900 dark:text-white">Messages</h2>
            </div>
            <Link href="/admin/messages" className="text-sm text-accent-dark font-semibold hover:text-accent transition-colors">View all →</Link>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {RECENT_MESSAGES.map((msg, i) => (
              <div key={i} className="flex items-start gap-3 px-6 py-3.5 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-brand-50 dark:bg-brand-950/50 border border-brand-100 dark:border-brand-900/50 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="font-display text-xs font-semibold text-brand-700 dark:text-brand-300">{msg.name[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{msg.name}</p>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 shrink-0">{msg.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{msg.subject}</p>
                </div>
                {!msg.read && <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1.5" />}
              </div>
            ))}
          </div>
        </div>
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
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 dark:border-gray-800">
                <th className="text-left text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 px-6 py-3">Member</th>
                <th className="text-left text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 px-6 py-3 hidden sm:table-cell">Email</th>
                <th className="text-left text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 px-6 py-3">Joined</th>
                <th className="text-left text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 px-6 py-3">Status</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {RECENT_MEMBERS.map((m) => (
                <tr key={m.email} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-50 dark:bg-brand-950/50 border border-brand-100 dark:border-brand-900/50 flex items-center justify-center shrink-0">
                        <span className="font-display text-xs font-semibold text-brand-700 dark:text-brand-300">{m.name[0]}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{m.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 hidden sm:table-cell">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{m.email}</span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{m.joined}</span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${m.status === 'Active' ? 'bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400' : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400'}`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <button className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 font-medium transition-colors">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
