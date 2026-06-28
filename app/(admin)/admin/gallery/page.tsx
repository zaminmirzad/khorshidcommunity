'use client';
import { useState } from 'react';

const ALBUMS = ['All', 'Nowruz 2026', 'Summer Festival', 'Workshops', 'Community'];

const PHOTOS = [
  { id: 1, album: 'Nowruz 2026', label: 'Opening Ceremony', aspect: 'landscape', color: 'from-blue-200 to-blue-300' },
  { id: 2, album: 'Nowruz 2026', label: 'Traditional Dance', aspect: 'portrait', color: 'from-purple-200 to-purple-300' },
  { id: 3, album: 'Summer Festival', label: 'Cultural Performances', aspect: 'landscape', color: 'from-amber-200 to-amber-300' },
  { id: 4, album: 'Workshops', label: 'Calligraphy Class', aspect: 'square', color: 'from-green-200 to-green-300' },
  { id: 5, album: 'Nowruz 2026', label: 'Community Gathering', aspect: 'landscape', color: 'from-red-200 to-red-300' },
  { id: 6, album: 'Community', label: 'Youth Program', aspect: 'portrait', color: 'from-teal-200 to-teal-300' },
  { id: 7, album: 'Summer Festival', label: 'Food & Culture', aspect: 'square', color: 'from-orange-200 to-orange-300' },
  { id: 8, album: 'Workshops', label: 'Language Class', aspect: 'landscape', color: 'from-indigo-200 to-indigo-300' },
  { id: 9, album: 'Community', label: 'Annual Dinner', aspect: 'landscape', color: 'from-pink-200 to-pink-300' },
];

export default function GalleryAdminPage() {
  const [activeAlbum, setActiveAlbum] = useState('All');
  const [selected, setSelected] = useState<number[]>([]);

  const photos = activeAlbum === 'All' ? PHOTOS : PHOTOS.filter((p) => p.album === activeAlbum);

  function toggleSelect(id: number) {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }

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
        <div className="flex items-center gap-2 shrink-0">
          {selected.length > 0 && (
            <button
              onClick={() => setSelected([])}
              className="text-sm text-red-600 dark:text-red-400 font-semibold px-4 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 border border-red-200 dark:border-red-800 transition-colors"
            >
              Delete {selected.length} selected
            </button>
          )}
          <label className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-brand-950 text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-[0_4px_12px_rgba(251,191,36,0.25)] cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            Upload Photos
            <input type="file" multiple accept="image/*,video/*" className="hidden" />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Photos', value: '284' },
          { label: 'Videos', value: '18' },
          { label: 'Albums', value: '12' },
          { label: 'Storage Used', value: '4.2 GB' },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm px-4 py-3.5">
            <div className="font-display text-2xl font-light text-gray-900 dark:text-white leading-none mb-0.5">{s.value}</div>
            <div className="text-xs text-gray-400 dark:text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {ALBUMS.map((album) => (
          <button
            key={album}
            onClick={() => setActiveAlbum(album)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeAlbum === album ? 'bg-brand-950 text-white' : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:text-white'}`}
          >
            {album}
          </button>
        ))}
        <button className="px-4 py-2 rounded-xl text-sm font-medium bg-white dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-700 text-gray-400 dark:text-gray-500 hover:border-gray-400 dark:hover:border-gray-600 hover:text-gray-600 dark:hover:text-gray-300 transition-all">
          + New Album
        </button>
      </div>

      <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
        {photos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => toggleSelect(photo.id)}
            className={`relative break-inside-avoid rounded-2xl overflow-hidden cursor-pointer group border-2 transition-all duration-200 ${selected.includes(photo.id) ? 'border-accent shadow-[0_0_0_3px_rgba(251,191,36,0.2)]' : 'border-transparent'}`}
          >
            <div className={`bg-gradient-to-br ${photo.color} ${photo.aspect === 'portrait' ? 'aspect-[3/4]' : photo.aspect === 'square' ? 'aspect-square' : 'aspect-[4/3]'} flex items-end p-3`}>
              <div className="w-full">
                <p className="text-white text-xs font-semibold drop-shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">{photo.label}</p>
                <p className="text-white/70 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">{photo.album}</p>
              </div>
            </div>
            <div className={`absolute top-2.5 left-2.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selected.includes(photo.id) ? 'bg-accent border-accent' : 'border-white/60 opacity-0 group-hover:opacity-100 bg-black/20'}`}>
              {selected.includes(photo.id) && (
                <svg className="w-3 h-3 text-brand-950" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              )}
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); }}
              className="absolute top-2.5 right-2.5 w-6 h-6 rounded-lg bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
