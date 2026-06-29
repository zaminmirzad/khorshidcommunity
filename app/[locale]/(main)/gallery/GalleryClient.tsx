'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import PageHero from '@/app/components/PageHero';
import { GALLERY_IMAGES, GALLERY_CATEGORIES } from '@/lib/data/gallery';
import type { GalleryItem } from './page';

const PAGE_SIZE = 9;

const FA_CATEGORY_NAMES: Record<string, string> = {
  all: 'همه',
  festivals: 'جشنواره‌ها',
  education: 'آموزش',
  community: 'کمیونیتی',
  youth: 'جوانان',
  arts: 'هنر',
};

export default function GalleryClient({ dbImages }: { dbImages: GalleryItem[] }) {
  const t = useTranslations('gallery');
  const locale = useLocale();
  const isFa = locale === 'fa';

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<{ id: number | string; src: string; title: string; description: string; date: string; location: string; category: string } | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const galleryStats = t.raw('galleryStats') as Array<{ number: string; label: string }>;

  const sourceImages = dbImages.length > 0
    ? dbImages.map((item) => ({
        id: item.id,
        category: item.category,
        src: item.url,
        title: item.title,
        description: item.description ?? '',
        date: item.date_label ?? '',
        location: item.location ?? '',
      }))
    : GALLERY_IMAGES;

  const filteredImages = selectedCategory === 'all'
    ? sourceImages
    : sourceImages.filter((img) => img.category === selectedCategory);

  const visibleImages = filteredImages.slice(0, visibleCount);
  const hasMore = visibleCount < filteredImages.length;

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setVisibleCount(PAGE_SIZE);
  };

  const openLightbox = (image: typeof GALLERY_IMAGES[0]) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
  };

  const getCategoryName = (categoryId: string) => {
    if (isFa) return FA_CATEGORY_NAMES[categoryId] ?? categoryId;
    return GALLERY_CATEGORIES.find((c) => c.id === categoryId)?.name ?? categoryId;
  };

  const statIcons = [
    <svg key="camera" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    <svg key="calendar" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    <svg key="clock" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    <svg key="users" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  ];

  return (
    <div className="bg-surface">
      <PageHero
        image="/images/gallery-hero.jpg"
        badge={t('badge')}
        title={
          isFa
            ? <>{t('heroTitle').split(' ')[0]} <em className="italic text-accent-muted">{t('heroTitle').split(' ').slice(1).join(' ')}</em></>
            : <>Photo <em className="italic text-accent-muted">Gallery</em></>
        }
        subtitle={t('heroSubtitle')}
      />

      {/* Stats */}
      <section className="py-20 bg-surface">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-3 text-accent-dark font-semibold uppercase text-[11px] tracking-[0.2em] mb-4">
              <span className="w-10 h-px bg-accent" />{t('archivesOverline')}<span className="w-10 h-px bg-accent" />
            </span>
            <h2 className="font-display font-light text-4xl md:text-5xl text-gray-900">
              {isFa
                ? <><span>خاطرات در </span><em className="italic text-brand-900">اعداد</em></>
                : <>Memories in <em className="italic text-brand-900">Numbers</em></>
              }
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryStats.map((stat, i) => (
              <div key={stat.label} className="group bg-surface rounded-2xl p-6 sm:p-8 border border-gray-100 hover:border-accent-light hover:shadow-xl transition-all duration-300 text-center hover:-translate-y-1">
                <div className="w-14 h-14 bg-brand-900 group-hover:bg-brand-800 rounded-2xl flex items-center justify-center text-accent mx-auto mb-5 transition-colors">
                  {statIcons[i]}
                </div>
                <div className="font-display text-3xl sm:text-4xl font-light text-brand-900 mb-1">{stat.number}</div>
                <div className="text-gray-400 text-xs font-semibold uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 bg-surface-alt dot-grid">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-3 text-accent-dark font-semibold uppercase text-[11px] tracking-[0.2em] mb-4">
              <span className="w-8 h-px bg-accent" />{t('browseOverline')}<span className="w-8 h-px bg-accent" />
            </span>
            <h2 className="font-display font-light text-4xl md:text-5xl text-gray-900 mb-8">
              {isFa
                ? <><span>کاوش در </span><em className="italic text-brand-900">گالری</em></>
                : <>Explore the <em className="italic text-brand-900">Gallery</em></>
              }
            </h2>
            <div className="flex flex-wrap justify-center gap-2.5">
              {GALLERY_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-brand-900 text-accent-muted shadow-lg border border-accent/20'
                      : 'bg-surface text-gray-600 border border-gray-200 hover:border-accent-light hover:text-accent-dark hover:shadow-md'
                  }`}
                >
                  <span className="text-base">{category.icon}</span>
                  {getCategoryName(category.id)}
                </button>
              ))}
            </div>
          </div>

          {filteredImages.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="font-display font-semibold text-2xl text-gray-800 mb-2">{t('noPhotos')}</h3>
              <p className="text-gray-500">{t('noPhotosSub')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {visibleImages.map((image) => (
                <button
                  key={image.id}
                  onClick={() => openLightbox(image as Parameters<typeof openLightbox>[0])}
                  className="group relative overflow-hidden rounded-2xl border border-gray-200 hover:border-accent/40 hover:shadow-2xl transition-all duration-500 text-left w-full hover:-translate-y-1"
                >
                  <div className="relative h-64 sm:h-72 overflow-hidden bg-gray-100">
                    <Image
                      src={image.src}
                      alt={`${image.title} — ${image.date} at ${image.location}, Khorshid Community San Diego`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <h3 className="text-white font-display font-semibold text-lg leading-snug mb-1">{image.title}</h3>
                      <p className="text-accent-muted text-xs">{image.location} · {image.date}</p>
                    </div>
                    <div className="absolute top-4 left-4 bg-accent text-brand-950 px-3 py-1 rounded-full font-semibold text-xs">
                      {getCategoryName(image.category)}
                    </div>
                    <div className="absolute top-4 right-4 w-9 h-9 bg-surface/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
                      <svg className="w-4 h-4 text-brand-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {hasMore && (
            <div className="text-center mt-12">
              <button onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)} className="btn-shimmer inline-flex items-center gap-2 px-8 py-3.5 bg-brand-900 hover:bg-brand-800 text-accent-muted font-semibold rounded-full transition-all duration-300 text-sm shadow-lg hover:shadow-xl">
                {t('loadMore')}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Video Highlights + Share CTA */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-brand-950">
        <div className="absolute -top-48 -right-48 w-[700px] h-[700px] rounded-full bg-accent/6 blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-48 -left-48 w-[600px] h-[600px] rounded-full bg-brand-400/10 blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-3 text-accent/80 font-semibold uppercase text-[11px] tracking-[0.2em] mb-4">
              <span className="w-10 h-px bg-accent/50" />{t('watchOverline')}<span className="w-10 h-px bg-accent/50" />
            </span>
            <h2 className="font-display font-light text-4xl md:text-5xl text-white">
              {isFa
                ? <><span>برترین‌های </span><em className="italic text-accent-muted">رویداد</em></>
                : <>Event <em className="italic text-accent-muted">Highlights</em></>
              }
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-20" dir="ltr">
            {[t('videoLabel1'), t('videoLabel2')].map((label) => (
              <a key={label} href="https://www.youtube.com/@khorshidcommunity" target="_blank" rel="noopener noreferrer" aria-label={`Watch ${label} on YouTube`} className="group relative rounded-2xl overflow-hidden border border-white/10 hover:border-accent/30 hover:shadow-2xl block transition-all duration-500 hover:-translate-y-1">
                <div className="aspect-video bg-white/5 backdrop-blur-sm flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-900/40 to-transparent" />
                  <div className="text-center text-white relative z-10">
                    <div className="w-20 h-20 bg-accent group-hover:bg-accent-hover rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110 shadow-[0_0_40px_rgba(251,191,36,0.35)]">
                      <svg className="w-8 h-8 text-brand-950 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                    <p className="font-display font-semibold text-lg">{label}</p>
                    <p className="text-brand-300 text-sm mt-1">{t('videoSoon')}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="flex items-center gap-0 mb-16">
            <span className="flex-1 h-px bg-white/8" />
            <span className="w-1.5 h-1.5 rounded-full bg-accent mx-3" />
            <span className="flex-1 h-px bg-white/8" />
          </div>

          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-3 text-accent/80 font-semibold uppercase text-[11px] tracking-[0.2em] mb-5">
              <span className="w-8 h-px bg-accent/50" />{t('shareOverline')}<span className="w-8 h-px bg-accent/50" />
            </span>
            <h3 className="font-display font-light text-3xl md:text-4xl text-white mb-3">
              {isFa
                ? <><span>{t('shareTitle').split('؟')[0]}</span><em className="italic text-accent-muted">؟</em></>
                : <>Have Photos from Our <em className="italic text-accent-muted">Events?</em></>
              }
            </h3>
            <p className="text-brand-300 text-sm max-w-xl mx-auto mb-8 leading-relaxed">{t('shareBody')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-shimmer inline-flex items-center justify-center gap-2 px-7 py-3 bg-accent hover:bg-accent-hover text-brand-950 font-semibold rounded-full transition-all text-sm">
                {t('shareBtn1')}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
              <button onClick={() => navigator.clipboard?.writeText('#KhorshidCommunity')} className="inline-flex items-center justify-center px-7 py-3 rounded-full border border-white/30 hover:border-white/60 hover:bg-white/10 font-semibold text-sm transition-all text-white" title="Copy hashtag to clipboard">
                {t('shareBtn2')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4" onClick={closeLightbox}>
          <div className="relative max-w-5xl w-full max-h-[90vh] bg-brand-950 rounded-2xl overflow-hidden border border-white/10" onClick={(e) => e.stopPropagation()}>
            <button onClick={closeLightbox} className="absolute top-4 right-4 z-10 w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all" aria-label="Close image">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="relative w-full h-[60vh] sm:h-[70vh]">
              <Image src={selectedImage.src} alt={selectedImage.title} fill className="object-contain" sizes="100vw" />
            </div>
            <div className="p-6 border-t border-white/10">
              <h3 className="font-display font-semibold text-xl text-white mb-1">{selectedImage.title}</h3>
              <p className="text-brand-300 text-sm">{selectedImage.description} · {selectedImage.date} · {selectedImage.location}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
