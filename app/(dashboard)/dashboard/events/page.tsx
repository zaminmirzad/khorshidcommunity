'use client';
import { useState } from 'react';
import Link from 'next/link';

const TABS = ['Upcoming', 'Past', 'Saved'] as const;
type Tab = typeof TABS[number];

const EVENTS: Record<Tab, Array<{
  title: string; date: string; day: string; month: string; location: string;
  category: string; status: string; statusColor: string;
}>> = {
  Upcoming: [
    { title: 'Summer Cultural Festival', date: 'July 12, 2026', day: '12', month: 'Jul', location: 'Balboa Park, San Diego', category: 'Festival', status: 'Registered', statusColor: 'bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400' },
    { title: 'Persian Language Workshop', date: 'July 19, 2026', day: '19', month: 'Jul', location: 'Khorshid Community Center', category: 'Education', status: 'Registered', statusColor: 'bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400' },
    { title: 'Community Dinner & Gathering', date: 'August 2, 2026', day: '2', month: 'Aug', location: 'La Jolla Cove Pavilion', category: 'Social', status: 'Saved', statusColor: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400' },
  ],
  Past: [
    { title: 'Nowruz Celebration 2026', date: 'March 20, 2026', day: '20', month: 'Mar', location: 'Balboa Park, San Diego', category: 'Festival', status: 'Attended', statusColor: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400' },
    { title: 'Persian Calligraphy Workshop', date: 'February 8, 2026', day: '8', month: 'Feb', location: 'Khorshid Community Center', category: 'Education', status: 'Attended', statusColor: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400' },
    { title: 'New Year Community Dinner', date: 'January 1, 2026', day: '1', month: 'Jan', location: 'Downtown San Diego', category: 'Social', status: 'Attended', statusColor: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400' },
  ],
  Saved: [
    { title: 'Community Dinner & Gathering', date: 'August 2, 2026', day: '2', month: 'Aug', location: 'La Jolla Cove Pavilion', category: 'Social', status: 'Saved', statusColor: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400' },
    { title: 'Mehregan Autumn Festival', date: 'October 10, 2026', day: '10', month: 'Oct', location: 'Balboa Park, San Diego', category: 'Festival', status: 'Saved', statusColor: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400' },
  ],
};

const CATEGORY_COLORS: Record<string, string> = {
  Festival: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400',
  Education: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400',
  Social: 'bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400',
};

export default function MyEventsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Upcoming');
  const events = EVENTS[activeTab];

  return (
    <div className="space-y-6">
      <div>
        <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-2">
          <span className="w-4 h-px bg-accent" />Events
        </span>
        <h1 className="font-display font-light text-3xl sm:text-4xl text-gray-900 dark:text-white">
          My <em className="italic text-brand-900 dark:text-brand-300">Events</em>
        </h1>
      </div>

      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
          >
            {tab}
            <span className={`ml-2 text-[11px] font-semibold px-1.5 py-0.5 rounded-full ${activeTab === tab ? 'bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
              {EVENTS[tab].length}
            </span>
          </button>
        ))}
      </div>

      {events.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">No events here yet.</p>
          <Link href="/events" className="mt-3 inline-block text-sm text-accent-dark font-semibold hover:text-accent transition-colors">
            Browse upcoming events →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <div key={event.title} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5 hover:shadow-md transition-all duration-200 group">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-brand-50 dark:bg-brand-950/50 border border-brand-100 dark:border-brand-900/50 flex flex-col items-center justify-center shrink-0">
                  <span className="font-bold text-brand-900 dark:text-brand-300 text-xl leading-none">{event.day}</span>
                  <span className="text-brand-500 dark:text-brand-500 text-[10px] uppercase tracking-wide">{event.month}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-base group-hover:text-brand-900 dark:group-hover:text-brand-300 transition-colors">{event.title}</h3>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[event.category]}`}>{event.category}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${event.statusColor}`}>{event.status}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      {event.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {event.location}
                    </span>
                  </div>
                </div>
                {activeTab === 'Upcoming' && (
                  <button className="shrink-0 text-xs text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30">
                    Cancel
                  </button>
                )}
                {activeTab === 'Saved' && (
                  <button className="shrink-0 bg-accent hover:bg-accent-hover text-brand-950 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
                    Register
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-6 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Discover more events happening in your community</p>
        <Link
          href="/events"
          className="inline-flex items-center gap-2 bg-brand-950 hover:bg-brand-900 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          Browse All Events
        </Link>
      </div>
    </div>
  );
}
