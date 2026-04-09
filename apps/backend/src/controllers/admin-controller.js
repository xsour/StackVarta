const path = require('node:path');
const store = require('../models/store');
const { sendData, sendList } = require('../utils/response');
const { AppError } = require('../utils/app-error');

function getPublicFileUrl(req, filename) {
  if (process.env.API_BASE_URL) {
    return `${String(process.env.API_BASE_URL).replace(/\/$/, '')}/uploads/${filename}`;
  }

  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const host = req.headers['x-forwarded-host'] || req.get('host');
  return `${protocol}://${host}/uploads/${filename}`;
}

async function listArticles(req, res) {
  const result = await store.listAdminArticles({
    page: req.query.page,
    perPage: req.query.perPage,
    status: req.query.status
  });

  return sendList(res, result.data, result.meta);
}

async function createArticle(req, res) {
  const article = await store.createArticle(req.body || {});
  return res.status(201).json({ data: article });
}

async function updateArticle(req, res) {
  const article = await store.updateArticle(req.params.id, req.body || {});
  return sendData(res, article);
}

async function deleteArticle(req, res) {
  const result = await store.deleteArticle(req.params.id);
  return sendData(res, result);
}

async function upload(req, res) {
  if (!req.file) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Image file is required');
  }

  const filename = path.basename(req.file.filename);
  return sendData(res, {
    filename,
    url: getPublicFileUrl(req, filename)
  });
}

async function listCategories(req, res) {
  const categories = await store.listAdminCategories();
  return sendData(res, categories);
}

async function createCategory(req, res) {
  const category = await store.createCategory(req.body || {});
  return res.status(201).json({ data: category });
}

async function updateCategory(req, res) {
  const category = await store.updateCategory(req.params.id, req.body || {});
  return sendData(res, category);
}

async function deleteCategory(req, res) {
  const result = await store.deleteCategory(req.params.id);
  return sendData(res, result);
}

async function listTags(req, res) {
  const tags = await store.listAdminTags();
  return sendData(res, tags);
}

async function createTag(req, res) {
  const tag = await store.createTag(req.body || {});
  return res.status(201).json({ data: tag });
}

async function updateTag(req, res) {
  const tag = await store.updateTag(req.params.id, req.body || {});
  return sendData(res, tag);
}

async function deleteTag(req, res) {
  const result = await store.deleteTag(req.params.id);
  return sendData(res, result);
}

async function listAuthors(req, res) {
  const authors = await store.listAuthors();
  return sendData(res, authors);
}

module.exports = {
  listArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  upload,
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  listTags,
  createTag,
  updateTag,
  deleteTag,
  listAuthors
};
