import { notFound } from 'next/navigation';

import ArticleCard from '../../../components/ArticleCard';
import Pagination from '../../../components/Pagination';
import { getCategories, getCategoryPageData } from '../../../lib/api';
import { siteConfig } from '../../../lib/site-config';

export const revalidate = 300;

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata(props) {
  const params = await props.params;
  const { category } = await getCategoryPageData(params.slug, { page: 1 });

  if (!category) {
    return {
      title: 'Категорію не знайдено'
    };
  }

  return {
    title: category.name,
    description: category.description,
    alternates: {
      canonical: `/categories/${category.slug}`
    },
    openGraph: {
      title: `${category.name} | ${siteConfig.name}`,
      description: category.description,
      url: `/categories/${category.slug}`
    }
  };
}

export default async function CategoryPage(props) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const page = Math.max(1, Number(searchParams?.page || 1) || 1);
  const { category, items, meta } = await getCategoryPageData(params.slug, { page });

  if (!category) {
    notFound();
  }

  return (
    <main className="container page">
      <section className="panel">
        <p className="eyebrow">Категорія</p>
        <h1>{category.name}</h1>
        <p className="muted">{category.description}</p>
      </section>

      <section className="panel section-spacer">
        <h2>Статті категорії</h2>
        {items.length ? (
          <div className="article-grid">
            {items.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>У цій категорії поки немає опублікованих статей.</p>
          </div>
        )}
        <Pagination basePath={`/categories/${category.slug}`} page={meta.page} totalPages={meta.totalPages} />
      </section>
    </main>
  );
}
