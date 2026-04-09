import { getAboutPageData } from '../../lib/api';

export const revalidate = 300;

function parseDisplayDate(value) {
  if (!value) return null;

  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  return new Date(value);
}

function formatLaunchNote(value) {
  if (!value) return '';

  const parsedDate = parseDisplayDate(value);
  if (!parsedDate || Number.isNaN(parsedDate.getTime())) return '';

  const monthNames = [
    'січні',
    'лютому',
    'березні',
    'квітні',
    'травні',
    'червні',
    'липні',
    'серпні',
    'вересні',
    'жовтні',
    'листопаді',
    'грудні'
  ];

  const monthName = monthNames[parsedDate.getMonth()] || '';
  const year = parsedDate.getFullYear();

  return `Проєкт офіційно запущено в ${monthName} ${year} року як незалежну ініціативу в межах освітнього курсу з SEO-оптимізації та просування.`;
}

export async function generateMetadata() {
  const data = await getAboutPageData();

  return {
    title: data.title || 'Про нас',
    description: data.description,
    alternates: {
      canonical: '/about'
    }
  };
}

export default async function AboutPage() {
  const data = await getAboutPageData();
  const email = data?.contacts?.email || '';
  const socialLinks = Array.isArray(data?.socialLinks) ? data.socialLinks : [];
  const foundedLabel = data?.foundedAt || (data?.foundedDate ? 'Запуск' : '');
  const foundedNote = data?.foundedNote || formatLaunchNote(data?.foundedDate);

  return (
    <main className="container page">
      <section className="hero">
        <p className="eyebrow">Про проєкт</p>
        <h1>{data.name}</h1>
        <p className="muted">{data.description}</p>
      </section>

      <section className="panel section-spacer">
        <h2>Місія</h2>
        <div className="content">
          <p>{data.mission}</p>
        </div>
      </section>

      <section className="panel section-spacer">
        <h2>Контакти</h2>
        <p className="muted" style={{ margin: '0 0 16px', lineHeight: 1.6 }}>
          Для пропозицій, фідбеку або запитів на співпрацю:
        </p>
        {email ? (
          <a href={`mailto:${email}`} className="pill" style={{ display: 'inline-flex' }}>
            {email}
          </a>
        ) : (
          <p className="muted">Контактний email тимчасово не вказано.</p>
        )}
      </section>

      <section className="panel section-spacer">
        <h2>Соцмережі</h2>
        {socialLinks.length ? (
          <nav className="pill-list">
            {socialLinks.map((link) => (
              <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="pill">
                {link.name}
              </a>
            ))}
          </nav>
        ) : (
          <p className="muted">Соцмережі проєкту поки не додано.</p>
        )}
      </section>

      {(foundedLabel || foundedNote) ? (
        <section className="panel section-spacer about-launch-panel" style={{ borderStyle: 'dashed', opacity: 0.9 }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'baseline', flexWrap: 'wrap' }}>
            {foundedLabel ? (
              <span
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: 'var(--accent)',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase'
                }}
              >
                {foundedLabel}
              </span>
            ) : null}
            {foundedNote ? (
              <p className="muted" style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.6 }}>
                {foundedNote}
              </p>
            ) : null}
          </div>
        </section>
      ) : null}
    </main>
  );
}
