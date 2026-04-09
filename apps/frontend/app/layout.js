import './globals.css';
import SiteFooter from '../components/SiteFooter';
import SiteHeader from '../components/SiteHeader';
import { getCategories } from '../lib/api';
import { siteConfig } from '../lib/site-config';

export const metadata = {
  metadataBase: new URL(siteConfig.baseUrl),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    url: siteConfig.baseUrl,
    type: 'website'
  }
};

export default async function RootLayout({ children }) {
  const categories = await getCategories();

  return (
    <html lang="uk">
      <body>
        <SiteHeader categories={categories} />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
