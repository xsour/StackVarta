import './globals.css';
import SiteFooter from '../components/SiteFooter';
import SiteHeader from '../components/SiteHeader';
import { getCategories, getFeedArticles } from '../lib/api';
import { siteConfig } from '../lib/site-config';

export const metadata = {
  metadataBase: new URL(siteConfig.baseUrl),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': `${siteConfig.baseUrl}/rss.xml`
    }
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    url: siteConfig.baseUrl,
    type: 'website',
    images: [
      {
        url: `${siteConfig.baseUrl}/site-logo.svg`,
        alt: `${siteConfig.name} logo`
      }
    ]
  },
  icons: {
    icon: '/site-logo.svg'
  }
};

export default async function RootLayout({ children }) {
  const [categories, latestArticles] = await Promise.all([getCategories(), getFeedArticles(5)]);

  return (
    <html lang="uk">
      <body>
        <SiteHeader categories={categories} />
        {children}
        <SiteFooter categories={categories} latestArticles={latestArticles} />
      </body>
    </html>
  );
}
