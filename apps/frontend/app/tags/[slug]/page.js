import Link from 'next/link';
import { notFound } from 'next/navigation';

import ArticleCard from '../../../components/ArticleCard';
import Breadcrumbs from '../../../components/Breadcrumbs';
import Pagination from '../../../components/Pagination';
import { getTagPageData, getTags } from '../../../lib/api';
import { toAbsoluteUrl } from '../../../lib/site-config';

export const revalidate = 300;

function buildCanonical(slug, page) {
  return page > 1 ? `/tags/${slug}?page=${page}` : `/tags/${slug}`;
}

export async function generateStaticParams() {
  const tags = await getTags();
  return tags.map((tag) => ({ slug: tag.slug }));
}

export async function generateMetadata(props) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const page = Math.max(1, Number(searchParams?.page || 1) || 1);
  const { tag } = await getTagPageData(params.slug, { page: 1 });

  if (!tag) {
    return {
      title: 'Тег не знайдено'
    };
  }

  const canonical = buildCanonical(tag.slug, page);
  const title = `Тег: ${tag.name}`;
  const description = `Службова колекція матеріалів з тегом ${tag.name}.`;

  return {
    title,
    description,
    alternates: {
      canonical
    },
    robots: {
      index: false,
      follow: true
    },
    openGraph: {
      title,
      description,
      url: toAbsoluteUrl(canonical)
    }
  };
}

export default async function TagPage(props) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const page = Math.max(1, Number(searchParams?.page || 1) || 1);
  const { tag, items, meta } = await getTagPageData(params.slug, { page });

  if (!tag) {
    notFound();
  }

  return (
    <main className="container page">
      <section className="panel">
        <Breadcrumbs items={[{ label: 'Головна', href: '/' }, { label: 'Теги', href: '/archive' }, { label: `#${tag.name}` }]} />
        <p className="eyebrow">Службова сторінка тегу</p>
        <h1>#{tag.name}</h1>
        <p className="muted">
          Теги допомагають навігації та внутрішній перелінковці, але сторінка закрита від індексації, щоб не створювати тонкі дубльовані колекції.
        </p>
        <div className="inline-list section-spacer">
          <Link href="/archive" className="pill">Архів</Link>
          <Link href="/search" className="pill">Пошук</Link>
        </div>
      </section>

      <section className="panel section-spacer">
        <h2>Матеріали за тегом</h2>
        {items.length ? (
          <div className="article-grid">
            {items.map((article, index) => (
              <ArticleCard key={article.slug} article={article} priority={index === 0 && page === 1} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>За цим тегом поки немає опублікованих статей.</p>
          </div>
        )}
        <Pagination basePath={`/tags/${tag.slug}`} page={meta.page} totalPages={meta.totalPages} />
      </section>
    </main>
  );
}
