const { sendError } = require('../utils/response');

function notFound(req, res, next) {
  return sendError(res, 404, 'NOT_FOUND', 'Route not found');
}

module.exports = {
  notFound
};
