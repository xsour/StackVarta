import Link from 'next/link';

import { siteConfig } from '../lib/site-config';

function getNavLabel(category) {
  return category.shortName || category.name;
}

export default function SiteHeader({ categories = [] }) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <div>
          <Link href="/" className="brand">
            {siteConfig.name}
          </Link>
          <p className="brand-note">Технічний блог про SEO-ready frontend, backend і DevOps.</p>
        </div>

        <nav aria-label="Основна навігація" className="main-nav">
          <Link href="/">Головна</Link>

          <details className="dropdown">
            <summary className="dropdown-title">Категорії</summary>
            <div className="dropdown-menu">
              {categories.map((category) => (
                <Link key={category.slug} href={`/categories/${category.slug}`}>
                  {getNavLabel(category)}
                </Link>
              ))}
            </div>
          </details>

          <Link href="/authors">Автори</Link>
          <Link href="/archive">Архів</Link>
          <Link href="/search">Пошук</Link>
          <Link href="/about">Про нас</Link>
          <Link href="/contacts">Контакти</Link>
        </nav>
      </div>
    </header>
  );
}
