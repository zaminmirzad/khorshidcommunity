import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="pt-[72px]">
        {children}
      </main>
      <Footer />
    </>
  );
}
