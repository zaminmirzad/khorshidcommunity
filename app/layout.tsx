// app/layout.tsx - Clean version with components
'use client';

import Header from './components/Header';
import Footer from './components/Footer';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Header />
        
        {/* Main Content */}
        <main style={{ paddingTop: '80px' }}>
          {children}
        </main>
        
        <Footer />
      </body>
    </html>
  );
}