import { Cormorant_Garamond, Inter, Vazirmatn } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const vazirmatn = Vazirmatn({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-persian',
  display: 'swap',
});

export const metadata = {
  title: 'Khorshid Community | Persian & Hazara Cultural Center in San Diego',
  description: 'Join 5,200+ members at Khorshid Community in San Diego. Persian cultural events, Nowruz celebrations, language classes, and community support for Hazara and Iranian families.',
  keywords: 'Khorshid Community San Diego, Persian community San Diego, Hazara community San Diego, Iranian American San Diego, Nowruz San Diego, Persian events San Diego',
  alternates: {
    canonical: 'https://khorshidcommunity.org',
    languages: {
      en: 'https://khorshidcommunity.org',
      fa: 'https://khorshidcommunity.org/fa',
      'x-default': 'https://khorshidcommunity.org',
    },
  },
  authors: [{ name: 'Khorshid Community' }],
  creator: 'Khorshid Community',
  publisher: 'Khorshid Community',
  metadataBase: new URL('https://khorshidcommunity.org'),
  openGraph: {
    title: 'Khorshid Community | Persian & Hazara Cultural Center in San Diego',
    description: 'Keeping our culture alive, uniting generations, building a vibrant future in San Diego.',
    url: 'https://khorshidcommunity.org',
    siteName: 'Khorshid Community',
    locale: 'en_US',
    alternateLocale: ['fa_IR', 'fa_AF'],
    type: 'website',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630, alt: 'Khorshid Community Persian and Hazara cultural center in San Diego' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Khorshid Community | Persian & Hazara Cultural Center in San Diego',
    description: 'Keeping our culture alive, uniting generations, building a vibrant future in San Diego.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable} ${vazirmatn.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
