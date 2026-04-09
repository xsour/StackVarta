import Link from 'next/link';

import { siteConfig } from '../lib/site-config';

export default function SiteFooter({ categories = [], latestArticles = [] }) {
  return (
    <footer className="site-footer">
      <div className="container footer-inner footer-grid">
        <section>
          <h2 className="footer-title">{siteConfig.name}</h2>
          <p className="muted footer-copy">
            Контентний проєкт про технічне SEO, продуктивність, архітектуру шаблонів і стабільний деплой без зайвого шуму.
          </p>
          <div className="footer-meta">
            <Link href="/rss.xml">RSS</Link>
            <Link href="/contacts">Зв’язатися з нами</Link>
          </div>
        </section>

        <section>
          <h2 className="footer-title">Ключові сторінки</h2>
          <ul className="footer-links">
            <li><Link href="/about">Про нас</Link></li>
            <li><Link href="/authors">Автори</Link></li>
            <li><Link href="/archive">Архів</Link></li>
            <li><Link href="/search">Пошук</Link></li>
          </ul>
        </section>

        <section>
          <h2 className="footer-title">Категорії</h2>
          <ul className="footer-links">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link href={`/categories/${category.slug}`}>{category.name}</Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="footer-title">Свіжі матеріали</h2>
          <ul className="footer-links footer-links-compact">
            {latestArticles.map((article) => (
              <li key={article.slug}>
                <Link href={`/articles/${article.slug}`}>{article.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </footer>
  );
}
