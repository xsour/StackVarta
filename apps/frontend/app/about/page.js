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
        <h2>Місія та редакційна політика</h2>
        <div className="content">
          <p>{data.mission}</p>
        </div>
      </section>

      <section className="panel section-spacer">
        <h2>Контакти</h2>
        <ul className="details-list">
          <li>
            <strong>Email:</strong> <a href={`mailto:${data.contacts.email}`}>{data.contacts.email}</a>
          </li>
          <li>
            <strong>Дата заснування:</strong> {new Date(data.foundedDate).toLocaleDateString('uk-UA')}
          </li>
        </ul>
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
    </main>
  );
}
