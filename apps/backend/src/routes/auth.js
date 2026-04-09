const { Router } = require('express');
const controller = require('../controllers/auth-controller');
const { asyncHandler } = require('../middleware/async-handler');
const { requireAuth } = require('../middleware/auth');

const router = Router();

router.post('/login', asyncHandler(controller.login));
router.post('/logout', asyncHandler(controller.logout));
router.get('/me', requireAuth, asyncHandler(controller.me));

module.exports = router;
