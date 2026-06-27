import type { SocialLink } from './types';

export const SITE_CONFIG = {
  name: 'Khorshid Community',
  url: 'https://khorshidcommunity.org',
  phone: '+1 (619) 882-7406',
  email: 'info@khorshidcommunity.org',
  address: 'Sky Beach, San Diego, CA',
  foundingYear: 1998,
  officeHours: {
    weekdays: '10AM – 6PM',
    saturday: '11AM – 4PM',
    sunday: 'Closed (Events only)',
  },
} as const;

export const SOCIAL_LINKS: SocialLink[] = [
  { name: 'Instagram', href: 'https://www.instagram.com/khorshidcommunity', icon: '📷' },
  { name: 'Facebook', href: 'https://www.facebook.com/khorshidcommunity', icon: '📘' },
  { name: 'YouTube', href: 'https://www.youtube.com/@khorshidcommunity', icon: '▶️' },
  { name: 'Twitter', href: 'https://twitter.com/khorshidcommunity', icon: '🔗' },
];
