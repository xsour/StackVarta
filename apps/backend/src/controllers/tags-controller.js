const store = require('../models/store');
const { sendData, sendError, sendList } = require('../utils/response');

async function listTags(req, res) {
  const tags = await store.getTags();
  return sendData(res, tags);
}

async function getTag(req, res) {
  const tag = await store.getTagBySlug(req.params.slug);
  if (!tag) {
    return sendError(res, 404, 'NOT_FOUND', 'Tag not found');
  }

  return sendData(res, tag);
}

async function tagArticles(req, res) {
  const result = await store.getArticlesByTag(req.params.slug, {
    page: req.query.page,
    perPage: req.query.perPage
  });

  if (!result) {
    return sendError(res, 404, 'NOT_FOUND', 'Tag not found');
  }

  return sendList(res, result.data, result.meta);
}

module.exports = {
  listTags,
  getTag,
  tagArticles
};
