import { notFound } from 'next/navigation';

import ArticleCard from '../../../components/ArticleCard';
import Pagination from '../../../components/Pagination';
import { getTagPageData, getTags } from '../../../lib/api';
import { siteConfig } from '../../../lib/site-config';

export const revalidate = 300;

export async function generateStaticParams() {
  const tags = await getTags();
  return tags.map((tag) => ({ slug: tag.slug }));
}

export async function generateMetadata(props) {
  const params = await props.params;
  const { tag } = await getTagPageData(params.slug, { page: 1 });

  if (!tag) {
    return {
      title: 'Тег не знайдено'
    };
  }

  return {
    title: `Тег: ${tag.name}`,
    description: `Список статей з тегом ${tag.name}`,
    alternates: {
      canonical: `/tags/${tag.slug}`
    },
    openGraph: {
      title: `Тег: ${tag.name} | ${siteConfig.name}`,
      description: `Список статей з тегом ${tag.name}`,
      url: `/tags/${tag.slug}`
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
        <p className="eyebrow">Тег</p>
        <h1>#{tag.name}</h1>
        <p className="muted">Список матеріалів, де використано цей тег.</p>
      </section>

      <section className="panel section-spacer">
        <h2>Матеріали за тегом</h2>
        {items.length ? (
          <div className="article-grid">
            {items.map((article) => (
              <ArticleCard key={article.slug} article={article} />
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
