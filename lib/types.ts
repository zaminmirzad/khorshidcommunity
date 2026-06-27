export interface NavLink {
  href: string;
  label: string;
}

export interface SocialLink {
  name: string;
  href: string;
  icon: string;
}

export interface Event {
  id: number;
  date: string;
  time: string;
  title: string;
  location: string;
  type: 'Cultural' | 'Religious' | 'Sports' | 'Educational';
  image: string;
  alt: string;
  description: string;
  schemaDate: string | null;
}

export interface TeamMember {
  name: string;
  role: string;
  src: string;
  alt: string;
  bio: string;
}

export interface GalleryImage {
  id: number;
  category: 'cultural' | 'events' | 'workshops' | 'volunteers' | 'celebrations';
  src: string;
  title: string;
  description: string;
  date: string;
  location: string;
}

export interface GalleryCategory {
  id: string;
  name: string;
  icon: string;
}
