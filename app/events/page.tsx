// app/events/page.tsx
// FIXES APPLIED:
// [SEO] Added page-level metadata — was missing entirely
// [SEO] Event JSON-LD schema added for each event
// [SEO] Descriptive alt text on all event images
// [Bug] Raw <img> replaced with Next.js <Image>

import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';

// FIX (SEO): Page-level metadata
export const metadata = {
  title: "Events & Programs | Khorshid Community San Diego",
  description: "Upcoming Persian and Hazara cultural events in San Diego — Nowruz Festival 2026, Hazara Culture Day, Eid celebrations, community football, and more at Khorshid Community.",
  alternates: {
    canonical: "https://khorshidcommunity.org/events",
  },
  openGraph: {
    title: "Events & Programs | Khorshid Community San Diego",
    description: "Persian and Hazara cultural events in San Diego — Nowruz 2026, Hazara Culture Day, Eid celebrations, and weekly community programs.",
    url: "https://khorshidcommunity.org/events",
    images: [{ url: "/images/nowruz-festival.jpg", width: 1200, height: 630, alt: "Nowruz Persian New Year Festival 2026 at Khorshid Community San Diego" }],
  },
};

export default function EventsPage() {
  const events = [
    {
      id: 1,
      date: "TBD",
      time: "TBD",
      title: "Hazara Culture Day 2025",
      location: "Khorshid Community Hall",
      type: "Cultural",
      image: "/images/nowruz-festival.jpg",
      // FIX (SEO): Descriptive alt text
      alt: "Hazara Culture Day celebration featuring art, music and traditions at Khorshid Community San Diego",
      description: "Celebrating the rich heritage, art, music, and traditions of the Hazara community. A day of cultural exchange, traditional food, music performances, and unity.",
      schemaDate: null,
    },
/*     {
      id: 2,
      date: "March 20, 2026",
      time: "6:00 PM - 10:00 PM",
      title: "Nowruz Festiv 2025",
      location: "Khorshid Community Hall",
      type: "Cultural",
      image: "/images/nowruz-festival.jpg",
      alt: "Nowruz Persian New Year festival 2026 with Haft-Seen, music and dance at Khorshid Community Hall San Diego",
      description: "The largest Persian New Year celebration in the region with music, dance, traditional Haft-Seen table, and a festive dinner to welcome spring.",
      schemaDate: "2026-03-20T18:00",
    }, */
    {
      id: 3,
      date: "TBD",
      time: "TBD",
      title: "Eid al-Fitr Celebration",
      location: "Community Center",
      type: "Religious",
      image: "/images/eid-celebration.jpg",
      alt: "Eid al-Fitr celebration with prayers and festive meals at Khorshid Community San Diego",
      description: "Join our community celebration for Eid al-Fitr with special prayers, festive meals, family activities, and gift exchange for children.",
      schemaDate: null,
    },
    {
      id: 4,
      date: "TBD",
      time: "TBD",
      title: "Nowruz Celebration",
      location: "Community Center",
      type: "Religious",
      image: "/images/eid-celebration.jpg",
      alt: "Eid al-Adha celebration with community prayers and food distribution at Khorshid Community San Diego",
      description: "Commemorating Eid al-Adha with community prayers, food distribution, and family gathering to celebrate and share blessings.",
      schemaDate: null,
    },
    {
      id: 5,
      date: "Weekly",
      time: "4:00 PM - 6:00 PM",
      title: "Community Football Match",
      location: "Central Park Field",
      type: "Sports",
      image: "/images/football-match.jpg",
      alt: "Weekly community football match open to all ages at Central Park Field San Diego",
      description: "Join our weekly community football match! Open to all ages and skill levels. Great way to stay active, meet new people, and build team spirit.",
      schemaDate: null,
    },
  ];

  // FIX (SEO): Event schema for all events with known dates
  const eventsJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": events
      .filter(e => e.schemaDate)
      .map((event, i) => ({
        "@type": "Event",
        "position": i + 1,
        "name": event.title,
        "startDate": event.schemaDate,
        "location": {
          "@type": "Place",
          "name": event.location,
          "address": { "@type": "PostalAddress", "addressLocality": "San Diego", "addressRegion": "CA" }
        },
        "organizer": { "@type": "Organization", "name": "Khorshid Community", "url": "https://khorshidcommunity.org" },
        "description": event.description,
        "eventStatus": "https://schema.org/EventScheduled",
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "image": `https://khorshidcommunity.org${event.image}`,
      })),
  };

  return (
    <>
      <Script
        id="json-ld-events-page"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventsJsonLd) }}
      />

      <div className="bg-gray-50 min-h-screen py-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-yellow-600 font-semibold tracking-wide uppercase text-sm">Come Together</span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">Our Events & Programs</h1>
            <p className="text-gray-600 text-lg">From cultural festivals to sports activities — there's always something happening at KhorshidCommunity.</p>
          </div>

          {/* Event List */}
          <div className="space-y-10 max-w-5xl mx-auto">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row">
                {/* FIX (Bug): Next.js Image instead of raw <img> */}
                <div className="md:w-1/3 h-64 md:h-64 overflow-hidden bg-gradient-to-br from-blue-800 to-blue-900 flex-shrink-0 relative">
                  <Image
                    src={event.image}
                    alt={event.alt}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-6 md:w-2/3">
                  <div className="flex flex-wrap gap-2 items-center mb-3">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">{event.type}</span>
                    <span className="text-gray-500 text-sm flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {event.date} {event.time !== "TBD" && `at ${event.time}`}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{event.title}</h2>
                  <div className="flex items-center text-gray-500 text-sm mb-3">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {event.location}
                  </div>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <button className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-semibold rounded-lg transition-all">
                    {event.title === "Community Football Match" ? "Join Match →" : "RSVP & Details →"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Calendar Note */}
          <div className="text-center mt-16 p-6 bg-yellow-50 rounded-2xl max-w-3xl mx-auto">
            <p className="text-gray-700">📅 Want to host an event or suggest a program? <Link href="/contact" className="text-yellow-700 font-semibold underline">Contact our events team</Link></p>
          </div>
        </div>
      </div>
    </>
  );
}