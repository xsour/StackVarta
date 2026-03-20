UPDATE site_settings
SET
    title = 'Про нас',
    name = 'StackVarta',
    description = 'Сучасний технічний медіа-ресурс, присвячений архітектурі програмного забезпечення, DevOps-практикам та впровадженню AI в розробку. Ми пишемо для української IT-спільноти: від студентів, які роблять перші кроки в коді, до досвідчених інженерів, які шукають глибоку аналітику та перевірені технічні рішення.',
    mission = 'Спрощувати складне. Ми прагнемо стати надійною точкою опори для розробників, надаючи контент, який економить час на налагодження та допомагає будувати безпечні, швидкі й масштабовані системи.',
    contact_email = 'stackvarta@gmail.com',
    founded_date = '2026-02-01'::date,
    social_links = '[{"name":"GitHub","url":"https://github.com/xsour/StackNova"}]'::jsonb,
    updated_at = NOW()
WHERE name = 'StackNova'
   OR title ILIKE '%StackNova%'
   OR contact_email = 'hello@stacknova.dev'
   OR description ILIKE 'StackNova —%'
   OR CAST(social_links AS TEXT) ILIKE '%twitter.com/stacknova%';

UPDATE articles
SET
    meta_title = regexp_replace(meta_title, '\s*(\||—|-)\s*(IT Blog|StackNova|StackVarta)$', '', 'i'),
    updated_at = NOW()
WHERE meta_title ~* '\s*(\||—|-)\s*(IT Blog|StackNova|StackVarta)$';
