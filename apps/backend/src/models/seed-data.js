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
    name: 'Андрій Коваль',
    slug: 'andrii-koval',
    email: 'andrii.koval@stackvarta.dev',
    bio: 'Cloud Architecture, Go, Docker & Kubernetes. 6+ років у розробці високонавантажених систем. Працював над міграцією монолітів у мікросервісну архітектуру для фінтех-проєктів.',
    full_name: 'Андрій Коваль',
    avatar_url: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=300&h=300',
    linkedin_url: 'https://linkedin.com/in/andrii-koval-example',
    github_url: 'https://github.com/akov-dev',
    is_admin: true
  },
  {
    name: 'Марія Петренко',
    slug: 'mariia-petrenko',
    email: 'mariia.petrenko@stackvarta.dev',
    bio: 'React, Next.js, Web Performance & Accessibility. Lead Frontend Developer, 5 років досвіду. Спеціалізується на створенні швидких та інклюзивних веб-інтерфейсів.',
    full_name: 'Марія Петренко',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300&h=300',
    linkedin_url: 'https://linkedin.com/in/mari-petrenko-example',
    github_url: null,
    is_admin: false
  },
  {
    name: 'Олексій Вовк',
    slug: 'oleksii-vovk',
    email: 'oleksii.vovk@stackvarta.dev',
    bio: 'Network Security, Pentesting, OWASP. Сертифікований фахівець з інформаційної безпеки (OSCP). Має досвід аудиту безпеки для банківських додатків.',
    full_name: 'Олексій Вовк',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300&h=300',
    linkedin_url: 'https://linkedin.com/in/vovk-security',
    github_url: null,
    is_admin: false
  },
  {
    name: 'Сергій Бондаренко',
    slug: 'serhii-bondarenko',
    email: 'serhii.bondarenko@stackvarta.dev',
    bio: 'Tech Scouting, IDE Optimization, Productivity Tools. Tech Lead / CTO в стартапах. За останні 10 років протестував сотні фреймворків та інструментів розробки.',
    full_name: 'Сергій Бондаренко',
    avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300&h=300',
    linkedin_url: 'https://linkedin.com/in/serhii-tech-reviews',
    github_url: null,
    is_admin: false
  },
  {
    name: 'Олена Дмитрук',
    slug: 'olena-dmytruk',
    email: 'olena.dmytruk@stackvarta.dev',
    bio: 'Machine Learning, Natural Language Processing (NLP), Python. Data Scientist з досвідом розробки рекомендаційних систем та впровадження LLM у бізнес-процеси.',
    full_name: 'Олена Дмитрук',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300&h=300',
    linkedin_url: 'https://linkedin.com/in/olena-ds-example',
    github_url: null,
    is_admin: false
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
    authorSlug: 'mariia-petrenko',
    tagSlugs: ['nextjs', 'ssr', 'seo']
  },
  {
    title: 'Семантична головна сторінка без зайвого шуму',
    slug: 'semantic-homepage-without-noise',
    excerpt:
      'Як побудувати головну сторінку блогу так, щоб і люди, і пошуковики бачили правильну структуру.',
    categorySlug: 'javascript-frontend',
    authorSlug: 'mariia-petrenko',
    tagSlugs: ['react', 'seo', 'ssr']
  },
  {
    title: 'SSG, ISR чи SSR: що обрати для контентного блогу',
    slug: 'ssg-isr-or-ssr-for-content-blog',
    excerpt:
      'Коротка логіка вибору рендерингу для головної, статті, категорії та сторінки пошуку.',
    categorySlug: 'javascript-frontend',
    authorSlug: 'mariia-petrenko',
    tagSlugs: ['nextjs', 'ssr', 'react']
  },
  {
    title: 'Express API основа для IT-блогу',
    slug: 'express-api-foundation-for-it-blog',
    excerpt:
      'Мінімальний backend-каркас з публічними ендпоінтами, який не соромно віддати команді.',
    categorySlug: 'backend-devops',
    authorSlug: 'andrii-koval',
    tagSlugs: ['nodejs', 'postgresql', 'devops']
  },
  {
    title: 'Railway guide для монорепозиторію',
    slug: 'railway-guide-for-monorepo',
    excerpt:
      'Ключові кроки перед першим деплоєм frontend, backend і бази даних у монорепозиторії.',
    categorySlug: 'backend-devops',
    authorSlug: 'andrii-koval',
    tagSlugs: ['railway', 'devops', 'seo']
  },
  {
    title: 'PostgreSQL схема для новинного сайту',
    slug: 'postgresql-schema-for-news-site',
    excerpt:
      'Стартова схема БД для авторів, категорій, статей, тегів та індексів пошуку.',
    categorySlug: 'backend-devops',
    authorSlug: 'andrii-koval',
    tagSlugs: ['postgresql', 'nodejs', 'tools']
  },
  {
    title: 'AI-інструменти для редакційного ресерчу',
    slug: 'ai-tools-for-editorial-research',
    excerpt:
      'Як AI допомагає готувати матеріали, але не підміняє редакторську перевірку джерел.',
    categorySlug: 'ai-ml',
    authorSlug: 'olena-dmytruk',
    tagSlugs: ['ai', 'ml', 'tools']
  },
  {
    title: 'ML-пояснення для технічного блогу простими словами',
    slug: 'ml-explainers-for-technical-blog',
    excerpt:
      'Як писати про ML так, щоб матеріал залишався точним і зрозумілим для ширшої аудиторії.',
    categorySlug: 'ai-ml',
    authorSlug: 'olena-dmytruk',
    tagSlugs: ['ai', 'ml', 'seo']
  },
  {
    title: 'Базові security headers для публічного сайту',
    slug: 'basic-security-headers-for-public-site',
    excerpt:
      'Які HTTP-заголовки варто перевіряти ще до того, як сайт отримає реальний трафік.',
    categorySlug: 'cybersecurity',
    authorSlug: 'oleksii-vovk',
    tagSlugs: ['security', 'devops', 'tools']
  },
  {
    title: 'Навіщо ховати admin від індексації',
    slug: 'why-admin-must-stay-out-of-index',
    excerpt:
      'Чому `/admin` не має потрапляти в пошук і як правильно закрити службову зону від індексації.',
    categorySlug: 'cybersecurity',
    authorSlug: 'oleksii-vovk',
    tagSlugs: ['security', 'seo', 'tools']
  },
  {
    title: 'Google Search Console без хаосу',
    slug: 'google-search-console-without-chaos',
    excerpt:
      'Що перевірити після верифікації домену і як швидко оцінити технічний стан ресурсу.',
    categorySlug: 'tools-reviews',
    authorSlug: 'serhii-bondarenko',
    tagSlugs: ['seo', 'tools', 'railway']
  },
  {
    title: 'Набір інструментів для контентної команди',
    slug: 'toolkit-for-content-engineering-team',
    excerpt:
      'Практична добірка інструментів для розробки, деплою, зберігання даних і технічного моніторингу.',
    categorySlug: 'tools-reviews',
    authorSlug: 'serhii-bondarenko',
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
