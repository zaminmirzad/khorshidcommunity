'use client';
import { useState } from 'react';

type Event = {
  id: string;
  title: string;
  description: string | null;
  date: string;
  location: string | null;
  capacity: number | null;
  is_free: boolean;
  active: boolean;
  registrations?: { count: number }[];
};

type Props = {
  events: Event[];
  registrationMap: Record<string, string>;
  memberId: string;
};

const TABS = ['Upcoming', 'Past'] as const;

export default function EventsClient({ events, registrationMap, memberId }: Props) {
  const [tab, setTab] = useState<typeof TABS[number]>('Upcoming');
  const [regMap, setRegMap] = useState(registrationMap);
  const [loading, setLoading] = useState<string | null>(null);

  const now = new Date();
  const upcoming = events.filter((e) => new Date(e.date) >= now);
  const past = events.filter((e) => new Date(e.date) < now);
  const shown = tab === 'Upcoming' ? upcoming : past;

  async function register(eventId: string) {
    setLoading(eventId);
    const res = await fetch('/api/events/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId }),
    });
    if (res.ok) setRegMap((prev) => ({ ...prev, [eventId]: 'registered' }));
    else { const { error } = await res.json(); alert(error ?? 'Could not register.'); }
    setLoading(null);
  }

  async function cancel(eventId: string) {
    if (!confirm('Cancel your registration for this event?')) return;
    setLoading(eventId);
    const res = await fetch('/api/events/register', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId }),
    });
    if (res.ok) setRegMap((prev) => ({ ...prev, [eventId]: 'cancelled' }));
    setLoading(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-2">
          <span className="w-4 h-px bg-accent" />Community
        </span>
        <h1 className="font-display font-light text-3xl sm:text-4xl text-gray-900 dark:text-white">
          My <em className="italic text-brand-900 dark:text-brand-300">Events</em>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1.5 text-sm">Browse and register for community events.</p>
      </div>

      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === t ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>
            {t} {t === 'Upcoming' ? `(${upcoming.length})` : `(${past.length})`}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="py-16 text-center text-gray-400 dark:text-gray-500 text-sm">
          {tab === 'Upcoming' ? 'No upcoming events. Check back soon.' : 'No past events.'}
        </div>
      ) : (
        <div className="space-y-4">
          {shown.map((event) => {
            const status = regMap[event.id];
            const registered = status === 'registered';
            const regCount = event.registrations?.[0]?.count ?? 0;
            const spotsLeft = event.capacity ? event.capacity - regCount : null;
            const isFull = spotsLeft !== null && spotsLeft <= 0 && !registered;
            const isPast = new Date(event.date) < now;

            return (
              <div key={event.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-brand-50 dark:bg-brand-950/50 border border-brand-100 dark:border-brand-900/50 flex flex-col items-center justify-center shrink-0">
                    <span className="font-bold text-brand-900 dark:text-brand-300 text-xl leading-none">
                      {new Date(event.date).getDate()}
                    </span>
                    <span className="text-brand-500 text-[10px] uppercase tracking-wide">
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{event.title}</h3>
                          {event.is_free
                            ? <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400">Free</span>
                            : <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400">Paid</span>}
                          {registered && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300">Registered</span>}
                        </div>
                        {event.description && <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 leading-relaxed">{event.description}</p>}
                        <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500 flex-wrap">
                          <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} at {new Date(event.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                          {event.location && <span>· {event.location}</span>}
                          {spotsLeft !== null && <span>· {isFull ? 'Full' : `${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left`}</span>}
                        </div>
                      </div>

                      {!isPast && (
                        <div className="shrink-0">
                          {registered ? (
                            <button onClick={() => cancel(event.id)} disabled={loading === event.id}
                              className="text-xs font-semibold px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-red-200 dark:hover:border-red-800 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 disabled:opacity-60 transition-all">
                              {loading === event.id ? 'Cancelling…' : 'Cancel'}
                            </button>
                          ) : (
                            <button onClick={() => register(event.id)} disabled={loading === event.id || isFull}
                              className="text-xs font-semibold px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover disabled:opacity-60 text-brand-950 shadow-[0_4px_12px_rgba(251,191,36,0.2)] transition-all">
                              {loading === event.id ? 'Registering…' : isFull ? 'Full' : 'Register'}
                            </button>
                          )}
                        </div>
                      )}
                      {isPast && registered && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 shrink-0">Attended</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
