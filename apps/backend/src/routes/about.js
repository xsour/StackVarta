const { Router } = require('express');
const controller = require('../controllers/about-controller');
const { asyncHandler } = require('../middleware/async-handler');
const { requireAuth } = require('../middleware/auth');

const router = Router();

// GET /api/about — публічний
router.get('/', asyncHandler(controller.getAbout));

// PUT /api/about — тільки для адміна
router.put('/', requireAuth, asyncHandler(controller.updateAbout));

module.exports = router;
