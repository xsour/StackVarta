const store = require('../models/store');
const { sendData, sendError, sendList } = require('../utils/response');

async function listAuthors(req, res) {
  const authors = await store.getAuthors();
  return sendData(res, authors);
}

async function authorProfile(req, res) {
  const author = await store.getAuthorBySlug(req.params.slug);
  if (!author) {
    return sendError(res, 404, 'NOT_FOUND', 'Author not found');
  }
  // totalArticles вже включено в getAuthorBySlug через COUNT у SQL
  return sendData(res, author);
}

async function authorArticles(req, res) {
  const result = await store.getArticlesByAuthor(req.params.slug, {
    page: req.query.page,
    perPage: req.query.perPage
  });

  if (!result) {
    return sendError(res, 404, 'NOT_FOUND', 'Author not found');
  }

  return sendList(res, result.data, result.meta);
}

module.exports = {
  listAuthors,
  authorProfile,
  authorArticles
};

