import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { getTranslations } from 'next-intl/server';
import { FEATURED_EVENTS } from '@/lib/data/events';
import { SITE_CONFIG } from '@/lib/constants';

type Props = { params: Promise<{ locale: string }> };

const EN_PROGRAMS = [
  { icon: '🎭', title: 'Cultural Festivals', desc: 'Annual Nowruz celebrations, Mehregan festivals, traditional music concerts, and dance workshops that bring our heritage to life.' },
  { icon: '📚', title: 'Educational Programs', desc: 'Persian language classes for all levels, heritage storytelling sessions, history workshops, and children\'s cultural education.' },
  { icon: '🤝', title: 'Community Support', desc: 'Elderly assistance programs, food drives, crisis relief, newcomer settlement support, and family counseling services.' },
  { icon: '🌱', title: 'Youth Leadership', desc: 'Empowering next-gen leaders through mentorship programs, civic engagement workshops, and career development initiatives.' },
  { icon: '🎨', title: 'Arts & Expression', desc: 'Calligraphy workshops, Persian miniature painting, poetry nights celebrating Rumi & Hafez, and traditional music classes.' },
  { icon: '🏆', title: 'Sports & Wellness', desc: 'Community sports leagues, yoga sessions, hiking clubs, and health awareness programs for all ages.' },
];

const FA_PROGRAMS = [
  { icon: '🎭', title: 'جشنواره‌های فرهنگی', desc: 'جشن‌های سالانه نوروز، جشن‌های مهرگان، کنسرت‌های موسیقی سنتی و کارگاه‌های رقص که میراث ما را زنده می‌کند.' },
  { icon: '📚', title: 'برنامه‌های آموزشی', desc: 'کلاس‌های زبان فارسی برای همه سطوح، جلسات داستان‌گویی میراثی، کارگاه‌های تاریخ و آموزش فرهنگی کودکان.' },
  { icon: '🤝', title: 'حمایت از کمیونیتی', desc: 'برنامه‌های کمک به سالمندان، کمپین‌های غذایی، کمک در بحران، حمایت از تازه‌واردان و خدمات مشاوره خانوادگی.' },
  { icon: '🌱', title: 'رهبری جوانان', desc: 'توانمندسازی رهبران نسل بعدی از طریق برنامه‌های مربیگری، کارگاه‌های مشارکت مدنی و ابتکارات توسعه شغلی.' },
  { icon: '🎨', title: 'هنر و بیان', desc: 'کارگاه‌های خوشنویسی، نقاشی مینیاتور فارسی، شب‌های شعر با رومی و حافظ، و کلاس‌های موسیقی سنتی.' },
  { icon: '🏆', title: 'ورزش و سلامت', desc: 'لیگ‌های ورزشی کمیونیتی، جلسات یوگا، باشگاه‌های پیاده‌روی و برنامه‌های آگاهی بهداشتی برای همه سنین.' },
];

const EN_STATS = [
  { number: '1,200+', label: 'Active Members', icon: '👥' },
  { number: '40+', label: 'Monthly Programs', icon: '📅' },
  { number: '15', label: 'Partner Orgs', icon: '🤝' },
  { number: '$250K+', label: 'Community Support', icon: '💝' },
];

const FA_STATS = [
  { number: '۱٬۲۰۰+', label: 'اعضای فعال', icon: '👥' },
  { number: '۴۰+', label: 'برنامه ماهانه', icon: '📅' },
  { number: '۱۵', label: 'سازمان شریک', icon: '🤝' },
  { number: '$۲۵۰K+', label: 'حمایت اجتماعی', icon: '💝' },
];

const EN_TESTIMONIALS = [
  { quote: "KhorshidCommunity feels like home. Through their events, my children learned about our heritage in ways I couldn't teach alone. The community support is unmatched.", name: 'Maryam K.', role: 'Member since 2015' },
  { quote: 'This organization transformed my connection to our culture. From language classes to celebrations, every experience has been authentic and heartwarming.', name: 'Reza S.', role: 'Volunteer Leader' },
];

const FA_TESTIMONIALS = [
  { quote: 'کمیونیتی خورشید برای من مثل خانه است. از طریق رویدادهای آنها، فرزندانم میراث ما را به روش‌هایی یاد گرفتند که من به تنهایی نمی‌توانستم آموزش دهم.', name: 'مریم ک.', role: 'عضو از سال ۲۰۱۵' },
  { quote: 'این سازمان ارتباط من با فرهنگمان را متحول کرد. از کلاس‌های زبان تا جشن‌ها، هر تجربه‌ای اصیل و دلگرم‌کننده بوده است.', name: 'رضا ص.', role: 'رهبر داوطلب' },
];

const EN_NEWS = [
  { date: 'Jan 15, 2025', title: 'New Youth Mentorship Program Launches', desc: 'Empowering young adults with career guidance and cultural education.', category: 'Announcement' },
  { date: 'Jan 10, 2025', title: 'Nowruz Festival Seeks Volunteers', desc: 'Join our team to help organize the biggest Persian New Year celebration.', category: 'Volunteer' },
  { date: 'Jan 5, 2025', title: 'Community Food Drive Success', desc: 'Over 500 families received support during winter holidays.', category: 'Impact' },
];

const FA_NEWS = [
  { date: '۱۵ ژانویه ۲۰۲۵', title: 'راه‌اندازی برنامه جدید مربیگری جوانان', desc: 'توانمندسازی جوانان با راهنمایی شغلی و آموزش فرهنگی.', category: 'اطلاعیه' },
  { date: '۱۰ ژانویه ۲۰۲۵', title: 'جشنواره نوروز به دنبال داوطلب است', desc: 'به تیم ما بپیوندید تا در برگزاری بزرگترین جشن سال نو فارسی کمک کنید.', category: 'داوطلبی' },
  { date: '۵ ژانویه ۲۰۲۵', title: 'موفقیت کمپین غذایی کمیونیتی', desc: 'بیش از ۵۰۰ خانواده در تعطیلات زمستانی حمایت دریافت کردند.', category: 'تأثیر' },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'NonProfit'],
  name: SITE_CONFIG.name,
  alternateName: 'Khorshid Community San Diego',
  url: SITE_CONFIG.url,
  logo: `${SITE_CONFIG.url}/logo.png`,
  sameAs: ['https://www.instagram.com/khorshidcommunity', 'https://www.facebook.com/khorshidcommunity'],
  address: { '@type': 'PostalAddress', addressLocality: 'San Diego', addressRegion: 'CA', addressCountry: 'US' },
  nonprofitStatus: 'Nonprofit501c3',
  description: 'Persian and Hazara cultural community center in San Diego offering events, language classes, and support services.',
  foundingDate: String(SITE_CONFIG.foundingYear),
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('home');
  const isFa = locale === 'fa';

  const programs = isFa ? FA_PROGRAMS : EN_PROGRAMS;
  const stats = isFa ? FA_STATS : EN_STATS;
  const testimonials = isFa ? FA_TESTIMONIALS : EN_TESTIMONIALS;
  const news = isFa ? FA_NEWS : EN_NEWS;
  const heroStats = t.raw('heroStats') as Array<{ value: string; label: string }>;

  return (
    <>
      <Script id="json-ld-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/images/hero-section.jpg')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-950/80 via-brand-950/75 to-brand-950/95" />
        </div>

        <div className="absolute left-6 sm:left-10 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-3 z-20">
          <span className="w-px h-20 bg-white/20" />
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          <span className="w-px h-20 bg-white/20" />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 py-20 lg:py-32 text-center text-white" dir="ltr">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 mb-8 text-xs font-semibold tracking-[0.15em] uppercase bg-white/10 backdrop-blur-md rounded-full border border-white/15">
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
            {t('badge')}
          </div>

          <h1 className="mb-6 tracking-tight">
            <span className="block font-display font-light italic text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-accent-muted leading-none mb-1">
              Khorshid
            </span>
            <span className="block font-display font-semibold text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white leading-none">
              Community
            </span>
          </h1>

          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="w-16 sm:w-24 h-px bg-accent/50" />
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="w-16 sm:w-24 h-px bg-accent/50" />
          </div>

          <p className={`font-display font-light italic text-xl sm:text-2xl md:text-3xl text-brand-100 max-w-3xl mx-auto mb-4 leading-relaxed${isFa ? ' font-persian' : ''}`}>
            {t('heroSubtitle')}
          </p>
          <p className="font-sans text-sm sm:text-base text-brand-300 max-w-xl mx-auto mb-10">
            {t('heroBody')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/events"
              className="btn-shimmer group inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold text-brand-950 bg-accent hover:bg-accent-hover rounded-full transition-all duration-300 shadow-[0_0_30px_rgba(251,191,36,0.3)] hover:shadow-[0_0_40px_rgba(251,191,36,0.5)]"
            >
              {t('heroCta1')}
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link href="/about" className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-semibold text-white rounded-full border border-white/30 hover:border-white/60 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
              {t('heroCta2')}
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 mt-16 pt-10 border-t border-white/10">
            {heroStats.map((s, i) => (
              <div key={s.label} className="flex items-center gap-8 sm:gap-12">
                {i > 0 && <span className="w-px h-8 bg-white/20 hidden sm:block" />}
                <div className="text-center">
                  <div className="font-display text-3xl sm:text-4xl font-light text-accent-muted">{s.value}</div>
                  <div className="text-xs text-brand-300 tracking-widest uppercase mt-1">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 opacity-60">
          <span className="text-white text-[10px] tracking-[0.2em] uppercase">Scroll</span>
          <span className="w-px h-8 bg-white/50" />
        </div>
      </section>

      {/* ── Mission ──────────────────────────────────────────────────────── */}
      <section className="py-24 bg-surface-alt">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <span className="inline-flex items-center gap-3 text-accent-dark font-semibold uppercase text-[11px] tracking-[0.2em] mb-6">
            <span className="w-10 h-px bg-accent" />{t('missionOverline')}<span className="w-10 h-px bg-accent" />
          </span>
          <h2 className="font-display font-light text-4xl md:text-5xl text-gray-900 mb-6 leading-tight">
            {t('missionTitle')}
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">{t('missionBody')}</p>
        </div>
      </section>

      {/* ── Programs ─────────────────────────────────────────────────────── */}
      <section className="py-28 bg-surface">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-3 text-accent-dark font-semibold uppercase text-[11px] tracking-[0.2em] mb-5">
              <span className="w-10 h-px bg-accent" />{t('programsOverline')}<span className="w-10 h-px bg-accent" />
            </span>
            <h2 className="font-display font-light text-4xl md:text-5xl text-gray-900 leading-tight">
              {t('programsTitle')}
            </h2>
            <p className="text-gray-400 mt-4 text-base">{t('programsSubtitle')}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((item) => (
              <div key={item.title} className="group bg-surface rounded-2xl p-8 border border-gray-100 hover:border-accent-light hover:shadow-2xl transition-all duration-500 hover:-translate-y-1.5">
                <div className="w-14 h-14 bg-brand-50 group-hover:bg-accent-light rounded-2xl flex items-center justify-center text-3xl mb-6 transition-colors duration-300">
                  {item.icon}
                </div>
                <h3 className="font-display font-semibold text-xl text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                <div className="mt-6 pt-5 border-t border-gray-100 flex items-center gap-1.5 text-accent-dark text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>{t('programsLearnMore')}</span>
                  <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Upcoming Events ──────────────────────────────────────────────── */}
      <section className="py-28 relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-brand-950">
        <div className="absolute -top-48 -right-48 w-[700px] h-[700px] rounded-full bg-accent/6 blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-48 -left-48 w-[600px] h-[600px] rounded-full bg-brand-400/10 blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-3 text-accent/80 font-semibold uppercase text-[11px] tracking-[0.2em] mb-5">
              <span className="w-10 h-px bg-accent/50" />{t('eventsOverline')}<span className="w-10 h-px bg-accent/50" />
            </span>
            <h2 className="font-display font-light text-4xl md:text-5xl text-white">
              {isFa ? 'رویدادهای' : 'Upcoming'}{' '}
              <em className="italic text-accent-muted">{isFa ? 'پیش رو' : 'Events'}</em>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto" dir="ltr">
            {FEATURED_EVENTS.map((event) => (
              <div key={event.id} className="group bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-accent/40 hover:bg-white/10 transition-all duration-500 hover:-translate-y-1">
                <div className="relative h-52 overflow-hidden">
                  <Image src={event.image} alt={event.alt} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 33vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 to-transparent" />
                  <span className="absolute top-4 left-4 bg-accent text-brand-950 px-3 py-1 rounded-full font-semibold text-xs tracking-wide">{event.date}</span>
                </div>
                <div className="p-6">
                  <h3 className="font-display font-semibold text-xl text-white mb-2">{event.title}</h3>
                  <p className="text-brand-300 text-sm mb-4 leading-relaxed">{event.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-brand-400 text-xs flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {event.location}
                    </span>
                    <Link href="/events" className="text-accent hover:text-accent-hover text-sm font-semibold transition-colors">{t('eventsDetails')}</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/events" className="btn-shimmer inline-flex items-center gap-2 px-8 py-3.5 bg-accent hover:bg-accent-hover text-brand-950 font-semibold rounded-full transition-all duration-300 text-sm">
              {t('eventsViewAll')}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Impact Stats ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-surface-alt dot-grid">
        <div className="container mx-auto px-6 relative">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-3 text-accent-dark font-semibold uppercase text-[11px] tracking-[0.2em] mb-5">
              <span className="w-10 h-px bg-accent" />{t('impactOverline')}<span className="w-10 h-px bg-accent" />
            </span>
            <h2 className="font-display font-light text-4xl md:text-5xl text-gray-900">
              {isFa ? 'تفاوت‌آفرینی در' : 'Making a'}{' '}
              <em className="italic text-brand-900">{isFa ? 'هر روز' : 'Difference'}</em>
              {!isFa && ' Daily'}
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="group bg-surface rounded-2xl p-6 sm:p-8 text-center shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-accent-light">
                <div className="text-4xl mb-4">{stat.icon}</div>
                <div className="font-display text-3xl sm:text-4xl font-light text-brand-900 mb-1">{stat.number}</div>
                <div className="text-gray-400 text-xs font-semibold uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section className="py-28 relative overflow-hidden bg-gradient-to-b from-brand-900 via-brand-950 to-brand-950">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[350px] rounded-full bg-accent/5 blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-40 right-0 w-[500px] h-[500px] rounded-full bg-brand-400/10 blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-6 max-w-5xl relative z-10">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-3 text-accent/80 font-semibold uppercase text-[11px] tracking-[0.2em] mb-5">
              <span className="w-10 h-px bg-accent/50" />{t('testimonialsOverline')}<span className="w-10 h-px bg-accent/50" />
            </span>
            <h2 className="font-display font-light text-4xl md:text-5xl text-white">
              {isFa ? 'نظر' : 'What'}{' '}
              <em className="italic text-accent-muted">{isFa ? 'اعضا' : 'Members'}</em>
              {!isFa && ' Say'}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((item) => (
              <div key={item.name} className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-accent/30 transition-all duration-300">
                <div className="font-display text-7xl text-accent/30 leading-none mb-4 group-hover:text-accent/50 transition-colors">"</div>
                <p className="font-display font-light italic text-lg text-brand-100 leading-relaxed mb-8">{item.quote}</p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <div className="w-8 h-px bg-accent" />
                  <div>
                    <div className="font-semibold text-white text-sm">{item.name}</div>
                    <div className="text-accent/70 text-xs">{item.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Latest News ──────────────────────────────────────────────────── */}
      <section className="py-28 bg-surface">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-3 text-accent-dark font-semibold uppercase text-[11px] tracking-[0.2em] mb-5">
              <span className="w-10 h-px bg-accent" />{t('newsOverline')}<span className="w-10 h-px bg-accent" />
            </span>
            <h2 className="font-display font-light text-4xl md:text-5xl text-gray-900">
              {isFa ? 'آخرین' : 'Latest'}{' '}
              <em className="italic text-brand-900">{isFa ? 'اخبار' : 'Updates'}</em>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {news.map((item) => (
              <article key={item.title} className="group border-t-2 border-gray-100 hover:border-accent pt-6 transition-colors duration-300">
                <span className="inline-block px-3 py-1 bg-brand-50 text-brand-700 text-xs font-semibold rounded-full mb-3">{item.category}</span>
                <div className="text-gray-400 text-xs mb-3 tracking-wide">{item.date}</div>
                <h3 className="font-display font-semibold text-xl text-gray-900 mb-3 group-hover:text-brand-900 transition-colors leading-snug">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                <span className="inline-flex items-center gap-1 mt-4 text-accent-dark text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">{t('newsReadMore')}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Floating CTA ─────────────────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link href="/contact" className="btn-shimmer flex items-center gap-2 bg-accent hover:bg-accent-hover text-brand-950 px-5 py-3 rounded-full shadow-[0_8px_30px_rgba(251,191,36,0.4)] hover:shadow-[0_8px_30px_rgba(251,191,36,0.6)] transition-all duration-300 font-semibold text-sm">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {t('floatingCta')}
        </Link>
      </div>
    </>
  );
}
