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
  { goal: 'Expand youth programs by 50%', progress: '65%', target: 'Reach 500 young leaders' },
  { goal: 'Launch mental health support services', progress: '40%', target: 'Free counseling for members' },
  { goal: 'Establish cultural archive & museum', progress: '25%', target: 'Preserve 1,000+ artifacts' },
  { goal: 'Build interfaith dialogue initiatives', progress: '80%', target: '10+ partner organizations' },
];

const MILESTONES = [
  { year: '1998', title: 'Foundation', desc: 'KhorshidCommunity founded by passionate community volunteers' },
  { year: '2015', title: 'Community Center Opens', desc: 'First dedicated space for events and programs' },
  { year: '2019', title: 'Youth Leadership Program', desc: 'Launch of mentorship initiatives' },
  { year: '2021', title: '20th Anniversary Gala', desc: 'Celebrated with 800+ community members' },
  { year: '2023', title: 'Digital Transformation', desc: 'Online classes & virtual events launched' },
  { year: '2025', title: 'Expansion Plan', desc: 'New cultural center coming soon' },
];

export default function AboutPage() {
  return (
    <div className="bg-white">
      <PageHero
        image="/images/about-hero.jpg"
        badge="About KhorshidCommunity"
        title={<>Preserving Heritage,<br />Building Futures</>}
        subtitle={`Serving our community since ${SITE_CONFIG.foundingYear} with pride, purpose, and dedication`}
        height="h-[50vh] min-h-[400px]"
        overlayOpacity="bg-black/50"
      />

      <div className="container mx-auto px-4 sm:px-6 py-20 max-w-6xl">

        {/* Who We Are */}
        <div className="text-center mb-16">
          <span className="text-yellow-600 font-semibold tracking-wide uppercase text-sm">Our Story</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-6">Who We Are</h2>
          <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full mb-8" />
          <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
            KhorshidCommunity is a vibrant, nonprofit organization dedicated to uniting and empowering
            the Hazara and Persian-speaking community and culture enthusiasts. Founded in {SITE_CONFIG.foundingYear} by passionate volunteers,
            we've grown into a thriving hub of cultural celebration, educational programs, and social support
            — serving over 5,000 community members annually.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {[
            {
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
              title: 'Our Mission',
              body: 'To unite, empower, and celebrate the Khorshid community by preserving cultural traditions, providing educational opportunities, and fostering meaningful social connections across generations. We strive to create a home away from home where every member feels valued, heard, and inspired.',
            },
            {
              icon: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>,
              title: 'Our Vision',
              body: 'A world where the rich tapestry of Hazara and Persian culture thrives for generations to come — where every individual, regardless of age or background, finds belonging, purpose, and an opportunity to contribute to a vibrant, interconnected community.',
            },
          ].map((card) => (
            <div key={card.title} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg border border-blue-100">
              <div className="w-16 h-16 bg-blue-700 rounded-2xl flex items-center justify-center mb-5">
                <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">{card.icon}</svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">{card.title}</h3>
              <p className="text-gray-700 leading-relaxed">{card.body}</p>
            </div>
          ))}
        </div>

        {/* Core Values */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <span className="text-yellow-600 font-semibold tracking-wide uppercase text-sm">What We Stand For</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">Our Core Values</h2>
            <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full" />
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {CORE_VALUES.map((value) => (
              <div key={value.title} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{value.title}</h3>
                <p className="text-gray-700 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Strategic Goals */}
        <div className="mb-20 bg-gray-50 rounded-3xl p-8 sm:p-10">
          <div className="text-center mb-10">
            <span className="text-yellow-600 font-semibold tracking-wide uppercase text-sm">Our Roadmap</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">Strategic Goals 2025–2028</h2>
            <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {STRATEGIC_GOALS.map((item) => (
              <div key={item.goal} className="bg-white rounded-xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-gray-800">{item.goal}</h3>
                  <span className="text-sm font-semibold text-yellow-600 shrink-0 ml-2">{item.progress}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: item.progress }} />
                </div>
                <p className="text-sm text-gray-600">🎯 {item.target}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <span className="text-yellow-600 font-semibold tracking-wide uppercase text-sm">Our Journey</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">Key Milestones</h2>
            <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full" />
          </div>
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-px h-full w-0.5 bg-yellow-200 hidden md:block" />
            <div className="space-y-8">
              {MILESTONES.map((item, idx) => (
                <div key={item.year} className={`relative flex flex-col md:flex-row ${idx % 2 !== 0 ? 'md:justify-end' : ''}`}>
                  <div className={`md:w-1/2 ${idx % 2 !== 0 ? 'md:pl-12' : 'md:pr-12 md:text-right'}`}>
                    <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500 hover:shadow-lg transition-all">
                      <div className="text-2xl font-bold text-yellow-600 mb-2">{item.year}</div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Leadership */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <span className="text-yellow-600 font-semibold tracking-wide uppercase text-sm">Our Leaders</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">Meet the Team</h2>
            <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full" />
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">Dedicated volunteers and staff working tirelessly to serve our community</p>
          </div>

          {/* President */}
          <div className="max-w-3xl mx-auto mb-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-36 h-36 rounded-full overflow-hidden ring-4 ring-yellow-400 shrink-0 relative">
                <Image src={PRESIDENT.src} alt={PRESIDENT.alt} fill className="object-cover" sizes="144px" />
              </div>
              <div className="text-center md:text-left flex-1">
                <h3 className="text-2xl font-bold text-gray-800">{PRESIDENT.name}</h3>
                <p className="text-yellow-600 font-semibold text-lg mb-3">{PRESIDENT.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{PRESIDENT.bio}</p>
              </div>
            </div>
          </div>

          {/* Team */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {TEAM_MEMBERS.map((member) => (
              <div key={member.name} className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 text-center group">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden ring-4 ring-yellow-200 group-hover:ring-yellow-400 transition-all mb-4 relative">
                  <Image src={member.src} alt={member.alt} fill className="object-cover" sizes="128px" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
                <p className="text-yellow-600 font-semibold text-sm mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-3xl p-10 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Become Part of Our Story</h2>
          <p className="text-lg text-blue-100 mb-6 max-w-2xl mx-auto">
            Whether you're looking to volunteer, donate, or simply join our events — there's a place for you at KhorshidCommunity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="inline-flex items-center justify-center px-8 py-3 bg-yellow-500 text-blue-900 font-bold rounded-xl hover:bg-yellow-600 transition-all shadow-lg">
              Join Our Community
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link href="/events" className="inline-flex items-center justify-center px-8 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/30 transition-all">
              View Upcoming Events
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
