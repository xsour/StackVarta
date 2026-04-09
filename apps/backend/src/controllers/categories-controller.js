const store = require('../models/store');
const { sendData, sendError, sendList } = require('../utils/response');

async function listCategories(req, res) {
  const categories = await store.getCategories();
  return sendData(res, categories);
}

async function getCategory(req, res) {
  const category = await store.getCategoryBySlug(req.params.slug);
  if (!category) {
    return sendError(res, 404, 'NOT_FOUND', 'Category not found');
  }

  return sendData(res, category);
}

async function categoryArticles(req, res) {
  const result = await store.getArticlesByCategory(req.params.slug, {
    page: req.query.page,
    perPage: req.query.perPage
  });

  if (!result) {
    return sendError(res, 404, 'NOT_FOUND', 'Category not found');
  }

  return sendList(res, result.data, result.meta);
}

module.exports = {
  listCategories,
  getCategory,
  categoryArticles
};
