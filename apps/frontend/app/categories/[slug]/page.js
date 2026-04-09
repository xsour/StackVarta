import Link from 'next/link';
import { notFound } from 'next/navigation';

import ArticleCard from '../../../components/ArticleCard';
import Breadcrumbs from '../../../components/Breadcrumbs';
import Pagination from '../../../components/Pagination';
import { getCategories, getCategoryPageData } from '../../../lib/api';
import { toAbsoluteUrl } from '../../../lib/site-config';

export const revalidate = 300;

function buildCanonical(slug, page) {
  return page > 1 ? `/categories/${slug}?page=${page}` : `/categories/${slug}`;
}

function getCategoryHighlights(items) {
  const authorMap = new Map();
  const tagMap = new Map();

  items.forEach((article) => {
    if (article.author?.slug) {
      authorMap.set(article.author.slug, article.author);
    }

    (article.tags || []).forEach((tag) => {
      if (tag.slug) {
        tagMap.set(tag.slug, tag);
      }
    });
  });

  return {
    authors: Array.from(authorMap.values()).slice(0, 3),
    tags: Array.from(tagMap.values()).slice(0, 6)
  };
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata(props) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const page = Math.max(1, Number(searchParams?.page || 1) || 1);
  const { category } = await getCategoryPageData(params.slug, { page: 1 });

  if (!category) {
    return {
      title: 'Категорію не знайдено'
    };
  }

  const canonical = buildCanonical(category.slug, page);
  const title = `${category.name}: статті, добірки та практичні гайди`;
  const description = category.description;

  return {
    title,
    description,
    alternates: {
      canonical
    },
    openGraph: {
      title,
      description,
      url: toAbsoluteUrl(canonical),
      type: 'website'
    }
  };
}

export default async function CategoryPage(props) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const page = Math.max(1, Number(searchParams?.page || 1) || 1);
  const [{ category, items, meta }, allCategories] = await Promise.all([
    getCategoryPageData(params.slug, { page }),
    getCategories()
  ]);

  if (!category) {
    notFound();
  }

  const { authors, tags } = getCategoryHighlights(items);
  const siblingCategories = allCategories.filter((item) => item.slug !== category.slug).slice(0, 4);
  const breadcrumbs = [
    { label: 'Головна', href: '/' },
    { label: category.name }
  ];

  return (
    <main className="container page">
      <section className="panel">
        <Breadcrumbs items={breadcrumbs} />
        <p className="eyebrow">Категорійний хаб</p>
        <h1>{category.name}</h1>
        <p className="muted category-copy">{category.description}</p>

        <div className="inline-list section-spacer">
          <span className="pill">{meta.total} матеріалів</span>
          <span className="pill">Сторінка {meta.page} з {meta.totalPages}</span>
          <Link href="/archive" className="pill">Архів усіх публікацій</Link>
        </div>
      </section>

      <section className="panel section-spacer">
        <div className="section-heading">
          <div>
            <h2>Що входить до цього силосу</h2>
            <p className="muted">
              Категорія зібрана як окремий тематичний хаб: усі матеріали посилаються на сторінку категорії,
              а сторінка категорії підсилює статті списком, чистими URL та контекстними переходами.
            </p>
          </div>
        </div>

        <div className="content-links-grid">
          <article className="panel panel-soft compact-panel">
            <h3>Автори в цій темі</h3>
            {authors.length ? (
              <div className="inline-list">
                {authors.map((author) => (
                  <Link key={author.slug} href={`/authors/${author.slug}`} className="pill">
                    {author.name}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="muted">Автори для цієї категорії з’являться після публікації матеріалів.</p>
            )}
          </article>

          <article className="panel panel-soft compact-panel">
            <h3>Часті теги</h3>
            {tags.length ? (
              <div className="inline-list">
                {tags.map((tag) => (
                  <Link key={tag.slug} href={`/tags/${tag.slug}`} className="tag">
                    #{tag.name}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="muted">Теги ще не заповнені для цієї категорії.</p>
            )}
          </article>

          <article className="panel panel-soft compact-panel">
            <h3>Суміжні хаби</h3>
            <div className="inline-list">
              {siblingCategories.map((item) => (
                <Link key={item.slug} href={`/categories/${item.slug}`} className="pill">
                  {item.name}
                </Link>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="panel section-spacer">
        <div className="section-heading">
          <div>
            <h2>Статті категорії</h2>
            <p className="muted">
              Кожна картка посилається на статтю, автора та відповідний тематичний розділ, щоб сторінки не залишалися orphan.
            </p>
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
            <p>У цій категорії поки немає опублікованих статей.</p>
          </div>
        )}

        <Pagination basePath={`/categories/${category.slug}`} page={meta.page} totalPages={meta.totalPages} />
      </section>
    </main>
  );
}
