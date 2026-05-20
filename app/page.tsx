// app/page.tsx - Navy Blue & Gold Theme Matching Logo
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <>
  
       {/* Hero Section - Fully Responsive */}
      <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* Navy Blue gradient matching logo */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950/90 via-blue-900/85 to-blue-950/90 z-10" />
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: "url('/images/hero-section.jpg')",
              backgroundPosition: "center"
            }}
          />
        </div>

        <div className="relative z-20 container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 lg:py-32 text-center text-white">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6 md:mb-8 text-xs sm:text-sm font-semibold tracking-wide bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-400 rounded-full animate-pulse"></span>
            Established 1998 • Nonprofit Organization
          </div>
          
          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-3 sm:mb-4 md:mb-6 tracking-tight">
            <span className="text-yellow-400">Khorshid</span>
            <span className="text-blue-300">Community</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl max-w-4xl mx-auto mb-4 sm:mb-6 md:mb-8 text-blue-100 leading-relaxed px-2">
            Keeping Our Culture Alive,<br className="hidden xs:block" />Uniting Generations, Building a Vibrant Future
          </p>
          
          {/* Description */}
          <p className="text-sm sm:text-base md:text-lg text-gray-200 max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-12 px-4">
            Join 5,000+ members celebrating Hazara and Persian heritage through cultural events, 
            educational programs, and community support initiatives.
          </p>
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-5 justify-center px-4">
            <Link 
              href="/events" 
              className="group inline-flex items-center justify-center px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg font-semibold text-blue-900 bg-yellow-400 rounded-xl hover:bg-yellow-500 transition-all duration-300 shadow-2xl hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Explore Upcoming Events
              <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link 
              href="/about" 
              className="inline-flex items-center justify-center px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg font-semibold text-white bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-300 border border-white/30"
            >
              Discover Our Story
            </Link>
          </div>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 mt-8 sm:mt-10 md:mt-12 lg:mt-16">
            <div className="text-center px-2 sm:px-3 md:px-4">
              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">5,200+</div>
              <div className="text-xs sm:text-sm text-yellow-300">Lives Impacted</div>
            </div>
            <div className="w-px h-6 sm:h-8 md:h-10 lg:h-12 bg-white/30"></div>
            <div className="text-center px-2 sm:px-3 md:px-4">
              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">48</div>
              <div className="text-xs sm:text-sm text-yellow-300">Annual Events</div>
            </div>
            <div className="w-px h-6 sm:h-8 md:h-10 lg:h-12 bg-white/30"></div>
            <div className="text-center px-2 sm:px-3 md:px-4">
              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">350+</div>
              <div className="text-xs sm:text-sm text-yellow-300">Active Volunteers</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
          <div className="w-5 h-7 sm:w-6 sm:h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-1.5 sm:w-1.5 sm:h-2 bg-yellow-400 rounded-full mt-1.5 sm:mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Trust Bar - Featured In */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container mx-auto px-6">
          <p className="text-center text-gray-500 text-sm uppercase tracking-wide mb-6">Trusted By & Featured In</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60">
            {["Local Arts Council", "City of Culture", "Heritage Foundation", "Community Alliance", "Unity Network"].map((partner, idx) => (
              <span key={idx} className="text-gray-600 font-semibold text-lg">{partner}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement Banner */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <span className="text-yellow-600 font-semibold uppercase text-sm tracking-wide">Our Purpose</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-6">
            One Community. One Family. One Future.
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            KhorshidCommunity bridges generations, preserves Hazara and Persian heritage, and empowers 
            individuals through connection, culture, and compassionate action.
          </p>
        </div>
      </section>

      {/* What We Do - Detailed Programs */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-yellow-600 font-semibold tracking-wide uppercase text-sm">Comprehensive Programs</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">What We Do</h2>
            <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full"></div>
            <p className="text-gray-600 text-lg mt-6">KhorshidCommunity is the heartbeat of cultural preservation and community empowerment through six core pillars.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                icon: "🎭", 
                title: "Cultural Festivals", 
                desc: "Annual Nowruz celebrations, Mehregan festivals, traditional music concerts, and dance workshops that bring our heritage to life."
              },
              { 
                icon: "📚", 
                title: "Educational Programs", 
                desc: "Persian language classes for all levels, heritage storytelling sessions, history workshops, and children's cultural education."
              },
              { 
                icon: "🤝", 
                title: "Community Support", 
                desc: "Elderly assistance programs, food drives, crisis relief, newcomer settlement support, and family counseling services."
              },
              { 
                icon: "🌱", 
                title: "Youth Leadership", 
                desc: "Empowering next-gen leaders through mentorship programs, civic engagement workshops, and career development initiatives."
              },
              { 
                icon: "🎨", 
                title: "Arts & Expression", 
                desc: "Calligraphy workshops, Persian miniature painting, poetry nights celebrating Rumi & Hafez, and traditional music classes."
              },
              { 
                icon: "🏆", 
                title: "Sports & Wellness", 
                desc: "Community sports leagues, yoga sessions, hiking clubs, and health awareness programs for all ages."
              },
            ].map((item, idx) => (
              <div key={idx} className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-yellow-600 font-semibold text-sm">Learn more →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Preview */}
      <section className="py-24 bg-gradient-to-br from-blue-950 to-blue-900 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-yellow-400 font-semibold tracking-wide uppercase text-sm">Join Us</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4">Upcoming Events</h2>
            <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full"></div>
            <p className="text-gray-300 mt-4 text-lg">Don't miss out on our flagship celebrations and programs</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { 
                date: "TBD", 
                title: "Hazara Culture Day", 
                desc: "Celebrating the rich heritage, art, music, and traditions of the Hazara community.", 
                location: "Community Hall", 
                image: "/images/hazara-culture-day.jpg",
                spots: "Register for updates"
              },
              { 
                date: "MAR 20, 2026", 
                title: "Nowruz Festival 2026", 
                desc: "The largest Persian New Year celebration with music, dance, traditional Haft-Seen.", 
                location: "Community Hall", 
                image: "/images/nowruz-festival.jpg",
                spots: "Save the date"
              },
              { 
                date: "Weekly", 
                title: "Community Football Match", 
                desc: "Weekly football match open to all ages. Great way to stay active and meet new people.", 
                location: "Central Park Field", 
                image: "/images/football-match.jpg",
                spots: "Join anytime"
              },
            ].map((event, idx) => (
              <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative h-56 overflow-hidden bg-gray-200">
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-yellow-500 text-blue-900 px-3 py-1 rounded-lg font-bold text-sm">
                    {event.date}
                  </div>
                </div>
                <div className="p-6 text-gray-800">
                  <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{event.desc}</p>
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {event.location}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-600 text-sm font-semibold">{event.spots}</span>
                    <button className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-semibold rounded-lg transition-all text-sm">
                      Learn More →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/events" className="inline-flex items-center px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-semibold rounded-xl transition-all shadow-lg">
              View All Events
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-yellow-600 font-semibold tracking-wide uppercase text-sm">Our Impact</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2">Making a Difference Daily</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "1,200+", label: "Active Members", icon: "👥" },
              { number: "40+", label: "Monthly Programs", icon: "📅" },
              { number: "15", label: "Partner Orgs", icon: "🤝" },
              { number: "$250K+", label: "Community Support", icon: "💝" },
            ].map((stat, idx) => (
              <div key={idx} className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
                <div className="text-4xl mb-3">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold text-blue-900">{stat.number}</div>
                <div className="text-gray-600 font-medium mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gradient-to-r from-blue-900 to-blue-950 text-white">
        <div className="container mx-auto px-6 text-center max-w-5xl">
          <span className="text-yellow-400 font-semibold uppercase text-sm tracking-wide">Voices of Our Community</span>
          <h2 className="text-4xl font-bold mt-3 mb-12">What Members Say</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl">
              <div className="text-6xl text-yellow-400 mb-4">"</div>
              <p className="text-lg italic leading-relaxed">KhorshidCommunity feels like home. Through their events, my children learned about our heritage in ways I couldn't teach alone. The community support is unmatched.</p>
              <div className="mt-6">
                <div className="font-bold text-xl">Maryam K.</div>
                <div className="text-yellow-300 text-sm">Member since 2015</div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl">
              <div className="text-6xl text-yellow-400 mb-4">"</div>
              <p className="text-lg italic leading-relaxed">This organization transformed my connection to our culture. From language classes to celebrations, every experience has been authentic and heartwarming.</p>
              <div className="mt-6">
                <div className="font-bold text-xl">Reza S.</div>
                <div className="text-yellow-300 text-sm">Volunteer Leader</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News/Blog Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-yellow-600 font-semibold tracking-wide uppercase text-sm">Stay Informed</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2">Latest Updates</h2>
            <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full mt-4"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { date: "Jan 15, 2025", title: "New Youth Mentorship Program Launches", desc: "Empowering young adults with career guidance and cultural education.", category: "Announcement" },
              { date: "Jan 10, 2025", title: "Nowruz Festival Seeks Volunteers", desc: "Join our team to help organize the biggest Persian New Year celebration.", category: "Volunteer" },
              { date: "Jan 5, 2025", title: "Community Food Drive Success", desc: "Over 500 families received support during winter holidays.", category: "Impact" },
            ].map((news, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all">
                <div className="text-sm text-yellow-600 font-semibold mb-2">{news.category}</div>
                <div className="text-xs text-gray-400 mb-2">{news.date}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{news.title}</h3>
                <p className="text-gray-600">{news.desc}</p>
                <button className="mt-4 text-yellow-600 font-semibold hover:text-yellow-700 transition">Read More →</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter & CTA */}
      <section className="py-20 bg-blue-950">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Join Our Newsletter</h2>
          <p className="text-blue-200 mb-8 text-lg">Stay updated on events, programs, and community news — delivered monthly.</p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input type="email" placeholder="Your email address" className="flex-1 px-6 py-3 rounded-xl border-0 focus:ring-2 focus:ring-yellow-500 outline-none" />
            <button className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-semibold rounded-xl transition-all">Subscribe</button>
          </form>
          <p className="text-blue-300 text-sm mt-4">We respect your privacy. Unsubscribe anytime.</p>
        </div>
      </section>

      {/* Partner Logos */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6">
          <p className="text-center text-gray-500 text-sm uppercase mb-8">Proud Partners & Sponsors</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all">
            {["Partner Foundation", "Cultural Alliance", "Heritage Fund", "Community Trust", "Unity Partners"].map((partner, idx) => (
              <div key={idx} className="text-xl font-bold text-gray-400">{partner}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Floating CTA Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link href="/contact" className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-blue-900 px-5 py-3 rounded-full shadow-2xl transition-all hover:scale-105">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="font-semibold">Get Involved</span>
        </Link>
      </div>
    </>
  );
}