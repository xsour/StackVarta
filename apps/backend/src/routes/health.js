const { Router } = require('express');
const store = require('../models/store');

const router = Router();

router.get('/', (req, res) => {
  res.json({
    data: {
      status: 'ok',
      service: 'backend',
      database: store.getDbMode(),
      timestamp: new Date().toISOString()
    }
  });
});

module.exports = router;
