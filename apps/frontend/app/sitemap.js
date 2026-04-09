import { getSitemapData } from '../lib/api';
import { siteConfig } from '../lib/site-config';

function getLatestDate(values = [], fallbackDate = new Date()) {
  const timestamps = values
    .map((value) => new Date(value).getTime())
    .filter((value) => Number.isFinite(value));

  if (!timestamps.length) {
    return fallbackDate;
  }

  return new Date(Math.max(...timestamps));
}

export default async function sitemap() {
  const { categories, authors, articles } = await getSitemapData();
  const baseUrl = siteConfig.baseUrl;
  const now = new Date();

  const authorLastModified = authors.reduce((accumulator, author) => {
    const relatedDates = articles
      .filter((article) => article.author?.slug === author.slug)
      .map((article) => article.updatedAt || article.publishedAt);

    accumulator[author.slug] = getLatestDate(relatedDates, now);
    return accumulator;
  }, {});

  const categoryLastModified = categories.reduce((accumulator, category) => {
    const relatedDates = articles
      .filter((article) => article.category?.slug === category.slug)
      .map((article) => article.updatedAt || article.publishedAt);

    accumulator[category.slug] = getLatestDate(relatedDates, now);
    return accumulator;
  }, {});

  return [
    {
      url: `${baseUrl}/`,
      lastModified: getLatestDate(articles.map((article) => article.updatedAt || article.publishedAt), now)
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now
    },
    {
      url: `${baseUrl}/contacts`,
      lastModified: now
    },
    {
      url: `${baseUrl}/authors`,
      lastModified: getLatestDate(Object.values(authorLastModified), now)
    },
    {
      url: `${baseUrl}/archive`,
      lastModified: getLatestDate(articles.map((article) => article.updatedAt || article.publishedAt), now)
    },
    ...categories.map((category) => ({
      url: `${baseUrl}/categories/${category.slug}`,
      lastModified: categoryLastModified[category.slug] || now
    })),
    ...authors.map((author) => ({
      url: `${baseUrl}/authors/${author.slug}`,
      lastModified: authorLastModified[author.slug] || now
    })),
    ...articles.map((article) => ({
      url: `${baseUrl}/articles/${article.slug}`,
      lastModified: new Date(article.updatedAt || article.publishedAt || now)
    }))
  ];
}
