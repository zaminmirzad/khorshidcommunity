// app/events/page.tsx - Events Page
import Link from 'next/link';

export default function EventsPage() {
  const events = [
    { id: 1, date: "March 20, 2025", time: "6:00 PM - 10:00 PM", title: "Nowruz Festival: Persian New Year Celebration", location: "Khorshid Community Hall, 123 Main St", type: "Cultural", image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2070&h=400&fit=crop", description: "Join us for music, dance, traditional Haft-Seen table, and a festive dinner to welcome spring." },
    { id: 2, date: "April 5, 2025", time: "2:00 PM - 5:00 PM", title: "Youth Leadership Workshop", location: "Community Center Room B", type: "Education", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&h=400&fit=crop", description: "Empowering young adults with communication and organizational skills for community leadership." },
    { id: 3, date: "April 18, 2025", time: "7:00 PM - 9:00 PM", title: "Poetry Night: Celebrating Rumi & Hafez", location: "Cultural Library", type: "Arts", image: "https://images.unsplash.com/photo-1516575334481-f85287c2c82d?q=80&w=2070&h=400&fit=crop", description: "An evening of classical Persian poetry readings and discussions." },
    { id: 4, date: "May 10, 2025", time: "11:00 AM - 3:00 PM", title: "Family Picnic & Sports Day", location: "Central Park", type: "Social", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2070&h=400&fit=crop", description: "Fun games, traditional food potluck, and outdoor activities for all ages." },
    { id: 5, date: "June 1, 2025", time: "10:00 AM - 4:00 PM", title: "Heritage Cooking Class: Persian Cuisine", location: "Kitchen Studio", type: "Workshop", image: "https://images.unsplash.com/photo-1551326844-4df70f78d0e9?q=80&w=2070&h=400&fit=crop", description: "Learn to cook authentic dishes like Ghormeh Sabzi and Tahdig." },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-amber-600 font-semibold tracking-wide uppercase text-sm">Come Together</span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">Our Events & Programs</h1>
          <p className="text-gray-600 text-lg">From cultural festivals to educational workshops — there's always something happening at KhorshidCommunity.</p>
        </div>

        {/* Event List */}
        <div className="space-y-10 max-w-5xl mx-auto">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row">
              <div className="md:w-1/3 h-64 md:h-auto overflow-hidden">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6 md:w-2/3">
                <div className="flex flex-wrap gap-2 items-center mb-3">
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">{event.type}</span>
                  <span className="text-gray-500 text-sm flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    {event.date} at {event.time}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{event.title}</h2>
                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {event.location}
                </div>
                <p className="text-gray-600 mb-4">{event.description}</p>
                <button className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-all">RSVP & Details →</button>
              </div>
            </div>
          ))}
        </div>

        {/* Calendar Note */}
        <div className="text-center mt-16 p-6 bg-amber-50 rounded-2xl max-w-3xl mx-auto">
          <p className="text-gray-700">📅 Want to host an event or suggest a program? <Link href="/contact" className="text-amber-700 font-semibold underline">Contact our events team</Link></p>
        </div>
      </div>
    </div>
  );
}