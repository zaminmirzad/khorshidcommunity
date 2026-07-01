'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

type Member = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: string;
  joined_at: string;
  avatar_url: string | null;
  active: boolean;
};

const FILTERS = ['All', 'admin', 'member'] as const;

type RowProps = {
  m: Member;
  acting: string | null;
  confirmDelete: string | null;
  setConfirmDelete: (id: string | null) => void;
  changeRole: (m: Member, role: 'admin' | 'member') => void;
  toggleActive: (m: Member) => void;
  deleteMember: (m: Member) => void;
};

function MemberRow({ m, acting, confirmDelete, setConfirmDelete, changeRole, toggleActive, deleteMember }: RowProps) {
  const isActing = acting === m.id;
  const isConfirmingDelete = confirmDelete === m.id;

  return (
    <div className="px-6 py-4">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-brand-50 dark:bg-brand-950/50 border border-brand-100 dark:border-brand-900/50 flex items-center justify-center shrink-0 overflow-hidden">
          {m.avatar_url
            ? <Image src={m.avatar_url} alt={m.full_name} width={40} height={40} className="object-cover w-full h-full" />
            : <span className="font-display text-sm font-semibold text-brand-700 dark:text-brand-300">{m.full_name[0]}</span>
          }
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{m.full_name}</p>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${m.role === 'admin' ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400' : 'bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400'}`}>
              {m.role}
            </span>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{m.email}{m.phone ? ` · ${m.phone}` : ''}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            Joined {new Date(m.joined_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {isActing ? (
          <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">Saving…</span>
        ) : isConfirmingDelete ? (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-gray-500 dark:text-gray-400">Delete {m.full_name}?</span>
            <button onClick={() => deleteMember(m)}
              className="text-xs font-semibold px-3 py-1.5 rounded-sm bg-red-600 hover:bg-red-700 text-white transition-colors">
              Confirm
            </button>
            <button onClick={() => setConfirmDelete(null)}
              className="text-xs font-semibold px-3 py-1.5 rounded-sm border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
            {m.role === 'member' ? (
              <button onClick={() => changeRole(m, 'admin')}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 hover:border-red-300 dark:hover:border-red-700 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all">
                Make Admin
              </button>
            ) : (
              <button onClick={() => changeRole(m, 'member')}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                Demote
              </button>
            )}
            <button onClick={() => toggleActive(m)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-sm border transition-all ${
                m.active
                  ? 'border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30'
                  : 'border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/30'
              }`}>
              {m.active ? 'Deactivate' : 'Activate'}
            </button>
            <button onClick={() => setConfirmDelete(m.id)}
              className="text-xs font-semibold px-3 py-1.5 rounded-sm border border-red-200 dark:border-red-900/50 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all">
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<typeof FILTERS[number]>('All');
  const [acting, setActing] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [deactivatedOpen, setDeactivatedOpen] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from('members')
        .select('*')
        .order('joined_at', { ascending: false });
      setMembers(data ?? []);
      setLoading(false);
    }
    load();
  }, []);

  async function changeRole(member: Member, newRole: 'admin' | 'member') {
    if (member.role === newRole) return;
    setActing(member.id);
    const res = await fetch(`/api/admin/members/${member.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole }),
    });
    if (res.ok) {
      setMembers((prev) => prev.map((m) => m.id === member.id ? { ...m, role: newRole } : m));
    } else {
      const { error: e } = await res.json();
      setError(e ?? 'Failed to change role.');
    }
    setActing(null);
  }

  async function toggleActive(member: Member) {
    setActing(member.id);
    const res = await fetch(`/api/admin/members/${member.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !member.active }),
    });
    if (res.ok) {
      setMembers((prev) => prev.map((m) => m.id === member.id ? { ...m, active: !m.active } : m));
    } else {
      const { error: e } = await res.json();
      setError(e ?? 'Failed to update status.');
    }
    setActing(null);
  }

  async function deleteMember(member: Member) {
    setActing(member.id);
    setConfirmDelete(null);
    const res = await fetch(`/api/admin/members/${member.id}`, { method: 'DELETE' });
    if (res.ok) {
      setMembers((prev) => prev.filter((m) => m.id !== member.id));
    } else {
      const { error: e } = await res.json();
      setError(e ?? 'Failed to delete member.');
    }
    setActing(null);
  }

  const matchesSearch = (m: Member) =>
    m.full_name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase());
  const matchesFilter = (m: Member) => filter === 'All' || m.role === filter;

  const activeFiltered = members.filter((m) => m.active && matchesSearch(m) && matchesFilter(m));
  const deactivatedFiltered = members.filter((m) => !m.active && matchesSearch(m) && matchesFilter(m));

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
        <button
          onClick={() => {
            const rows = [['Name', 'Email', 'Phone', 'Role', 'Status', 'Joined'].join(',')];
            members.forEach((m) => {
              rows.push([
                `"${m.full_name.replace(/"/g, '""')}"`,
                `"${m.email.replace(/"/g, '""')}"`,
                `"${(m.phone ?? '').replace(/"/g, '""')}"`,
                m.role,
                m.active ? 'Active' : 'Deactivated',
                new Date(m.joined_at).toLocaleDateString('en-US'),
              ].join(','));
            });
            const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `members-${new Date().toISOString().slice(0, 10)}.csv`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          disabled={loading || members.length === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-md border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Export CSV
        </button>
      </div>

      {error && (
        <div className="flex items-center justify-between gap-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md text-sm">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-red-400 hover:text-red-600 shrink-0">✕</button>
        </div>
      )}

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
            className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all"
          />
        </div>
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-md">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-sm text-sm font-medium capitalize transition-all ${filter === f ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">{activeFiltered.length} member{activeFiltered.length !== 1 ? 's' : ''}</p>
        </div>
        {loading ? (
          <div className="py-12 text-center text-gray-400 dark:text-gray-500 text-sm">Loading…</div>
        ) : (
          <>
            <div className="divide-y divide-gray-50 dark:divide-gray-800">
              {activeFiltered.map((m) => <MemberRow key={m.id} m={m} acting={acting} confirmDelete={confirmDelete} setConfirmDelete={setConfirmDelete} changeRole={changeRole} toggleActive={toggleActive} deleteMember={deleteMember} />)}
              {activeFiltered.length === 0 && (
                <div className="py-12 text-center text-gray-400 dark:text-gray-500 text-sm">No members found.</div>
              )}
            </div>

            {deactivatedFiltered.length > 0 && (
              <div className="border-t border-gray-100 dark:border-gray-800">
                <button
                  onClick={() => setDeactivatedOpen((v) => !v)}
                  className="w-full flex items-center justify-between px-6 py-3 text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <span className="font-medium">
                    Deactivated · {deactivatedFiltered.length}
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${deactivatedOpen ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {deactivatedOpen && (
                  <div className="divide-y divide-gray-50 dark:divide-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
                    {deactivatedFiltered.map((m) => <MemberRow key={m.id} m={m} acting={acting} confirmDelete={confirmDelete} setConfirmDelete={setConfirmDelete} changeRole={changeRole} toggleActive={toggleActive} deleteMember={deleteMember} />)}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
