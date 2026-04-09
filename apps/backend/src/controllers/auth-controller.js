const store = require('../models/store');
const { sendData, sendError } = require('../utils/response');
const { signToken } = require('../utils/auth');

async function login(req, res) {
  const email = req.body?.email;
  const password = req.body?.password;

  const user = await store.authenticateUser(email, password);
  if (!user) {
    return sendError(res, 401, 'INVALID_CREDENTIALS', 'Invalid email or password');
  }

  const token = signToken(user);
  return sendData(res, {
    token,
    user
  });
}

async function logout(req, res) {
  return sendData(res, {
    success: true
  });
}

async function me(req, res) {
  return sendData(res, req.user);
}

module.exports = {
  login,
  logout,
  me
};
