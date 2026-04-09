import Link from 'next/link';

import Breadcrumbs from '../../components/Breadcrumbs';
import { formatDate, formatMonthYear, parseDisplayDate } from '../../lib/date';
import { getFeedArticles } from '../../lib/api';
import { toAbsoluteUrl } from '../../lib/site-config';

export const revalidate = 300;

export const metadata = {
  title: 'Архів публікацій',
  description: 'Архів усіх статей StackVarta з групуванням за місяцями, категоріями та авторами.',
  alternates: {
    canonical: '/archive'
  },
  openGraph: {
    title: 'Архів публікацій | StackVarta',
    description: 'Архів усіх статей StackVarta з групуванням за місяцями, категоріями та авторами.',
    url: toAbsoluteUrl('/archive')
  }
};

function groupArticlesByMonth(articles) {
  const groups = new Map();

  articles.forEach((article) => {
    const date = parseDisplayDate(article.publishedAt || article.createdAt || Date.now()) || new Date();
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!groups.has(key)) {
      groups.set(key, []);
    }

    groups.get(key).push(article);
  });

  return Array.from(groups.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([key, items]) => ({ key, items }));
}

export default async function ArchivePage() {
  const articles = await getFeedArticles(100);
  const groups = groupArticlesByMonth(articles);

  return (
    <main className="container page">
      <section className="panel">
        <Breadcrumbs items={[{ label: 'Головна', href: '/' }, { label: 'Архів' }]} />
        <p className="eyebrow">Архів контенту</p>
        <h1>Архів публікацій</h1>
        <p className="muted">
          Архівна сторінка дає короткий шлях до будь-якої статті з головної навігації та зменшує глибину кліків для старших матеріалів.
        </p>
      </section>

      <section className="section-spacer archive-list">
        {groups.map((group) => {
          const anchorDate = parseDisplayDate(`${group.key}-01`);
          return (
            <section key={group.key} className="panel archive-month">
              <h2>{anchorDate ? formatMonthYear(anchorDate) : group.key}</h2>
              <ul className="archive-items">
                {group.items.map((article) => (
                  <li key={article.slug} className="archive-item">
                    <div>
                      <Link href={`/articles/${article.slug}`} className="archive-link">
                        {article.title}
                      </Link>
                      <p className="muted archive-meta">
                        {formatDate(article.publishedAt || article.createdAt)}
                        {article.category ? (
                          <>
                            {' · '}
                            <Link href={`/categories/${article.category.slug}`}>{article.category.name}</Link>
                          </>
                        ) : null}
                        {article.author ? (
                          <>
                            {' · '}
                            <Link href={`/authors/${article.author.slug}`}>{article.author.name}</Link>
                          </>
                        ) : null}
                      </p>
                    </div>
                    <Link href={`/articles/${article.slug}`} className="pill">Відкрити</Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </section>
    </main>
  );
}
