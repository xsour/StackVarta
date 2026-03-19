import { getAboutPageData } from '../../lib/api';

export const revalidate = 300;

export async function generateMetadata() {
  const data = await getAboutPageData();

  return {
    title: data.title,
    description: data.description,
    alternates: {
      canonical: '/about'
    }
  };
}

export default async function AboutPage() {
  const data = await getAboutPageData();

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
        <a href={`mailto:${data.contacts.email}`} className="pill" style={{ display: 'inline-flex' }}>
          {data.contacts.email}
        </a>
      </section>

      <section className="panel section-spacer">
        <h2>Соцмережі</h2>
        <nav className="pill-list">
          {data.socialLinks.map((link) => (
            <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="pill">
              {link.name}
            </a>
          ))}
        </nav>
      </section>

      {(data.foundedAt || data.foundedNote) && (
        <section className="panel section-spacer" style={{ borderStyle: 'dashed', opacity: 0.8 }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'baseline', flexWrap: 'wrap' }}>
            {data.foundedAt && (
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                {data.foundedAt}
              </span>
            )}
            {data.foundedNote && (
              <p className="muted" style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.6 }}>
                {data.foundedNote}
              </p>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
