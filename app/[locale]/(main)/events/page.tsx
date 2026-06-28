import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { getTranslations } from 'next-intl/server';
import PageHero from '@/app/components/PageHero';
import { EVENTS } from '@/lib/data/events';
import { SITE_CONFIG } from '@/lib/constants';

type Props = { params: Promise<{ locale: string }> };

const FA_TYPE_LABELS: Record<string, string> = {
  Festival: 'جشنواره',
  Workshop: 'کارگاه',
  Class: 'کلاس',
  Community: 'کمیونیتی',
  Sports: 'ورزشی',
  Sport: 'ورزشی',
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

export default async function EventsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('events');
  const isFa = locale === 'fa';

  return (
    <>
      <Script id="json-ld-events-page" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventsJsonLd) }} />

      <PageHero
        image="/images/nowruz-festival.jpg"
        badge={t('badge')}
        title={
          isFa
            ? <>{t('heroTitle').split(' ')[0]} <em className="italic text-accent-muted">{t('heroTitle').split(' ').slice(1).join(' ')}</em></>
            : <>Events & <em className="italic text-accent-muted">Programs</em></>
        }
        subtitle={t('heroSubtitle')}
      />

      <div className="bg-surface-alt min-h-screen">
        <div className="bg-surface border-b border-gray-100 py-10">
          <div className="container mx-auto px-6 text-center">
            <span className="inline-flex items-center gap-3 text-accent-dark font-semibold uppercase text-[11px] tracking-[0.2em]">
              <span className="w-10 h-px bg-accent" />{t('upcomingOverline')}<span className="w-10 h-px bg-accent" />
            </span>
            <p className="text-gray-500 mt-3 text-sm max-w-lg mx-auto">{t('upcomingBody')}</p>
          </div>
        </div>

        <div className="container mx-auto px-6 py-20">
          <div className="space-y-6 max-w-5xl mx-auto">
            {EVENTS.map((event, i) => {
              const typeLabel = isFa ? (FA_TYPE_LABELS[event.type] ?? event.type) : event.type;
              const rsvpLabel = event.type === 'Sports' ? t('joinMatch') : t('rsvpNow');
              return (
                <article key={event.id} className="group bg-surface rounded-2xl overflow-hidden border border-gray-100 hover:border-accent-light hover:shadow-2xl transition-all duration-500 flex flex-col md:flex-row">
                  <div className="md:w-2/5 h-60 md:h-auto relative shrink-0 overflow-hidden">
                    <Image
                      src={event.image}
                      alt={event.alt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 40vw"
                      priority={i === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-brand-950/20" />
                    <span className="absolute top-4 left-4 bg-accent text-brand-950 px-3 py-1 rounded-full font-semibold text-xs tracking-wide">{typeLabel}</span>
                  </div>
                  <div className="p-7 md:p-8 flex flex-col justify-center flex-1">
                    <div className="flex flex-wrap gap-4 items-center mb-4" dir="ltr">
                      <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {event.date}{event.time !== 'TBD' && ` · ${event.time}`}
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {event.location}
                      </div>
                    </div>
                    <h2 className="font-display font-semibold text-2xl md:text-3xl text-gray-900 mb-3 group-hover:text-brand-900 transition-colors">{event.title}</h2>
                    <div className="flex items-center gap-3 mb-4"><span className="w-8 h-px bg-accent" /></div>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6">{event.description}</p>
                    <div className="flex items-center gap-4">
                      <Link href="/contact" className="btn-shimmer inline-flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent-hover text-brand-950 font-semibold rounded-full transition-all duration-300 text-sm">
                        {rsvpLabel}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                      </Link>
                      <span className="text-gray-300 text-sm">{t('freeForMembers')}</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-20 max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-brand-900 via-brand-950 to-brand-950 rounded-2xl p-10 text-center text-white relative overflow-hidden">
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-72 h-36 rounded-full bg-accent/10 blur-[70px] pointer-events-none" />
              <div className="relative z-10">
                <span className="inline-flex items-center gap-3 text-accent/80 font-semibold uppercase text-[11px] tracking-[0.2em] mb-5">
                  <span className="w-8 h-px bg-accent/50" />{t('ideaOverline')}<span className="w-8 h-px bg-accent/50" />
                </span>
                <h3 className="font-display font-light text-3xl mb-3">
                  {isFa ? (
                    <><span>{t('ideaTitle').split('؟')[0]}</span><em className="italic text-accent-muted">؟</em></>
                  ) : (
                    <>Want to Host or Suggest a <em className="italic text-accent-muted">Program?</em></>
                  )}
                </h3>
                <p className="text-brand-300 text-sm mb-7 max-w-md mx-auto">{t('ideaBody')}</p>
                <Link href="/contact" className="btn-shimmer inline-flex items-center gap-2 px-7 py-3 bg-accent hover:bg-accent-hover text-brand-950 font-semibold rounded-full transition-all text-sm">
                  {t('ideaCta')}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
