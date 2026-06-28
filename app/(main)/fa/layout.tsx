// app/fa/layout.tsx
// FIX (SEO): Separate layout for Persian routes sets lang="fa" dir="rtl"
// so Google correctly indexes Farsi content instead of treating it as English.
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

export const metadata = {
  title: "کمیونیتی خورشید | مرکز فرهنگی فارسی و هزاره در سن دیگو",
  description: "به کمیونیتی خورشید در سن دیگو بپیوندید. رویدادهای فرهنگی فارسی، جشن‌های نوروز، کلاس‌های زبان فارسی، و حمایت از جامعه هزاره و ایرانی.",
  alternates: {
    canonical: "https://khorshidcommunity.org/fa",
    languages: {
      'en': 'https://khorshidcommunity.org',
      'fa': 'https://khorshidcommunity.org/fa',
      'x-default': 'https://khorshidcommunity.org',
    },
  },
  openGraph: {
    title: "کمیونیتی خورشید | مرکز فرهنگی فارسی و هزاره در سن دیگو",
    description: "به کمیونیتی خورشید در سن دیگو بپیوندید. رویدادهای فرهنگی فارسی، جشن‌های نوروز، و حمایت از جامعه هزاره.",
    url: "https://khorshidcommunity.org/fa",
    siteName: "کمیونیتی خورشید",
    locale: "fa_IR",
    alternateLocale: ["en_US"],
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "کمیونیتی خورشید سن دیگو",
      },
    ],
  },
};

export default function FaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Header />
        <main style={{ paddingTop: '80px' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}