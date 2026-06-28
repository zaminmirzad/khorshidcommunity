'use client';
import { useState } from 'react';

const MESSAGES = [
  { id: 1, name: 'Sara Ahmadi', email: 'sara@email.com', subject: 'Question about Nowruz event', body: 'Hello, I was wondering if there are still spots available for the upcoming Nowruz event. My family of 4 would love to attend. Please let us know the registration details.', time: '1 hour ago', read: false, replied: false },
  { id: 2, name: 'Reza Tehrani', email: 'reza@email.com', subject: 'Membership inquiry', body: "Hi, I recently moved to San Diego and found out about Khorshid Community. I'd love to learn more about becoming a member and how I can get involved with the community activities.", time: '3 hours ago', read: false, replied: false },
  { id: 3, name: 'Mina Hashemi', email: 'mina@email.com', subject: 'Volunteering opportunities', body: 'I am very interested in volunteering at your events. I have experience in event coordination and would love to contribute to the community. Do you have any opportunities available?', time: '6 hours ago', read: false, replied: false },
  { id: 4, name: 'Ali Karimi', email: 'ali@email.com', subject: 'Event feedback — Summer Festival', body: 'I attended the Summer Festival last year and had an amazing time. The organization was excellent and I appreciated all the effort that went into the cultural performances. Looking forward to this year!', time: 'Yesterday', read: false, replied: false },
  { id: 5, name: 'Parisa Rahimi', email: 'parisa@email.com', subject: 'Persian language class inquiry', body: 'Could you please send me information about the Persian language classes? I would like to enroll my children (ages 8 and 10) in the upcoming session.', time: '2 days ago', read: true, replied: true },
  { id: 6, name: 'Daud Sultani', email: 'daud@email.com', subject: 'Donation inquiry', body: 'I would like to make a donation to support the community programs. What is the best way to contribute? I appreciate all the work you do for the community.', time: '3 days ago', read: true, replied: true },
];

export default function MessagesPage() {
  const [selected, setSelected] = useState<typeof MESSAGES[0] | null>(null);
  const [filter, setFilter] = useState<'All' | 'Unread' | 'Replied'>('All');

  const filtered = MESSAGES.filter((m) => {
    if (filter === 'Unread') return !m.read;
    if (filter === 'Replied') return m.replied;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-2">
          <span className="w-4 h-px bg-accent" />Inbox
        </span>
        <h1 className="font-display font-light text-3xl sm:text-4xl text-gray-900 dark:text-white">
          <em className="italic text-brand-900 dark:text-brand-300">Messages</em>
        </h1>
      </div>

      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
        {(['All', 'Unread', 'Replied'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === f ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
          >
            {f}
            {f === 'Unread' && (
              <span className="ml-1.5 text-[10px] font-bold bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded-full">
                {MESSAGES.filter((m) => !m.read).length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2 space-y-2">
          {filtered.map((msg) => (
            <button
              key={msg.id}
              onClick={() => setSelected(msg)}
              className={`w-full text-left bg-white dark:bg-gray-900 rounded-2xl border p-4 transition-all duration-200 hover:shadow-md ${selected?.id === msg.id ? 'border-accent/40 shadow-md ring-1 ring-accent/20' : 'border-gray-100 dark:border-gray-800 shadow-sm'}`}
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-50 dark:bg-brand-950/50 border border-brand-100 dark:border-brand-900/50 flex items-center justify-center shrink-0">
                  <span className="font-display text-sm font-semibold text-brand-700 dark:text-brand-300">{msg.name[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <p className={`text-sm truncate ${!msg.read ? 'font-bold text-gray-900 dark:text-white' : 'font-medium text-gray-700 dark:text-gray-300'}`}>{msg.name}</p>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 shrink-0">{msg.time}</span>
                  </div>
                  <p className={`text-xs truncate ${!msg.read ? 'font-semibold text-gray-700 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'}`}>{msg.subject}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">{msg.body}</p>
                </div>
                {!msg.read && <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1.5" />}
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-8 text-center text-gray-400 dark:text-gray-500 text-sm">
              No messages here.
            </div>
          )}
        </div>

        <div className="lg:col-span-3">
          {selected ? (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-50 dark:border-gray-800">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-semibold text-gray-900 dark:text-white text-lg mb-1">{selected.subject}</h2>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-brand-50 dark:bg-brand-950/50 border border-brand-100 dark:border-brand-900/50 flex items-center justify-center">
                          <span className="font-display text-[10px] font-semibold text-brand-700 dark:text-brand-300">{selected.name[0]}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{selected.name}</span>
                      </div>
                      <span className="text-sm text-gray-400 dark:text-gray-500">{selected.email}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-gray-400 dark:text-gray-500">{selected.time}</span>
                    {selected.replied && (
                      <span className="text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full">Replied</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="px-6 py-5">
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{selected.body}</p>
              </div>
              <div className="px-6 py-5 border-t border-gray-50 dark:border-gray-800">
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-3">Reply</p>
                <textarea
                  rows={4}
                  placeholder="Write your reply…"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none focus:outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all mb-3"
                />
                <div className="flex items-center justify-between">
                  <button className="text-sm text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors">Delete message</button>
                  <button className="bg-accent hover:bg-accent-hover text-brand-950 font-semibold px-6 py-2.5 rounded-xl text-sm transition-all shadow-[0_4px_12px_rgba(251,191,36,0.25)]">
                    Send Reply
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 h-64 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
              Select a message to read it
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
