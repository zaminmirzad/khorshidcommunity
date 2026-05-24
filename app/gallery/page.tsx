// app/gallery/page.tsx — Server Component (NO 'use client')
// metadata must live here, not in the client component

import Script from 'next/script';
import GalleryClient from './GalleryClient';

export const metadata = {
  title: "Photo Gallery | Khorshid Community San Diego — Persian & Hazara Events",
  description: "Browse photos from Khorshid Community events in San Diego — Nowruz festivals, Hazara Culture Day, volunteer days, workshops, and community celebrations.",
  alternates: {
    canonical: "https://khorshidcommunity.org/gallery",
  },
  openGraph: {
    title: "Photo Gallery | Khorshid Community San Diego",
    description: "Photos from Persian and Hazara cultural events in San Diego — Nowruz festivals, community gatherings, workshops and more.",
    url: "https://khorshidcommunity.org/gallery",
    images: [{ url: "/images/gallery-hero.jpg", width: 1200, height: 630, alt: "Khorshid Community photo gallery — Persian and Hazara events in San Diego" }],
  },
};

const imageListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ImageGallery",
  "name": "Khorshid Community San Diego — Event Photo Gallery",
  "description": "Photos from Persian and Hazara cultural events organized by Khorshid Community in San Diego.",
  "url": "https://khorshidcommunity.org/gallery",
  "author": { "@type": "Organization", "name": "Khorshid Community", "url": "https://khorshidcommunity.org" },
};

export default function GalleryPage() {
  return (
    <>
      <Script
        id="json-ld-gallery"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(imageListJsonLd) }}
      />
      <GalleryClient />
    </>
  );
}