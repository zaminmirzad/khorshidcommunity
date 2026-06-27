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
    <div className="bg-gray-50 min-h-screen">
      <PageHero
        image="/images/gallery-hero.jpg"
        badge="Our Memories"
        title="Photo Gallery"
        subtitle="Capturing the vibrant spirit, culture, and unity of KhorshidCommunity"
      />

      <div className="container mx-auto px-4 sm:px-6 py-16 max-w-7xl">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-16">
          {[
            { number: '500+', label: 'Photos Captured', icon: '📸' },
            { number: '48+', label: 'Events Covered', icon: '🎉' },
            { number: '15', label: 'Years of Memories', icon: '📅' },
            { number: '1000+', label: 'Happy Faces', icon: '😊' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-xl transition-all">
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-2xl md:text-3xl font-bold text-yellow-600">{stat.number}</div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Category Filters */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-3">
            {GALLERY_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 text-sm sm:text-base ${
                  selectedCategory === category.id
                    ? 'bg-yellow-500 text-blue-900 shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-yellow-50 hover:shadow-md'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
                {selectedCategory === category.id && (
                  <span className="bg-blue-900/30 rounded-full w-5 h-5 flex items-center justify-center text-xs">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleImages.map((image) => (
            <div
              key={image.id}
              onClick={() => openLightbox(image)}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
            >
              <div className="relative h-64 sm:h-72 overflow-hidden">
                <Image
                  src={image.src}
                  alt={`${image.title} — ${image.date} at ${image.location}, Khorshid Community San Diego`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-white text-lg font-bold mb-1">{image.title}</h3>
                  <p className="text-yellow-300 text-sm">📍 {image.location} · 📅 {image.date}</p>
                </div>
                <div className="absolute top-4 left-4 bg-yellow-500/90 backdrop-blur-sm text-blue-900 px-3 py-1 rounded-full text-xs font-semibold">
                  {GALLERY_CATEGORIES.find((c) => c.id === image.category)?.name}
                </div>
                <div className="absolute top-4 right-4 bg-white/90 rounded-full w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-0 group-hover:scale-100">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredImages.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📸</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No photos yet</h3>
            <p className="text-gray-600">Check back soon for more memories from this category!</p>
          </div>
        )}

        {hasMore && (
          <div className="text-center mt-12">
            <button
              onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
              className="inline-flex items-center gap-2 px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-semibold rounded-xl transition-all shadow-lg"
            >
              Load More Memories
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}

        {/* Video Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <span className="text-yellow-600 font-semibold tracking-wide uppercase text-sm">Watch</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Event Highlights</h2>
            <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full mt-4" />
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {['Nowruz Festival 2024 Highlights', 'Community Volunteer Day'].map((label) => (
              <a
                key={label}
                href="https://www.youtube.com/@khorshidcommunity"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Watch ${label} on YouTube`}
                className="relative rounded-2xl overflow-hidden shadow-xl group block"
              >
                <div className="aspect-video bg-gradient-to-br from-blue-900 to-blue-950 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-blue-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <p className="font-semibold">{label}</p>
                    <p className="text-sm text-blue-200 mt-1">Coming soon on our YouTube channel</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Share CTA */}
        <div className="mt-20 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-10 sm:p-12 text-center">
          <div className="text-5xl mb-4">📤</div>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">Share Your Memories</h3>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Have photos from our events? We'd love to feature them in our gallery!
            Tag us on social media or send us your favorite moments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-semibold rounded-xl transition-all">
              Submit Your Photos
            </Link>
            <button
              onClick={() => navigator.clipboard?.writeText('#KhorshidCommunity')}
              className="px-6 py-3 bg-white hover:bg-gray-50 text-yellow-600 font-semibold rounded-xl transition-all border border-yellow-200"
              title="Copy hashtag to clipboard"
            >
              Use #KhorshidCommunity
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] bg-white rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all"
              aria-label="Close image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="relative w-full h-[60vh] sm:h-[70vh]">
              <Image src={selectedImage.src} alt={selectedImage.title} fill className="object-contain" sizes="100vw" />
            </div>
            <div className="p-6 bg-white">
              <h3 className="text-2xl font-bold text-gray-800 mb-1">{selectedImage.title}</h3>
              <p className="text-gray-600">{selectedImage.description} · {selectedImage.date} · {selectedImage.location}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
