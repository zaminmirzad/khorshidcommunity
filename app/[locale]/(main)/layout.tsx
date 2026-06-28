import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const messages = await getMessages();
  const isRTL = locale === 'fa';

  return (
    <NextIntlClientProvider messages={messages}>
      <Header />
      <main
        className={`pt-[72px]${isRTL ? ' font-persian' : ''}`}
        dir={isRTL ? 'rtl' : undefined}
      >
        {children}
      </main>
      <Footer />
    </NextIntlClientProvider>
  );
}
