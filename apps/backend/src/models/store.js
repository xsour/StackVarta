const fs = require('node:fs/promises');
const path = require('node:path');
const bcrypt = require('bcryptjs');
const { Pool: PgPool } = require('pg');
const { newDb } = require('pg-mem');

const seedData = require('./seed-data');
const { AppError } = require('../utils/app-error');
const { createSlug } = require('../utils/slug');

const MIGRATION_PATH = path.join(__dirname, '..', '..', 'migrations', '001_init.sql');
const MIGRATION_PATH_002 = path.join(__dirname, '..', '..', 'migrations', '002_authors_and_site_settings.sql');

let pool;
let dbMode = 'memory';
let initialized = false;
let initPromise = null;

function normalizePage(value, fallback = 1) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }

  return Math.floor(parsed);
}

function normalizePerPage(value, fallback = 10, max = 100) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }

  return Math.min(max, Math.floor(parsed));
}

function parseBoolean(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true') return true;
    if (normalized === 'false') return false;
  }
  return undefined;
}

function parseNullableString(value) {
  if (value === null || value === undefined) return null;
  const normalized = String(value).trim();
  return normalized ? normalized : null;
}

function parseInteger(value, fieldName, { required = true } = {}) {
  if (value === null || value === undefined || value === '') {
    if (required) {
      throw new AppError(400, 'VALIDATION_ERROR', `${fieldName} is required`);
    }
    return null;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new AppError(400, 'VALIDATION_ERROR', `${fieldName} must be a positive integer`);
  }

  return parsed;
}

function parseDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new AppError(400, 'VALIDATION_ERROR', 'publishedAt must be a valid date');
  }
  return date.toISOString();
}

function normalizeTagIds(value) {
  if (Array.isArray(value)) {
    return [...new Set(value.map((item) => parseInteger(item, 'tagId')).filter(Boolean))];
  }

  if (typeof value === 'string' && value.trim()) {
    return [
      ...new Set(
          value
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean)
              .map((item) => parseInteger(item, 'tagId'))
      )
    ];
  }

  return [];
}

function sanitizeUserRow(row) {
  if (!row) return null;

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    email: row.email,
    bio: row.bio,
    fullName: row.full_name || null,
    avatarUrl: row.avatar_url,
    linkedinUrl: row.linkedin_url || null,
    githubUrl: row.github_url || null,
    // структура socials — для сумісності з фронтендом
    socials: {
      linkedin: row.linkedin_url || null,
      github: row.github_url || null
    },
    isAdmin: Boolean(row.is_admin),
    createdAt: row.created_at
  };
}

function mapCategoryRow(row) {
  if (!row) return null;

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    createdAt: row.created_at
  };
}

function mapTagRow(row) {
  if (!row) return null;

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    createdAt: row.created_at
  };
}

function mapArticleRow(row, tags = []) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    coverUrl: row.cover_url,
    authorId: row.author_id,
    categoryId: row.category_id,
    status: row.status,
    views: row.views,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    author: row.author_join_id
        ? {
          id: row.author_join_id,
          name: row.author_name,
          slug: row.author_slug,
          bio: row.author_bio,
          avatarUrl: row.author_avatar_url,
          fullName: row.author_full_name || null,
          linkedinUrl: row.author_linkedin_url || null,
          githubUrl: row.author_github_url || null,
          email: row.author_email,
          isAdmin: Boolean(row.author_is_admin)
        }
        : null,
    category: row.category_join_id
        ? {
          id: row.category_join_id,
          name: row.category_name,
          slug: row.category_slug,
          description: row.category_description
        }
        : null,
    tags,
    tagIds: tags.map((tag) => tag.id)
  };
}

function buildPagination(total, page, perPage) {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  return {
    total,
    page,
    perPage,
    totalPages
  };
}

function getArticleSelect() {
  return `
    SELECT
      a.id,
      a.title,
      a.slug,
      a.excerpt,
      a.content,
      a.cover_url,
      a.author_id,
      a.category_id,
      a.status,
      a.views,
      a.meta_title,
      a.meta_description,
      a.published_at,
      a.created_at,
      a.updated_at,
      u.id AS author_join_id,
      u.name AS author_name,
      u.slug AS author_slug,
      u.email AS author_email,
      u.bio AS author_bio,
      u.avatar_url AS author_avatar_url,
      u.full_name AS author_full_name,
      u.linkedin_url AS author_linkedin_url,
      u.github_url AS author_github_url,
      u.is_admin AS author_is_admin,
      c.id AS category_join_id,
      c.name AS category_name,
      c.slug AS category_slug,
      c.description AS category_description
    FROM articles a
           LEFT JOIN users u ON u.id = a.author_id
           LEFT JOIN categories c ON c.id = a.category_id
  `;
}

function getRealPoolConfig() {
  const config = {
    connectionString: process.env.DATABASE_URL
  };

  const wantsSsl = parseBoolean(process.env.DATABASE_SSL);
  if (wantsSsl) {
    config.ssl = { rejectUnauthorized: false };
  }

  return config;
}

async function createPool() {
  if (process.env.DATABASE_URL) {
    try {
      const realPool = new PgPool(getRealPoolConfig());
      await realPool.query('SELECT 1');
      dbMode = 'postgres';
      console.log('[db] connected to PostgreSQL');
      return realPool;
    } catch (error) {
      console.warn('[db] failed to connect to PostgreSQL, falling back to in-memory database');
      console.warn(error.message);
    }
  }

  const memoryDb = newDb({ autoCreateForeignKeyIndices: true });
  const adapter = memoryDb.adapters.createPg();
  dbMode = 'memory';
  console.log('[db] using in-memory PostgreSQL fallback');
  return new adapter.Pool();
}

async function query(text, params = []) {
  await initStore();
  return pool.query(text, params);
}

async function runMigrations() {
  const sql = await fs.readFile(MIGRATION_PATH, 'utf8');
  await pool.query(sql);
  const sql002 = await fs.readFile(MIGRATION_PATH_002, 'utf8');
  await pool.query(sql002);
}

async function seedIfNeeded() {
  const { rows } = await pool.query('SELECT COUNT(*) AS total FROM users');
  const totalUsers = Number(rows[0]?.total || 0);
  if (totalUsers > 0) {
    return;
  }

  const passwordHash = await bcrypt.hash(seedData.seedPassword, 10);

  const userIdBySlug = new Map();
  const categoryIdBySlug = new Map();
  const tagIdBySlug = new Map();

  for (const user of seedData.users) {
    const result = await pool.query(
        `
          INSERT INTO users (name, slug, email, password, bio, full_name, avatar_url, linkedin_url, github_url, is_admin)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING id
        `,
        [user.name, user.slug, user.email, passwordHash, user.bio, user.full_name || null, user.avatar_url, user.linkedin_url || null, user.github_url || null, user.is_admin]
    );
    userIdBySlug.set(user.slug, result.rows[0].id);
  }

  for (const category of seedData.categories) {
    const result = await pool.query(
        `
          INSERT INTO categories (name, slug, description)
          VALUES ($1, $2, $3)
            RETURNING id
        `,
        [category.name, category.slug, category.description]
    );
    categoryIdBySlug.set(category.slug, result.rows[0].id);
  }

  for (const tag of seedData.tags) {
    const result = await pool.query(
        `
          INSERT INTO tags (name, slug)
          VALUES ($1, $2)
            RETURNING id
        `,
        [tag.name, tag.slug]
    );
    tagIdBySlug.set(tag.slug, result.rows[0].id);
  }

  for (const article of seedData.articles) {
    const result = await pool.query(
        `
          INSERT INTO articles (
            title,
            slug,
            excerpt,
            content,
            cover_url,
            author_id,
            category_id,
            status,
            views,
            meta_title,
            meta_description,
            published_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING id
        `,
        [
          article.title,
          article.slug,
          article.excerpt,
          article.content,
          article.cover_url,
          userIdBySlug.get(article.authorSlug),
          categoryIdBySlug.get(article.categorySlug),
          article.status,
          article.views,
          article.meta_title,
          article.meta_description,
          article.published_at
        ]
    );

    const articleId = result.rows[0].id;
    for (const tagSlug of article.tagSlugs) {
      const tagId = tagIdBySlug.get(tagSlug);
      await pool.query(
          'INSERT INTO article_tags (article_id, tag_id) VALUES ($1, $2)',
          [articleId, tagId]
      );
    }
  }
}

async function initStore() {
  if (initialized) {
    return;
  }

  if (!initPromise) {
    initPromise = (async () => {
      pool = await createPool();
      await runMigrations();
      await seedIfNeeded();
      initialized = true;
    })();
  }

  return initPromise;
}

async function getTagMapForArticleIds(articleIds) {
  if (!articleIds.length) {
    return new Map();
  }

  const uniqueIds = [...new Set(articleIds)];
  const placeholders = uniqueIds.map((_, index) => `$${index + 1}`).join(', ');
  const { rows } = await query(
      `
        SELECT at.article_id, t.id, t.name, t.slug, t.created_at
        FROM article_tags at
      JOIN tags t ON t.id = at.tag_id
        WHERE at.article_id IN (${placeholders})
        ORDER BY t.name ASC
      `,
      uniqueIds
  );

  const map = new Map();
  for (const row of rows) {
    if (!map.has(row.article_id)) {
      map.set(row.article_id, []);
    }
    map.get(row.article_id).push(mapTagRow(row));
  }

  return map;
}

async function hydrateArticles(rows) {
  const tagMap = await getTagMapForArticleIds(rows.map((row) => row.id));
  return rows.map((row) => mapArticleRow(row, tagMap.get(row.id) || []));
}

async function fetchArticleByClause(whereClause, params, { includeDrafts = false } = {}) {
  const conditions = [whereClause];
  if (!includeDrafts) {
    conditions.push(`a.status = 'published'`);
  }

  const { rows } = await query(
      `
      ${getArticleSelect()}
      WHERE ${conditions.join(' AND ')}
      LIMIT 1
    `,
      params
  );

  if (!rows[0]) {
    return null;
  }

  const hydrated = await hydrateArticles(rows);
  return hydrated[0] || null;
}

async function countQuery(sql, params = []) {
  const { rows } = await query(sql, params);
  return Number(rows[0]?.total || 0);
}

async function listArticles({ page = 1, perPage = 10, category = '' } = {}) {
  const safePage = normalizePage(page);
  const safePerPage = normalizePerPage(perPage);
  const filters = [`a.status = 'published'`];
  const params = [];

  if (category) {
    params.push(String(category));
    filters.push(`c.slug = $${params.length}`);
  }

  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const total = await countQuery(
      `
        SELECT COUNT(*) AS total
        FROM articles a
               LEFT JOIN categories c ON c.id = a.category_id
          ${whereClause}
      `,
      params
  );

  const dataParams = [...params, safePerPage, (safePage - 1) * safePerPage];
  const { rows } = await query(
      `
      ${getArticleSelect()}
      ${whereClause}
      ORDER BY COALESCE(a.published_at, a.created_at) DESC, a.id DESC
      LIMIT $${dataParams.length - 1}
      OFFSET $${dataParams.length}
    `,
      dataParams
  );

  return {
    data: await hydrateArticles(rows),
    meta: buildPagination(total, safePage, safePerPage)
  };
}

async function getArticleBySlug(slug, options = {}) {
  return fetchArticleByClause('a.slug = $1', [slug], options);
}

async function getArticleById(id, options = {}) {
  return fetchArticleByClause('a.id = $1', [id], options);
}

async function getRelatedArticles(slug, limit = 3) {
  const current = await getArticleBySlug(slug, { includeDrafts: true });
  if (!current) {
    return null;
  }

  const safeLimit = Math.max(1, Math.min(12, Number(limit) || 3));
  const { rows } = await query(
      `
      ${getArticleSelect()}
      WHERE a.status = 'published'
        AND a.category_id = $1
        AND a.id <> $2
      ORDER BY COALESCE(a.published_at, a.created_at) DESC, a.id DESC
      LIMIT $3
    `,
      [current.categoryId, current.id, safeLimit]
  );

  return hydrateArticles(rows);
}

async function incrementArticleViews(id) {
  const articleId = parseInteger(id, 'id');
  const result = await query(
      `
        UPDATE articles
        SET views = views + 1, updated_at = NOW()
        WHERE id = $1
          RETURNING id
      `,
      [articleId]
  );

  if (!result.rows[0]) {
    return null;
  }

  return getArticleById(articleId, { includeDrafts: true });
}

async function getCategories() {
  const { rows } = await query('SELECT * FROM categories ORDER BY name ASC');
  return rows.map(mapCategoryRow);
}

async function getCategoryBySlug(slug) {
  const { rows } = await query('SELECT * FROM categories WHERE slug = $1 LIMIT 1', [slug]);
  return mapCategoryRow(rows[0]);
}

async function getCategoryById(id) {
  const { rows } = await query('SELECT * FROM categories WHERE id = $1 LIMIT 1', [id]);
  return mapCategoryRow(rows[0]);
}

async function getArticlesByCategory(slug, { page = 1, perPage = 10 } = {}) {
  const category = await getCategoryBySlug(slug);
  if (!category) {
    return null;
  }

  const safePage = normalizePage(page);
  const safePerPage = normalizePerPage(perPage);
  const total = await countQuery(
      `
        SELECT COUNT(*) AS total
        FROM articles
        WHERE status = 'published' AND category_id = $1
      `,
      [category.id]
  );

  const { rows } = await query(
      `
      ${getArticleSelect()}
      WHERE a.status = 'published' AND a.category_id = $1
      ORDER BY COALESCE(a.published_at, a.created_at) DESC, a.id DESC
      LIMIT $2 OFFSET $3
    `,
      [category.id, safePerPage, (safePage - 1) * safePerPage]
  );

  return {
    category,
    data: await hydrateArticles(rows),
    meta: buildPagination(total, safePage, safePerPage)
  };
}

async function getTags() {
  const { rows } = await query('SELECT * FROM tags ORDER BY name ASC');
  return rows.map(mapTagRow);
}

async function getTagBySlug(slug) {
  const { rows } = await query('SELECT * FROM tags WHERE slug = $1 LIMIT 1', [slug]);
  return mapTagRow(rows[0]);
}

async function getTagById(id) {
  const { rows } = await query('SELECT * FROM tags WHERE id = $1 LIMIT 1', [id]);
  return mapTagRow(rows[0]);
}

async function getArticlesByTag(slug, { page = 1, perPage = 10 } = {}) {
  const tag = await getTagBySlug(slug);
  if (!tag) {
    return null;
  }

  const safePage = normalizePage(page);
  const safePerPage = normalizePerPage(perPage);
  const total = await countQuery(
      `
        SELECT COUNT(*) AS total
        FROM articles a
               JOIN article_tags at ON at.article_id = a.id
        WHERE a.status = 'published' AND at.tag_id = $1
      `,
      [tag.id]
  );

  const { rows } = await query(
      `
      ${getArticleSelect()}
      JOIN article_tags at ON at.article_id = a.id
      WHERE a.status = 'published' AND at.tag_id = $1
      ORDER BY COALESCE(a.published_at, a.created_at) DESC, a.id DESC
      LIMIT $2 OFFSET $3
    `,
      [tag.id, safePerPage, (safePage - 1) * safePerPage]
  );

  return {
    tag,
    data: await hydrateArticles(rows),
    meta: buildPagination(total, safePage, safePerPage)
  };
}

async function getAuthors() {
  const { rows } = await query(
      `
        SELECT
          u.id,
          u.name,
          u.slug,
          u.email,
          u.bio,
          u.full_name,
          u.avatar_url,
          u.linkedin_url,
          u.github_url,
          u.is_admin,
          u.created_at,
          SUM(CASE WHEN a.status = 'published' THEN 1 ELSE 0 END) AS published_count
        FROM users u
               LEFT JOIN articles a ON a.author_id = u.id
        GROUP BY u.id, u.name, u.slug, u.email, u.bio, u.full_name, u.avatar_url, u.linkedin_url, u.github_url, u.is_admin, u.created_at
        ORDER BY u.name ASC
      `
  );

  return rows.map((row) => ({
    ...sanitizeUserRow(row),
    publishedCount: Number(row.published_count || 0)
  }));
}

async function getAuthorBySlug(slug) {
  const { rows } = await query(
      `
        SELECT
          u.id,
          u.name,
          u.slug,
          u.email,
          u.bio,
          u.full_name,
          u.avatar_url,
          u.linkedin_url,
          u.github_url,
          u.is_admin,
          u.created_at,
          SUM(CASE WHEN a.status = 'published' THEN 1 ELSE 0 END) AS total_articles
        FROM users u
               LEFT JOIN articles a ON a.author_id = u.id
        WHERE u.slug = $1
        GROUP BY u.id, u.name, u.slug, u.email, u.bio, u.full_name, u.avatar_url, u.linkedin_url, u.github_url, u.is_admin, u.created_at
          LIMIT 1
      `,
      [slug]
  );
  if (!rows[0]) return null;
  return {
    ...sanitizeUserRow(rows[0]),
    totalArticles: Number(rows[0].total_articles || 0)
  };
}

async function getAuthorById(id) {
  const { rows } = await query('SELECT * FROM users WHERE id = $1 LIMIT 1', [id]);
  return sanitizeUserRow(rows[0]);
}

async function getArticlesByAuthor(slug, { page = 1, perPage = 10 } = {}) {
  const author = await getAuthorBySlug(slug);
  if (!author) {
    return null;
  }

  const safePage = normalizePage(page);
  const safePerPage = normalizePerPage(perPage);
  const total = await countQuery(
      `
        SELECT COUNT(*) AS total
        FROM articles
        WHERE status = 'published' AND author_id = $1
      `,
      [author.id]
  );

  const { rows } = await query(
      `
      ${getArticleSelect()}
      WHERE a.status = 'published' AND a.author_id = $1
      ORDER BY COALESCE(a.published_at, a.created_at) DESC, a.id DESC
      LIMIT $2 OFFSET $3
    `,
      [author.id, safePerPage, (safePage - 1) * safePerPage]
  );

  return {
    author,
    data: await hydrateArticles(rows),
    meta: buildPagination(total, safePage, safePerPage)
  };
}

async function searchArticles(queryText, { page = 1, perPage = 10 } = {}) {
  const normalizedQuery = String(queryText || '').trim().toLowerCase();
  const safePage = normalizePage(page);
  const safePerPage = normalizePerPage(perPage);

  if (!normalizedQuery) {
    return {
      data: [],
      meta: buildPagination(0, safePage, safePerPage)
    };
  }

  const pattern = `%${normalizedQuery}%`;
  const searchCondition = `
    (
      LOWER(a.title) LIKE $1
      OR LOWER(COALESCE(a.excerpt, '')) LIKE $1
      OR LOWER(COALESCE(a.content, '')) LIKE $1
      OR LOWER(COALESCE(c.name, '')) LIKE $1
      OR LOWER(COALESCE(u.name, '')) LIKE $1
      OR EXISTS (
        SELECT 1
        FROM article_tags at
        JOIN tags t ON t.id = at.tag_id
        WHERE at.article_id = a.id AND LOWER(t.name) LIKE $1
      )
    )
  `;

  const total = await countQuery(
      `
        SELECT COUNT(*) AS total
        FROM articles a
               LEFT JOIN users u ON u.id = a.author_id
               LEFT JOIN categories c ON c.id = a.category_id
        WHERE a.status = 'published' AND ${searchCondition}
      `,
      [pattern]
  );

  const { rows } = await query(
      `
      ${getArticleSelect()}
      WHERE a.status = 'published' AND ${searchCondition}
      ORDER BY COALESCE(a.published_at, a.created_at) DESC, a.id DESC
      LIMIT $2 OFFSET $3
    `,
      [pattern, safePerPage, (safePage - 1) * safePerPage]
  );

  return {
    data: await hydrateArticles(rows),
    meta: buildPagination(total, safePage, safePerPage)
  };
}

async function authenticateUser(email, password) {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  if (!normalizedEmail || !password) {
    return null;
  }

  const { rows } = await query('SELECT * FROM users WHERE LOWER(email) = $1 LIMIT 1', [normalizedEmail]);
  const userRow = rows[0];
  if (!userRow) {
    return null;
  }

  const isValid = await bcrypt.compare(String(password), userRow.password);
  if (!isValid) {
    return null;
  }

  return sanitizeUserRow(userRow);
}

async function getUserById(id) {
  const { rows } = await query('SELECT * FROM users WHERE id = $1 LIMIT 1', [id]);
  return sanitizeUserRow(rows[0]);
}

function normalizeArticlePayload(payload = {}) {
  const title = parseNullableString(payload.title);
  const content = parseNullableString(payload.content);
  const excerpt = parseNullableString(payload.excerpt);
  const coverUrl = parseNullableString(payload.coverUrl);
  const slug = parseNullableString(payload.slug) || createSlug(title || '');
  const status = parseNullableString(payload.status) || 'draft';
  const metaTitle = parseNullableString(payload.metaTitle) || title;
  const metaDescription = parseNullableString(payload.metaDescription) || excerpt;
  const authorId = parseInteger(payload.authorId, 'authorId');
  const categoryId = parseInteger(payload.categoryId, 'categoryId');
  const tagIds = normalizeTagIds(payload.tagIds);

  if (!title) {
    throw new AppError(400, 'VALIDATION_ERROR', 'title is required');
  }

  if (!content) {
    throw new AppError(400, 'VALIDATION_ERROR', 'content is required');
  }

  if (!slug) {
    throw new AppError(400, 'VALIDATION_ERROR', 'slug is required');
  }

  if (!['draft', 'published'].includes(status)) {
    throw new AppError(400, 'VALIDATION_ERROR', 'status must be draft or published');
  }

  return {
    title,
    slug,
    excerpt,
    content,
    coverUrl,
    authorId,
    categoryId,
    status,
    metaTitle,
    metaDescription,
    publishedAt: parseDate(payload.publishedAt) || (status === 'published' ? new Date().toISOString() : null),
    tagIds
  };
}

async function ensureCategoryExists(categoryId) {
  const category = await getCategoryById(categoryId);
  if (!category) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Category not found');
  }
}

async function ensureAuthorExists(authorId) {
  const author = await getAuthorById(authorId);
  if (!author) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Author not found');
  }
}

async function ensureTagsExist(tagIds) {
  for (const tagId of tagIds) {
    const tag = await getTagById(tagId);
    if (!tag) {
      throw new AppError(400, 'VALIDATION_ERROR', `Tag ${tagId} not found`);
    }
  }
}

async function syncArticleTags(articleId, tagIds) {
  await query('DELETE FROM article_tags WHERE article_id = $1', [articleId]);

  if (!tagIds.length) {
    return;
  }

  const values = tagIds.map((_, index) => `($1, $${index + 2})`).join(', ');
  await query(`INSERT INTO article_tags (article_id, tag_id) VALUES ${values}`, [articleId, ...tagIds]);
}

function handleDatabaseError(error) {
  if (error instanceof AppError) {
    throw error;
  }

  if (error?.code === '23505') {
    throw new AppError(409, 'CONFLICT', 'Resource with the same unique field already exists');
  }

  if (error?.code === '23503') {
    throw new AppError(400, 'RELATION_CONSTRAINT', 'Cannot remove or update resource because it is still referenced');
  }

  throw error;
}

async function listAdminArticles({ page = 1, perPage = 20, status = '' } = {}) {
  const safePage = normalizePage(page);
  const safePerPage = normalizePerPage(perPage, 20, 100);
  const filters = [];
  const params = [];

  if (status) {
    params.push(String(status));
    filters.push(`a.status = $${params.length}`);
  }

  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const total = await countQuery(`SELECT COUNT(*) AS total FROM articles a ${whereClause}`, params);

  const { rows } = await query(
      `
      ${getArticleSelect()}
      ${whereClause}
      ORDER BY a.updated_at DESC, a.id DESC
      LIMIT $${params.length + 1}
      OFFSET $${params.length + 2}
    `,
      [...params, safePerPage, (safePage - 1) * safePerPage]
  );

  return {
    data: await hydrateArticles(rows),
    meta: buildPagination(total, safePage, safePerPage)
  };
}

async function createArticle(payload) {
  try {
    const data = normalizeArticlePayload(payload);
    await ensureAuthorExists(data.authorId);
    await ensureCategoryExists(data.categoryId);
    await ensureTagsExist(data.tagIds);

    const result = await query(
        `
          INSERT INTO articles (
            title,
            slug,
            excerpt,
            content,
            cover_url,
            author_id,
            category_id,
            status,
            meta_title,
            meta_description,
            published_at,
            updated_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
            RETURNING id
        `,
        [
          data.title,
          data.slug,
          data.excerpt,
          data.content,
          data.coverUrl,
          data.authorId,
          data.categoryId,
          data.status,
          data.metaTitle,
          data.metaDescription,
          data.publishedAt
        ]
    );

    const articleId = result.rows[0].id;
    await syncArticleTags(articleId, data.tagIds);
    return getArticleById(articleId, { includeDrafts: true });
  } catch (error) {
    handleDatabaseError(error);
  }
}

async function updateArticle(id, payload) {
  const articleId = parseInteger(id, 'id');
  const existingArticle = await getArticleById(articleId, { includeDrafts: true });
  if (!existingArticle) {
    throw new AppError(404, 'NOT_FOUND', 'Article not found');
  }

  try {
    const data = normalizeArticlePayload(payload);
    await ensureAuthorExists(data.authorId);
    await ensureCategoryExists(data.categoryId);
    await ensureTagsExist(data.tagIds);

    await query(
        `
          UPDATE articles
          SET
            title = $1,
            slug = $2,
            excerpt = $3,
            content = $4,
            cover_url = $5,
            author_id = $6,
            category_id = $7,
            status = $8,
            meta_title = $9,
            meta_description = $10,
            published_at = $11,
            updated_at = NOW()
          WHERE id = $12
        `,
        [
          data.title,
          data.slug,
          data.excerpt,
          data.content,
          data.coverUrl,
          data.authorId,
          data.categoryId,
          data.status,
          data.metaTitle,
          data.metaDescription,
          data.publishedAt,
          articleId
        ]
    );

    await syncArticleTags(articleId, data.tagIds);
    return getArticleById(articleId, { includeDrafts: true });
  } catch (error) {
    handleDatabaseError(error);
  }
}

async function deleteArticle(id) {
  const articleId = parseInteger(id, 'id');
  const result = await query('DELETE FROM articles WHERE id = $1 RETURNING id', [articleId]);
  if (!result.rows[0]) {
    throw new AppError(404, 'NOT_FOUND', 'Article not found');
  }
  return { id: articleId };
}

function normalizeCategoryPayload(payload = {}) {
  const name = parseNullableString(payload.name);
  const description = parseNullableString(payload.description);
  const slug = parseNullableString(payload.slug) || createSlug(name || '');

  if (!name) {
    throw new AppError(400, 'VALIDATION_ERROR', 'name is required');
  }

  if (!slug) {
    throw new AppError(400, 'VALIDATION_ERROR', 'slug is required');
  }

  return { name, slug, description };
}

async function listAdminCategories() {
  return getCategories();
}

async function createCategory(payload) {
  try {
    const data = normalizeCategoryPayload(payload);
    const result = await query(
        'INSERT INTO categories (name, slug, description) VALUES ($1, $2, $3) RETURNING id',
        [data.name, data.slug, data.description]
    );
    return getCategoryById(result.rows[0].id);
  } catch (error) {
    handleDatabaseError(error);
  }
}

async function updateCategory(id, payload) {
  const categoryId = parseInteger(id, 'id');
  const existing = await getCategoryById(categoryId);
  if (!existing) {
    throw new AppError(404, 'NOT_FOUND', 'Category not found');
  }

  try {
    const data = normalizeCategoryPayload(payload);
    await query(
        'UPDATE categories SET name = $1, slug = $2, description = $3 WHERE id = $4',
        [data.name, data.slug, data.description, categoryId]
    );
    return getCategoryById(categoryId);
  } catch (error) {
    handleDatabaseError(error);
  }
}

async function deleteCategory(id) {
  const categoryId = parseInteger(id, 'id');
  const usageCount = await countQuery('SELECT COUNT(*) AS total FROM articles WHERE category_id = $1', [categoryId]);
  if (usageCount > 0) {
    throw new AppError(400, 'RELATION_CONSTRAINT', 'Cannot delete category that still has articles');
  }

  const result = await query('DELETE FROM categories WHERE id = $1 RETURNING id', [categoryId]);
  if (!result.rows[0]) {
    throw new AppError(404, 'NOT_FOUND', 'Category not found');
  }
  return { id: categoryId };
}

function normalizeTagPayload(payload = {}) {
  const name = parseNullableString(payload.name);
  const slug = parseNullableString(payload.slug) || createSlug(name || '');

  if (!name) {
    throw new AppError(400, 'VALIDATION_ERROR', 'name is required');
  }

  if (!slug) {
    throw new AppError(400, 'VALIDATION_ERROR', 'slug is required');
  }

  return { name, slug };
}

async function listAdminTags() {
  return getTags();
}

async function createTag(payload) {
  try {
    const data = normalizeTagPayload(payload);
    const result = await query('INSERT INTO tags (name, slug) VALUES ($1, $2) RETURNING id', [
      data.name,
      data.slug
    ]);
    return getTagById(result.rows[0].id);
  } catch (error) {
    handleDatabaseError(error);
  }
}

async function updateTag(id, payload) {
  const tagId = parseInteger(id, 'id');
  const existing = await getTagById(tagId);
  if (!existing) {
    throw new AppError(404, 'NOT_FOUND', 'Tag not found');
  }

  try {
    const data = normalizeTagPayload(payload);
    await query('UPDATE tags SET name = $1, slug = $2 WHERE id = $3', [data.name, data.slug, tagId]);
    return getTagById(tagId);
  } catch (error) {
    handleDatabaseError(error);
  }
}

async function deleteTag(id) {
  const tagId = parseInteger(id, 'id');
  const result = await query('DELETE FROM tags WHERE id = $1 RETURNING id', [tagId]);
  if (!result.rows[0]) {
    throw new AppError(404, 'NOT_FOUND', 'Tag not found');
  }
  return { id: tagId };
}

async function listAuthors() {
  return getAuthors();
}

function mapSiteSettingsRow(row) {
  if (!row) return null;
  return {
    title: row.title,
    name: row.name,
    description: row.description,
    mission: row.mission,
    contacts: { email: row.contact_email },
    foundedDate: row.founded_date
        ? (row.founded_date instanceof Date
            ? row.founded_date.toISOString().slice(0, 10)
            : String(row.founded_date).slice(0, 10))
        : null,
    socialLinks: Array.isArray(row.social_links) ? row.social_links : (row.social_links ? JSON.parse(row.social_links) : []),
    updatedAt: row.updated_at
  };
}

async function getSiteSettings() {
  const { rows } = await query('SELECT * FROM site_settings ORDER BY id ASC LIMIT 1');
  return mapSiteSettingsRow(rows[0]);
}

async function updateSiteSettings(payload = {}) {
  const existing = await getSiteSettings();
  if (!existing) {
    throw new AppError(404, 'NOT_FOUND', 'Site settings not found');
  }

  const title = parseNullableString(payload.title) || existing.title;
  const name = parseNullableString(payload.name) || existing.name;
  const description = parseNullableString(payload.description);
  const mission = parseNullableString(payload.mission);
  const contactEmail = parseNullableString(payload.contactEmail || (payload.contacts && payload.contacts.email));
  const foundedDate = parseNullableString(payload.foundedDate); // передаємо як рядок, БД сама приведе
  const socialLinks = Array.isArray(payload.socialLinks) ? JSON.stringify(payload.socialLinks) : null;

  const { rows } = await query(
      `
        UPDATE site_settings
        SET
          title         = COALESCE($1, title),
          name          = COALESCE($2, name),
          description   = COALESCE($3, description),
          mission       = COALESCE($4, mission),
          contact_email = COALESCE($5, contact_email),
          founded_date  = COALESCE($6, founded_date),
          social_links  = COALESCE($7, social_links),
          updated_at    = NOW()
        WHERE id = (SELECT id FROM site_settings ORDER BY id ASC LIMIT 1)
          RETURNING *
      `,
      [title, name, description, mission, contactEmail, foundedDate, socialLinks]
  );

  return mapSiteSettingsRow(rows[0]);
}

function getDbMode() {
  return dbMode;
}

module.exports = {
  initStore,
  getDbMode,
  listArticles,
  getArticleBySlug,
  getArticleById,
  getRelatedArticles,
  incrementArticleViews,
  getCategories,
  getCategoryBySlug,
  getArticlesByCategory,
  getTags,
  getTagBySlug,
  getArticlesByTag,
  getAuthors,
  getAuthorBySlug,
  getArticlesByAuthor,
  searchArticles,
  authenticateUser,
  getUserById,
  listAdminArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  listAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  listAdminTags,
  createTag,
  updateTag,
  deleteTag,
  listAuthors,
  getSiteSettings,
  updateSiteSettings
};