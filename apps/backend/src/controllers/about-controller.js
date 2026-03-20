const store = require('../models/store');
const { sendData, sendError } = require('../utils/response');

async function getAbout(req, res) {
  const settings = await store.getSiteSettings();
  if (!settings) {
    return sendError(res, 404, 'NOT_FOUND', 'Site settings not found');
  }
  return sendData(res, settings);
}

async function updateAbout(req, res) {
  const updated = await store.updateSiteSettings(req.body);
  return sendData(res, updated);
}

module.exports = { getAbout, updateAbout };
