import Image from 'next/image';
import { notFound } from 'next/navigation';

import ArticleCard from '../../../components/ArticleCard';
import Pagination from '../../../components/Pagination';
import { getAuthorPageData, getAuthors } from '../../../lib/api';
import { siteConfig } from '../../../lib/site-config';

export const revalidate = 86400;

export async function generateStaticParams() {
  const authors = await getAuthors();
  return authors.map((author) => ({ slug: author.slug }));
}

export async function generateMetadata(props) {
  const params = await props.params;
  const { author } = await getAuthorPageData(params.slug, { page: 1 });

  if (!author) {
    return {
      title: 'Автора не знайдено'
    };
  }

  const authorName = author.fullName || author.name;

  return {
    title: `Профіль автора ${authorName}`,
    description: author.bio,
    alternates: {
      canonical: `/authors/${author.slug}`
    },
    openGraph: {
      title: `Профіль автора ${authorName} | ${siteConfig.name}`,
      description: author.bio,
      url: `/authors/${author.slug}`
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

  const socials = author.socials || {
    linkedin: author.linkedinUrl || null,
    github: author.githubUrl || null
  };

  return (
    <main className="container page">
      <section className="author-box">
        <div className="author-top">
          <Image
            src={author.avatarUrl || '/author-avatar.svg'}
            alt={author.name}
            width={120}
            height={120}
            className="author-avatar"
            style={{ borderRadius: '50%', objectFit: 'cover' }}
          />
          <div>
            <p className="eyebrow">Автор профілю</p>
            <h1>{author.fullName || author.name}</h1>
            <p className="muted" style={{ fontSize: '1.1rem', marginBottom: '16px' }}>
              {author.bio}
            </p>

            <div className="author-meta-footer" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center' }}>
              <div className="stats">
                <strong>{author.totalArticles || 0}</strong> <span className="muted">статей опубліковано</span>
              </div>

              <div className="social-links" style={{ display: 'flex', gap: '12px' }}>
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
        </div>
      </section>

      <section className="panel section-spacer">
        <h2>Матеріали автора</h2>
        {items.length ? (
          <div className="article-grid">
            {items.map((article) => (
              <ArticleCard key={article.slug} article={article} />
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
