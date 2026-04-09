ALTER TABLE users
    ADD COLUMN IF NOT EXISTS full_name VARCHAR(200),
    ADD COLUMN IF NOT EXISTS linkedin_url VARCHAR(500),
    ADD COLUMN IF NOT EXISTS github_url VARCHAR(500);

CREATE TABLE IF NOT EXISTS site_settings (
    id            SERIAL PRIMARY KEY,
    title         VARCHAR(300) NOT NULL DEFAULT 'Про нас',
    name          VARCHAR(100) NOT NULL DEFAULT 'StackVarta',
    description   TEXT,
    mission       TEXT,
    contact_email VARCHAR(150),
    founded_date  DATE,
    social_links  JSONB NOT NULL DEFAULT '[]',
    updated_at    TIMESTAMP DEFAULT NOW()
);

INSERT INTO site_settings (title, name, description, mission, contact_email, founded_date, social_links)
SELECT
    'Про нас',
    'StackVarta',
    'Сучасний технічний медіа-ресурс, присвячений архітектурі програмного забезпечення, DevOps-практикам та впровадженню AI в розробку. Ми пишемо для української IT-спільноти: від студентів, які роблять перші кроки в коді, до досвідчених інженерів, які шукають глибоку аналітику та перевірені технічні рішення.',
    'Спрощувати складне. Ми прагнемо стати надійною точкою опори для розробників, надаючи контент, який економить час на налагодження та допомагає будувати безпечні, швидкі й масштабовані системи.',
    'stackvarta@gmail.com',
    '2026-02-01'::date,
    '[{"name":"GitHub","url":"https://github.com/xsour/StackNova"}]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM site_settings);

UPDATE users
SET
    full_name = 'Олег Миколайович Коваль',
    avatar_url = 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200&h=200',
    linkedin_url = 'https://linkedin.com/in/oleh-koval',
    github_url = 'https://github.com/oleh-koval'
WHERE slug = 'oleh-koval';

UPDATE users
SET
    full_name = 'Ірина Василівна Гнатюк',
    avatar_url = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200',
    linkedin_url = 'https://linkedin.com/in/iryna-hnatiuk',
    github_url = 'https://github.com/iryna-hnatiuk'
WHERE slug = 'iryna-hnatiuk';

UPDATE users
SET
    full_name = 'Максим Артемович Бондар',
    avatar_url = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200',
    linkedin_url = 'https://linkedin.com/in/maksym-bondar',
    github_url = 'https://github.com/maksym-bondar'
WHERE slug = 'maksym-bondar';
