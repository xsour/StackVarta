import Link from 'next/link';

import Breadcrumbs from '../../components/Breadcrumbs';
import { getAboutPageData } from '../../lib/api';
import { toAbsoluteUrl } from '../../lib/site-config';

export const revalidate = 300;

export async function generateMetadata() {
  const aboutData = await getAboutPageData();

  return {
    title: 'Контакти',
    description: 'Контакти редакції StackVarta для фідбеку, технічних питань і співпраці.',
    alternates: {
      canonical: '/contacts'
    },
    openGraph: {
      title: 'Контакти | StackVarta',
      description: 'Контакти редакції StackVarta для фідбеку, технічних питань і співпраці.',
      url: toAbsoluteUrl('/contacts')
    },
    other: {
      contact_email: aboutData?.contacts?.email || ''
    }
  };
}

export default async function ContactsPage() {
  const data = await getAboutPageData();
  const email = data?.contacts?.email || '';
  const socialLinks = Array.isArray(data?.socialLinks) ? data.socialLinks : [];

  const contactJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Контакти StackVarta',
    url: toAbsoluteUrl('/contacts'),
    mainEntity: {
      '@type': 'Organization',
      name: data.name,
      email: email || undefined,
      sameAs: socialLinks.map((link) => link.url)
    }
  };

  return (
    <main className="container page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }} />

      <section className="panel">
        <Breadcrumbs items={[{ label: 'Головна', href: '/' }, { label: 'Контакти' }]} />
        <p className="eyebrow">Зв’язок з редакцією</p>
        <h1>Контакти</h1>
        <p className="muted">
          Тут зібрані базові контакти й корисні переходи, які потрібні для довіри до проєкту та коректної структури службових сторінок.
        </p>
      </section>

      <section className="panel section-spacer contacts-grid">
        <article className="panel panel-soft compact-panel">
          <h2>Email</h2>
          {email ? (
            <p>
              <a href={`mailto:${email}`} className="pill">{email}</a>
            </p>
          ) : (
            <p className="muted">Контактний email тимчасово не вказано.</p>
          )}
          <p className="muted">Використовуйте пошту для пропозицій, фідбеку по матеріалах або технічних запитань.</p>
        </article>

        <article className="panel panel-soft compact-panel">
          <h2>Соціальні профілі</h2>
          {socialLinks.length ? (
            <div className="inline-list">
              {socialLinks.map((link) => (
                <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="pill">
                  {link.name}
                </a>
              ))}
            </div>
          ) : (
            <p className="muted">Соцмережі поки не додані.</p>
          )}
        </article>

        <article className="panel panel-soft compact-panel">
          <h2>Швидкі переходи</h2>
          <div className="inline-list">
            <Link href="/about" className="pill">Про нас</Link>
            <Link href="/authors" className="pill">Автори</Link>
            <Link href="/archive" className="pill">Архів</Link>
          </div>
        </article>
      </section>
    </main>
  );
}
