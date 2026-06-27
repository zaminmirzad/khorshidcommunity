import Link from 'next/link';
import Image from 'next/image';
import PageHero from '@/app/components/PageHero';
import { PRESIDENT, TEAM_MEMBERS } from '@/lib/data/team';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata = {
  title: 'About Us | Khorshid Community — Persian & Hazara Cultural Center San Diego',
  description: 'Learn about Khorshid Community, founded in 1998. Our mission, vision, core values, leadership team, and strategic goals for the Persian and Hazara community in San Diego.',
  alternates: { canonical: `${SITE_CONFIG.url}/about` },
  openGraph: {
    title: 'About Khorshid Community | Persian & Hazara Cultural Center San Diego',
    description: `Founded in ${SITE_CONFIG.foundingYear}, Khorshid Community unites 5,000+ members celebrating Hazara and Persian heritage in San Diego.`,
    url: `${SITE_CONFIG.url}/about`,
    images: [{ url: '/images/about-hero.jpg', width: 1200, height: 630, alt: 'Khorshid Community about page — Persian and Hazara cultural center San Diego' }],
  },
};

const CORE_VALUES = [
  { icon: '🤝', title: 'Inclusivity', desc: 'Everyone is welcome regardless of background, religion, or generation. We celebrate diversity and create safe spaces for all voices.' },
  { icon: '🎭', title: 'Cultural Pride', desc: 'We honor our heritage with joy and authenticity, preserving traditions while embracing evolution and growth.' },
  { icon: '💪', title: 'Mutual Support', desc: 'We lift each other through challenges and celebrate successes together, embodying true community spirit.' },
  { icon: '📚', title: 'Education First', desc: 'Knowledge is power. We invest in learning opportunities for all ages — from language classes to leadership training.' },
  { icon: '🌟', title: 'Excellence', desc: 'We strive for the highest quality in every program, event, and service we offer to our community.' },
  { icon: '🌱', title: 'Sustainability', desc: 'Building lasting impact through responsible practices and empowering future generations to carry our mission forward.' },
];

const STRATEGIC_GOALS = [
  { goal: 'Expand youth programs by 50%', progress: 65, label: '65%', target: 'Reach 500 young leaders' },
  { goal: 'Launch mental health support services', progress: 40, label: '40%', target: 'Free counseling for members' },
  { goal: 'Establish cultural archive & museum', progress: 25, label: '25%', target: 'Preserve 1,000+ artifacts' },
  { goal: 'Build interfaith dialogue initiatives', progress: 80, label: '80%', target: '10+ partner organizations' },
];

const MILESTONES = [
  { year: '1998', title: 'Foundation', desc: 'KhorshidCommunity founded by passionate community volunteers' },
  { year: '2015', title: 'Community Center Opens', desc: 'First dedicated space for events and programs' },
  { year: '2019', title: 'Youth Leadership Program', desc: 'Launch of mentorship initiatives' },
  { year: '2021', title: '20th Anniversary Gala', desc: 'Celebrated with 800+ community members' },
  { year: '2023', title: 'Digital Transformation', desc: 'Online classes & virtual events launched' },
  { year: '2025', title: 'Expansion Plan', desc: 'New cultural center coming soon' },
];

function SectionHeader({ overline, title }: { overline: string; title: React.ReactNode }) {
  return (
    <div className="text-center mb-14">
      <span className="inline-flex items-center gap-3 text-amber-600 font-semibold uppercase text-[11px] tracking-[0.2em] mb-5">
        <span className="w-10 h-px bg-amber-400" />
        {overline}
        <span className="w-10 h-px bg-amber-400" />
      </span>
      <h2 className="font-display font-light text-4xl md:text-5xl text-gray-900">{title}</h2>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="bg-white">
      <PageHero
        image="/images/about-hero.jpg"
        badge="About KhorshidCommunity"
        title={<>Preserving Heritage,<br /><em className="italic text-amber-300">Building Futures</em></>}
        subtitle={`Serving our community since ${SITE_CONFIG.foundingYear} with pride, purpose, and dedication`}
        height="h-[55vh] min-h-[420px]"
      />

      {/* ── Who We Are ────────────────────────────────────────────────── */}
      <section className="py-24 bg-[#faf8f4]">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <span className="inline-flex items-center gap-3 text-amber-600 font-semibold uppercase text-[11px] tracking-[0.2em] mb-6">
            <span className="w-10 h-px bg-amber-400" />
            Our Story
            <span className="w-10 h-px bg-amber-400" />
          </span>
          <h2 className="font-display font-light text-4xl md:text-5xl text-gray-900 mb-6 leading-tight">
            Who <em className="italic text-blue-900">We Are</em>
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            KhorshidCommunity is a vibrant, nonprofit organization dedicated to uniting and empowering
            the Hazara and Persian-speaking community and culture enthusiasts. Founded in {SITE_CONFIG.foundingYear} by
            passionate volunteers, we've grown into a thriving hub of cultural celebration, educational
            programs, and social support — serving over 5,000 community members annually.
          </p>
        </div>
      </section>

      {/* ── Mission & Vision ──────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <SectionHeader overline="Our Purpose" title={<>Mission & <em className="italic text-blue-900">Vision</em></>} />
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                ),
                title: 'Our Mission',
                body: 'To unite, empower, and celebrate the Khorshid community by preserving cultural traditions, providing educational opportunities, and fostering meaningful social connections across generations. We strive to create a home away from home where every member feels valued, heard, and inspired.',
              },
              {
                icon: (
                  <>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </>
                ),
                title: 'Our Vision',
                body: 'A world where the rich tapestry of Hazara and Persian culture thrives for generations to come — where every individual, regardless of age or background, finds belonging, purpose, and an opportunity to contribute to a vibrant, interconnected community.',
              },
            ].map((card) => (
              <div key={card.title} className="group bg-[#faf8f4] rounded-2xl p-8 border border-gray-100 hover:border-amber-200 hover:shadow-xl transition-all duration-500">
                <div className="w-14 h-14 bg-blue-900 group-hover:bg-blue-800 rounded-2xl flex items-center justify-center mb-6 transition-colors">
                  <svg className="w-7 h-7 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">{card.icon}</svg>
                </div>
                <h3 className="font-display font-semibold text-2xl text-gray-900 mb-4">{card.title}</h3>
                <div className="w-8 h-px bg-amber-400 mb-4" />
                <p className="text-gray-500 leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Core Values ───────────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-br from-blue-950 to-[#0a1628]">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-3 text-amber-400/80 font-semibold uppercase text-[11px] tracking-[0.2em] mb-5">
              <span className="w-10 h-px bg-amber-400/50" />
              What We Stand For
              <span className="w-10 h-px bg-amber-400/50" />
            </span>
            <h2 className="font-display font-light text-4xl md:text-5xl text-white">
              Our Core <em className="italic text-amber-300">Values</em>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {CORE_VALUES.map((value) => (
              <div key={value.title} className="group bg-white/5 backdrop-blur-sm rounded-2xl p-7 border border-white/10 hover:border-amber-400/30 hover:bg-white/10 transition-all duration-500 hover:-translate-y-1">
                <div className="w-12 h-12 bg-white/8 rounded-xl flex items-center justify-center text-2xl mb-5">{value.icon}</div>
                <h3 className="font-display font-semibold text-xl text-white mb-3">{value.title}</h3>
                <p className="text-blue-300 text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ──────────────────────────────────────────────────── */}
      <section className="py-24 bg-[#faf8f4]">
        <div className="container mx-auto px-6 max-w-4xl">
          <SectionHeader overline="Our Journey" title={<>Key <em className="italic text-blue-900">Milestones</em></>} />
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[18px] md:left-1/2 top-0 bottom-0 w-px bg-amber-200 md:-translate-x-px" />
            <div className="space-y-10">
              {MILESTONES.map((item, idx) => (
                <div
                  key={item.year}
                  className={`relative flex gap-6 md:gap-0 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  {/* Mobile/desktop dot */}
                  <div className="relative shrink-0 md:absolute md:left-1/2 md:-translate-x-1/2 w-9 h-9 bg-white border-2 border-amber-400 rounded-full flex items-center justify-center z-10">
                    <span className="w-2 h-2 bg-amber-400 rounded-full" />
                  </div>

                  <div className={`flex-1 md:w-1/2 ${idx % 2 === 0 ? 'md:pr-14 md:text-right' : 'md:pl-14 md:ml-auto'} pl-4 md:pl-0`}>
                    <div className="bg-white rounded-xl p-6 border border-gray-100 hover:border-amber-200 hover:shadow-lg transition-all duration-300">
                      <span className="font-display text-2xl font-light text-amber-500">{item.year}</span>
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

      {/* ── Strategic Goals ───────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <SectionHeader overline="Our Roadmap" title={<>Strategic Goals <em className="italic text-blue-900">2025–2028</em></>} />
          <div className="grid md:grid-cols-2 gap-6">
            {STRATEGIC_GOALS.map((item) => (
              <div key={item.goal} className="group bg-[#faf8f4] rounded-2xl p-6 border border-gray-100 hover:border-amber-200 hover:shadow-md transition-all duration-300">
                <div className="flex justify-between items-start mb-3 gap-3">
                  <h3 className="font-display font-semibold text-gray-900">{item.goal}</h3>
                  <span className="font-display text-2xl font-light text-amber-500 shrink-0">{item.label}</span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
                  <div
                    className="bg-gradient-to-r from-amber-400 to-amber-500 h-1.5 rounded-full transition-all duration-700"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <svg className="w-3.5 h-3.5 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {item.target}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Leadership ────────────────────────────────────────────────── */}
      <section className="py-24 bg-[#faf8f4]">
        <div className="container mx-auto px-6 max-w-6xl">
          <SectionHeader overline="Our Leaders" title={<>Meet the <em className="italic text-blue-900">Team</em></>} />

          {/* President */}
          <div className="max-w-3xl mx-auto mb-16 bg-white rounded-2xl p-8 sm:p-10 border border-gray-100 shadow-sm">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative shrink-0">
                <div className="w-36 h-36 rounded-full overflow-hidden ring-4 ring-amber-400 ring-offset-4 ring-offset-white relative">
                  <Image src={PRESIDENT.src} alt={PRESIDENT.alt} fill className="object-cover" sizes="144px" />
                </div>
              </div>
              <div className="text-center md:text-left flex-1">
                <span className="inline-flex items-center gap-2 text-amber-600 font-semibold uppercase text-[11px] tracking-[0.15em] mb-3">
                  <span className="w-6 h-px bg-amber-400" />
                  President
                </span>
                <h3 className="font-display font-semibold text-2xl text-gray-900 mb-1">{PRESIDENT.name}</h3>
                <p className="text-blue-900 font-medium text-sm mb-4">{PRESIDENT.role}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{PRESIDENT.bio}</p>
              </div>
            </div>
          </div>

          {/* Team grid */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {TEAM_MEMBERS.map((member) => (
              <div key={member.name} className="group bg-white rounded-2xl p-7 border border-gray-100 hover:border-amber-200 hover:shadow-xl transition-all duration-500 text-center">
                <div className="w-28 h-28 mx-auto rounded-full overflow-hidden ring-2 ring-gray-100 group-hover:ring-amber-300 ring-offset-2 ring-offset-white transition-all duration-300 mb-5 relative">
                  <Image src={member.src} alt={member.alt} fill className="object-cover" sizes="112px" />
                </div>
                <h3 className="font-display font-semibold text-xl text-gray-900 mb-1">{member.name}</h3>
                <p className="text-amber-600 font-semibold text-xs uppercase tracking-wider mb-3">{member.role}</p>
                <div className="w-8 h-px bg-amber-300 mx-auto mb-4" />
                <p className="text-gray-500 text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing CTA ───────────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-br from-blue-950 via-blue-900 to-[#0a1628]">
        <div className="container mx-auto px-6 max-w-3xl text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 50% 100%, #fbbf24, transparent 60%)' }} />
          <div className="relative z-10">
            <span className="inline-flex items-center gap-3 text-amber-400/80 font-semibold uppercase text-[11px] tracking-[0.2em] mb-6">
              <span className="w-10 h-px bg-amber-400/50" />
              Join Us
              <span className="w-10 h-px bg-amber-400/50" />
            </span>
            <h2 className="font-display font-light text-4xl md:text-5xl mb-5">
              Become Part of <em className="italic text-amber-300">Our Story</em>
            </h2>
            <p className="text-blue-300 text-base mb-9 max-w-xl mx-auto leading-relaxed">
              Whether you're looking to volunteer, donate, or simply join our events — there's a place for you at KhorshidCommunity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="btn-shimmer inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-amber-400 hover:bg-amber-500 text-blue-950 font-semibold rounded-full transition-all text-sm"
              >
                Join Our Community
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/events"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full border border-white/30 hover:border-white/60 hover:bg-white/10 transition-all text-sm font-semibold backdrop-blur-sm"
              >
                View Upcoming Events
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
