import { getSitemapData } from '../lib/api';
import { siteConfig } from '../lib/site-config';

export default async function sitemap() {
  const { categories, authors, tags, articles } = await getSitemapData();
  const baseUrl = siteConfig.baseUrl;
  const now = new Date();

  return [
    {
      url: `${baseUrl}/`,
      lastModified: now
    },
    ...categories.map((category) => ({
      url: `${baseUrl}/categories/${category.slug}`,
      lastModified: now
    })),
    ...authors.map((author) => ({
      url: `${baseUrl}/authors/${author.slug}`,
      lastModified: now
    })),
    ...tags.map((tag) => ({
      url: `${baseUrl}/tags/${tag.slug}`,
      lastModified: now
    })),
    ...articles.map((article) => ({
      url: `${baseUrl}/articles/${article.slug}`,
      lastModified: new Date(article.updatedAt || article.publishedAt || now)
    }))
  ];
}
