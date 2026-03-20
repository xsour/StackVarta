const categories = [
  {
    name: 'JavaScript / Frontend',
    slug: 'javascript-frontend',
    description:
      'Новини та практичні матеріали про React, Next.js, SSR і семантичну розмітку.'
  },
  {
    name: 'Backend та DevOps',
    slug: 'backend-devops',
    description:
      'API, PostgreSQL, Railway, deployment та стабільна інфраструктура проєкту.'
  },
  {
    name: 'Штучний інтелект та ML',
    slug: 'ai-ml',
    description: 'Практичні AI/ML матеріали для технічного блогу.'
  },
  {
    name: 'Кібербезпека',
    slug: 'cybersecurity',
    description: 'Безпека публічного сайту, admin-зони та технічні перевірки.'
  },
  {
    name: 'Огляди інструментів та технологій',
    slug: 'tools-reviews',
    description: 'Корисні сервіси та зв’язки інструментів для команди.'
  }
];

const users = [
  {
    name: 'Олег Коваль',
    slug: 'oleh-koval',
    email: 'oleh@example.com',
    bio: 'Frontend-інженер з 8-річним досвідом. Спеціалізується на побудові високонавантажених інтерфейсів з використанням React та Next.js. Активно впроваджує практики технічного SEO та Core Web Vitals.',
    full_name: 'Олег Миколайович Коваль',
    avatar_url: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200&h=200',
    linkedin_url: 'https://linkedin.com/in/oleh-koval',
    github_url: 'https://github.com/oleh-koval',
    is_admin: true
  },
  {
    name: 'Ірина Гнатюк',
    slug: 'iryna-hnatiuk',
    email: 'iryna@example.com',
    bio: 'Backend-розробниця, експертка з PostgreSQL та системного дизайну. Працює над оптимізацією запитів та масштабуванням мікросервісів. Регулярна спікерка на профільних конференціях.',
    full_name: 'Ірина Василівна Гнатюк',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200',
    linkedin_url: 'https://linkedin.com/in/iryna-hnatiuk',
    github_url: 'https://github.com/iryna-hnatiuk',
    is_admin: true
  },
  {
    name: 'Максим Бондар',
    slug: 'maksym-bondar',
    email: 'maksym@example.com',
    bio: 'DevOps-інженер та системний адміністратор. Захоплюється автоматизацією процесів деплою, безпекою хмарних інфраструктур та моніторингом систем у реальному часі.',
    full_name: 'Максим Артемович Бондар',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200',
    linkedin_url: 'https://linkedin.com/in/maksym-bondar',
    github_url: 'https://github.com/maksym-bondar',
    is_admin: true
  }
];

const tags = [
  { name: 'Next.js', slug: 'nextjs' },
  { name: 'SSR', slug: 'ssr' },
  { name: 'React', slug: 'react' },
  { name: 'Node.js', slug: 'nodejs' },
  { name: 'PostgreSQL', slug: 'postgresql' },
  { name: 'Railway', slug: 'railway' },
  { name: 'DevOps', slug: 'devops' },
  { name: 'SEO', slug: 'seo' },
  { name: 'AI', slug: 'ai' },
  { name: 'ML', slug: 'ml' },
  { name: 'Security', slug: 'security' },
  { name: 'Tools', slug: 'tools' }
];

const articleSeeds = [
  {
    title: 'Next.js App Router для SEO-орієнтованого блогу',
    slug: 'nextjs-app-router-for-seo-blog',
    excerpt:
      'Як App Router з SSR/SSG допомагає будувати індексований контентний сайт без зайвих компромісів.',
    categorySlug: 'javascript-frontend',
    authorSlug: 'oleh-koval',
    tagSlugs: ['nextjs', 'ssr', 'seo']
  },
  {
    title: 'Семантична головна сторінка без зайвого шуму',
    slug: 'semantic-homepage-without-noise',
    excerpt:
      'Як побудувати головну сторінку блогу так, щоб і люди, і пошуковики бачили правильну структуру.',
    categorySlug: 'javascript-frontend',
    authorSlug: 'oleh-koval',
    tagSlugs: ['react', 'seo', 'ssr']
  },
  {
    title: 'SSG, ISR чи SSR: що обрати для контентного блогу',
    slug: 'ssg-isr-or-ssr-for-content-blog',
    excerpt:
      'Коротка логіка вибору рендерингу для головної, статті, категорії та сторінки пошуку.',
    categorySlug: 'javascript-frontend',
    authorSlug: 'maksym-bondar',
    tagSlugs: ['nextjs', 'ssr', 'react']
  },
  {
    title: 'Express API основа для IT-блогу',
    slug: 'express-api-foundation-for-it-blog',
    excerpt:
      'Мінімальний backend-каркас з публічними ендпоінтами, який не соромно віддати команді.',
    categorySlug: 'backend-devops',
    authorSlug: 'iryna-hnatiuk',
    tagSlugs: ['nodejs', 'postgresql', 'devops']
  },
  {
    title: 'Railway guide для монорепозиторію',
    slug: 'railway-guide-for-monorepo',
    excerpt:
      'Ключові кроки перед першим деплоєм frontend, backend і бази даних у монорепозиторії.',
    categorySlug: 'backend-devops',
    authorSlug: 'maksym-bondar',
    tagSlugs: ['railway', 'devops', 'seo']
  },
  {
    title: 'PostgreSQL схема для новинного сайту',
    slug: 'postgresql-schema-for-news-site',
    excerpt:
      'Стартова схема БД для авторів, категорій, статей, тегів та індексів пошуку.',
    categorySlug: 'backend-devops',
    authorSlug: 'iryna-hnatiuk',
    tagSlugs: ['postgresql', 'nodejs', 'tools']
  },
  {
    title: 'AI-інструменти для редакційного ресерчу',
    slug: 'ai-tools-for-editorial-research',
    excerpt:
      'Як AI допомагає готувати матеріали, але не підміняє редакторську перевірку джерел.',
    categorySlug: 'ai-ml',
    authorSlug: 'oleh-koval',
    tagSlugs: ['ai', 'ml', 'tools']
  },
  {
    title: 'ML-пояснення для технічного блогу простими словами',
    slug: 'ml-explainers-for-technical-blog',
    excerpt:
      'Як писати про ML так, щоб матеріал залишався точним і зрозумілим для ширшої аудиторії.',
    categorySlug: 'ai-ml',
    authorSlug: 'iryna-hnatiuk',
    tagSlugs: ['ai', 'ml', 'seo']
  },
  {
    title: 'Базові security headers для публічного сайту',
    slug: 'basic-security-headers-for-public-site',
    excerpt:
      'Які HTTP-заголовки варто перевіряти ще до того, як сайт отримає реальний трафік.',
    categorySlug: 'cybersecurity',
    authorSlug: 'maksym-bondar',
    tagSlugs: ['security', 'devops', 'tools']
  },
  {
    title: 'Навіщо ховати admin від індексації',
    slug: 'why-admin-must-stay-out-of-index',
    excerpt:
      'Чому `/admin` не має потрапляти в пошук і як правильно закрити службову зону від індексації.',
    categorySlug: 'cybersecurity',
    authorSlug: 'maksym-bondar',
    tagSlugs: ['security', 'seo', 'tools']
  },
  {
    title: 'Google Search Console без хаосу',
    slug: 'google-search-console-without-chaos',
    excerpt:
      'Що перевірити після верифікації домену і як швидко оцінити технічний стан ресурсу.',
    categorySlug: 'tools-reviews',
    authorSlug: 'oleh-koval',
    tagSlugs: ['seo', 'tools', 'railway']
  },
  {
    title: 'Набір інструментів для контентної команди',
    slug: 'toolkit-for-content-engineering-team',
    excerpt:
      'Практична добірка інструментів для розробки, деплою, зберігання даних і технічного моніторингу.',
    categorySlug: 'tools-reviews',
    authorSlug: 'iryna-hnatiuk',
    tagSlugs: ['tools', 'devops', 'railway']
  }
];

const categoryParagraphs = {
  'javascript-frontend': [
    'Для SEO-орієнтованого блогу важливо не просто відрендерити інтерфейс, а віддати готовий HTML уже на першому запиті. Це дозволяє curl, View Source та пошуковим ботам одразу побачити заголовки, тексти і навігаційні посилання.',
    'Семантична розмітка потрібна не для краси. header, main, section, article, nav і footer допомагають зрозуміти, де основний контент, а де допоміжні блоки. Це спрощує і технічний аудит, і майбутню SEO-оптимізацію.',
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
  cybersecurity: [
    'Публічний сайт без базової безпеки — це ризик ще до того, як прийде трафік. Тому перевірка curl -I, HTTP-заголовків, доступності robots.txt і відокремлення admin-зони — це нормальна частина стартового технічного SEO.',
    'Не все, що доступне технічно, має індексуватись. Адмінка, внутрішні сторінки редагування, службові урли й тестові ендпоінти краще одразу прибрати з індексації та не робити їх частиною публічної навігації.',
    'Після запуску важливо мати простий план: перевірив URL, перевірив заголовки, перевірив robots.txt, підключив GSC і тільки після цього відправив сторінку на індексацію.'
  ],
  'tools-reviews': [
    'Найкорисніші інструменти на старті навчального блогу — це ті, що дають швидкий зворотний зв’язок: GitHub для workflow, Railway для production URL, Google Search Console для індексації та curl для технічної перевірки HTML.',
    'Коли команда фіксує правила URL, метадані та маршрутну структуру з самого початку, наступні ітерації проходять значно швидше й без зайвих переробок.',
    'Огляд інструментів корисний лише тоді, коли він призводить до конкретної дії. У добре організованому проєкті кожен сервіс має зрозумілу роль у процесі розробки.'
  ]
};

const publishedDates = [
  '2026-03-12T09:00:00.000Z',
  '2026-03-11T09:00:00.000Z',
  '2026-03-10T09:00:00.000Z',
  '2026-03-09T09:00:00.000Z',
  '2026-03-08T09:00:00.000Z',
  '2026-03-07T09:00:00.000Z',
  '2026-03-06T09:00:00.000Z',
  '2026-03-05T09:00:00.000Z',
  '2026-03-04T09:00:00.000Z',
  '2026-03-03T09:00:00.000Z',
  '2026-03-02T09:00:00.000Z',
  '2026-03-01T09:00:00.000Z'
];

const articles = articleSeeds.map((seed, index) => ({
  ...seed,
  content: [
    `Матеріал "${seed.title}" підготовлено у форматі повноцінної статті з акцентом на читабельність, структуру та пошукову доступність.`,
    ...categoryParagraphs[seed.categorySlug]
  ].join('\n\n'),
  cover_url: '/placeholder-cover.svg',
  views: 120 + index * 17,
  meta_title: seed.title,
  meta_description: seed.excerpt,
  status: 'published',
  published_at: publishedDates[index]
}));

module.exports = {
  categories,
  users,
  tags,
  articles,
  seedPassword: process.env.SEED_ADMIN_PASSWORD || 'change-me'
};
