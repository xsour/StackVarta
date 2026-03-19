import Link from 'next/link';

function getNavLabel(category) {
  return category.shortName || category.name;
}

export default function SiteHeader({ categories = [] }) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <div>
          <Link href="/" className="brand">
            StackVarta
          </Link>
        </div>

        <nav aria-label="Основна навігація" className="main-nav">
          <Link href="/">Головна</Link>

          <div className="dropdown">
            <span className="dropdown-title">Категорії ▾</span>

            <div className="dropdown-menu">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/categories/${category.slug}`}
                >
                  {getNavLabel(category)}
                </Link>
              ))}
            </div>
          </div>

          <Link href="/search">Пошук</Link>
          <Link href="/rss.xml">RSS</Link>
          <Link href="/about">About</Link>
          <Link href="/admin">Admin</Link>
        </nav>
      </div>
    </header>
  );
}
