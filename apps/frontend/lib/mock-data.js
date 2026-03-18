function getSafeBaseUrl() {
  const fallback = 'http://localhost:3000';
  const raw = process.env.NEXT_PUBLIC_SITE_URL || fallback;

  try {
    return new URL(raw).toString().replace(/\/$/, '');
  } catch {
    return fallback;
  }
}

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'IT Blog',
  baseUrl: getSafeBaseUrl(),
  description:
    'Новини та статті про frontend, backend, DevOps, AI, кібербезпеку й корисні інструменти.'
};

export const categories = [
  {
    slug: 'javascript-frontend',
    name: 'JavaScript / Frontend',
    shortName: 'Frontend',
    description: 'Новини та практичні матеріали про React, Next.js, SSR, семантичну верстку і побудову індексованих інтерфейсів.'
  },
  {
    slug: 'backend-devops',
    name: 'Backend та DevOps',
    shortName: 'Backend/DevOps',
    description: 'API, PostgreSQL, Railway, deployment, CI/CD і все, що потрібно для production-ready контентного проєкту.'
  },
  {
    slug: 'ai-ml',
    name: 'Штучний інтелект та ML',
    shortName: 'AI / ML',
    description: 'Прикладні матеріали про AI-інструменти, роботу з ML та використання автоматизації в редакційних процесах.'
  },
  {
    slug: 'cybersecurity',
    name: 'Кібербезпека',
    shortName: 'Security',
    description: 'Практичні поради щодо безпеки публічних сайтів, доступів, заголовків та базової гігієни команди.'
  },
  {
    slug: 'tools-reviews',
    name: 'Огляди інструментів та технологій',
    shortName: 'Tools',
    description: 'Огляди сервісів, утиліт, workflow-комбінацій та корисних інструментів для контент-команд і розробників.'
  }
];

export const authors = [
  {
    id: 1,
    slug: 'oleh-koval',
    name: 'Олег Коваль',
    fullName: 'Олег Миколайович Коваль',
    bio: 'Frontend-інженер з 8-річним досвідом. Спеціалізується на побудові високонавантажених інтерфейсів з використанням React та Next.js. Активно впроваджує практики технічного SEO та Core Web Vitals.',
    avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200&h=200',
    socials: {
      linkedin: 'https://linkedin.com/in/oleh-koval',
      github: 'https://github.com/oleh-koval'
    }
  },
  {
    id: 2,
    slug: 'iryna-hnatiuk',
    name: 'Ірина Гнатюк',
    fullName: 'Ірина Василівна Гнатюк',
    bio: 'Backend-розробниця, експертка з PostgreSQL та системного дизайну. Працює над оптимізацією запитів та масштабуванням мікросервісів. Регулярна спікерка на профільних конференціях.',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200',
    socials: {
      linkedin: 'https://linkedin.com/in/iryna-hnatiuk',
      github: 'https://github.com/iryna-hnatiuk'
    }
  },
  {
    id: 3,
    slug: 'maksym-bondar',
    name: 'Максим Бондар',
    fullName: 'Максим Артемович Бондар',
    bio: 'DevOps-інженер та системний адміністратор. Захоплюється автоматизацією процесів деплою, безпекою хмарних інфраструктур та моніторингом систем у реальному часі.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200',
    socials: {
      linkedin: 'https://linkedin.com/in/maksym-bondar',
      github: 'https://github.com/maksym-bondar'
    }
  }
];

export const tags = [
  { slug: 'nextjs', name: 'Next.js' },
  { slug: 'ssr', name: 'SSR' },
  { slug: 'react', name: 'React' },
  { slug: 'nodejs', name: 'Node.js' },
  { slug: 'postgresql', name: 'PostgreSQL' },
  { slug: 'railway', name: 'Railway' },
  { slug: 'devops', name: 'DevOps' },
  { slug: 'seo', name: 'SEO' },
  { slug: 'ai', name: 'AI' },
  { slug: 'ml', name: 'ML' },
  { slug: 'security', name: 'Security' },
  { slug: 'tools', name: 'Tools' }
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

const categoryParagraphs = {
  'javascript-frontend': [
    'Для SEO-орієнтованого блогу важливо не просто відрендерити інтерфейс, а віддати готовий HTML уже на першому запиті. Це дозволяє `curl`, View Source та пошуковим ботам одразу побачити заголовки, тексти і навігаційні посилання.',
    'Семантична розмітка потрібна не для краси. `header`, `main`, `section`, `article`, `nav` і `footer` допомагають зрозуміти, де основний контент, а де допоміжні блоки. Це спрощує і технічний аудит, і майбутню SEO-оптимізацію.',
    'На старті достатньо зафіксувати чисті slug, базові metadata і стабільну структуру сторінок. Після цього фронтенд-команда може замінювати мок-дані на реальний API, не ламаючи індексацію.'
  ],
  'backend-devops': [
    'Навіть якщо backend ще не готовий функціонально, команді важливо відразу погодити API-контракт, структуру маршрутів і формат відповідей. Це прибирає хаос між frontend та backend уже з першого спринту.',
    'PostgreSQL потрібен не лише тому, що це вимога ТЗ. Чітка схема з індексами по slug, category, author і published_at одразу задає правильну структуру для майбутнього пошуку, фільтрації та SEO-сторінок.',
    'DevOps-частина на старті — це не складний кластер, а передбачуваний деплой, коректні змінні середовища, доступний публічний URL, і можливість швидко перевірити заголовки, HTML та доступність сайту для ботів.'
  ],
  'ai-ml': [
    'AI і ML можуть пришвидшити дослідження тем, але не замінюють редакторську перевірку джерел. Для технічного блогу важливо, щоб кожен матеріал мав чітку структуру, коректні терміни та зрозумілий висновок.',
    'Для SEO корисно писати матеріали так, щоб користувач знаходив відповідь уже з перших абзаців. Це означає прості формулювання, явні підзаголовки та зрозумілий опис проблеми без води.',
    'На старті достатньо підготувати зрозумілу структуру статті й валідні metadata. Далі розділ AI можна розширювати глибшими матеріалами у наступних ітераціях.'
  ],
  'cybersecurity': [
    'Публічний сайт без базової безпеки — це ризик ще до того, як прийде трафік. Тому перевірка `curl -I`, HTTP-заголовків, доступності robots.txt і відокремлення admin-зони — це нормальна частина стартового технічного SEO.',
    'Не все, що доступне технічно, має індексуватись. Адмінка, внутрішні сторінки редагування, службові урли й тестові ендпоінти краще одразу прибрати з індексації та не робити їх частиною публічної навігації.',
    'Після запуску важливо мати простий план: перевірив URL, перевірив заголовки, перевірив robots.txt, підключив GSC і тільки після цього відправив сторінку на індексацію.'
  ],
  'tools-reviews': [
    'Найкорисніші інструменти на старті навчального блогу — це ті, що дають швидкий зворотний зв’язок: GitHub для workflow, Railway для production URL, Google Search Console для індексації та `curl` для технічної перевірки HTML.',
    'Коли команда фіксує правила URL, метадані та маршрутну структуру з самого початку, наступні ітерації проходять значно швидше й без зайвих переробок.',
    'Огляд інструментів корисний лише тоді, коли він призводить до конкретної дії. У добре організованому проєкті кожен сервіс має зрозумілу роль у процесі розробки.'
  ]
};

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

export const articles = articleSeeds.map((seed, index) => ({
  id: index + 1,
  ...seed,
  coverUrl: '/placeholder-cover.svg',
  content: [
    `Матеріал "${seed.title}" підготовлено у форматі повноцінної статті з акцентом на читабельність, структуру та пошукову доступність.`,
    ...categoryParagraphs[seed.categorySlug]
  ].join('\n\n'),
  publishedAt: publishedDates[index],
  updatedAt: publishedDates[index],
  views: 120 + index * 17,
  metaTitle: `${seed.title} | IT Blog`,
  metaDescription: seed.excerpt
}));

const categoryIndex = new Map(categories.map((item) => [item.slug, item]));
const authorIndex = new Map(authors.map((item) => [item.slug, item]));
const tagIndex = new Map(tags.map((item) => [item.slug, item]));

function hydrateArticle(article) {
  return {
    ...article,
    category: categoryIndex.get(article.categorySlug),
    author: authorIndex.get(article.authorSlug),
    tags: article.tagSlugs.map((slug) => tagIndex.get(slug))
  };
}

function sortByDateDesc(items) {
  return [...items].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
}

function paginate(items, page = 1, perPage = 10) {
  const currentPage = Number.isNaN(Number(page)) ? 1 : Math.max(1, Number(page));
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const start = (currentPage - 1) * perPage;
  const end = start + perPage;

  return {
    items: items.slice(start, end),
    meta: {
      total,
      page: currentPage,
      perPage,
      totalPages
    }
  };
}

export function getPublishedArticles() {
  return sortByDateDesc(articles).map(hydrateArticle);
}

export function getHomepageData({ page = 1, category = '' } = {}) {
  const filtered = getPublishedArticles().filter((article) => {
    if (!category) return true;
    return article.categorySlug === category;
  });

  return paginate(filtered, page, 10);
}

export function getCategoryBySlug(slug) {
  return categoryIndex.get(slug) || null;
}

export function getArticlesByCategory(slug, { page = 1, perPage = 10 } = {}) {
  const filtered = getPublishedArticles().filter((article) => article.categorySlug === slug);
  return paginate(filtered, page, perPage);
}

export function getAuthorBySlug(slug) {
  return authorIndex.get(slug) || null;
}

export function getArticlesByAuthor(slug, { page = 1, perPage = 10 } = {}) {
  const filtered = getPublishedArticles().filter((article) => article.authorSlug === slug);
  return paginate(filtered, page, perPage);
}

export function getTagBySlug(slug) {
  return tagIndex.get(slug) || null;
}

export function getArticlesByTag(slug, { page = 1, perPage = 10 } = {}) {
  const filtered = getPublishedArticles().filter((article) => article.tagSlugs.includes(slug));
  return paginate(filtered, page, perPage);
}

export function getArticleBySlug(slug) {
  const article = articles.find((item) => item.slug === slug);
  return article ? hydrateArticle(article) : null;
}

export function getRelatedArticles(slug, limit = 3) {
  const current = getArticleBySlug(slug);
  if (!current) return [];

  return getPublishedArticles()
    .filter((article) => article.slug !== slug && article.categorySlug === current.categorySlug)
    .slice(0, limit);
}

export function searchArticles(query) {
  const normalized = String(query || '').trim().toLowerCase();
  if (!normalized) return [];

  return getPublishedArticles().filter((article) => {
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
}

export const aboutData = {
  title: 'Про нас | IT Blog',
  name: 'IT Blog',
  description: 'IT Blog - це профільне видання для розробників, інженерів та tech-ентузіастів. Ми розповідаємо про frontend, backend, DevOps, штучний інтелект та кібербезпеку.',
  mission: 'Наша місія - створювати якісний україномовний контент, що допомагає IT-фахівцям зростати професійно, впроваджувати найкращі практики та залишатись у курсі сучасних технологій. Ми пишемо без води та клікбейту, зосереджуючись на практичному досвіді.',
  contacts: {
    email: 'hello@itblog.example.com'
  },
  socialLinks: [
    { name: 'Twitter', url: 'https://twitter.com/itblog' },
    { name: 'GitHub', url: 'https://github.com/itblog' },
    { name: 'LinkedIn', url: 'https://linkedin.com/company/itblog' }
  ],
  foundedDate: '2025-01-15'
};

export function getAboutData() {
  return aboutData;
}

export function getArticleCountByAuthor(slug) {
  return articles.filter((article) => article.authorSlug === slug).length;
}
