'use client';
import { useState } from 'react';

const ALL_MEMBERS = [
  { name: 'Farida Ahmadi', email: 'farida@email.com', joined: 'Jun 28, 2026', events: 0, status: 'Active' },
  { name: 'Navid Hosseini', email: 'navid@email.com', joined: 'Jun 28, 2026', events: 2, status: 'Active' },
  { name: 'Sahar Karimi', email: 'sahar@email.com', joined: 'Jun 27, 2026', events: 0, status: 'Pending' },
  { name: 'Khalid Rahimi', email: 'khalid@email.com', joined: 'Jun 26, 2026', events: 5, status: 'Active' },
  { name: 'Leila Moradi', email: 'leila@email.com', joined: 'Jun 25, 2026', events: 8, status: 'Active' },
  { name: 'Ahmad Karimi', email: 'ahmad@email.com', joined: 'Jan 15, 2021', events: 24, status: 'Active' },
  { name: 'Maryam Sultani', email: 'maryam@email.com', joined: 'Mar 10, 2022', events: 17, status: 'Active' },
  { name: 'Hassan Noori', email: 'hassan@email.com', joined: 'Jun 20, 2026', events: 1, status: 'Pending' },
  { name: 'Zahra Alizadeh', email: 'zahra@email.com', joined: 'Jun 18, 2026', events: 3, status: 'Active' },
  { name: 'Reza Tehrani', email: 'reza@email.com', joined: 'May 5, 2024', events: 11, status: 'Active' },
];

const FILTERS = ['All', 'Active', 'Pending'];

export default function MembersPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filtered = ALL_MEMBERS.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || m.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-2">
            <span className="w-4 h-px bg-accent" />Community
          </span>
          <h1 className="font-display font-light text-3xl sm:text-4xl text-gray-900 dark:text-white">
            <em className="italic text-brand-900 dark:text-brand-300">Members</em>
          </h1>
        </div>
        <button className="inline-flex items-center gap-2 bg-brand-950 hover:bg-brand-900 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shrink-0">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Invite Member
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all"
          />
        </div>
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === f ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">{filtered.length} member{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 dark:border-gray-800">
                <th className="text-left text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 px-6 py-3">Member</th>
                <th className="text-left text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 px-6 py-3 hidden md:table-cell">Email</th>
                <th className="text-left text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 px-6 py-3 hidden sm:table-cell">Joined</th>
                <th className="text-left text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 px-6 py-3 hidden lg:table-cell">Events</th>
                <th className="text-left text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 px-6 py-3">Status</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {filtered.map((m) => (
                <tr key={m.email} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors group">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-brand-50 dark:bg-brand-950/50 border border-brand-100 dark:border-brand-900/50 flex items-center justify-center shrink-0">
                        <span className="font-display text-sm font-semibold text-brand-700 dark:text-brand-300">{m.name[0]}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{m.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 hidden md:table-cell">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{m.email}</span>
                  </td>
                  <td className="px-6 py-3.5 hidden sm:table-cell">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{m.joined}</span>
                  </td>
                  <td className="px-6 py-3.5 hidden lg:table-cell">
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{m.events}</span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${m.status === 'Active' ? 'bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400' : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400'}`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium px-2.5 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">View</button>
                      <button className="text-xs text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium px-2.5 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-gray-400 dark:text-gray-500 text-sm">No members found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
