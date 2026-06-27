import type { Event } from '../types';

export const EVENTS: Event[] = [
  {
    id: 1,
    date: 'TBD',
    time: 'TBD',
    title: 'Hazara Culture Day 2025',
    location: 'Khorshid Community Hall',
    type: 'Cultural',
    image: '/images/hazara-culture-day.jpg',
    alt: 'Hazara Culture Day celebration featuring art, music and traditions at Khorshid Community San Diego',
    description: 'Celebrating the rich heritage, art, music, and traditions of the Hazara community. A day of cultural exchange, traditional food, music performances, and unity.',
    schemaDate: null,
  },
  {
    id: 2,
    date: 'TBD',
    time: 'TBD',
    title: 'Eid al-Fitr Celebration',
    location: 'Community Center',
    type: 'Religious',
    image: '/images/eid-celebration.jpg',
    alt: 'Eid al-Fitr celebration with prayers and festive meals at Khorshid Community San Diego',
    description: 'Join our community celebration for Eid al-Fitr with special prayers, festive meals, family activities, and gift exchange for children.',
    schemaDate: null,
  },
  {
    id: 3,
    date: 'TBD',
    time: 'TBD',
    title: 'Nowruz Celebration',
    location: 'Community Center',
    type: 'Cultural',
    image: '/images/nowruz-festival.jpg',
    alt: 'Nowruz Persian New Year celebration at Khorshid Community San Diego',
    description: 'Celebrating Nowruz with community gatherings, traditional Haft-Seen, music, food, and family.',
    schemaDate: null,
  },
  {
    id: 4,
    date: 'Weekly',
    time: '4:00 PM – 6:00 PM',
    title: 'Community Football Match',
    location: 'Central Park Field',
    type: 'Sports',
    image: '/images/football-match.jpg',
    alt: 'Weekly community football match open to all ages at Central Park Field San Diego',
    description: 'Join our weekly community football match! Open to all ages and skill levels. Great way to stay active, meet new people, and build team spirit.',
    schemaDate: null,
  },
];

export const FEATURED_EVENTS = EVENTS.slice(0, 3);
