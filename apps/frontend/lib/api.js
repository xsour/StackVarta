import {
  authors as fallbackAuthors,
  categories as fallbackCategories,
  getArticleBySlug as getFallbackArticleBySlug,
  getArticlesByAuthor as getFallbackArticlesByAuthor,
  getArticlesByCategory as getFallbackArticlesByCategory,
  getArticlesByTag as getFallbackArticlesByTag,
  getAuthorBySlug as getFallbackAuthorBySlug,
  getCategoryBySlug as getFallbackCategoryBySlug,
  getHomepageData as getFallbackHomepageData,
  getPublishedArticles as getFallbackPublishedArticles,
  getRelatedArticles as getFallbackRelatedArticles,
  getTagBySlug as getFallbackTagBySlug,
  searchArticles as searchFallbackArticles,
  tags as fallbackTags,
  getAboutData as getFallbackAboutData,
  getArticleCountByAuthor as getFallbackArticleCountByAuthor
} from './mock-data';
import { getApiBaseUrl } from './site-config';

class ApiHttpError extends Error {
  constructor(status, payload) {
    super(payload?.error?.message || `HTTP ${status}`);
    this.name = 'ApiHttpError';
    this.status = status;
    this.payload = payload;
  }
}

function isNotFoundError(error) {
  return error instanceof ApiHttpError && error.status === 404;
}

function buildApiUrl(pathname) {
  const base = getApiBaseUrl();
  return `${base}${pathname}`;
}

async function requestJson(pathname, { revalidate = 300, cache = 'force-cache', ...options } = {}) {
  const response = await fetch(buildApiUrl(pathname), {
    ...options,
    cache,
    next: { revalidate },
    headers: {
      Accept: 'application/json',
      ...(options.headers || {})
    }
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiHttpError(response.status, payload);
  }

  return payload;
}

function buildPageMeta(total, page, perPage) {
  const safeTotal = Number(total || 0);
  const safePage = Number(page || 1);
  const safePerPage = Number(perPage || 10);
  return {
    total: safeTotal,
    page: safePage,
    perPage: safePerPage,
    totalPages: Math.max(1, Math.ceil(safeTotal / safePerPage))
  };
}

export async function getCategories() {
  try {
    const payload = await requestJson('/api/categories');
    return payload.data;
  } catch {
    return fallbackCategories;
  }
}

export async function getAuthors() {
  try {
    const payload = await requestJson('/api/authors');
    return payload.data;
  } catch {
    return fallbackAuthors;
  }
}

export async function getTags() {
  try {
    const payload = await requestJson('/api/tags');
    return payload.data;
  } catch {
    return fallbackTags;
  }
}

export async function getHomePageData({ page = 1, category = '' } = {}) {
  try {
    const query = new URLSearchParams({
      page: String(page),
      perPage: '10'
    });

    if (category) {
      query.set('category', category);
    }

    const [articlesPayload, categories] = await Promise.all([
      requestJson(`/api/articles?${query.toString()}`),
      getCategories()
    ]);

    return {
      items: articlesPayload.data,
      meta: articlesPayload.meta,
      categories
    };
  } catch {
    const { items, meta } = getFallbackHomepageData({ page, category });
    return {
      items,
      meta,
      categories: fallbackCategories
    };
  }
}

export async function getArticlePageData(slug) {
  try {
    const [articlePayload, relatedPayload] = await Promise.all([
      requestJson(`/api/articles/${slug}`, { revalidate: 60 }),
      requestJson(`/api/articles/${slug}/related?limit=3`, { revalidate: 60 })
    ]);

    return {
      article: articlePayload.data,
      relatedArticles: relatedPayload.data
    };
  } catch (error) {
    if (isNotFoundError(error)) {
      return {
        article: null,
        relatedArticles: []
      };
    }

    const fallbackArticle = getFallbackArticleBySlug(slug);
    if (!fallbackArticle) {
      return {
        article: null,
        relatedArticles: []
      };
    }

    return {
      article: fallbackArticle,
      relatedArticles: getFallbackRelatedArticles(slug, 3)
    };
  }
}

export async function getCategoryPageData(slug, { page = 1 } = {}) {
  try {
    const [categoryPayload, articlesPayload] = await Promise.all([
      requestJson(`/api/categories/${slug}`),
      requestJson(`/api/categories/${slug}/articles?page=${page}&perPage=10`)
    ]);

    return {
      category: categoryPayload.data,
      items: articlesPayload.data,
      meta: articlesPayload.meta
    };
  } catch (error) {
    if (isNotFoundError(error)) {
      return {
        category: null,
        items: [],
        meta: buildPageMeta(0, page, 10)
      };
    }

    const category = getFallbackCategoryBySlug(slug);
    if (!category) {
      return {
        category: null,
        items: [],
        meta: buildPageMeta(0, page, 10)
      };
    }

    const { items, meta } = getFallbackArticlesByCategory(slug, { page, perPage: 10 });
    return { category, items, meta };
  }
}

export async function getAuthorPageData(slug, { page = 1 } = {}) {
  try {
    const [authorPayload, articlesPayload] = await Promise.all([
      requestJson(`/api/authors/${slug}`),
      requestJson(`/api/authors/${slug}/articles?page=${page}&perPage=10`)
    ]);

    return {
      author: authorPayload.data,
      items: articlesPayload.data,
      meta: articlesPayload.meta
    };
  } catch (error) {
    if (isNotFoundError(error)) {
      return {
        author: null,
        items: [],
        meta: buildPageMeta(0, page, 10)
      };
    }

    const author = getFallbackAuthorBySlug(slug);
    if (!author) {
      return {
        author: null,
        items: [],
        meta: buildPageMeta(0, page, 10)
      };
    }

    const { items, meta } = getFallbackArticlesByAuthor(slug, { page, perPage: 10 });
    const totalArticles = getFallbackArticleCountByAuthor(slug);
    return { author: { ...author, totalArticles }, items, meta };
  }
}

export async function getTagPageData(slug, { page = 1 } = {}) {
  try {
    const [tagPayload, articlesPayload] = await Promise.all([
      requestJson(`/api/tags/${slug}`),
      requestJson(`/api/tags/${slug}/articles?page=${page}&perPage=10`)
    ]);

    return {
      tag: tagPayload.data,
      items: articlesPayload.data,
      meta: articlesPayload.meta
    };
  } catch (error) {
    if (isNotFoundError(error)) {
      return {
        tag: null,
        items: [],
        meta: buildPageMeta(0, page, 10)
      };
    }

    const tag = getFallbackTagBySlug(slug);
    if (!tag) {
      return {
        tag: null,
        items: [],
        meta: buildPageMeta(0, page, 10)
      };
    }

    const { items, meta } = getFallbackArticlesByTag(slug, { page, perPage: 10 });
    return { tag, items, meta };
  }
}

export async function getSearchResults(query) {
  const normalizedQuery = String(query || '').trim();
  if (!normalizedQuery) {
    return [];
  }

  try {
    const payload = await requestJson(`/api/search?q=${encodeURIComponent(normalizedQuery)}&perPage=20`, {
      revalidate: 0,
      cache: 'no-store'
    });
    return payload.data;
  } catch {
    return searchFallbackArticles(normalizedQuery);
  }
}

export async function getFeedArticles(limit = 50) {
  try {
    const payload = await requestJson(`/api/articles?page=1&perPage=${limit}`);
    return payload.data;
  } catch {
    return getFallbackPublishedArticles().slice(0, limit);
  }
}

export async function getSitemapData() {
  const [categories, authors, tags, articles] = await Promise.all([
    getCategories(),
    getAuthors(),
    getTags(),
    getFeedArticles(100)
  ]);

  return {
    categories,
    authors,
    tags,
    articles
  };
}

export async function getAboutPageData() {
  try {
    const payload = await requestJson('/api/about');
    return payload.data;
  } catch {
    return getFallbackAboutData();
  }
}
