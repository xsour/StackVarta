import Image from 'next/image';
import Link from 'next/link';

import Breadcrumbs from '../../components/Breadcrumbs';
import { getAuthors, getFeedArticles } from '../../lib/api';
import { toAbsoluteImageUrl, toAbsoluteUrl } from '../../lib/site-config';

export const revalidate = 300;

export const metadata = {
  title: 'Автори',
  description: 'Публічний список авторів StackVarta з короткою біографією та переходами до матеріалів.',
  alternates: {
    canonical: '/authors'
  },
  openGraph: {
    title: 'Автори | StackVarta',
    description: 'Публічний список авторів StackVarta з короткою біографією та переходами до матеріалів.',
    url: toAbsoluteUrl('/authors')
  }
};

export default async function AuthorsPage() {
  const [authors, articles] = await Promise.all([getAuthors(), getFeedArticles(100)]);
  const counts = articles.reduce((accumulator, article) => {
    if (article.author?.slug) {
      accumulator[article.author.slug] = (accumulator[article.author.slug] || 0) + 1;
    }
    return accumulator;
  }, {});

  const categoriesByAuthor = articles.reduce((accumulator, article) => {
    if (!article.author?.slug || !article.category?.slug) {
      return accumulator;
    }

    if (!accumulator[article.author.slug]) {
      accumulator[article.author.slug] = new Map();
    }

    accumulator[article.author.slug].set(article.category.slug, article.category);
    return accumulator;
  }, {});

  const authorsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: authors.map((author, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Person',
        name: author.fullName || author.name,
        url: toAbsoluteUrl(`/authors/${author.slug}`),
        image: author.avatarUrl ? toAbsoluteImageUrl(author.avatarUrl) : undefined
      }
    }))
  };

  return (
    <main className="container page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(authorsJsonLd) }} />

      <section className="panel">
        <Breadcrumbs items={[{ label: 'Головна', href: '/' }, { label: 'Автори' }]} />
        <p className="eyebrow">Команда авторів</p>
        <h1>Автори StackVarta</h1>
        <p className="muted">
          Профілі авторів відкриті в навігації, щоб підсилювати E-E-A-T сигнали, авторство статей і логіку внутрішньої перелінковки.
        </p>
      </section>

      <section className="section-spacer author-list-grid">
        {authors.map((author) => {
          const topicalCategories = Array.from(categoriesByAuthor[author.slug]?.values() || []).slice(0, 3);
          const totalArticles = counts[author.slug] || 0;

          return (
            <article key={author.slug} className="panel author-panel-card">
              <div className="author-top author-featured">
                <Image
                  src={author.avatarUrl || '/author-avatar.svg'}
                  alt={`Фото автора ${author.fullName || author.name}`}
                  width={96}
                  height={96}
                  sizes="96px"
                  className="author-avatar-large"
                  style={{ borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <p className="eyebrow">Автор</p>
                  <h2 className="author-card-title">
                    <Link href={`/authors/${author.slug}`} className="link-accent">
                      {author.fullName || author.name}
                    </Link>
                  </h2>
                  <p className="muted author-card-bio">{author.bio}</p>
                </div>
              </div>

              <div className="inline-list section-spacer">
                <span className="pill">{totalArticles} матеріалів</span>
                {topicalCategories.map((category) => (
                  <Link key={category.slug} href={`/categories/${category.slug}`} className="pill">
                    {category.name}
                  </Link>
                ))}
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
