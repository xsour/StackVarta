import Link from 'next/link';

export default function Breadcrumbs({ items = [], className = '' }) {
  if (!Array.isArray(items) || items.length < 2) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumbs" className={`breadcrumbs ${className}`.trim()}>
      <ol className="breadcrumbs-list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const key = `${item.label}-${index}`;

          return (
            <li key={key} className="breadcrumbs-item">
              {item.href && !isLast ? (
                <Link href={item.href}>{item.label}</Link>
              ) : (
                <span aria-current={isLast ? 'page' : undefined}>{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
