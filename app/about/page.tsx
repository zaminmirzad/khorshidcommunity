// app/about/page.tsx - Navy Blue & Gold Theme
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px] bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-[url('/images/about-hero.jpg')] bg-cover bg-center mix-blend-overlay" />
        <div className="relative z-10 text-center px-6">
          <span className="text-yellow-400 font-semibold tracking-wide uppercase text-sm mb-2 block">About KhorshidCommunity</span>
          <h1 className="text-5xl md:text-7xl font-bold mb-4">Preserving Heritage,<br />Building Futures</h1>
          <p className="text-xl max-w-2xl mx-auto text-blue-100">Serving our community since 1998 with pride, purpose, and dedication</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20 max-w-6xl">
        
        {/* Who We Are */}
        <div className="text-center mb-16">
          <span className="text-yellow-600 font-semibold tracking-wide uppercase text-sm">Our Story</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-6">Who We Are</h2>
          <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full mb-8"></div>
          <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
            KhorshidCommunity is a vibrant, nonprofit organization dedicated to uniting and empowering 
            the Hazara and Persian-speaking community and culture enthusiasts. Founded in 1998 by passionate volunteers, 
            we've grown into a thriving hub of cultural celebration, educational programs, and social support 
            — serving over 5,000 community members annually.
          </p>
        </div>

        {/* Mission & Vision Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {/* Mission Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg border border-blue-100">
            <div className="w-16 h-16 bg-blue-700 rounded-2xl flex items-center justify-center mb-5">
              <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Our Mission</h3>
            <p className="text-gray-700 leading-relaxed">
              To unite, empower, and celebrate the Khorshid community by preserving cultural traditions, 
              providing educational opportunities, and fostering meaningful social connections across generations. 
              We strive to create a home away from home where every member feels valued, heard, and inspired.
            </p>
          </div>

          {/* Vision Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg border border-blue-100">
            <div className="w-16 h-16 bg-blue-700 rounded-2xl flex items-center justify-center mb-5">
              <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Our Vision</h3>
            <p className="text-gray-700 leading-relaxed">
              A world where the rich tapestry of Hazara and Persian culture thrives for generations to come — where 
              every individual, regardless of age or background, finds belonging, purpose, and an opportunity 
              to contribute to a vibrant, interconnected community.
            </p>
          </div>
        </div>

        {/* Core Values Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <span className="text-yellow-600 font-semibold tracking-wide uppercase text-sm">What We Stand For</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">Our Core Values</h2>
            <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                icon: "🤝", 
                title: "Inclusivity", 
                desc: "Everyone is welcome regardless of background, religion, or generation. We celebrate diversity and create safe spaces for all voices.",
              },
              { 
                icon: "🎭", 
                title: "Cultural Pride", 
                desc: "We honor our heritage with joy and authenticity, preserving traditions while embracing evolution and growth.",
              },
              { 
                icon: "💪", 
                title: "Mutual Support", 
                desc: "We lift each other through challenges and celebrate successes together, embodying true community spirit.",
              },
              { 
                icon: "📚", 
                title: "Education First", 
                desc: "Knowledge is power. We invest in learning opportunities for all ages — from language classes to leadership training.",
              },
              { 
                icon: "🌟", 
                title: "Excellence", 
                desc: "We strive for the highest quality in every program, event, and service we offer to our community.",
              },
              { 
                icon: "🌱", 
                title: "Sustainability", 
                desc: "Building lasting impact through responsible practices and empowering future generations to carry our mission forward.",
              },
            ].map((value, idx) => (
              <div key={idx} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{value.title}</h3>
                <p className="text-gray-700 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Strategic Goals */}
        <div className="mb-20 bg-gray-50 rounded-3xl p-10">
          <div className="text-center mb-10">
            <span className="text-yellow-600 font-semibold tracking-wide uppercase text-sm">Our Roadmap</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">Strategic Goals 2025-2028</h2>
            <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { goal: "Expand youth programs by 50%", progress: "65%", target: "Reach 500 young leaders" },
              { goal: "Launch mental health support services", progress: "40%", target: "Free counseling for members" },
              { goal: "Establish cultural archive & museum", progress: "25%", target: "Preserve 1,000+ artifacts" },
              { goal: "Build interfaith dialogue initiatives", progress: "80%", target: "10+ partner organizations" },
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-gray-800">{item.goal}</h3>
                  <span className="text-sm font-semibold text-yellow-600">{item.progress}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: item.progress }}></div>
                </div>
                <p className="text-sm text-gray-600">🎯 {item.target}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline / Milestones */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <span className="text-yellow-600 font-semibold tracking-wide uppercase text-sm">Our Journey</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">Key Milestones</h2>
            <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full"></div>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-yellow-200 hidden md:block"></div>
            <div className="space-y-8">
              {[
                { year: "2010", title: "Foundation", desc: "KhorshidCommunity founded by 5 families", side: "left" },
                { year: "2015", title: "Community Center Opens", desc: "First dedicated space for events and programs", side: "right" },
                { year: "2019", title: "Youth Leadership Program", desc: "Launch of mentorship initiatives", side: "left" },
                { year: "2021", title: "20th Anniversary Gala", desc: "Celebrated with 800+ community members", side: "right" },
                { year: "2023", title: "Digital Transformation", desc: "Online classes & virtual events launched", side: "left" },
                { year: "2025", title: "Expansion Plan", desc: "New cultural center coming soon", side: "right" },
              ].map((item, idx) => (
                <div key={idx} className={`relative flex flex-col md:flex-row ${item.side === 'right' ? 'md:justify-end' : ''}`}>
                  <div className={`md:w-1/2 ${item.side === 'right' ? 'md:pl-12' : 'md:pr-12 md:text-right'}`}>
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

        {/* Leadership Team */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <span className="text-yellow-600 font-semibold tracking-wide uppercase text-sm">Our Leaders</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">Meet the Team</h2>
            <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full"></div>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">Dedicated volunteers and staff working tirelessly to serve our community</p>
          </div>
          
          {/* President - Mahdi Soroush - Top centered */}
          <div className="max-w-3xl mx-auto mb-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-36 h-36 rounded-full overflow-hidden bg-gradient-to-br from-blue-700 to-blue-800 ring-4 ring-yellow-400 shrink-0 flex items-center justify-center">
                <picture>
                  <source srcSet="/images/mahdi-soroush.jpg" type="image/jpeg" />
                  <img 
                    src="/images/mahdi-soroush.jpg" 
                    alt="Mahdi Soroush" 
                    className="w-full h-full object-cover"
                  />
                </picture>
              </div>
              <div className="text-center md:text-left flex-1">
                <h3 className="text-2xl font-bold text-gray-800">Mahdi Soroush</h3>
                <p className="text-yellow-600 font-semibold text-lg mb-3">President</p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Mahdi Soroush is the President of the Khorshid nonprofit community and holds a Master's degree in 
                  Computer Science and Technology from Shanxi University. Fluent in English, Chinese, Persian, and Pashto, 
                  he is dedicated to community development, cultural engagement, youth empowerment, and strengthening 
                  connections within diverse communities through leadership and service.
                </p>
              </div>
            </div>
          </div>

          {/* Three leaders in a row */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Jafar Rezaei - Secretary */}
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 text-center group">
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 ring-4 ring-yellow-200 group-hover:ring-yellow-400 transition-all mb-4 flex items-center justify-center">
                <img 
                  src="/images/jafar-rezaei.jpg" 
                  alt="Jafar Rezaei" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Jafar Rezaei</h3>
              <p className="text-yellow-600 font-semibold text-sm mb-3">Secretary</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Jafar Rezaei is an Electrical Engineering graduate and currently serves as the Secretary of the Khorshid Community. 
                With experience in engineering, project coordination, and community development, he contributes to strengthening 
                organizational structure, community engagement, and long-term initiatives supporting the Afghan and Hazara community.
              </p>
            </div>

            {/* Mortaza Yaqobi - Vice President */}
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 text-center group">
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 ring-4 ring-yellow-200 group-hover:ring-yellow-400 transition-all mb-4 flex items-center justify-center">
                <img 
                  src="/images/mortaza-yaqobi.jpg" 
                  alt="Mortaza Yaqobi" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Mortaza Yaqobi</h3>
              <p className="text-yellow-600 font-semibold text-sm mb-3">Vice President & Cultural Committee Chair</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Bachelor's degree in Political Science with a focus on International Relations. Experience in entrepreneurship 
                and business management in Afghanistan, including trade, tourism, education, and cargo logistics. Committed to 
                preserving Hazara identity, promoting cultural initiatives, empowering youth, and supporting constructive 
                cultural integration within America's diverse society.
              </p>
            </div>

            {/* Ihsan Latif - CFO */}
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 text-center group">
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 ring-4 ring-yellow-200 group-hover:ring-yellow-400 transition-all mb-4 flex items-center justify-center">
                <img 
                  src="/images/ihsan-latif.jpg" 
                  alt="Ihsan Latif" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Ihsan Latif</h3>
              <p className="text-yellow-600 font-semibold text-sm mb-3">Chief Financial Officer</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Former student at San Diego State University, currently serving as the Chief Financial Officer of the Khorshid Community. 
                Brings over 8 years of experience in business management, team leadership, and business consulting. Focused on maintaining 
                financial transparency, strengthening organizational operations, and supporting the long-term growth and stability of the community.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-3xl p-10 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Become Part of Our Story</h2>
          <p className="text-lg text-blue-100 mb-6 max-w-2xl mx-auto">
            Whether you're looking to volunteer, donate, or simply join our events — there's a place for you at KhorshidCommunity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="inline-flex items-center px-8 py-3 bg-yellow-500 text-blue-900 font-bold rounded-xl hover:bg-yellow-600 transition-all shadow-lg">
              Join Our Community
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link href="/events" className="inline-flex items-center px-8 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/30 transition-all">
              View Upcoming Events
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}