import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import ArticleCard from '../../../components/ArticleCard';
import Breadcrumbs from '../../../components/Breadcrumbs';
import Pagination from '../../../components/Pagination';
import { getAuthorPageData, getAuthors } from '../../../lib/api';
import { formatDate } from '../../../lib/date';
import { toAbsoluteImageUrl, toAbsoluteUrl } from '../../../lib/site-config';

export const revalidate = 300;

function buildCanonical(slug, page) {
  return page > 1 ? `/authors/${slug}?page=${page}` : `/authors/${slug}`;
}

function getCategoryLinks(items) {
  const unique = new Map();

  items.forEach((article) => {
    if (article.category?.slug) {
      unique.set(article.category.slug, article.category);
    }
  });

  return Array.from(unique.values()).slice(0, 4);
}

export async function generateStaticParams() {
  const authors = await getAuthors();
  return authors.map((author) => ({ slug: author.slug }));
}

export async function generateMetadata(props) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const page = Math.max(1, Number(searchParams?.page || 1) || 1);
  const { author } = await getAuthorPageData(params.slug, { page: 1 });

  if (!author) {
    return {
      title: 'Автора не знайдено'
    };
  }

  const authorName = author.fullName || author.name;
  const canonical = buildCanonical(author.slug, page);
  const title = `${authorName} — автор ${page > 1 ? `(сторінка ${page})` : ''}`.trim();

  return {
    title,
    description: author.bio,
    alternates: {
      canonical
    },
    openGraph: {
      title,
      description: author.bio,
      url: toAbsoluteUrl(canonical),
      type: 'profile',
      images: author.avatarUrl
        ? [
            {
              url: toAbsoluteImageUrl(author.avatarUrl),
              alt: `Фото автора ${authorName}`
            }
          ]
        : undefined
    }
  };
}

export default async function AuthorPage(props) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const page = Math.max(1, Number(searchParams?.page || 1) || 1);
  const { author, items, meta } = await getAuthorPageData(params.slug, { page });

  if (!author) {
    notFound();
  }

  const authorName = author.fullName || author.name;
  const articleCount = meta.total || author.totalArticles || items.length;
  const categoryLinks = getCategoryLinks(items);
  const socials = author.socials || {
    linkedin: author.linkedinUrl || null,
    github: author.githubUrl || null
  };

  const breadcrumbs = [
    { label: 'Головна', href: '/' },
    { label: 'Автори', href: '/authors' },
    { label: authorName }
  ];

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: authorName,
    description: author.bio,
    image: author.avatarUrl ? toAbsoluteImageUrl(author.avatarUrl) : undefined,
    url: toAbsoluteUrl(`/authors/${author.slug}`),
    sameAs: [socials.linkedin, socials.github].filter(Boolean),
    worksFor: {
      '@type': 'Organization',
      name: 'StackVarta',
      url: toAbsoluteUrl('/')
    }
  };

  return (
    <main className="container page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />

      <section className="author-box panel">
        <Breadcrumbs items={breadcrumbs} />
        <div className="author-top author-featured">
          <Image
            src={author.avatarUrl || '/author-avatar.svg'}
            alt={`Фото автора ${authorName}`}
            width={120}
            height={120}
            sizes="120px"
            className="author-avatar-large"
            style={{ borderRadius: '50%', objectFit: 'cover' }}
          />
          <div>
            <p className="eyebrow">Профіль автора</p>
            <h1>{authorName}</h1>
            <p className="muted author-card-bio">{author.bio}</p>

            <div className="inline-list section-spacer">
              <span className="pill">{articleCount} опублікованих матеріалів</span>
              {socials.linkedin ? (
                <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="pill">
                  LinkedIn
                </a>
              ) : null}
              {socials.github ? (
                <a href={socials.github} target="_blank" rel="noopener noreferrer" className="pill">
                  GitHub
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="panel section-spacer">
        <div className="section-heading">
          <div>
            <h2>Експертиза й тематичні напрямки</h2>
            <p className="muted">
              Профіль автора підсилює E-E-A-T сигнали: тут зібрані біографія, зовнішні профілі, дата публікацій і перелік матеріалів у конкретних категоріях.
            </p>
          </div>
        </div>

        <div className="content-links-grid">
          <article className="panel panel-soft compact-panel">
            <h3>Покриває категорії</h3>
            <div className="inline-list">
              {categoryLinks.length ? (
                categoryLinks.map((category) => (
                  <Link key={category.slug} href={`/categories/${category.slug}`} className="pill">
                    {category.name}
                  </Link>
                ))
              ) : (
                <span className="muted">Категорії з’являться після публікації статей.</span>
              )}
            </div>
          </article>

          <article className="panel panel-soft compact-panel">
            <h3>Остання активність</h3>
            <p className="muted">
              {items[0]?.updatedAt || items[0]?.publishedAt
                ? `Останнє оновлення матеріалу: ${formatDate(items[0].updatedAt || items[0].publishedAt)}.`
                : 'Поки що немає опублікованих матеріалів.'}
            </p>
          </article>

          <article className="panel panel-soft compact-panel">
            <h3>Корисні переходи</h3>
            <div className="inline-list">
              <Link href="/authors" className="pill">Усі автори</Link>
              <Link href="/archive" className="pill">Архів</Link>
              <Link href="/about" className="pill">Про редакцію</Link>
            </div>
          </article>
        </div>
      </section>

      <section className="panel section-spacer">
        <div className="section-heading">
          <div>
            <h2>Матеріали автора</h2>
            <p className="muted">Статті відсортовані за датою публікації та доступні з профілю без зайвих проміжних кроків.</p>
          </div>
        </div>

        {items.length ? (
          <div className="article-grid">
            {items.map((article, index) => (
              <ArticleCard key={article.slug} article={article} priority={index === 0 && page === 1} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>У цього автора поки немає опублікованих статей.</p>
          </div>
        )}

        <Pagination basePath={`/authors/${author.slug}`} page={meta.page} totalPages={meta.totalPages} />
      </section>
    </main>
  );
}
