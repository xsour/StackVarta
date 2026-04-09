import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import ArticleCard from '../../../components/ArticleCard';
import ArticleViewTracker from '../../../components/ArticleViewTracker';
import Breadcrumbs from '../../../components/Breadcrumbs';
import RichArticleContent from '../../../components/RichArticleContent';
import { getArticleBreadcrumbItems } from '../../../lib/article-seo';
import { formatDate } from '../../../lib/date';
import { getArticlePageData, getFeedArticles } from '../../../lib/api';
import { siteConfig, toAbsoluteImageUrl, toAbsoluteUrl } from '../../../lib/site-config';

export const revalidate = 60;

export async function generateStaticParams() {
  const articles = await getFeedArticles(100);
  return articles.map((article) => ({ slug: article.slug }));
}

function shouldBypassOptimization(src = '') {
  return String(src).toLowerCase().endsWith('.svg');
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
      title: `${article.metaTitle || article.title} | ${siteConfig.name}`,
      description: article.metaDescription || article.excerpt,
      url: toAbsoluteUrl(`/articles/${article.slug}`),
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt || article.publishedAt,
      authors: article.author?.name ? [article.author.name] : undefined,
      images: [
        {
          url: toAbsoluteImageUrl(article.coverUrl),
          alt: article.coverAlt || article.title
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

  const breadcrumbs = getArticleBreadcrumbItems(article);
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.metaDescription || article.excerpt,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    image: [toAbsoluteImageUrl(article.coverUrl)],
    wordCount: article.wordCount,
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
      url: siteConfig.baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: toAbsoluteUrl('/site-logo.svg')
      }
    },
    mainEntityOfPage: toAbsoluteUrl(`/articles/${article.slug}`),
    inLanguage: 'uk'
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href ? toAbsoluteUrl(item.href) : toAbsoluteUrl(`/articles/${article.slug}`)
    }))
  };

  const faqJsonLd = Array.isArray(article.faq) && article.faq.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: article.faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
          }
        }))
      }
    : null;

  return (
    <main className="container page narrow">
      <ArticleViewTracker articleId={article.id} />
      <article className="article-layout">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        {faqJsonLd ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
          />
        ) : null}

        <div className="article-header-shell">
          <Breadcrumbs items={breadcrumbs} className="article-breadcrumbs" />

          <Image
            src={article.coverUrl || '/placeholder-cover.svg'}
            alt={article.coverAlt || article.title}
            width={1600}
            height={900}
            className="article-cover"
            priority
            sizes="(max-width: 768px) 100vw, 760px"
            unoptimized={shouldBypassOptimization(article.coverUrl)}
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
            {article.excerpt ? <p className="muted article-excerpt">{article.excerpt}</p> : null}

            <div className="inline-list article-highlight-list">
              {article.author ? (
                <Link href={`/authors/${article.author.slug}`} className="pill">
                  Автор: {article.author.name}
                </Link>
              ) : null}
              {article.focusKeyword ? <span className="pill">Запит: {article.focusKeyword}</span> : null}
              <span className="pill">{article.readingTimeMinutes || 1} хв читання</span>
              <span className="pill">{article.wordCount || 0} слів</span>
            </div>
          </header>
        </div>

        <RichArticleContent article={article} />

        <section className="panel section-spacer author-signature">
          <div className="author-top author-featured">
            {article.author?.avatarUrl ? (
              <Image
                src={article.author.avatarUrl}
                alt={`Фото автора ${article.author.name}`}
                width={96}
                height={96}
                sizes="96px"
                className="author-avatar-large"
                style={{ borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : null}
            <div>
              <p className="eyebrow" style={{ marginBottom: '4px' }}>Автор матеріалу</p>
              <h2 className="author-card-title">
                {article.author?.slug ? (
                  <Link href={`/authors/${article.author.slug}`} className="link-accent">
                    {article.author.fullName || article.author.name}
                  </Link>
                ) : (
                  article.author?.fullName || article.author?.name
                )}
              </h2>
              <p className="muted author-card-bio">{article.author?.bio}</p>
              <div className="article-dates muted">
                <span><strong>Опубліковано:</strong> {formatDate(article.publishedAt)}</span>
                <span><strong>Оновлено:</strong> {formatDate(article.updatedAt || article.publishedAt)}</span>
              </div>
            </div>
          </div>
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
          <h2 className="section-title">Схожі статті</h2>
          <p className="muted related-copy">Автоматично підібрані матеріали з того самого силосу, щоб сторінка не залишалась ізольованою.</p>
          {relatedArticles.length ? (
            <div className="article-grid">
              {relatedArticles.map((related) => (
                <ArticleCard key={related.slug} article={related} />
              ))}
            </div>
          ) : (
            <p className="muted">Схожих статей поки немає.</p>
          )}
        </section>
      </article>
    </main>
  );
}
