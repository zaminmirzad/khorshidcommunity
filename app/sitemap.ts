// app/sitemap.ts
// FIX (SEO): Removed /fa/about, /fa/events, /fa/contact — these pages don't exist yet.
// Submitting 404 URLs wastes crawl budget and can suppress rankings.
// Add them back once the pages are built.
export default function sitemap() {
  return [
    // English pages
    {
      url: 'https://khorshidcommunity.org',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: 'https://khorshidcommunity.org/about',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: 'https://khorshidcommunity.org/events',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: 'https://khorshidcommunity.org/contact',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: 'https://khorshidcommunity.org/gallery',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    // Persian page (only /fa exists currently)
    {
      url: 'https://khorshidcommunity.org/fa',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
  ];
}