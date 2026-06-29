'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Event = {
  id: string;
  title: string;
  description: string | null;
  date: string;
  location: string | null;
  capacity: number | null;
  is_free: boolean;
  active: boolean;
  created_at: string;
  registrations?: { count: number }[];
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', description: '', date: '', location: '', capacity: '', is_free: true });

  async function load() {
    const supabase = createClient();
    const { data } = await supabase
      .from('events')
      .select('*, registrations:event_registrations(count)')
      .order('date', { ascending: true });
    setEvents(data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function createEvent(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const res = await fetch('/api/admin/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, capacity: form.capacity ? Number(form.capacity) : null }),
    });
    const json = await res.json();
    setSaving(false);
    if (!res.ok) { setError(json.error ?? 'Failed to create event.'); return; }
    setForm({ title: '', description: '', date: '', location: '', capacity: '', is_free: true });
    setShowForm(false);
    await load();
  }

  async function toggleActive(event: Event) {
    await fetch('/api/admin/events', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: event.id, active: !event.active }),
    });
    setEvents((prev) => prev.map((e) => e.id === event.id ? { ...e, active: !e.active } : e));
  }

  const upcoming = events.filter((e) => new Date(e.date) >= new Date());
  const past = events.filter((e) => new Date(e.date) < new Date());

  function EventCard({ event }: { event: Event }) {
    const regCount = event.registrations?.[0]?.count ?? 0;
    const isFull = event.capacity ? regCount >= event.capacity : false;
    const isPast = new Date(event.date) < new Date();
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{event.title}</h3>
              {!event.active && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400">Inactive</span>}
              {event.is_free
                ? <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400">Free</span>
                : <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400">Paid</span>}
              {isFull && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400">Full</span>}
            </div>
            {event.description && <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">{event.description}</p>}
            <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500 flex-wrap">
              <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              {event.location && <span>· {event.location}</span>}
              <span>· {regCount}{event.capacity ? `/${event.capacity}` : ''} registered</span>
            </div>
          </div>
          {!isPast && (
            <button onClick={() => toggleActive(event)} className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shrink-0">
              {event.active ? 'Deactivate' : 'Activate'}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-2">
            <span className="w-4 h-px bg-accent" />Community
          </span>
          <h1 className="font-display font-light text-3xl sm:text-4xl text-gray-900 dark:text-white">
            <em className="italic text-brand-900 dark:text-brand-300">Events</em>
          </h1>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-brand-950 font-semibold px-5 py-2.5 rounded-xl text-sm transition-all shadow-[0_4px_12px_rgba(251,191,36,0.25)]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          New Event
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-accent/30 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white text-sm mb-4">New Event</h2>
          <form onSubmit={createEvent} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">Title *</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="e.g. Nowruz Celebration" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">Date & Time *</label>
                <input type="datetime-local" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">Location</label>
                <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Balboa Park, San Diego" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">Capacity <span className="normal-case font-normal text-gray-300 dark:text-gray-600 tracking-normal">optional</span></label>
                <input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} placeholder="Leave blank for unlimited" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Event details…" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all" />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="is_free" checked={form.is_free} onChange={(e) => setForm({ ...form, is_free: e.target.checked })} className="rounded border-gray-300 text-accent focus:ring-accent/30" />
              <label htmlFor="is_free" className="text-sm text-gray-700 dark:text-gray-200">Free event</label>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => { setShowForm(false); setError(''); }} className="px-4 py-2 rounded-xl text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Cancel</button>
              <button type="submit" disabled={saving} className="px-5 py-2 rounded-xl text-sm font-semibold bg-accent hover:bg-accent-hover disabled:opacity-60 text-brand-950 transition-all">
                {saving ? 'Creating…' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-gray-400 text-sm">Loading…</div>
      ) : (
        <div className="space-y-6">
          {upcoming.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500">Upcoming ({upcoming.length})</h2>
              {upcoming.map((e) => <EventCard key={e.id} event={e} />)}
            </div>
          )}
          {past.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500">Past ({past.length})</h2>
              {past.map((e) => <EventCard key={e.id} event={e} />)}
            </div>
          )}
          {events.length === 0 && <div className="py-12 text-center text-gray-400 dark:text-gray-500 text-sm">No events yet. Create your first event.</div>}
        </div>
      )}
    </div>
  );
}
