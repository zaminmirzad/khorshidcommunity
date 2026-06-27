import type { GalleryImage, GalleryCategory } from '../types';

export const GALLERY_CATEGORIES: GalleryCategory[] = [
  { id: 'all', name: 'All Moments', icon: '📸' },
  { id: 'cultural', name: 'Cultural Festivals', icon: '🎭' },
  { id: 'events', name: 'Community Events', icon: '🎉' },
  { id: 'workshops', name: 'Workshops', icon: '📚' },
  { id: 'volunteers', name: 'Volunteers', icon: '🤝' },
  { id: 'celebrations', name: 'Celebrations', icon: '🎊' },
];

export const GALLERY_IMAGES: GalleryImage[] = [
  { id: 1, category: 'cultural', src: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=800&h=600&fit=crop', title: 'Nowruz Celebration 2024', description: 'Hundreds gathered to celebrate Persian New Year with traditional music and dance.', date: 'March 2024', location: 'Community Hall' },
  { id: 2, category: 'cultural', src: '/images/eid-celebration.jpg', title: 'Annual Unity Gala', description: 'Our biggest fundraising event of the year with live performances.', date: 'May 2024', location: 'Grand Ballroom' },
  { id: 3, category: 'cultural', src: '/images/eid-celebration1.jpg', title: 'Persian Calligraphy Exhibition', description: 'Master calligraphers showcased their beautiful artwork.', date: 'August 2024', location: 'Cultural Center' },
  { id: 4, category: 'cultural', src: 'https://images.unsplash.com/photo-1516575334481-f85287c2c82d?q=80&w=800&h=600&fit=crop', title: 'Poetry Night: Rumi & Hafez', description: 'An evening of classical Persian poetry and interpretations.', date: 'October 2024', location: 'Library Hall' },
  { id: 5, category: 'events', src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&h=600&fit=crop', title: 'Youth Leadership Summit', description: 'Empowering the next generation of community leaders.', date: 'June 2024', location: 'Conference Center' },
  { id: 6, category: 'events', src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&h=600&fit=crop', title: 'Family Picnic Day', description: 'Fun outdoor activities for all ages at Central Park.', date: 'July 2024', location: 'Central Park' },
  { id: 7, category: 'events', src: 'https://images.unsplash.com/photo-1551326844-4df70f78d0e9?q=80&w=800&h=600&fit=crop', title: 'Cooking Class: Persian Cuisine', description: 'Learning to cook authentic Ghormeh Sabzi and Tahdig.', date: 'September 2024', location: 'Kitchen Studio' },
  { id: 8, category: 'events', src: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=800&h=600&fit=crop', title: 'New Year Celebration', description: 'Welcoming the new year with family and friends.', date: 'January 2024', location: 'Community Hall' },
  { id: 9, category: 'workshops', src: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&h=600&fit=crop', title: 'Traditional Music Workshop', description: 'Learning to play the Santur and Tombak.', date: 'February 2024', location: 'Music Studio' },
  { id: 10, category: 'workshops', src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&h=600&fit=crop', title: 'Leadership Training', description: 'Developing skills for community leadership.', date: 'March 2024', location: 'Training Center' },
  { id: 11, category: 'workshops', src: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=800&h=600&fit=crop', title: 'Art & Culture Workshop', description: 'Children learning about Persian art and history.', date: 'April 2024', location: 'Art Studio' },
  { id: 12, category: 'workshops', src: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=800&h=600&fit=crop', title: 'Language Classes', description: 'Persian language lessons for all levels.', date: 'Ongoing', location: 'Classroom A' },
  { id: 13, category: 'volunteers', src: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=800&h=600&fit=crop', title: 'Volunteer Appreciation Day', description: 'Celebrating our dedicated volunteers.', date: 'December 2024', location: 'Community Center' },
  { id: 14, category: 'volunteers', src: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=800&h=600&fit=crop', title: 'Food Drive Team', description: 'Volunteers packing meals for families in need.', date: 'November 2024', location: 'Food Bank' },
  { id: 15, category: 'volunteers', src: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=800&h=600&fit=crop', title: 'Community Cleanup', description: 'Making our neighborhood beautiful together.', date: 'October 2024', location: 'Neighborhood' },
  { id: 16, category: 'celebrations', src: 'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?q=80&w=800&h=600&fit=crop', title: 'Wedding Celebration', description: 'Traditional Persian wedding ceremony.', date: 'August 2024', location: 'Wedding Hall' },
  { id: 17, category: 'celebrations', src: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=800&h=600&fit=crop', title: 'Birthday Party', description: "Celebrating community elders' birthdays.", date: 'September 2024', location: 'Community Hall' },
  { id: 18, category: 'celebrations', src: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&h=600&fit=crop', title: 'Graduation Ceremony', description: "Celebrating our students' achievements.", date: 'June 2024', location: 'Auditorium' },
];
