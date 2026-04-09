import Image from 'next/image';
import Link from 'next/link';

import ArticleCard from '../components/ArticleCard';
import Pagination from '../components/Pagination';
import { getCategories, getHomePageData } from '../lib/api';
import { siteConfig, toAbsoluteUrl } from '../lib/site-config';

export const revalidate = 300;

function buildHomeCanonical({ page, category }) {
  if (category) {
    return page > 1 ? `/categories/${category}?page=${page}` : `/categories/${category}`;
  }

  return page > 1 ? `/?page=${page}` : '/';
}

export async function generateMetadata(props) {
  const searchParams = await props.searchParams;
  const page = Math.max(1, Number(searchParams?.page || 1) || 1);
  const categorySlug = String(searchParams?.category || '').trim();
  const categories = await getCategories();
  const currentCategory = categories.find((item) => item.slug === categorySlug);

  if (currentCategory) {
    const title = `${currentCategory.name}: статті та практичні гайди`;
    const description = currentCategory.description;
    return {
      title,
      description,
      alternates: {
        canonical: buildHomeCanonical({ page, category: currentCategory.slug })
      },
      openGraph: {
        title: `${title} | ${siteConfig.name}`,
        description,
        url: toAbsoluteUrl(buildHomeCanonical({ page, category: currentCategory.slug }))
      }
    };
  }

  const canonical = buildHomeCanonical({ page, category: '' });
  const title = 'IT-блог про розробку, SEO та DevOps';
  const description = 'Практичні статті про frontend, backend, DevOps, AI, кібербезпеку та технічне SEO з чистою структурою сторінок.';

  return {
    title,
    description,
    alternates: {
      canonical
    },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url: toAbsoluteUrl(canonical)
    }
  };
}

function shouldBypassOptimization(src = '') {
  return String(src).toLowerCase().endsWith('.svg');
}

export default async function HomePage(props) {
  const searchParams = await props.searchParams;
  const category = String(searchParams?.category || '').trim();
  const page = Math.max(1, Number(searchParams?.page || 1) || 1);
  const { items, meta, categories } = await getHomePageData({ page, category });
  const featuredArticles = items.slice(0, 3);
  const leadArticle = featuredArticles[0] || null;

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.baseUrl,
    description: siteConfig.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteConfig.baseUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <main className="container page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />

      <section className="hero hero-home">
        <div>
          <p className="eyebrow">Технології, SEO і стабільний production</p>
          <h1>StackVarta — технічний блог із чистою структурою сторінок</h1>
          <p className="muted hero-copy">
            Публікації команди про frontend, backend, DevOps, AI, кібербезпеку та інструменти, з якими ми працюємо щодня. Ми одразу закладаємо SSR, metadata, canonical, перелінковку і технічні файли, щоб із сайтом було зручно працювати на лабораторних 4–6.
          </p>
          <div className="inline-list hero-actions">
            <Link href="/archive" className="button button-secondary">Відкрити архів</Link>
            <Link href="/about" className="pill">Редакційний підхід</Link>
          </div>
        </div>
      </section>

      <section className="panel section-spacer" aria-labelledby="categories-title">
        <div className="section-heading">
          <div>
            <h2 id="categories-title">Категорійні хаби</h2>
            <p className="muted">Головна посилається на всі ключові силоси, щоб сторінки були досяжні не більше ніж за 2–3 кліки.</p>
          </div>
        </div>
        <nav className="pill-list" aria-label="Фільтр категорій">
          <Link href="/" className={`pill ${!category ? 'is-active' : ''}`}>
            Усі категорії
          </Link>
          {categories.map((item) => (
            <Link
              key={item.slug}
              href={`/categories/${item.slug}`}
              className="pill"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </section>

      {leadArticle ? (
        <section className="panel section-spacer" aria-labelledby="featured-title">
          <div className="section-heading">
            <div>
              <h2 id="featured-title">Featured articles</h2>
              <p className="muted">Перший екран головної веде до пріоритетних матеріалів і допомагає швидко перевірити внутрішню перелінковку.</p>
            </div>
          </div>

          <div className="featured-grid">
            <article className="featured-lead">
              <Link href={`/articles/${leadArticle.slug}`} className="featured-image-link">
                <Image
                  src={leadArticle.coverUrl}
                  alt={leadArticle.coverAlt || leadArticle.title}
                  width={1600}
                  height={900}
                  className="featured-image"
                  priority
                  sizes="(max-width: 768px) 100vw, 720px"
                  unoptimized={shouldBypassOptimization(leadArticle.coverUrl)}
                />
              </Link>
              <div className="featured-content">
                {leadArticle.category ? (
                  <Link href={`/categories/${leadArticle.category.slug}`} className="badge">
                    {leadArticle.category.name}
                  </Link>
                ) : null}
                <h3>
                  <Link href={`/articles/${leadArticle.slug}`}>{leadArticle.title}</Link>
                </h3>
                <p className="muted">{leadArticle.excerpt}</p>
                <div className="inline-list">
                  <Link href={`/articles/${leadArticle.slug}`} className="button">
                    Читати статтю
                  </Link>
                  {leadArticle.author ? <Link href={`/authors/${leadArticle.author.slug}`} className="pill">{leadArticle.author.name}</Link> : null}
                </div>
              </div>
            </article>

            <div className="featured-stack">
              {featuredArticles.slice(1).map((article) => (
                <article key={article.slug} className="featured-mini">
                  <h3>
                    <Link href={`/articles/${article.slug}`}>{article.title}</Link>
                  </h3>
                  <p className="muted">{article.excerpt}</p>
                  <div className="inline-list">
                    {article.category ? (
                      <Link href={`/categories/${article.category.slug}`} className="pill">
                        {article.category.name}
                      </Link>
                    ) : null}
                    <Link href={`/articles/${article.slug}`} className="pill">Перейти до статті</Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="panel section-spacer" aria-labelledby="latest-title">
        <div className="section-heading">
          <div>
            <h2 id="latest-title">Останні статті</h2>
            <p className="muted">На головній зібрані анонси статей, категорії, автори й короткі описи матеріалів з чистими внутрішніми посиланнями.</p>
          </div>
        </div>

        {items.length ? (
          <div className="article-grid">
            {items.map((article, index) => (
              <ArticleCard key={article.slug} article={article} priority={index === 0 && !leadArticle} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>За обраним фільтром поки немає матеріалів.</p>
          </div>
        )}

        <Pagination
          basePath="/"
          page={meta.page}
          totalPages={meta.totalPages}
          extraParams={{ category }}
        />
      </section>
    </main>
  );
}
