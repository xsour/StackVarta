import Link from 'next/link';

import Breadcrumbs from '../../components/Breadcrumbs';
import { formatMonthYear } from '../../lib/date';
import { getAboutPageData } from '../../lib/api';
import { toAbsoluteUrl } from '../../lib/site-config';

export const revalidate = 300;

export async function generateMetadata() {
  const data = await getAboutPageData();

  return {
    title: data.title || 'Про нас',
    description: data.description,
    alternates: {
      canonical: '/about'
    },
    openGraph: {
      title: `${data.title || 'Про нас'} | StackVarta`,
      description: data.description,
      url: toAbsoluteUrl('/about')
    }
  };
}

export default async function AboutPage() {
  const data = await getAboutPageData();
  const email = data?.contacts?.email || '';
  const socialLinks = Array.isArray(data?.socialLinks) ? data.socialLinks : [];
  const launchMonth = data?.foundedDate ? formatMonthYear(data.foundedDate) : '';

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: data.name,
    url: toAbsoluteUrl('/'),
    description: data.description,
    foundingDate: data.foundedDate,
    email: email || undefined,
    sameAs: socialLinks.map((link) => link.url),
    logo: toAbsoluteUrl('/site-logo.svg'),
    contactPoint: email
      ? [
          {
            '@type': 'ContactPoint',
            email,
            contactType: 'editorial support',
            availableLanguage: ['uk']
          }
        ]
      : undefined
  };

  return (
    <main className="container page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />

      <section className="hero">
        <Breadcrumbs items={[{ label: 'Головна', href: '/' }, { label: 'Про нас' }]} />
        <p className="eyebrow">Про редакцію</p>
        <h1>{data.name}</h1>
        <p className="muted hero-copy">{data.description}</p>
        <div className="inline-list section-spacer">
          {launchMonth ? <span className="pill">Працюємо з {launchMonth}</span> : null}
          <Link href="/authors" className="pill">Профілі авторів</Link>
          <Link href="/contacts" className="pill">Контакти</Link>
        </div>
      </section>

      <section className="panel section-spacer">
        <h2>Місія і редакційний підхід</h2>
        <div className="content">
          <p>{data.mission}</p>
          <p>
            Ми ведемо проєкт як технічний блог із прозорою структурою сторінок: у статтях є авторство, дата оновлення,
            breadcrumbs, внутрішні переходи та schema-розмітка. Це допомагає одночасно і читачеві, і команді, яка робить SEO-аудит по коду.
          </p>
        </div>
      </section>

      <section className="panel section-spacer">
        <h2>Що вже є в публічній частині</h2>
        <div className="content-links-grid">
          <article className="panel panel-soft compact-panel">
            <h3>Авторські профілі</h3>
            <p className="muted">Кожен профіль містить ім’я, біографію, зовнішні профілі та список матеріалів автора.</p>
          </article>

          <article className="panel panel-soft compact-panel">
            <h3>Категорійні хаби</h3>
            <p className="muted">Головна веде до всіх основних силосів, а сторінки категорій збирають статті за темою.</p>
          </article>

          <article className="panel panel-soft compact-panel">
            <h3>Технічні сигнали</h3>
            <p className="muted">Canonical, sitemap, robots.txt, JSON-LD і noindex для thin/service pages налаштовані на рівні шаблонів.</p>
          </article>
        </div>
      </section>

      <section className="panel section-spacer">
        <h2>Контакти й соціальні профілі</h2>
        {email ? (
          <p>
            <a href={`mailto:${email}`} className="pill">{email}</a>
          </p>
        ) : (
          <p className="muted">Контактний email тимчасово не вказано.</p>
        )}

        {socialLinks.length ? (
          <nav className="pill-list section-spacer">
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
    </main>
  );
}
