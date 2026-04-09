const { verifyToken } = require('../utils/auth');
const store = require('../models/store');
const { AppError } = require('../utils/app-error');

async function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(new AppError(401, 'UNAUTHORIZED', 'Missing or invalid authorization token'));
  }

  try {
    const payload = verifyToken(token);
    const user = await store.getUserById(Number(payload.sub));

    if (!user) {
      return next(new AppError(401, 'UNAUTHORIZED', 'User not found'));
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(new AppError(401, 'UNAUTHORIZED', 'Invalid or expired token'));
  }
}

function requireAdmin(req, res, next) {
  if (!req.user?.isAdmin) {
    return next(new AppError(403, 'FORBIDDEN', 'Admin access required'));
  }

  return next();
}

module.exports = {
  requireAuth,
  requireAdmin
};
