const jwt = require('jsonwebtoken');

function getJwtSecret() {
  return process.env.JWT_SECRET || 'change-me';
}

function signToken(user) {
  return jwt.sign(
    {
      sub: String(user.id),
      email: user.email,
      isAdmin: Boolean(user.isAdmin)
    },
    getJwtSecret(),
    {
      expiresIn: '7d'
    }
  );
}

function verifyToken(token) {
  return jwt.verify(token, getJwtSecret());
}

module.exports = {
  signToken,
  verifyToken
};
