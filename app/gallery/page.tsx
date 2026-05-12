// app/gallery/page.tsx - Modern Professional Gallery with Categories & Lightbox
'use client';
import { useState } from 'react';
import Image from 'next/image';

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<{ src: string; title: string; description: string } | null>(null);

  const categories = [
    { id: 'all', name: 'All Moments', icon: '📸' },
    { id: 'cultural', name: 'Cultural Festivals', icon: '🎭' },
    { id: 'events', name: 'Community Events', icon: '🎉' },
    { id: 'workshops', name: 'Workshops', icon: '📚' },
    { id: 'volunteers', name: 'Volunteers', icon: '🤝' },
    { id: 'celebrations', name: 'Celebrations', icon: '🎊' },
  ];

  const galleryImages = [
    // Cultural Festivals
    { id: 1, category: 'cultural', src: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=800&h=600&fit=crop', title: 'Nowruz Celebration 2024', description: 'Hundreds gathered to celebrate Persian New Year with traditional music and dance.', date: 'March 2024', location: 'Community Hall' },
    { id: 2, category: 'cultural', src: 'https://images.unsplash.com/photo-1511795409674-ef06e2d3b66c?q=80&w=800&h=600&fit=crop', title: 'Annual Unity Gala', description: 'Our biggest fundraising event of the year with live performances.', date: 'May 2024', location: 'Grand Ballroom' },
    { id: 3, category: 'cultural', src: 'https://images.unsplash.com/photo-1544717305-38c6e4b7ee20?q=80&w=800&h=600&fit=crop', title: 'Persian Calligraphy Exhibition', description: 'Master calligraphers showcased their beautiful artwork.', date: 'August 2024', location: 'Cultural Center' },
    { id: 4, category: 'cultural', src: 'https://images.unsplash.com/photo-1516575334481-f85287c2c82d?q=80&w=800&h=600&fit=crop', title: 'Poetry Night: Rumi & Hafez', description: 'An evening of classical Persian poetry and interpretations.', date: 'October 2024', location: 'Library Hall' },
    
    // Community Events
    { id: 5, category: 'events', src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&h=600&fit=crop', title: 'Youth Leadership Summit', description: 'Empowering the next generation of community leaders.', date: 'June 2024', location: 'Conference Center' },
    { id: 6, category: 'events', src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&h=600&fit=crop', title: 'Family Picnic Day', description: 'Fun outdoor activities for all ages at Central Park.', date: 'July 2024', location: 'Central Park' },
    { id: 7, category: 'events', src: 'https://images.unsplash.com/photo-1551326844-4df70f78d0e9?q=80&w=800&h=600&fit=crop', title: 'Cooking Class: Persian Cuisine', description: 'Learning to cook authentic Ghormeh Sabzi and Tahdig.', date: 'September 2024', location: 'Kitchen Studio' },
    { id: 8, category: 'events', src: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=800&h=600&fit=crop', title: 'New Year Celebration', description: 'Welcoming the new year with family and friends.', date: 'January 2024', location: 'Community Hall' },
    
    // Workshops
    { id: 9, category: 'workshops', src: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&h=600&fit=crop', title: 'Traditional Music Workshop', description: 'Learning to play the Santur and Tombak.', date: 'February 2024', location: 'Music Studio' },
    { id: 10, category: 'workshops', src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&h=600&fit=crop', title: 'Leadership Training', description: 'Developing skills for community leadership.', date: 'March 2024', location: 'Training Center' },
    { id: 11, category: 'workshops', src: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=800&h=600&fit=crop', title: 'Art & Culture Workshop', description: 'Children learning about Persian art and history.', date: 'April 2024', location: 'Art Studio' },
    { id: 12, category: 'workshops', src: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=800&h=600&fit=crop', title: 'Language Classes', description: 'Persian language lessons for all levels.', date: 'Ongoing', location: 'Classroom A' },
    
    // Volunteers
    { id: 13, category: 'volunteers', src: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=800&h=600&fit=crop', title: 'Volunteer Appreciation Day', description: 'Celebrating our dedicated volunteers.', date: 'December 2024', location: 'Community Center' },
    { id: 14, category: 'volunteers', src: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=800&h=600&fit=crop', title: 'Food Drive Team', description: 'Volunteers packing meals for families in need.', date: 'November 2024', location: 'Food Bank' },
    { id: 15, category: 'volunteers', src: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=800&h=600&fit=crop', title: 'Community Cleanup', description: 'Making our neighborhood beautiful together.', date: 'October 2024', location: 'Neighborhood' },
    
    // Celebrations
    { id: 16, category: 'celebrations', src: 'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?q=80&w=800&h=600&fit=crop', title: 'Wedding Celebration', description: 'Traditional Persian wedding ceremony.', date: 'August 2024', location: 'Wedding Hall' },
    { id: 17, category: 'celebrations', src: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=800&h=600&fit=crop', title: 'Birthday Party', description: 'Celebrating community elders\' birthdays.', date: 'September 2024', location: 'Community Hall' },
    { id: 18, category: 'celebrations', src: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&h=600&fit=crop', title: 'Graduation Ceremony', description: 'Celebrating our students\' achievements.', date: 'June 2024', location: 'Auditorium' },
  ];

  const filteredImages = selectedCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  const openLightbox = (image: typeof galleryImages[0]) => {
    setSelectedImage({
      src: image.src,
      title: image.title,
      description: `${image.description} • ${image.date} • ${image.location}`
    });
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[40vh] min-h-[350px] bg-gradient-to-r from-amber-900 via-orange-800 to-amber-900 flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511795409674-ef06e2d3b66c?q=80&w=2070')] bg-cover bg-center mix-blend-overlay" />
        <div className="relative z-10 text-center px-6">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold bg-white/20 backdrop-blur-sm rounded-full">Our Memories</span>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Photo Gallery</h1>
          <p className="text-xl max-w-2xl mx-auto text-amber-100">Capturing the vibrant spirit, culture, and unity of KhorshidCommunity</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 max-w-7xl">
        
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { number: "500+", label: "Photos Captured", icon: "📸" },
            { number: "48+", label: "Events Covered", icon: "🎉" },
            { number: "15", label: "Years of Memories", icon: "📅" },
            { number: "1000+", label: "Happy Faces", icon: "😊" },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-xl transition-all">
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-2xl md:text-3xl font-bold text-amber-600">{stat.number}</div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Category Filters */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                  selectedCategory === category.id
                    ? 'bg-amber-600 text-white shadow-lg transform scale-105'
                    : 'bg-white text-gray-700 hover:bg-amber-50 hover:shadow-md'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
                {selectedCategory === category.id && (
                  <span className="bg-white/30 rounded-full w-5 h-5 flex items-center justify-center text-xs">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              onClick={() => openLightbox(image)}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="relative h-72 overflow-hidden">
                <img
                  src={image.src}
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-white text-xl font-bold mb-1">{image.title}</h3>
                  <p className="text-amber-200 text-sm flex items-center gap-2">
                    <span>📍 {image.location}</span>
                    <span>•</span>
                    <span>📅 {image.date}</span>
                  </p>
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4 bg-amber-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold">
                  {categories.find(c => c.id === image.category)?.name}
                </div>

                {/* Zoom Icon */}
                <div className="absolute top-4 right-4 bg-white/90 rounded-full w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredImages.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📸</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No photos yet</h3>
            <p className="text-gray-600">Check back soon for more memories from this category!</p>
          </div>
        )}

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center gap-2 px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-all shadow-lg">
            Load More Memories
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Video Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <span className="text-amber-600 font-semibold tracking-wide uppercase text-sm">Watch</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Event Highlights</h2>
            <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full mt-4"></div>
            <p className="text-gray-600 mt-4">Relive our most memorable moments through video</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative rounded-2xl overflow-hidden shadow-xl group">
              <div className="aspect-video bg-gray-900 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-20 h-20 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform cursor-pointer">
                    <div className="w-0 h-0 border-t-8 border-t-transparent border-l-14 border-l-white border-b-8 border-b-transparent ml-1"></div>
                  </div>
                  <p className="font-semibold">Nowruz Festival 2024 Highlights</p>
                  <p className="text-sm text-gray-300">Watch the celebration</p>
                </div>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-xl group">
              <div className="aspect-video bg-gray-800 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-20 h-20 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform cursor-pointer">
                    <div className="w-0 h-0 border-t-8 border-t-transparent border-l-14 border-l-white border-b-8 border-b-transparent ml-1"></div>
                  </div>
                  <p className="font-semibold">Community Volunteer Day</p>
                  <p className="text-sm text-gray-300">Making a difference together</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Share Your Photos CTA */}
        <div className="mt-20 bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-12 text-center">
          <div className="text-5xl mb-4">📤</div>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">Share Your Memories</h3>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Have photos from our events? We'd love to feature them in our gallery! 
            Tag us on social media or send us your favorite moments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-all">
              Upload Your Photos
            </button>
            <button className="px-6 py-3 bg-white hover:bg-gray-50 text-amber-600 font-semibold rounded-xl transition-all border border-amber-200">
              Use #KhorshidCommunity
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div 
            className="relative max-w-5xl w-full max-h-[90vh] bg-white rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image */}
            <img 
              src={selectedImage.src} 
              alt={selectedImage.title}
              className="w-full h-auto max-h-[70vh] object-contain"
            />

            {/* Caption */}
            <div className="p-6 bg-white">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{selectedImage.title}</h3>
              <p className="text-gray-600">{selectedImage.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}