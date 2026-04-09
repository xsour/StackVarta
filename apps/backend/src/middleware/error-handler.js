const { AppError } = require('../utils/app-error');
const { sendError } = require('../utils/response');

function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return sendError(res, err.statusCode, err.code, err.message);
  }

  if (err?.code === 'LIMIT_FILE_SIZE') {
    return sendError(res, 400, 'FILE_TOO_LARGE', 'Uploaded file is too large');
  }

  console.error(err);
  return sendError(res, 500, 'INTERNAL_SERVER_ERROR', 'Unexpected server error');
}

module.exports = {
  errorHandler
};
