import { getFeedArticles } from '../../lib/api';
import { siteConfig, toAbsoluteUrl } from '../../lib/site-config';

function escapeXml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const articles = await getFeedArticles(20);

  const items = articles
    .map(
      (article) => `
        <item>
          <title>${escapeXml(article.title)}</title>
          <link>${escapeXml(toAbsoluteUrl(`/articles/${article.slug}`))}</link>
          <guid>${escapeXml(toAbsoluteUrl(`/articles/${article.slug}`))}</guid>
          <description>${escapeXml(article.excerpt || '')}</description>
          <pubDate>${new Date(article.publishedAt || Date.now()).toUTCString()}</pubDate>
        </item>
      `
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0">
      <channel>
        <title>${escapeXml(siteConfig.name)}</title>
        <link>${escapeXml(siteConfig.baseUrl)}</link>
        <description>${escapeXml(siteConfig.description)}</description>
        ${items}
      </channel>
    </rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  });
}
