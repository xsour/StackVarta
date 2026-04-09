const store = require('../models/store');
const { sendData, sendError, sendList } = require('../utils/response');

async function listArticles(req, res) {
  const result = await store.listArticles({
    page: req.query.page,
    perPage: req.query.perPage,
    category: req.query.category
  });

  return sendList(res, result.data, result.meta);
}

async function getArticle(req, res) {
  const article = await store.getArticleBySlug(req.params.slug);
  if (!article) {
    return sendError(res, 404, 'NOT_FOUND', 'Article not found');
  }

  return sendData(res, article);
}

async function getRelated(req, res) {
  const relatedArticles = await store.getRelatedArticles(req.params.slug, req.query.limit || 3);
  if (!relatedArticles) {
    return sendError(res, 404, 'NOT_FOUND', 'Article not found');
  }

  return sendData(res, relatedArticles);
}

async function incrementView(req, res) {
  const article = await store.incrementArticleViews(req.params.id);
  if (!article) {
    return sendError(res, 404, 'NOT_FOUND', 'Article not found');
  }

  return sendData(res, article);
}

module.exports = {
  listArticles,
  getArticle,
  getRelated,
  incrementView
};
