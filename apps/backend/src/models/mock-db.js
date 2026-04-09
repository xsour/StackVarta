const categories = [
  {
    id: 1,
    name: 'JavaScript / Frontend',
    slug: 'javascript-frontend',
    description: 'Новини та практичні матеріали про React, Next.js, SSR і семантичну розмітку.'
  },
  {
    id: 2,
    name: 'Backend та DevOps',
    slug: 'backend-devops',
    description: 'API, PostgreSQL, Railway, deployment та стабільна інфраструктура проєкту.'
  },
  {
    id: 3,
    name: 'Штучний інтелект та ML',
    slug: 'ai-ml',
    description: 'Практичні AI/ML матеріали для технічного блогу.'
  },
  {
    id: 4,
    name: 'Кібербезпека',
    slug: 'cybersecurity',
    description: 'Безпека публічного сайту, admin-зони та технічні перевірки.'
  },
  {
    id: 5,
    name: 'Огляди інструментів та технологій',
    slug: 'tools-reviews',
    description: 'Корисні сервіси та зв’язки інструментів для команди.'
  }
];

const users = [
  {
    id: 1,
    name: 'Олег Коваль',
    slug: 'oleh-koval',
    email: 'oleh@example.com',
    password: 'change-me',
    bio: 'Frontend/SEO ентузіаст.',
    avatar_url: '/author-avatar.svg',
    is_admin: true
  },
  {
    id: 2,
    name: 'Ірина Гнатюк',
    slug: 'iryna-hnatiuk',
    email: 'iryna@example.com',
    password: 'change-me',
    bio: 'Backend інженерка.',
    avatar_url: '/author-avatar.svg',
    is_admin: true
  },
  {
    id: 3,
    name: 'Максим Бондар',
    slug: 'maksym-bondar',
    email: 'maksym@example.com',
    password: 'change-me',
    bio: 'DevOps і технічний редактор.',
    avatar_url: '/author-avatar.svg',
    is_admin: true
  }
];

const tags = [
  { id: 1, name: 'Next.js', slug: 'nextjs' },
  { id: 2, name: 'SSR', slug: 'ssr' },
  { id: 3, name: 'React', slug: 'react' },
  { id: 4, name: 'Node.js', slug: 'nodejs' },
  { id: 5, name: 'PostgreSQL', slug: 'postgresql' },
  { id: 6, name: 'Railway', slug: 'railway' },
  { id: 7, name: 'DevOps', slug: 'devops' },
  { id: 8, name: 'SEO', slug: 'seo' },
  { id: 9, name: 'AI', slug: 'ai' },
  { id: 10, name: 'ML', slug: 'ml' },
  { id: 11, name: 'Security', slug: 'security' },
  { id: 12, name: 'Tools', slug: 'tools' }
];

const articleSeeds = [
  {
    title: 'Next.js App Router для SEO-орієнтованого блогу',
    slug: 'nextjs-app-router-for-seo-blog',
    excerpt: 'Як App Router з SSR/SSG допомагає будувати індексований контентний сайт без зайвих компромісів.',
    categorySlug: 'javascript-frontend',
    authorSlug: 'oleh-koval',
    tagSlugs: ['nextjs', 'ssr', 'seo']
  },
  {
    title: 'Семантична головна сторінка без зайвого шуму',
    slug: 'semantic-homepage-without-noise',
    excerpt: 'Як побудувати головну сторінку блогу так, щоб і люди, і пошуковики бачили правильну структуру.',
    categorySlug: 'javascript-frontend',
    authorSlug: 'oleh-koval',
    tagSlugs: ['react', 'seo', 'ssr']
  },
  {
    title: 'SSG, ISR чи SSR: що обрати для контентного блогу',
    slug: 'ssg-isr-or-ssr-for-content-blog',
    excerpt: 'Коротка логіка вибору рендерингу для головної, статті, категорії та сторінки пошуку.',
    categorySlug: 'javascript-frontend',
    authorSlug: 'maksym-bondar',
    tagSlugs: ['nextjs', 'ssr', 'react']
  },
  {
    title: 'Express API основа для IT-блогу',
    slug: 'express-api-foundation-for-it-blog',
    excerpt: 'Мінімальний backend-каркас з публічними ендпоінтами, який не соромно віддати команді.',
    categorySlug: 'backend-devops',
    authorSlug: 'iryna-hnatiuk',
    tagSlugs: ['nodejs', 'postgresql', 'devops']
  },
  {
    title: 'Railway guide для монорепозиторію',
    slug: 'railway-guide-for-monorepo',
    excerpt: 'Ключові кроки перед першим деплоєм frontend, backend і бази даних у монорепозиторії.',
    categorySlug: 'backend-devops',
    authorSlug: 'maksym-bondar',
    tagSlugs: ['railway', 'devops', 'seo']
  },
  {
    title: 'PostgreSQL схема для новинного сайту',
    slug: 'postgresql-schema-for-news-site',
    excerpt: 'Стартова схема БД для авторів, категорій, статей, тегів та індексів пошуку.',
    categorySlug: 'backend-devops',
    authorSlug: 'iryna-hnatiuk',
    tagSlugs: ['postgresql', 'nodejs', 'tools']
  },
  {
    title: 'AI-інструменти для редакційного ресерчу',
    slug: 'ai-tools-for-editorial-research',
    excerpt: 'Як AI допомагає готувати матеріали, але не підміняє редакторську перевірку джерел.',
    categorySlug: 'ai-ml',
    authorSlug: 'oleh-koval',
    tagSlugs: ['ai', 'ml', 'tools']
  },
  {
    title: 'ML-пояснення для технічного блогу простими словами',
    slug: 'ml-explainers-for-technical-blog',
    excerpt: 'Як писати про ML так, щоб матеріал залишався точним і зрозумілим для ширшої аудиторії.',
    categorySlug: 'ai-ml',
    authorSlug: 'iryna-hnatiuk',
    tagSlugs: ['ai', 'ml', 'seo']
  },
  {
    title: 'Базові security headers для публічного сайту',
    slug: 'basic-security-headers-for-public-site',
    excerpt: 'Які HTTP-заголовки варто перевіряти ще до того, як сайт отримає реальний трафік.',
    categorySlug: 'cybersecurity',
    authorSlug: 'maksym-bondar',
    tagSlugs: ['security', 'devops', 'tools']
  },
  {
    title: 'Навіщо ховати admin від індексації',
    slug: 'why-admin-must-stay-out-of-index',
    excerpt: 'Чому `/admin` не має потрапляти в пошук і як правильно закрити службову зону від індексації.',
    categorySlug: 'cybersecurity',
    authorSlug: 'maksym-bondar',
    tagSlugs: ['security', 'seo', 'tools']
  },
  {
    title: 'Google Search Console без хаосу',
    slug: 'google-search-console-without-chaos',
    excerpt: 'Що перевірити після верифікації домену і як швидко оцінити технічний стан ресурсу.',
    categorySlug: 'tools-reviews',
    authorSlug: 'oleh-koval',
    tagSlugs: ['seo', 'tools', 'railway']
  },
  {
    title: 'Набір інструментів для контентної команди',
    slug: 'toolkit-for-content-engineering-team',
    excerpt: 'Практична добірка інструментів для розробки, деплою, зберігання даних і технічного моніторингу.',
    categorySlug: 'tools-reviews',
    authorSlug: 'iryna-hnatiuk',
    tagSlugs: ['tools', 'devops', 'railway']
  }
];

const publishedDates = [
  '2026-03-12',
  '2026-03-11',
  '2026-03-10',
  '2026-03-09',
  '2026-03-08',
  '2026-03-07',
  '2026-03-06',
  '2026-03-05',
  '2026-03-04',
  '2026-03-03',
  '2026-03-02',
  '2026-03-01'
];

const categoryBySlug = new Map(categories.map((item) => [item.slug, item]));
const userBySlug = new Map(users.map((item) => [item.slug, item]));
const tagBySlug = new Map(tags.map((item) => [item.slug, item]));

const articles = articleSeeds.map((seed, index) => ({
  id: index + 1,
  title: seed.title,
  slug: seed.slug,
  excerpt: seed.excerpt,
  content: [
    `Матеріал "${seed.title}" входить до стартового backend seed і потрібен для перевірки API, slug-маршрутів та SSR на frontend.`,
    'На цьому етапі дані віддаються з in-memory store, але структура вже наближена до реальної таблиці articles.',
    'Backend розробник далі замінює цей шар на PostgreSQL, не ламаючи контракт відповіді і маршрути.'
  ].join('\n\n'),
  cover_url: '/placeholder-cover.svg',
  author_id: userBySlug.get(seed.authorSlug).id,
  category_id: categoryBySlug.get(seed.categorySlug).id,
  status: 'published',
  views: 100 + index * 13,
  meta_title: seed.title,
  meta_description: seed.excerpt,
  published_at: publishedDates[index],
  created_at: publishedDates[index],
  updated_at: publishedDates[index]
}));

const articleTags = articleSeeds.flatMap((seed, index) =>
  seed.tagSlugs.map((tagSlug) => ({
    article_id: index + 1,
    tag_id: tagBySlug.get(tagSlug).id
  }))
);

function hydrateArticle(article) {
  const author = users.find((user) => user.id === article.author_id);
  const category = categories.find((item) => item.id === article.category_id);
  const relatedTagIds = articleTags.filter((item) => item.article_id === article.id).map((item) => item.tag_id);
  const relatedTags = tags.filter((tag) => relatedTagIds.includes(tag.id));

  return {
    ...article,
    author,
    category,
    tags: relatedTags
  };
}

function sortPublished(items) {
  return [...items].sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
}

function paginate(items, page = 1, perPage = 10) {
  const safePage = Number.isNaN(Number(page)) ? 1 : Math.max(1, Number(page));
  const safePerPage = Number.isNaN(Number(perPage)) ? 10 : Math.max(1, Number(perPage));
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / safePerPage));
  const start = (safePage - 1) * safePerPage;

  return {
    data: items.slice(start, start + safePerPage).map(hydrateArticle),
    meta: {
      total,
      page: safePage,
      perPage: safePerPage,
      totalPages
    }
  };
}

function getPublishedArticles() {
  return sortPublished(articles.filter((article) => article.status === 'published')).map(hydrateArticle);
}

function getArticles({ page = 1, perPage = 10, category = '' } = {}) {
  const filtered = sortPublished(articles.filter((article) => article.status === 'published')).filter((article) => {
    if (!category) return true;
    const currentCategory = categories.find((item) => item.id === article.category_id);
    return currentCategory && currentCategory.slug === category;
  });

  return paginate(filtered, page, perPage);
}

function getArticleBySlug(slug) {
  const article = articles.find((item) => item.slug === slug && item.status === 'published');
  return article ? hydrateArticle(article) : null;
}

function getRelatedArticles(slug, limit = 3) {
  const current = getArticleBySlug(slug);
  if (!current) return [];

  return getPublishedArticles()
    .filter((article) => article.slug !== current.slug && article.category.slug === current.category.slug)
    .slice(0, limit);
}

function incrementViews(id) {
  const article = articles.find((item) => item.id === id);
  if (!article) return null;
  article.views += 1;
  article.updated_at = new Date().toISOString();
  return hydrateArticle(article);
}

function getCategories() {
  return categories;
}

function getCategoryBySlug(slug) {
  return categories.find((item) => item.slug === slug) || null;
}

function getArticlesByCategory(slug, { page = 1, perPage = 10 } = {}) {
  const category = getCategoryBySlug(slug);
  if (!category) return null;

  const filtered = sortPublished(articles.filter((article) => article.status === 'published' && article.category_id === category.id));
  return paginate(filtered, page, perPage);
}

function getTags() {
  return tags;
}

function getTagBySlug(slug) {
  return tags.find((tag) => tag.slug === slug) || null;
}

function getArticlesByTag(slug, { page = 1, perPage = 10 } = {}) {
  const tag = getTagBySlug(slug);
  if (!tag) return null;

  const articleIds = articleTags.filter((item) => item.tag_id === tag.id).map((item) => item.article_id);
  const filtered = sortPublished(articles.filter((article) => article.status === 'published' && articleIds.includes(article.id)));

  return paginate(filtered, page, perPage);
}

function getAuthorBySlug(slug) {
  return users.find((user) => user.slug === slug) || null;
}

function getArticlesByAuthor(slug, { page = 1, perPage = 10 } = {}) {
  const author = getAuthorBySlug(slug);
  if (!author) return null;

  const filtered = sortPublished(articles.filter((article) => article.status === 'published' && article.author_id === author.id));
  return paginate(filtered, page, perPage);
}

function searchArticles(query) {
  const normalized = String(query || '').trim().toLowerCase();
  if (!normalized) {
    return {
      data: [],
      meta: {
        total: 0,
        page: 1,
        perPage: 10,
        totalPages: 1
      }
    };
  }

  const matches = getPublishedArticles().filter((article) => {
    const haystack = [
      article.title,
      article.excerpt,
      article.content,
      article.category.name,
      article.author.name,
      ...article.tags.map((tag) => tag.name)
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(normalized);
  });

  return {
    data: matches,
    meta: {
      total: matches.length,
      page: 1,
      perPage: matches.length || 10,
      totalPages: 1
    }
  };
}

module.exports = {
  categories,
  users,
  tags,
  articles,
  articleTags,
  getArticles,
  getArticleBySlug,
  getRelatedArticles,
  incrementViews,
  getCategories,
  getCategoryBySlug,
  getArticlesByCategory,
  getTags,
  getTagBySlug,
  getArticlesByTag,
  getAuthorBySlug,
  getArticlesByAuthor,
  searchArticles
};
