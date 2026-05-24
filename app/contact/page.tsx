// app/contact/page.tsx — Server Component (NO 'use client')
import ContactClient from './ContactClient';

export const metadata = {
  title: "Contact Us | Khorshid Community San Diego",
  description: "Get in touch with Khorshid Community in San Diego. Visit us at Sky Beach, call us, or send a message. We respond within 24 hours.",
  alternates: {
    canonical: "https://khorshidcommunity.org/contact",
  },
  openGraph: {
    title: "Contact Khorshid Community San Diego",
    description: "Reach out to Khorshid Community in San Diego. We'd love to hear from you about events, volunteering, membership, or partnerships.",
    url: "https://khorshidcommunity.org/contact",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}