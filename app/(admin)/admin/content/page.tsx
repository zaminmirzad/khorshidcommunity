'use client';
import { useEffect, useState } from 'react';

type Stat = { id: string; number: string; label_en: string; label_fa: string | null; icon: string; sort_order: number };
type Testimonial = { id: string; name: string; role_label: string | null; quote: string; active: boolean };
type Program = { id: string; icon: string; title_en: string; title_fa: string | null; desc_en: string | null; desc_fa: string | null; active: boolean; sort_order: number };

const TABS = ['Stats', 'Programs', 'Testimonials'] as const;

export default function ContentPage() {
  const [tab, setTab] = useState<typeof TABS[number]>('Stats');
  const [stats, setStats] = useState<Stat[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState('');

  // Program form
  const [showProgForm, setShowProgForm] = useState(false);
  const [progForm, setProgForm] = useState({ icon: '🎯', title_en: '', title_fa: '', desc_en: '', desc_fa: '' });

  // Testimonial form
  const [showTestForm, setShowTestForm] = useState(false);
  const [testForm, setTestForm] = useState({ name: '', role_label: '', quote: '' });

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/stats').then((r) => r.json()),
      fetch('/api/admin/programs').then((r) => r.json()),
      fetch('/api/admin/testimonials').then((r) => r.json()),
    ]).then(([s, p, t]) => {
      setStats(Array.isArray(s) ? s : []);
      setPrograms(Array.isArray(p) ? p : []);
      setTestimonials(Array.isArray(t) ? t : []);
      setLoading(false);
    });
  }, []);

  async function saveStat(stat: Stat) {
    setSaving(stat.id);
    await fetch('/api/admin/stats', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(stat) });
    setSaving(null);
  }

  async function addProgram(e: React.FormEvent) {
    e.preventDefault();
    setSaving('prog');
    const res = await fetch('/api/admin/programs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...progForm, title_fa: progForm.title_fa || null, desc_en: progForm.desc_en || null, desc_fa: progForm.desc_fa || null }) });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setSaving(null); return; }
    setPrograms((prev) => [...prev, data]);
    setProgForm({ icon: '🎯', title_en: '', title_fa: '', desc_en: '', desc_fa: '' });
    setShowProgForm(false);
    setSaving(null);
  }

  async function deleteProgram(id: string) {
    if (!confirm('Delete this program?')) return;
    await fetch('/api/admin/programs', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setPrograms((prev) => prev.filter((p) => p.id !== id));
  }

  async function toggleProgram(p: Program) {
    await fetch('/api/admin/programs', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: p.id, active: !p.active }) });
    setPrograms((prev) => prev.map((x) => x.id === p.id ? { ...x, active: !x.active } : x));
  }

  async function addTestimonial(e: React.FormEvent) {
    e.preventDefault();
    setSaving('test');
    const res = await fetch('/api/admin/testimonials', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...testForm, role_label: testForm.role_label || null }) });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setSaving(null); return; }
    setTestimonials((prev) => [...prev, data]);
    setTestForm({ name: '', role_label: '', quote: '' });
    setShowTestForm(false);
    setSaving(null);
  }

  async function deleteTestimonial(id: string) {
    if (!confirm('Delete this testimonial?')) return;
    await fetch('/api/admin/testimonials', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
  }

  async function toggleTestimonial(t: Testimonial) {
    await fetch('/api/admin/testimonials', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: t.id, active: !t.active }) });
    setTestimonials((prev) => prev.map((x) => x.id === t.id ? { ...x, active: !x.active } : x));
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-2"><span className="w-4 h-px bg-accent" />Website</span>
        <h1 className="font-display font-light text-3xl sm:text-4xl text-gray-900 dark:text-white">
          <em className="italic text-brand-900 dark:text-brand-300">Content</em>
        </h1>
      </div>

      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-md w-fit">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-5 py-2 rounded-sm text-sm font-medium transition-all ${tab === t ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>{t}</button>
        ))}
      </div>

      {loading ? <div className="py-12 text-center text-gray-400 text-sm">Loading…</div> : (
        <>
          {/* ── STATS ── */}
          {tab === 'Stats' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">Edit the stats shown on the homepage. Changes are live immediately.</p>
              {stats.map((stat) => (
                <div key={stat.id} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm p-5">
                  <div className="grid sm:grid-cols-4 gap-3 items-end">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">Icon</label>
                      <input value={stat.icon} onChange={(e) => setStats((prev) => prev.map((s) => s.id === stat.id ? { ...s, icon: e.target.value } : s))} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">Number</label>
                      <input value={stat.number} onChange={(e) => setStats((prev) => prev.map((s) => s.id === stat.id ? { ...s, number: e.target.value } : s))} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">Label (EN)</label>
                      <input value={stat.label_en} onChange={(e) => setStats((prev) => prev.map((s) => s.id === stat.id ? { ...s, label_en: e.target.value } : s))} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">Label (FA)</label>
                      <div className="flex gap-2">
                        <input value={stat.label_fa ?? ''} onChange={(e) => setStats((prev) => prev.map((s) => s.id === stat.id ? { ...s, label_fa: e.target.value } : s))} dir="rtl" className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all" />
                        <button onClick={() => saveStat(stat)} disabled={saving === stat.id} className="px-4 py-2.5 rounded-md bg-accent hover:bg-accent-hover disabled:opacity-60 text-brand-950 text-sm font-semibold transition-all shrink-0">
                          {saving === stat.id ? '…' : 'Save'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── PROGRAMS ── */}
          {tab === 'Programs' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button onClick={() => setShowProgForm(!showProgForm)} className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-brand-950 font-semibold px-5 py-2.5 rounded-md text-sm transition-all shadow-[0_4px_12px_rgba(251,191,36,0.25)]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  Add Program
                </button>
              </div>
              {showProgForm && (
                <div className="bg-white dark:bg-gray-900 rounded-lg border border-accent/30 shadow-sm p-6">
                  <form onSubmit={addProgram} className="space-y-4">
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">Icon (emoji)</label>
                        <input value={progForm.icon} onChange={(e) => setProgForm({ ...progForm, icon: e.target.value })} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all text-gray-900 dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">Title (EN) *</label>
                        <input value={progForm.title_en} onChange={(e) => setProgForm({ ...progForm, title_en: e.target.value })} required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all text-gray-900 dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">Title (FA)</label>
                        <input value={progForm.title_fa} onChange={(e) => setProgForm({ ...progForm, title_fa: e.target.value })} dir="rtl" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all text-gray-900 dark:text-white" />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">Description (EN)</label>
                        <textarea value={progForm.desc_en} onChange={(e) => setProgForm({ ...progForm, desc_en: e.target.value })} rows={3} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all text-gray-900 dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">Description (FA)</label>
                        <textarea value={progForm.desc_fa} onChange={(e) => setProgForm({ ...progForm, desc_fa: e.target.value })} rows={3} dir="rtl" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all text-gray-900 dark:text-white" />
                      </div>
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => setShowProgForm(false)} className="px-4 py-2 rounded-md text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Cancel</button>
                      <button type="submit" disabled={saving === 'prog'} className="px-5 py-2 rounded-md text-sm font-semibold bg-accent hover:bg-accent-hover disabled:opacity-60 text-brand-950">{saving === 'prog' ? 'Adding…' : 'Add Program'}</button>
                    </div>
                  </form>
                </div>
              )}
              <div className="space-y-2">
                {programs.map((p) => (
                  <div key={p.id} className="flex items-start gap-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm px-5 py-4">
                    <span className="text-2xl shrink-0 mt-0.5">{p.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{p.title_en}</p>
                        {p.title_fa && <p className="text-sm text-gray-400 dark:text-gray-500" dir="rtl">{p.title_fa}</p>}
                        {!p.active && <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400">Hidden</span>}
                      </div>
                      {p.desc_en && <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-2">{p.desc_en}</p>}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button onClick={() => toggleProgram(p)} className="text-xs font-medium px-3 py-1.5 rounded-sm border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">{p.active ? 'Hide' : 'Show'}</button>
                      <button onClick={() => deleteProgram(p.id)} className="text-xs font-medium px-3 py-1.5 rounded-sm bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-100 transition-colors">Delete</button>
                    </div>
                  </div>
                ))}
                {programs.length === 0 && <div className="py-12 text-center text-gray-400 dark:text-gray-500 text-sm">No programs yet.</div>}
              </div>
            </div>
          )}

          {/* ── TESTIMONIALS ── */}
          {tab === 'Testimonials' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button onClick={() => setShowTestForm(!showTestForm)} className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-brand-950 font-semibold px-5 py-2.5 rounded-md text-sm transition-all shadow-[0_4px_12px_rgba(251,191,36,0.25)]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  Add Testimonial
                </button>
              </div>
              {showTestForm && (
                <div className="bg-white dark:bg-gray-900 rounded-lg border border-accent/30 shadow-sm p-6">
                  <form onSubmit={addTestimonial} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">Name *</label>
                        <input value={testForm.name} onChange={(e) => setTestForm({ ...testForm, name: e.target.value })} required placeholder="e.g. Maryam K." className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">Role / Label</label>
                        <input value={testForm.role_label} onChange={(e) => setTestForm({ ...testForm, role_label: e.target.value })} placeholder="e.g. Member since 2015" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">Quote *</label>
                      <textarea value={testForm.quote} onChange={(e) => setTestForm({ ...testForm, quote: e.target.value })} required rows={3} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm text-gray-900 dark:text-white placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all" />
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => setShowTestForm(false)} className="px-4 py-2 rounded-md text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Cancel</button>
                      <button type="submit" disabled={saving === 'test'} className="px-5 py-2 rounded-md text-sm font-semibold bg-accent hover:bg-accent-hover disabled:opacity-60 text-brand-950">{saving === 'test' ? 'Adding…' : 'Add Testimonial'}</button>
                    </div>
                  </form>
                </div>
              )}
              <div className="space-y-2">
                {testimonials.map((t) => (
                  <div key={t.id} className="flex items-start gap-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm px-5 py-4">
                    <div className="w-9 h-9 rounded-full bg-brand-50 dark:bg-brand-950/50 border border-brand-100 dark:border-brand-900/50 flex items-center justify-center shrink-0">
                      <span className="font-display text-sm font-semibold text-brand-700 dark:text-brand-300">{t.name[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{t.name}</p>
                        {t.role_label && <p className="text-xs text-gray-400 dark:text-gray-500">{t.role_label}</p>}
                        {!t.active && <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400">Hidden</span>}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 italic">&ldquo;{t.quote}&rdquo;</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button onClick={() => toggleTestimonial(t)} className="text-xs font-medium px-3 py-1.5 rounded-sm border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">{t.active ? 'Hide' : 'Show'}</button>
                      <button onClick={() => deleteTestimonial(t.id)} className="text-xs font-medium px-3 py-1.5 rounded-sm bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-100 transition-colors">Delete</button>
                    </div>
                  </div>
                ))}
                {testimonials.length === 0 && <div className="py-12 text-center text-gray-400 dark:text-gray-500 text-sm">No testimonials yet.</div>}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
