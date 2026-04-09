function sendList(res, data, meta) {
  return res.json({ data, meta });
}

function sendData(res, data) {
  return res.json({ data });
}

function sendError(res, status, code, message) {
  return res.status(status).json({
    error: {
      code,
      message
    }
  });
}

module.exports = {
  sendList,
  sendData,
  sendError
};
