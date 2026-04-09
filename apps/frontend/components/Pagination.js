import Link from 'next/link';

function buildHref(basePath, page, extraParams = {}) {
  const params = new URLSearchParams();

  Object.entries(extraParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });

  if (page > 1) {
    params.set('page', String(page));
  }

  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export default function Pagination({ basePath = '/', page, totalPages, extraParams = {} }) {
  if (totalPages <= 1) {
    return null;
  }

  const currentPage = Math.max(1, Number(page) || 1);
  const prevHref = buildHref(basePath, currentPage - 1, extraParams);
  const nextHref = buildHref(basePath, currentPage + 1, extraParams);

  return (
    <nav className="pagination" aria-label="Пагінація">
      {currentPage > 1 ? (
        <Link href={prevHref} className="pagination-link">
          ← Попередня
        </Link>
      ) : (
        <span className="pagination-link disabled">← Попередня</span>
      )}

      <span className="pagination-status">
        Сторінка {currentPage} з {totalPages}
      </span>

      {currentPage < totalPages ? (
        <Link href={nextHref} className="pagination-link">
          Наступна →
        </Link>
      ) : (
        <span className="pagination-link disabled">Наступна →</span>
      )}
    </nav>
  );
}
