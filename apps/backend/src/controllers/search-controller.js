const store = require('../models/store');
const { sendList } = require('../utils/response');

async function search(req, res) {
  const result = await store.searchArticles(req.query.q || '', {
    page: req.query.page,
    perPage: req.query.perPage
  });

  return sendList(res, result.data, result.meta);
}

module.exports = {
  search
};
