import Link from 'next/link';

import ArticleCard from '../../components/ArticleCard';
import Breadcrumbs from '../../components/Breadcrumbs';
import { getSearchResults } from '../../lib/api';

export async function generateMetadata() {
  return {
    title: 'Пошук по блогу',
    description: 'Пошук статей за заголовком, описом, текстом та тегами.',
    alternates: {
      canonical: '/search'
    },
    robots: {
      index: false,
      follow: true
    }
  };
}

export default async function SearchPage(props) {
  const searchParams = await props.searchParams;
  const query = String(searchParams?.q || '').trim();
  const results = query ? await getSearchResults(query) : [];

  return (
    <main className="container page">
      <section className="panel">
        <Breadcrumbs items={[{ label: 'Головна', href: '/' }, { label: 'Пошук' }]} />
        <p className="eyebrow">Пошук</p>
        <h1>Пошук по блогу</h1>
        <p className="muted">
          Сторінка пошуку доступна для користувачів, але закрита від індексації, щоб не створювати thin pages з параметрами.
        </p>

        <form action="/search" method="get" className="search-form search-form-panel">
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Наприклад: canonical, Railway, SSR, PostgreSQL"
            className="input"
          />
          <button type="submit" className="button">
            Знайти
          </button>
        </form>

        <div className="inline-list section-spacer">
          <Link href="/search?q=canonical" className="pill">canonical</Link>
          <Link href="/search?q=breadcrumbs" className="pill">breadcrumbs</Link>
          <Link href="/search?q=railway" className="pill">Railway</Link>
          <Link href="/search?q=schema" className="pill">schema</Link>
        </div>
      </section>

      {query ? (
        <section className="panel section-spacer">
          <div className="section-heading">
            <div>
              <h2>Результати для: {query}</h2>
              <p className="muted">Знайдено {results.length} матеріалів із релевантними входженнями в заголовку, описі, тексті або тегах.</p>
            </div>
          </div>

          {results.length ? (
            <div className="article-grid">
              {results.map((article, index) => (
                <ArticleCard key={article.slug} article={article} priority={index === 0} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>За цим запитом матеріалів поки не знайдено. Спробуйте інші ключові слова або перейдіть до архіву.</p>
              <div className="inline-list section-spacer">
                <Link href="/archive" className="button button-secondary">Відкрити архів</Link>
                <Link href="/" className="pill">Повернутися на головну</Link>
              </div>
            </div>
          )}
        </section>
      ) : (
        <section className="empty-state section-spacer">
          <p>Введіть ключове слово, щоб знайти матеріали по темі, або скористайтеся навігацією за категоріями.</p>
        </section>
      )}
    </main>
  );
}
