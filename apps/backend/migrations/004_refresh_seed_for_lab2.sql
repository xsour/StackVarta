DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM users
        WHERE slug IN ('oleh-koval', 'iryna-hnatiuk', 'maksym-bondar')
    ) THEN
        TRUNCATE TABLE article_tags, articles, users, categories, tags RESTART IDENTITY CASCADE;
    END IF;
END $$;
