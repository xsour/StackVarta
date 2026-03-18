import Link from 'next/link';
import ArticleCard from '../components/ArticleCard';
import Pagination from '../components/Pagination';
import { getHomePageData } from '../lib/api';

export const revalidate = 300;

export const metadata = {
  title: 'IT Blog — новини та статті про технології',
  description:
    'Останні матеріали про frontend, backend, DevOps, AI, кібербезпеку та корисні інструменти.',
  alternates: {
    canonical: '/'
  }
};

export default async function HomePage(props) {
  const searchParams = await props.searchParams;
  const category = searchParams?.category || '';
  const page = Math.max(1, Number(searchParams?.page || 1) || 1);
  const { items, meta, categories } = await getHomePageData({ page, category });

  return (
    <main className="container page">
      <section className="hero">
        <p className="eyebrow">Технології та практика</p>
        <h1>IT Blog</h1>
        <p className="muted">
          Публікації команди про frontend, backend, DevOps, AI, кібербезпеку та інструменти,
          з якими ми працюємо щодня.
        </p>
      </section>

      <section className="panel section-spacer" aria-labelledby="categories-title">
        <h2 id="categories-title">Категорії</h2>
        <nav className="pill-list" aria-label="Фільтр категорій">
          <Link href="/" className={`pill ${!category ? 'is-active' : ''}`}>
            Усі категорії
          </Link>
          {categories.map((item) => (
            <Link
              key={item.slug}
              href={`/?category=${item.slug}`}
              className={`pill ${category === item.slug ? 'is-active' : ''}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </section>

      <section className="panel section-spacer" aria-labelledby="latest-title">
        <h2 id="latest-title">Останні статті</h2>
        <p className="muted">
          На головній зібрані свіжі анонси статей, категорії, дати, автори й короткі описи матеріалів.
        </p>

        {items.length ? (
          <div className="article-grid">
            {items.map((article) => (
              <ArticleCard key={article.slug} article={article} />
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
