'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const CATEGORIES = ['cultural', 'events', 'workshops', 'volunteers', 'celebrations'] as const;

type GalleryItem = {
  id: string;
  url: string;
  title: string;
  description: string | null;
  date_label: string | null;
  location: string | null;
  category: string;
  active: boolean;
  created_at: string;
};

export default function GalleryAdminPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState('all');
  const [form, setForm] = useState({ title: '', description: '', date_label: '', location: '', category: 'events' });
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    const res = await fetch('/api/admin/gallery');
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const arr = Array.from(files).filter((f) => f.type.startsWith('image/'));
    setSelectedFiles(arr);
    const urls = arr.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    if (arr.length > 0) setShowForm(true);
  }

  async function upload(e: React.FormEvent) {
    e.preventDefault();
    if (selectedFiles.length === 0 || !form.title) return;
    setUploading(true);
    setError('');

    for (const file of selectedFiles) {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('date_label', form.date_label);
      fd.append('location', form.location);
      fd.append('category', form.category);

      const res = await fetch('/api/admin/gallery', { method: 'POST', body: fd });
      if (!res.ok) {
        const json = await res.json();
        setError(json.error ?? 'Upload failed.');
        setUploading(false);
        return;
      }
    }

    previews.forEach((u) => URL.revokeObjectURL(u));
    setSelectedFiles([]);
    setPreviews([]);
    setForm({ title: '', description: '', date_label: '', location: '', category: 'events' });
    setShowForm(false);
    if (fileRef.current) fileRef.current.value = '';
    await load();
    setUploading(false);
  }

  async function deleteItem(item: GalleryItem) {
    if (!confirm(`Delete "${item.title}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/gallery/${item.id}`, { method: 'DELETE' });
    setItems((prev) => prev.filter((i) => i.id !== item.id));
  }

  async function toggleActive(item: GalleryItem) {
    await fetch(`/api/admin/gallery/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !item.active }),
    });
    setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, active: !i.active } : i));
  }

  const filtered = filterCategory === 'all' ? items : items.filter((i) => i.category === filterCategory);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-2">
            <span className="w-4 h-px bg-accent" />Media
          </span>
          <h1 className="font-display font-light text-3xl sm:text-4xl text-gray-900 dark:text-white">
            <em className="italic text-brand-900 dark:text-brand-300">Gallery</em>
          </h1>
        </div>
        <label className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-brand-950 text-sm font-semibold px-5 py-2.5 rounded-md transition-colors shadow-[0_4px_12px_rgba(251,191,36,0.25)] cursor-pointer shrink-0">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
          Upload Photos
          <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
        </label>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Photos', value: items.length },
          { label: 'Published', value: items.filter((i) => i.active).length },
          { label: 'Hidden', value: items.filter((i) => !i.active).length },
          { label: 'Categories', value: new Set(items.map((i) => i.category)).size },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm px-4 py-3.5">
            <div className="font-display text-2xl font-light text-gray-900 dark:text-white leading-none mb-0.5">{s.value}</div>
            <div className="text-xs text-gray-400 dark:text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-accent/30 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white text-sm mb-4">
            Upload {selectedFiles.length} photo{selectedFiles.length !== 1 ? 's' : ''}
          </h2>
          {previews.length > 0 && (
            <div className="flex gap-3 mb-5 overflow-x-auto pb-1">
              {previews.map((src, i) => (
                <div key={i} className="relative w-24 h-24 rounded-md overflow-hidden shrink-0 bg-gray-100 dark:bg-gray-800">
                  <Image src={src} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
          <form onSubmit={upload} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">Title *</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="e.g. Nowruz Celebration" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all capitalize">
                  {CATEGORIES.map((c) => <option key={c} value={c} className="capitalize">{c}</option>)}
                </select>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">Date <span className="normal-case font-normal text-gray-300 dark:text-gray-600 tracking-normal">e.g. March 2025</span></label>
                <input type="text" value={form.date_label} onChange={(e) => setForm({ ...form, date_label: e.target.value })} placeholder="March 2025" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">Location</label>
                <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Balboa Park" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-2">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Brief description…" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm text-gray-900 dark:text-white placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all" />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => { setShowForm(false); setSelectedFiles([]); setPreviews([]); if (fileRef.current) fileRef.current.value = ''; }} className="px-4 py-2 rounded-md text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Cancel</button>
              <button type="submit" disabled={uploading} className="px-5 py-2 rounded-md text-sm font-semibold bg-accent hover:bg-accent-hover disabled:opacity-60 text-brand-950 transition-all">
                {uploading ? 'Uploading…' : `Upload ${selectedFiles.length > 1 ? `${selectedFiles.length} Photos` : 'Photo'}`}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex gap-1.5 flex-wrap">
        {(['all', ...CATEGORIES] as const).map((cat) => (
          <button key={cat} onClick={() => setFilterCategory(cat)}
            className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-all ${filterCategory === cat ? 'bg-brand-950 dark:bg-white text-white dark:text-gray-900' : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'}`}>
            {cat === 'all' ? `All (${items.length})` : cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-400 text-sm">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-gray-400 dark:text-gray-500 text-sm">
          {items.length === 0 ? 'No photos yet. Upload your first photo.' : 'No photos in this category.'}
        </div>
      ) : (
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
          {filtered.map((item) => (
            <div key={item.id} className="relative break-inside-avoid rounded-lg overflow-hidden group border border-gray-100 dark:border-gray-800">
              <div className="relative w-full bg-gray-100 dark:bg-gray-800" style={{ aspectRatio: '4/3' }}>
                <Image src={item.url} alt={item.title} fill className="object-cover" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <p className="text-white text-xs font-semibold leading-snug truncate">{item.title}</p>
                <p className="text-white/60 text-[10px] capitalize">{item.category}{item.date_label ? ` · ${item.date_label}` : ''}</p>
              </div>
              {!item.active && (
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-gray-900/80 rounded-full text-[10px] text-gray-300 font-medium">Hidden</div>
              )}
              <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => toggleActive(item)} title={item.active ? 'Hide' : 'Show'}
                  className="w-7 h-7 rounded-sm bg-white/90 dark:bg-gray-800/90 flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-white transition-colors">
                  {item.active
                    ? <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
                </button>
                <button onClick={() => deleteItem(item)} title="Delete"
                  className="w-7 h-7 rounded-sm bg-red-500/90 flex items-center justify-center text-white hover:bg-red-500 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
