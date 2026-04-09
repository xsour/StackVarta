const { Router } = require('express');
const controller = require('../controllers/search-controller');
const { asyncHandler } = require('../middleware/async-handler');

const router = Router();

router.get('/', asyncHandler(controller.search));

module.exports = router;
