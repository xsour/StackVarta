import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import ArticleCard from '../../../components/ArticleCard';
import ArticleViewTracker from '../../../components/ArticleViewTracker';
import { getArticlePageData, getFeedArticles } from '../../../lib/api';
import { siteConfig, toAbsoluteImageUrl, toAbsoluteUrl } from '../../../lib/site-config';

export const revalidate = 60;

export async function generateStaticParams() {
  const articles = await getFeedArticles(100);
  return articles.map((article) => ({ slug: article.slug }));
}

function parseDisplayDate(value) {
  if (!value) return null;

  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  return new Date(value);
}

function formatDate(value) {
  const parsedDate = parseDisplayDate(value);
  if (!parsedDate || Number.isNaN(parsedDate.getTime())) return '';

  return new Intl.DateTimeFormat('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(parsedDate);
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getPageTitle(article) {
  const rawTitle = String(article?.metaTitle || article?.title || '').trim();
  if (!rawTitle) return '';

  const patterns = [siteConfig.name, 'IT Blog', 'StackNova']
    .filter(Boolean)
    .map((name) => new RegExp(`\\s*(\\||—|-)\\s*${escapeRegExp(name)}$`, 'i'));

  return patterns.reduce((title, pattern) => title.replace(pattern, '').trim(), rawTitle) || rawTitle;
}

export async function generateMetadata(props) {
  const params = await props.params;
  const { article } = await getArticlePageData(params.slug);

  if (!article) {
    return {
      title: 'Статтю не знайдено'
    };
  }

  const pageTitle = getPageTitle(article);

  return {
    title: pageTitle,
    description: article.metaDescription || article.excerpt,
    alternates: {
      canonical: `/articles/${article.slug}`
    },
    openGraph: {
      title: `${pageTitle} | ${siteConfig.name}`,
      description: article.metaDescription || article.excerpt,
      url: `${siteConfig.baseUrl}/articles/${article.slug}`,
      type: 'article',
      publishedTime: article.publishedAt,
      images: [
        {
          url: toAbsoluteImageUrl(article.coverUrl),
          alt: article.title
        }
      ]
    }
  };
}

export default async function ArticlePage(props) {
  const params = await props.params;
  const { article, relatedArticles } = await getArticlePageData(params.slug);

  if (!article) {
    notFound();
  }

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.metaDescription || article.excerpt,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    image: [toAbsoluteImageUrl(article.coverUrl)],
    author: article.author
      ? {
          '@type': 'Person',
          name: article.author.name,
          url: toAbsoluteUrl(`/authors/${article.author.slug}`)
        }
      : undefined,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.baseUrl
    },
    mainEntityOfPage: toAbsoluteUrl(`/articles/${article.slug}`)
  };

  return (
    <main className="container page narrow">
      <ArticleViewTracker articleId={article.id} />
      <article className="article-layout">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />

        <Image
          src={article.coverUrl || '/placeholder-cover.svg'}
          alt={article.title}
          width={1200}
          height={675}
          className="article-cover"
          priority
        />

        <header className="article-header">
          <div className="article-meta">
            {article.category ? (
              <Link href={`/categories/${article.category.slug}`} className="badge">
                {article.category.name}
              </Link>
            ) : null}
            <span className="muted">{formatDate(article.publishedAt)}</span>
          </div>

          <h1>{article.title}</h1>
          {article.excerpt ? <p className="muted">{article.excerpt}</p> : null}

          <div className="inline-list">
            {article.author ? (
              <Link href={`/authors/${article.author.slug}`} className="pill">
                Автор: {article.author.name}
              </Link>
            ) : null}
            <span className="pill">Переглядів: {article.views}</span>
          </div>
        </header>

        <section className="article-content prose">
          {String(article.content || '')
            .split('\n\n')
            .filter(Boolean)
            .map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
        </section>

        <section className="panel section-spacer author-signature">
          <div className="author-top" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            {article.author?.avatarUrl && (
              <Image
                src={article.author.avatarUrl}
                alt={article.author.name}
                width={80}
                height={80}
                style={{ borderRadius: '50%', objectFit: 'cover' }}
              />
            )}
            <div>
              <p className="eyebrow" style={{ marginBottom: '4px' }}>Автор матеріалу</p>
              <h3 style={{ margin: 0 }}>
                <Link href={`/authors/${article.author?.slug}`} style={{ color: 'var(--accent)' }}>
                  {article.author?.fullName || article.author?.name}
                </Link>
              </h3>
              <p className="muted" style={{ marginTop: '8px', fontSize: '0.95rem' }}>
                {article.author?.bio}
              </p>
              <div className="article-dates muted" style={{ marginTop: '12px', fontSize: '0.85rem', display: 'flex', gap: '16px' }}>
                <span><strong>Опубліковано:</strong> {formatDate(article.publishedAt)}</span>
                {article.updatedAt && article.updatedAt !== article.publishedAt && (
                  <span><strong>Оновлено:</strong> {formatDate(article.updatedAt)}</span>
                )}
                {(!article.updatedAt || article.updatedAt === article.publishedAt) && (
                  <span><strong>Оновлено:</strong> {formatDate(article.publishedAt)}</span>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="related-block">
          <h2 className="section-title">Теги</h2>
          <div className="tag-list">
            {article.tags?.length ? (
              article.tags.map((tag) => (
                <Link key={tag.slug} href={`/tags/${tag.slug}`} className="tag">
                  #{tag.name}
                </Link>
              ))
            ) : (
              <span className="muted">Для цієї статті ще не додано тегів.</span>
            )}
          </div>
        </section>

        <section className="related-block">
          <h2 className="section-title">Пов’язані статті</h2>
          {relatedArticles.length ? (
            <div className="article-grid">
              {relatedArticles.map((related) => (
                <ArticleCard key={related.slug} article={related} />
              ))}
            </div>
          ) : (
            <p className="muted">Пов’язаних статей поки немає.</p>
          )}
        </section>
      </article>
    </main>
  );
}
