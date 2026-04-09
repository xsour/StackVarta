import Image from 'next/image';
import Link from 'next/link';

const LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g;

function isExternalLink(href = '') {
  return /^https?:\/\//i.test(href);
}

function renderRichText(text) {
  const value = String(text || '');
  if (!value) return null;

  const nodes = [];
  let lastIndex = 0;
  let match;

  while ((match = LINK_PATTERN.exec(value)) !== null) {
    const [fullMatch, label, href] = match;
    const start = match.index;

    if (start > lastIndex) {
      nodes.push(value.slice(lastIndex, start));
    }

    if (isExternalLink(href)) {
      nodes.push(
        <a key={`${href}-${start}`} href={href} target="_blank" rel="noopener noreferrer">
          {label}
        </a>
      );
    } else {
      nodes.push(
        <Link key={`${href}-${start}`} href={href}>
          {label}
        </Link>
      );
    }

    lastIndex = start + fullMatch.length;
  }

  if (lastIndex < value.length) {
    nodes.push(value.slice(lastIndex));
  }

  return nodes;
}

function shouldBypassOptimization(src = '') {
  return String(src).toLowerCase().endsWith('.svg');
}

export default function RichArticleContent({ article }) {
  const intro = Array.isArray(article?.intro) ? article.intro : [];
  const sections = Array.isArray(article?.sections) ? article.sections : [];
  const faq = Array.isArray(article?.faq) ? article.faq : [];
  const cta = article?.cta;

  return (
    <>
      {intro.length ? (
        <section className="article-content prose" aria-labelledby="article-intro-title">
          <h2 id="article-intro-title" className="visually-hidden">
            Вступ до матеріалу
          </h2>
          {intro.map((paragraph, index) => (
            <p key={`intro-${index}`}>{renderRichText(paragraph)}</p>
          ))}
        </section>
      ) : null}

      {sections.map((section, index) => (
        <section key={`${section.title}-${index}`} className="article-content prose article-section">
          <h2>{section.title}</h2>

          {Array.isArray(section.paragraphs)
            ? section.paragraphs.map((paragraph, paragraphIndex) => (
                <p key={`${section.title}-paragraph-${paragraphIndex}`}>{renderRichText(paragraph)}</p>
              ))
            : null}

          {section.image ? (
            <figure className="content-figure">
              <Image
                src={section.image.src}
                alt={section.image.alt || section.title}
                width={1200}
                height={720}
                className="content-figure-image"
                sizes="(max-width: 768px) 100vw, 720px"
                unoptimized={shouldBypassOptimization(section.image.src)}
              />
              {section.image.caption ? <figcaption>{section.image.caption}</figcaption> : null}
            </figure>
          ) : null}

          {Array.isArray(section.checklist) && section.checklist.length ? (
            <ul className="article-checklist">
              {section.checklist.map((item) => (
                <li key={item}>{renderRichText(item)}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}

      {faq.length ? (
        <section className="article-content prose faq-block" aria-labelledby="faq-title">
          <h2 id="faq-title">FAQ</h2>
          <div className="faq-list">
            {faq.map((item, index) => (
              <article key={`${item.question}-${index}`} className="faq-item">
                <h3>{item.question}</h3>
                <p>{renderRichText(item.answer)}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {cta ? (
        <section className="article-content prose cta-box" aria-labelledby="cta-title">
          <h2 id="cta-title">{cta.title}</h2>
          <p>{renderRichText(cta.text)}</p>
          <Link href={cta.href} className="button cta-button">
            {cta.label}
          </Link>
        </section>
      ) : null}
    </>
  );
}
