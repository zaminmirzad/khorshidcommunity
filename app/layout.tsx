// app/layout.tsx - Root Layout with Navigation
import Link from 'next/link';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {/* Navigation Bar */}
        <nav className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-gray-100">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent">Khorshid<span className="text-amber-600">Community</span></Link>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-amber-600 font-medium transition">Home</Link>
              <Link href="/events" className="text-gray-700 hover:text-amber-600 font-medium transition">Events</Link>
              <Link href="/about" className="text-gray-700 hover:text-amber-600 font-medium transition">About</Link>
              <Link href="/gallery" className="text-gray-700 hover:text-amber-600 font-medium transition">Gallery</Link>
              <Link href="/contact" className="text-gray-700 hover:text-amber-600 font-medium transition">Contact</Link>
            </div>
            <Link href="/contact" className="hidden md:inline-block px-5 py-2 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition text-sm font-semibold">Join Us</Link>
            <button className="md:hidden text-gray-700">☰</button>
          </div>
        </nav>
        {children}
        {/* Footer */}
        <footer className="bg-gray-900 text-gray-300 py-12">
          <div className="container mx-auto px-6 text-center">
            <p>© 2025 KhorshidCommunity — Uniting hearts, preserving heritage.</p>
            <div className="flex justify-center space-x-6 mt-4">
              <span>Instagram</span><span>Facebook</span><span>YouTube</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}