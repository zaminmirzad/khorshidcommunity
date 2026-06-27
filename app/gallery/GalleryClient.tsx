'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PageHero from '@/app/components/PageHero';
import { GALLERY_IMAGES, GALLERY_CATEGORIES } from '@/lib/data/gallery';

const PAGE_SIZE = 9;

export default function GalleryClient() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<typeof GALLERY_IMAGES[0] | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filteredImages = selectedCategory === 'all'
    ? GALLERY_IMAGES
    : GALLERY_IMAGES.filter((img) => img.category === selectedCategory);

  const visibleImages = filteredImages.slice(0, visibleCount);
  const hasMore = visibleCount < filteredImages.length;

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setVisibleCount(PAGE_SIZE);
  };

  const openLightbox = (image: typeof GALLERY_IMAGES[0]) => {
    setSelectedImage(image);
    // iOS Safari requires position:fixed + width:100% to prevent background scroll
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

  return (
    <div className="bg-[#faf8f4] min-h-screen">
      <PageHero
        image="/images/gallery-hero.jpg"
        badge="Our Memories"
        title={<>Photo <em className="italic text-amber-300">Gallery</em></>}
        subtitle="Capturing the vibrant spirit, culture, and unity of KhorshidCommunity"
      />

      <div className="container mx-auto px-6 py-20 max-w-7xl">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {[
            { number: '500+', label: 'Photos Captured', icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )},
            { number: '48+', label: 'Events Covered', icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )},
            { number: '15', label: 'Years of Memories', icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )},
            { number: '1000+', label: 'Happy Faces', icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )},
          ].map((stat) => (
            <div key={stat.label} className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-amber-200 hover:shadow-xl transition-all duration-300 text-center">
              <div className="w-12 h-12 bg-blue-900 group-hover:bg-blue-800 rounded-xl flex items-center justify-center text-amber-400 mx-auto mb-4 transition-colors">
                {stat.icon}
              </div>
              <div className="font-display text-3xl font-light text-blue-900">{stat.number}</div>
              <div className="text-gray-400 text-xs font-semibold uppercase tracking-widest mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Category Filters */}
        <div className="mb-14">
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-3 text-amber-600 font-semibold uppercase text-[11px] tracking-[0.2em]">
              <span className="w-8 h-px bg-amber-400" />
              Browse by Category
              <span className="w-8 h-px bg-amber-400" />
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-2.5">
            {GALLERY_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-blue-900 text-amber-300 shadow-lg'
                    : 'bg-white text-gray-600 border border-gray-100 hover:border-amber-300 hover:text-amber-600'
                }`}
              >
                <span className="text-base">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        {filteredImages.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-display font-semibold text-2xl text-gray-800 mb-2">No photos yet</h3>
            <p className="text-gray-500">Check back soon for more memories from this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {visibleImages.map((image) => (
              <button
                key={image.id}
                onClick={() => openLightbox(image)}
                className="group relative overflow-hidden rounded-2xl border border-gray-100 hover:border-amber-200 hover:shadow-2xl transition-all duration-500 text-left w-full"
              >
                <div className="relative h-64 sm:h-72 overflow-hidden bg-gray-100">
                  <Image
                    src={image.src}
                    alt={`${image.title} — ${image.date} at ${image.location}, Khorshid Community San Diego`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-950/85 via-blue-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {/* Slide-up content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <h3 className="text-white font-display font-semibold text-lg leading-snug mb-1">{image.title}</h3>
                    <p className="text-amber-300 text-xs">{image.location} · {image.date}</p>
                  </div>
                  {/* Category badge */}
                  <div className="absolute top-4 left-4 bg-amber-400 text-blue-950 px-3 py-1 rounded-full font-semibold text-xs">
                    {GALLERY_CATEGORIES.find((c) => c.id === image.category)?.name}
                  </div>
                  {/* Zoom icon */}
                  <div className="absolute top-4 right-4 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
                    <svg className="w-4 h-4 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {hasMore && (
          <div className="text-center mt-12">
            <button
              onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
              className="btn-shimmer inline-flex items-center gap-2 px-8 py-3.5 bg-blue-900 hover:bg-blue-800 text-amber-300 font-semibold rounded-full transition-all duration-300 text-sm"
            >
              Load More Memories
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}

        {/* Video Section */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-3 text-amber-600 font-semibold uppercase text-[11px] tracking-[0.2em] mb-5">
              <span className="w-10 h-px bg-amber-400" />
              Watch
              <span className="w-10 h-px bg-amber-400" />
            </span>
            <h2 className="font-display font-light text-4xl md:text-5xl text-gray-900">
              Event <em className="italic text-blue-900">Highlights</em>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {['Nowruz Festival 2024 Highlights', 'Community Volunteer Day'].map((label) => (
              <a
                key={label}
                href="https://www.youtube.com/@khorshidcommunity"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Watch ${label} on YouTube`}
                className="group relative rounded-2xl overflow-hidden border border-gray-100 hover:border-amber-200 hover:shadow-xl block transition-all duration-500"
              >
                <div className="aspect-video bg-gradient-to-br from-blue-900 to-blue-950 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-18 h-18 w-20 h-20 bg-amber-400 group-hover:bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110 shadow-[0_0_30px_rgba(251,191,36,0.4)]">
                      <svg className="w-8 h-8 text-blue-950 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <p className="font-display font-semibold text-lg">{label}</p>
                    <p className="text-sm text-blue-300 mt-1">Coming soon on YouTube</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Share CTA */}
        <div className="mt-16 bg-gradient-to-br from-blue-950 to-[#0a1628] rounded-2xl p-10 sm:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 50% 100%, #fbbf24, transparent 60%)' }} />
          <div className="relative z-10">
            <span className="inline-flex items-center gap-3 text-amber-400/80 font-semibold uppercase text-[11px] tracking-[0.2em] mb-5">
              <span className="w-8 h-px bg-amber-400/50" />
              Share Your Moments
              <span className="w-8 h-px bg-amber-400/50" />
            </span>
            <h3 className="font-display font-light text-3xl md:text-4xl mb-3">
              Have Photos from Our <em className="italic text-amber-300">Events?</em>
            </h3>
            <p className="text-blue-300 text-sm max-w-xl mx-auto mb-8">
              We'd love to feature your memories in our gallery. Tag us on social media or send us your favorite moments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="btn-shimmer inline-flex items-center justify-center gap-2 px-7 py-3 bg-amber-400 hover:bg-amber-500 text-blue-950 font-semibold rounded-full transition-all text-sm"
              >
                Submit Your Photos
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <button
                onClick={() => navigator.clipboard?.writeText('#KhorshidCommunity')}
                className="inline-flex items-center justify-center px-7 py-3 rounded-full border border-white/30 hover:border-white/60 hover:bg-white/10 font-semibold text-sm transition-all"
                title="Copy hashtag to clipboard"
              >
                Copy #KhorshidCommunity
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Lightbox ── */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] bg-[#0f172a] rounded-2xl overflow-hidden border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all"
              aria-label="Close image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="relative w-full h-[60vh] sm:h-[70vh]">
              <Image src={selectedImage.src} alt={selectedImage.title} fill className="object-contain" sizes="100vw" />
            </div>
            <div className="p-6 border-t border-white/10">
              <h3 className="font-display font-semibold text-xl text-white mb-1">{selectedImage.title}</h3>
              <p className="text-blue-300 text-sm">{selectedImage.description} · {selectedImage.date} · {selectedImage.location}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
