'use client';
import { useState } from 'react';

const EVENTS = [
  { title: 'Summer Cultural Festival', date: 'Jul 12, 2026', location: 'Balboa Park', category: 'Festival', registered: 142, capacity: 200, status: 'Active' },
  { title: 'Persian Language Workshop', date: 'Jul 19, 2026', location: 'Khorshid Center', category: 'Education', registered: 22, capacity: 30, status: 'Almost Full' },
  { title: 'Community Dinner & Gathering', date: 'Aug 2, 2026', location: 'La Jolla Cove Pavilion', category: 'Social', registered: 67, capacity: 150, status: 'Active' },
  { title: 'Mehregan Autumn Festival', date: 'Oct 10, 2026', location: 'Balboa Park', category: 'Festival', registered: 0, capacity: 300, status: 'Draft' },
  { title: 'Nowruz Celebration 2026', date: 'Mar 20, 2026', location: 'Balboa Park', category: 'Festival', registered: 198, capacity: 200, status: 'Completed' },
  { title: 'Persian Calligraphy Workshop', date: 'Feb 8, 2026', location: 'Khorshid Center', category: 'Education', registered: 18, capacity: 20, status: 'Completed' },
];

const STATUS_COLORS: Record<string, string> = {
  Active: 'bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400',
  'Almost Full': 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400',
  Draft: 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400',
  Completed: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400',
};

const CATEGORY_COLORS: Record<string, string> = {
  Festival: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400',
  Education: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400',
  Social: 'bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400',
};

export default function AdminEventsPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-2">
            <span className="w-4 h-px bg-accent" />Management
          </span>
          <h1 className="font-display font-light text-3xl sm:text-4xl text-gray-900 dark:text-white">
            <em className="italic text-brand-900 dark:text-brand-300">Events</em>
          </h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-brand-950 text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-[0_4px_12px_rgba(251,191,36,0.25)] shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Create Event
        </button>
      </div>

      <div className="space-y-3">
        {EVENTS.map((event) => {
          const pct = Math.round((event.registered / event.capacity) * 100);
          return (
            <div key={event.title} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5 hover:shadow-md transition-all duration-200 group">
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start gap-2 mb-1.5">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-base">{event.title}</h3>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[event.category]}`}>{event.category}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[event.status]}`}>{event.status}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      {event.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {event.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {event.registered}/{event.capacity} registered
                    </span>
                  </div>
                  {event.status !== 'Draft' && (
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${pct >= 80 ? 'bg-amber-400' : 'bg-brand-500'}`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 shrink-0">{pct}%</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Edit</button>
                  <button className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors">Attendees</button>
                  <button className="text-xs text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">Delete</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-950/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-lg p-8 z-10 border border-gray-100 dark:border-gray-800">
            <div className="flex items-start justify-between mb-6">
              <div>
                <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-2">
                  <span className="w-4 h-px bg-accent" />New Event
                </span>
                <h2 className="font-display font-light text-2xl text-gray-900 dark:text-white">Create Event</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-white p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowModal(false); }}>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">Event Title</label>
                <input type="text" placeholder="e.g. Nowruz Celebration 2027" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">Date</label>
                  <input type="date" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">Capacity</label>
                  <input type="number" placeholder="200" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">Location</label>
                <input type="text" placeholder="Balboa Park, San Diego" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">Category</label>
                <select className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all">
                  <option>Festival</option>
                  <option>Education</option>
                  <option>Social</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">Description</label>
                <textarea rows={3} placeholder="Event description…" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none focus:outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-medium rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 bg-accent hover:bg-accent-hover text-brand-950 font-semibold py-3 rounded-xl text-sm transition-all shadow-[0_4px_12px_rgba(251,191,36,0.25)]">
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
