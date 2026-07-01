'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

type TeamMember = {
  id: string;
  name: string;
  title_en: string;
  title_fa: string | null;
  bio_en: string | null;
  bio_fa: string | null;
  photo_url: string | null;
  is_president: boolean;
  active: boolean;
  sort_order: number;
};

const EMPTY_FORM = { name: '', title_en: '', title_fa: '', bio_en: '', bio_fa: '', is_president: false };

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    const res = await fetch('/api/admin/team');
    setMembers(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFile(null);
    setPreview(null);
    setError('');
    setShowForm(true);
  }

  function openEdit(m: TeamMember) {
    setEditing(m);
    setForm({ name: m.name, title_en: m.title_en, title_fa: m.title_fa ?? '', bio_en: m.bio_en ?? '', bio_fa: m.bio_fa ?? '', is_president: m.is_president });
    setFile(null);
    setPreview(m.photo_url);
    setError('');
    setShowForm(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    if (editing) {
      const res = await fetch(`/api/admin/team/${editing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, title_fa: form.title_fa || null, bio_en: form.bio_en || null, bio_fa: form.bio_fa || null }),
      });
      if (!res.ok) { const j = await res.json(); setError(j.error); setSaving(false); return; }
      if (file) {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('name', form.name);
        fd.append('title_en', form.title_en);
        await fetch('/api/admin/team', { method: 'POST', body: fd });
        await fetch(`/api/admin/team/${editing.id}`, { method: 'DELETE' });
      }
    } else {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
      if (file) fd.append('file', file);
      const res = await fetch('/api/admin/team', { method: 'POST', body: fd });
      if (!res.ok) { const j = await res.json(); setError(j.error); setSaving(false); return; }
    }

    setSaving(false);
    setShowForm(false);
    if (preview && !editing?.photo_url) URL.revokeObjectURL(preview);
    await load();
  }

  async function deleteMember(m: TeamMember) {
    if (!confirm(`Delete ${m.name}?`)) return;
    await fetch(`/api/admin/team/${m.id}`, { method: 'DELETE' });
    setMembers((prev) => prev.filter((x) => x.id !== m.id));
  }

  async function toggleActive(m: TeamMember) {
    await fetch(`/api/admin/team/${m.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active: !m.active }) });
    setMembers((prev) => prev.map((x) => x.id === m.id ? { ...x, active: !x.active } : x));
  }

  const president = members.find((m) => m.is_president);
  const rest = members.filter((m) => !m.is_president);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-2"><span className="w-4 h-px bg-accent" />Website</span>
          <h1 className="font-display font-light text-3xl sm:text-4xl text-gray-900 dark:text-white">
            <em className="italic text-brand-900 dark:text-brand-300">Team</em>
          </h1>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-brand-950 font-semibold px-5 py-2.5 rounded-md text-sm transition-all shadow-[0_4px_12px_rgba(251,191,36,0.25)] shrink-0">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Member
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-accent/30 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white text-sm mb-4">{editing ? 'Edit Member' : 'New Member'}</h2>
          <form onSubmit={save} className="space-y-4">
            <div className="flex items-center gap-4 mb-2">
              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0 border border-gray-200 dark:border-gray-700">
                {preview ? <Image src={preview} alt="" fill className="object-cover" /> : <span className="absolute inset-0 flex items-center justify-center text-2xl text-gray-300">👤</span>}
              </div>
              <label className="text-sm font-medium text-accent-dark cursor-pointer hover:underline">
                {preview ? 'Change photo' : 'Upload photo'}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  setFile(f);
                  if (preview && !editing?.photo_url) URL.revokeObjectURL(preview);
                  setPreview(URL.createObjectURL(f));
                }} />
              </label>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">Full Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">Title (English) *</label>
                <input type="text" value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} required placeholder="e.g. President" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">Title (Farsi) <span className="normal-case font-normal text-gray-300 dark:text-gray-600 tracking-normal">optional</span></label>
              <input type="text" value={form.title_fa} onChange={(e) => setForm({ ...form, title_fa: e.target.value })} dir="rtl" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">Bio (English)</label>
              <textarea value={form.bio_en} onChange={(e) => setForm({ ...form, bio_en: e.target.value })} rows={3} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm text-gray-900 dark:text-white placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">Bio (Farsi) <span className="normal-case font-normal text-gray-300 dark:text-gray-600 tracking-normal">optional</span></label>
              <textarea value={form.bio_fa} onChange={(e) => setForm({ ...form, bio_fa: e.target.value })} rows={3} dir="rtl" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm text-gray-900 dark:text-white placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all" />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="is_president" checked={form.is_president} onChange={(e) => setForm({ ...form, is_president: e.target.checked })} className="rounded border-gray-300 text-accent focus:ring-accent/30" />
              <label htmlFor="is_president" className="text-sm text-gray-700 dark:text-gray-200">Featured / President</label>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-md text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Cancel</button>
              <button type="submit" disabled={saving} className="px-5 py-2 rounded-md text-sm font-semibold bg-accent hover:bg-accent-hover disabled:opacity-60 text-brand-950 transition-all">{saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Member'}</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-gray-400 text-sm">Loading…</div>
      ) : (
        <div className="space-y-3">
          {president && (
            <div className="mb-2">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500 mb-2">Featured</p>
              <MemberCard member={president} onEdit={openEdit} onDelete={deleteMember} onToggle={toggleActive} />
            </div>
          )}
          {rest.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500 mb-2">Team ({rest.length})</p>
              <div className="space-y-2">{rest.map((m) => <MemberCard key={m.id} member={m} onEdit={openEdit} onDelete={deleteMember} onToggle={toggleActive} />)}</div>
            </div>
          )}
          {members.length === 0 && <div className="py-12 text-center text-gray-400 dark:text-gray-500 text-sm">No team members yet.</div>}
        </div>
      )}
    </div>
  );
}

function MemberCard({ member, onEdit, onDelete, onToggle }: { member: TeamMember; onEdit: (m: TeamMember) => void; onDelete: (m: TeamMember) => void; onToggle: (m: TeamMember) => void }) {
  return (
    <div className="flex items-center gap-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm px-5 py-4">
      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-brand-50 dark:bg-brand-950/50 border border-brand-100 dark:border-brand-900/50 shrink-0">
        {member.photo_url
          ? <Image src={member.photo_url} alt={member.name} fill className="object-cover" />
          : <span className="absolute inset-0 flex items-center justify-center font-display text-lg font-semibold text-brand-700 dark:text-brand-300">{member.name[0]}</span>}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{member.name}</p>
          {!member.active && <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400">Hidden</span>}
          {member.is_president && <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-accent/20 text-amber-700 dark:text-amber-400">Featured</span>}
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500">{member.title_en}{member.title_fa ? ` · ${member.title_fa}` : ''}</p>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <button onClick={() => onToggle(member)} className="text-xs font-medium px-3 py-1.5 rounded-sm border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">{member.active ? 'Hide' : 'Show'}</button>
        <button onClick={() => onEdit(member)} className="text-xs font-medium px-3 py-1.5 rounded-sm border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Edit</button>
        <button onClick={() => onDelete(member)} className="text-xs font-medium px-3 py-1.5 rounded-sm bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors">Delete</button>
      </div>
    </div>
  );
}
