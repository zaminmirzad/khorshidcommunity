import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import PageHero from '@/app/components/PageHero';
import { EVENTS } from '@/lib/data/events';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata = {
  title: 'Events & Programs | Khorshid Community San Diego',
  description: 'Upcoming Persian and Hazara cultural events in San Diego — Nowruz Festival, Hazara Culture Day, Eid celebrations, community football, and more at Khorshid Community.',
  alternates: { canonical: `${SITE_CONFIG.url}/events` },
  openGraph: {
    title: 'Events & Programs | Khorshid Community San Diego',
    description: 'Persian and Hazara cultural events in San Diego — Nowruz, Hazara Culture Day, Eid celebrations, and weekly community programs.',
    url: `${SITE_CONFIG.url}/events`,
    images: [{ url: '/images/nowruz-festival.jpg', width: 1200, height: 630, alt: 'Nowruz Persian New Year Festival at Khorshid Community San Diego' }],
  },
};

const eventsJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: EVENTS
    .filter((e) => e.schemaDate)
    .map((event, i) => ({
      '@type': 'Event',
      position: i + 1,
      name: event.title,
      startDate: event.schemaDate,
      location: {
        '@type': 'Place',
        name: event.location,
        address: { '@type': 'PostalAddress', addressLocality: 'San Diego', addressRegion: 'CA' },
      },
      organizer: { '@type': 'Organization', name: SITE_CONFIG.name, url: SITE_CONFIG.url },
      description: event.description,
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      image: `${SITE_CONFIG.url}${event.image}`,
    })),
};

export default function EventsPage() {
  return (
    <>
      <Script id="json-ld-events-page" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventsJsonLd) }} />

      <PageHero
        image="/images/nowruz-festival.jpg"
        badge="Come Together"
        title="Our Events & Programs"
        subtitle="From cultural festivals to sports activities — there's always something happening at KhorshidCommunity."
      />

      <div className="bg-gray-50 min-h-screen py-16">
        <div className="container mx-auto px-4 sm:px-6">

          <div className="space-y-8 max-w-5xl mx-auto">
            {EVENTS.map((event) => (
              <div key={event.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row">
                <div className="md:w-1/3 h-56 md:h-auto overflow-hidden bg-gradient-to-br from-blue-800 to-blue-900 shrink-0 relative">
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
                    <span className="text-gray-500 text-sm flex items-center gap-1">
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {event.date}{event.time !== 'TBD' && ` at ${event.time}`}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{event.title}</h2>
                  <div className="flex items-center text-gray-500 text-sm mb-3 gap-1">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {event.location}
                  </div>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <Link href="/contact" className="inline-block px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-semibold rounded-lg transition-all text-sm">
                    {event.type === 'Sports' ? 'Join Match →' : 'RSVP & Details →'}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16 p-6 bg-yellow-50 rounded-2xl max-w-3xl mx-auto">
            <p className="text-gray-700">
              📅 Want to host an event or suggest a program?{' '}
              <Link href="/contact" className="text-yellow-700 font-semibold underline">Contact our events team</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
