# Safe labs 4-6 code patch

Цей архів зібраний поверх старої робочої версії проєкту.

Що важливо:
- не змінювались `package.json`, `docker-compose.yml`, backend-код, порти, env-ключі, Railway root directory, build/start scripts;
- не додавався `middleware.js`;
- не змінювався `next.config.mjs`;
- усі правки лише у публічній frontend-частині, щоб сайт мав кодову базу для лаб 4-6.

Що додано/оновлено:
- breadcrumbs на сторінках статей, категорій, авторів, службових сторінках;
- блок `Схожі статті`;
- сторінки `/authors`, `/archive`, `/contacts`;
- покращені metadata/canonical/open graph на ключових шаблонах;
- `Article`, `BreadcrumbList`, `FAQPage`, `Organization`, `Person`, `ContactPage` schema;
- розширений контент статей з H2/H3, FAQ, CTA і внутрішніми посиланнями;
- покращена header/footer навігація без публічного посилання на `/admin`;
- sitemap оновлено під нові сторінки; tag-сторінки переведені у `noindex,follow`.

Локальна перевірка цього набору правок уже виконувалась окремо: збірка frontend проходила успішно.
