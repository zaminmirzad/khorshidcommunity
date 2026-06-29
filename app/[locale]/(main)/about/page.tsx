import Link from 'next/link';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import PageHero from '@/app/components/PageHero';
import { PRESIDENT, TEAM_MEMBERS } from '@/lib/data/team';
import { SITE_CONFIG } from '@/lib/constants';
import { createClient } from '@/lib/supabase/server';

type Props = { params: Promise<{ locale: string }> };

const EN_CORE_VALUES = [
  { icon: '🤝', title: 'Inclusivity', desc: 'Everyone is welcome regardless of background, religion, or generation. We celebrate diversity and create safe spaces for all voices.' },
  { icon: '🎭', title: 'Cultural Pride', desc: 'We honor our heritage with joy and authenticity, preserving traditions while embracing evolution and growth.' },
  { icon: '💪', title: 'Mutual Support', desc: 'We lift each other through challenges and celebrate successes together, embodying true community spirit.' },
  { icon: '📚', title: 'Education First', desc: 'Knowledge is power. We invest in learning opportunities for all ages — from language classes to leadership training.' },
  { icon: '🌟', title: 'Excellence', desc: 'We strive for the highest quality in every program, event, and service we offer to our community.' },
  { icon: '🌱', title: 'Sustainability', desc: 'Building lasting impact through responsible practices and empowering future generations to carry our mission forward.' },
];

const FA_CORE_VALUES = [
  { icon: '🤝', title: 'فراگیری', desc: 'همه صرف نظر از پیشینه، دین یا نسل خوش‌آمد هستند. ما تنوع را جشن می‌گیریم و فضاهای امنی برای همه صداها ایجاد می‌کنیم.' },
  { icon: '🎭', title: 'افتخار فرهنگی', desc: 'ما میراث خود را با شادی و اصالت گرامی می‌داریم، سنت‌ها را حفظ می‌کنیم و در عین حال تکامل و رشد را می‌پذیریم.' },
  { icon: '💪', title: 'حمایت متقابل', desc: 'در مشکلات از هم حمایت می‌کنیم و موفقیت‌ها را با هم جشن می‌گیریم، تجسم روح واقعی کمیونیتی.' },
  { icon: '📚', title: 'آموزش در اولویت', desc: 'دانش قدرت است. ما در فرصت‌های یادگیری برای همه سنین سرمایه‌گذاری می‌کنیم — از کلاس‌های زبان تا آموزش رهبری.' },
  { icon: '🌟', title: 'تعالی', desc: 'برای بالاترین کیفیت در هر برنامه، رویداد و خدماتی که به کمیونیتی خود ارائه می‌دهیم تلاش می‌کنیم.' },
  { icon: '🌱', title: 'پایداری', desc: 'ایجاد تأثیر ماندگار از طریق روش‌های مسئولانه و توانمندسازی نسل‌های آینده برای پیشبرد مأموریت ما.' },
];

const EN_MILESTONES = [
  { year: '1998', title: 'Foundation', desc: 'KhorshidCommunity founded by passionate community volunteers' },
  { year: '2015', title: 'Community Center Opens', desc: 'First dedicated space for events and programs' },
  { year: '2019', title: 'Youth Leadership Program', desc: 'Launch of mentorship initiatives' },
  { year: '2021', title: '20th Anniversary Gala', desc: 'Celebrated with 800+ community members' },
  { year: '2023', title: 'Digital Transformation', desc: 'Online classes & virtual events launched' },
  { year: '2025', title: 'Expansion Plan', desc: 'New cultural center coming soon' },
];

const FA_MILESTONES = [
  { year: '۱۹۹۸', title: 'تأسیس', desc: 'تأسیس کمیونیتی خورشید توسط داوطلبان پرشور' },
  { year: '۲۰۱۵', title: 'افتتاح مرکز کمیونیتی', desc: 'اولین فضای اختصاصی برای رویدادها و برنامه‌ها' },
  { year: '۲۰۱۹', title: 'برنامه رهبری جوانان', desc: 'راه‌اندازی ابتکارات مربیگری' },
  { year: '۲۰۲۱', title: 'جشن بیستمین سالگرد', desc: 'جشن با بیش از ۸۰۰ عضو کمیونیتی' },
  { year: '۲۰۲۳', title: 'تحول دیجیتال', desc: 'راه‌اندازی کلاس‌های آنلاین و رویدادهای مجازی' },
  { year: '۲۰۲۵', title: 'طرح توسعه', desc: 'مرکز فرهنگی جدید به زودی افتتاح می‌شود' },
];

const EN_STRATEGIC_GOALS = [
  { goal: 'Expand youth programs by 50%', progress: 65, label: '65%', target: 'Reach 500 young leaders' },
  { goal: 'Launch mental health support services', progress: 40, label: '40%', target: 'Free counseling for members' },
  { goal: 'Establish cultural archive & museum', progress: 25, label: '25%', target: 'Preserve 1,000+ artifacts' },
  { goal: 'Build interfaith dialogue initiatives', progress: 80, label: '80%', target: '10+ partner organizations' },
];

const FA_STRATEGIC_GOALS = [
  { goal: 'گسترش برنامه‌های جوانان تا ۵۰٪', progress: 65, label: '۶۵٪', target: 'رسیدن به ۵۰۰ رهبر جوان' },
  { goal: 'راه‌اندازی خدمات حمایت از سلامت روان', progress: 40, label: '۴۰٪', target: 'مشاوره رایگان برای اعضا' },
  { goal: 'ایجاد آرشیو فرهنگی و موزه', progress: 25, label: '۲۵٪', target: 'حفظ بیش از ۱۰۰۰ اثر' },
  { goal: 'ایجاد ابتکارات گفتگوی بین‌ادیانی', progress: 80, label: '۸۰٪', target: 'بیش از ۱۰ سازمان شریک' },
];

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('about');
  const isFa = locale === 'fa';

  const coreValues = isFa ? FA_CORE_VALUES : EN_CORE_VALUES;
  const milestones = isFa ? FA_MILESTONES : EN_MILESTONES;
  const goals = isFa ? FA_STRATEGIC_GOALS : EN_STRATEGIC_GOALS;

  const supabase = await createClient();
  const { data: dbTeam } = await supabase.from('team_members').select('*').eq('active', true).order('sort_order');

  const teamData = dbTeam && dbTeam.length > 0 ? dbTeam : null;
  const president = teamData ? teamData.find((m: { is_president: boolean }) => m.is_president) ?? teamData[0] : null;
  const teamMembers = teamData ? teamData.filter((m: { is_president: boolean; id: string }) => !m.is_president || m.id !== president?.id) : null;

  return (
    <div className="bg-surface">
      <PageHero
        image="/images/about-hero.jpg"
        badge={t('badge')}
        title={
          isFa
            ? <>{t('heroTitle').split('،')[0]}،<br /><em className="italic text-accent-muted">{t('heroTitle').split('،')[1]}</em></>
            : <>Preserving Heritage,<br /><em className="italic text-accent-muted">Building Futures</em></>
        }
        subtitle={t('heroSubtitle', { year: SITE_CONFIG.foundingYear })}
        height="h-[55vh] min-h-[420px]"
      />

      {/* Who We Are */}
      <section className="py-24 bg-surface-alt">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <span className="inline-flex items-center gap-3 text-accent-dark font-semibold uppercase text-[11px] tracking-[0.2em] mb-6">
            <span className="w-10 h-px bg-accent" />{t('storyOverline')}<span className="w-10 h-px bg-accent" />
          </span>
          <h2 className="font-display font-light text-4xl md:text-5xl text-gray-900 mb-6 leading-tight">
            {isFa ? (
              <><span>ما </span><em className="italic text-brand-900">کی هستیم</em></>
            ) : (
              <>Who <em className="italic text-brand-900">We Are</em></>
            )}
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            {t('storyBody', { year: SITE_CONFIG.foundingYear })}
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-surface">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-3 text-accent-dark font-semibold uppercase text-[11px] tracking-[0.2em] mb-5">
              <span className="w-10 h-px bg-accent" />{t('purposeOverline')}<span className="w-10 h-px bg-accent" />
            </span>
            <h2 className="font-display font-light text-4xl md:text-5xl text-gray-900">
              {isFa ? (
                <><span>مأموریت و </span><em className="italic text-brand-900">چشم‌انداز</em></>
              ) : (
                <>Mission & <em className="italic text-brand-900">Vision</em></>
              )}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                svgPath: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
                title: t('missionTitle'),
                body: t('missionBody'),
              },
              {
                svgPath: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>,
                title: t('visionTitle'),
                body: t('visionBody'),
              },
            ].map((card) => (
              <div key={card.title} className="group bg-surface-alt rounded-2xl p-8 border border-gray-100 hover:border-accent-light hover:shadow-xl transition-all duration-500">
                <div className="w-14 h-14 bg-brand-900 group-hover:bg-brand-800 rounded-2xl flex items-center justify-center mb-6 transition-colors">
                  <svg className="w-7 h-7 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">{card.svgPath}</svg>
                </div>
                <h3 className="font-display font-semibold text-2xl text-gray-900 mb-4">{card.title}</h3>
                <div className="w-8 h-px bg-accent mb-4" />
                <p className="text-gray-500 leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-brand-950">
        <div className="absolute -top-40 right-0 w-[700px] h-[500px] rounded-full bg-accent/6 blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-40 -left-20 w-[500px] h-[500px] rounded-full bg-brand-400/10 blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-3 text-accent/80 font-semibold uppercase text-[11px] tracking-[0.2em] mb-5">
              <span className="w-10 h-px bg-accent/50" />{t('valuesOverline')}<span className="w-10 h-px bg-accent/50" />
            </span>
            <h2 className="font-display font-light text-4xl md:text-5xl text-white">
              {isFa ? (
                <><span>ارزش‌های اصلی </span><em className="italic text-accent-muted">ما</em></>
              ) : (
                <>Our Core <em className="italic text-accent-muted">Values</em></>
              )}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {coreValues.map((value) => (
              <div key={value.title} className="group bg-white/5 backdrop-blur-sm rounded-2xl p-7 border border-white/10 hover:border-accent/30 hover:bg-white/10 transition-all duration-500 hover:-translate-y-1">
                <div className="w-12 h-12 bg-white/8 rounded-xl flex items-center justify-center text-2xl mb-5">{value.icon}</div>
                <h3 className="font-display font-semibold text-xl text-white mb-3">{value.title}</h3>
                <p className="text-brand-300 text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-surface-alt">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-3 text-accent-dark font-semibold uppercase text-[11px] tracking-[0.2em] mb-5">
              <span className="w-10 h-px bg-accent" />{t('journeyOverline')}<span className="w-10 h-px bg-accent" />
            </span>
            <h2 className="font-display font-light text-4xl md:text-5xl text-gray-900">
              {isFa ? (
                <><span>نقاط عطف </span><em className="italic text-brand-900">کلیدی</em></>
              ) : (
                <>Key <em className="italic text-brand-900">Milestones</em></>
              )}
            </h2>
          </div>
          <div className="relative">
            <div className="absolute left-[18px] md:left-1/2 top-0 bottom-0 w-px bg-accent-light md:-translate-x-px" />
            <div className="space-y-10">
              {milestones.map((item, idx) => (
                <div key={item.year} className={`relative flex gap-6 md:gap-0 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className="relative shrink-0 md:absolute md:left-1/2 md:-translate-x-1/2 w-9 h-9 bg-surface border-2 border-accent rounded-full flex items-center justify-center z-10">
                    <span className="w-2 h-2 bg-accent rounded-full" />
                  </div>
                  <div className={`flex-1 md:w-1/2 ${idx % 2 === 0 ? 'md:pr-14 md:text-right' : 'md:pl-14 md:ml-auto'} pl-4 md:pl-0`}>
                    <div className="bg-surface rounded-xl p-6 border border-gray-100 hover:border-accent-light hover:shadow-lg transition-all duration-300">
                      <span className="font-display text-2xl font-light text-accent-dark">{item.year}</span>
                      <h3 className="font-display font-semibold text-lg text-gray-900 mt-1 mb-2">{item.title}</h3>
                      <p className="text-gray-500 text-sm">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Goals */}
      <section className="py-24 bg-surface">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-3 text-accent-dark font-semibold uppercase text-[11px] tracking-[0.2em] mb-5">
              <span className="w-10 h-px bg-accent" />{t('goalsOverline')}<span className="w-10 h-px bg-accent" />
            </span>
            <h2 className="font-display font-light text-4xl md:text-5xl text-gray-900">
              {isFa ? (
                <><span>اهداف استراتژیک </span><em className="italic text-brand-900">۲۰۲۵–۲۰۲۸</em></>
              ) : (
                <>Strategic Goals <em className="italic text-brand-900">2025–2028</em></>
              )}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {goals.map((item) => (
              <div key={item.goal} className="group bg-surface-alt rounded-2xl p-6 border border-gray-100 hover:border-accent-light hover:shadow-md transition-all duration-300">
                <div className="flex justify-between items-start mb-3 gap-3">
                  <h3 className="font-display font-semibold text-gray-900">{item.goal}</h3>
                  <span className="font-display text-2xl font-light text-accent-dark shrink-0">{item.label}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
                  <div className="bg-gradient-to-r from-accent to-accent-hover h-1.5 rounded-full" style={{ width: `${item.progress}%` }} />
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <svg className="w-3.5 h-3.5 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {item.target}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-24 bg-surface-alt">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-3 text-accent-dark font-semibold uppercase text-[11px] tracking-[0.2em] mb-5">
              <span className="w-10 h-px bg-accent" />{t('leadersOverline')}<span className="w-10 h-px bg-accent" />
            </span>
            <h2 className="font-display font-light text-4xl md:text-5xl text-gray-900">
              {isFa ? (
                <><span>آشنایی با </span><em className="italic text-brand-900">تیم</em></>
              ) : (
                <>Meet the <em className="italic text-brand-900">Team</em></>
              )}
            </h2>
          </div>

          {/* President / Featured */}
          {(president || PRESIDENT) && (() => {
            const p = president ?? PRESIDENT;
            const photoSrc = (p as { photo_url?: string; src?: string }).photo_url ?? (p as { src?: string }).src;
            const photoAlt = (p as { alt?: string }).alt ?? p.name;
            const role = isFa ? ((p as { title_fa?: string }).title_fa ?? (p as { title_en?: string; role?: string }).title_en ?? (p as { role?: string }).role ?? '') : ((p as { title_en?: string; role?: string }).title_en ?? (p as { role?: string }).role ?? '');
            const bio = isFa ? ((p as { bio_fa?: string }).bio_fa ?? (p as { bio_en?: string; bio?: string }).bio_en ?? (p as { bio?: string }).bio ?? '') : ((p as { bio_en?: string; bio?: string }).bio_en ?? (p as { bio?: string }).bio ?? '');
            return (
              <div className="max-w-3xl mx-auto mb-16 bg-surface rounded-2xl p-8 sm:p-10 border border-gray-100 shadow-sm">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="relative shrink-0">
                    <div className="w-36 h-36 rounded-full overflow-hidden ring-4 ring-accent ring-offset-4 ring-offset-surface relative bg-brand-50">
                      {photoSrc ? <Image src={photoSrc} alt={photoAlt} fill className="object-cover" sizes="144px" /> : <span className="absolute inset-0 flex items-center justify-center font-display text-5xl font-semibold text-brand-700">{p.name[0]}</span>}
                    </div>
                  </div>
                  <div className="text-center md:text-left flex-1">
                    <span className="inline-flex items-center gap-2 text-accent-dark font-semibold uppercase text-[11px] tracking-[0.15em] mb-3">
                      <span className="w-6 h-px bg-accent" />{t('presidentLabel')}
                    </span>
                    <h3 className="font-display font-semibold text-2xl text-gray-900 mb-1">{p.name}</h3>
                    <p className="text-brand-900 font-medium text-sm mb-4">{role}</p>
                    <p className="text-gray-500 text-sm leading-relaxed">{bio}</p>
                  </div>
                </div>
              </div>
            );
          })()}

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {(teamMembers ?? TEAM_MEMBERS).map((member) => {
              const photoSrc = (member as { photo_url?: string; src?: string }).photo_url ?? (member as { src?: string }).src;
              const photoAlt = (member as { alt?: string }).alt ?? member.name;
              const role = isFa ? ((member as { title_fa?: string }).title_fa ?? (member as { title_en?: string; role?: string }).title_en ?? (member as { role?: string }).role ?? '') : ((member as { title_en?: string; role?: string }).title_en ?? (member as { role?: string }).role ?? '');
              const bio = isFa ? ((member as { bio_fa?: string }).bio_fa ?? (member as { bio_en?: string; bio?: string }).bio_en ?? (member as { bio?: string }).bio ?? '') : ((member as { bio_en?: string; bio?: string }).bio_en ?? (member as { bio?: string }).bio ?? '');
              return (
                <div key={member.name} className="group bg-surface rounded-2xl p-7 border border-gray-100 hover:border-accent-light hover:shadow-xl transition-all duration-500 text-center">
                  <div className="w-28 h-28 mx-auto rounded-full overflow-hidden ring-2 ring-gray-100 group-hover:ring-accent-muted ring-offset-2 ring-offset-surface transition-all duration-300 mb-5 relative bg-brand-50">
                    {photoSrc ? <Image src={photoSrc} alt={photoAlt} fill className="object-cover" sizes="112px" /> : <span className="absolute inset-0 flex items-center justify-center font-display text-3xl font-semibold text-brand-700">{member.name[0]}</span>}
                  </div>
                  <h3 className="font-display font-semibold text-xl text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-accent-dark font-semibold text-xs uppercase tracking-wider mb-3">{role}</p>
                  <div className="w-8 h-px bg-accent-muted mx-auto mb-4" />
                  <p className="text-gray-500 text-sm leading-relaxed">{bio}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-950 to-brand-950">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full bg-accent/8 blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-6 max-w-3xl text-center text-white relative z-10">
          <span className="inline-flex items-center gap-3 text-accent/80 font-semibold uppercase text-[11px] tracking-[0.2em] mb-6">
            <span className="w-10 h-px bg-accent/50" />{t('ctaOverline')}<span className="w-10 h-px bg-accent/50" />
          </span>
          <h2 className="font-display font-light text-4xl md:text-5xl mb-5">
            {isFa ? (
              <><span>بخشی از </span><em className="italic text-accent-muted">داستان ما</em><span> شوید</span></>
            ) : (
              <>Become Part of <em className="italic text-accent-muted">Our Story</em></>
            )}
          </h2>
          <p className="text-brand-300 text-base mb-9 max-w-xl mx-auto leading-relaxed">{t('ctaBody')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-shimmer inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-accent hover:bg-accent-hover text-brand-950 font-semibold rounded-full transition-all text-sm">
              {t('ctaBtn1')}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
            <Link href="/events" className="inline-flex items-center justify-center px-8 py-3.5 rounded-full border border-white/30 hover:border-white/60 hover:bg-white/10 transition-all text-sm font-semibold backdrop-blur-sm">
              {t('ctaBtn2')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
