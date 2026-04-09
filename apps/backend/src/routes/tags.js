const { Router } = require('express');
const controller = require('../controllers/tags-controller');
const { asyncHandler } = require('../middleware/async-handler');

const router = Router();

router.get('/', asyncHandler(controller.listTags));
router.get('/:slug', asyncHandler(controller.getTag));
router.get('/:slug/articles', asyncHandler(controller.tagArticles));

module.exports = router;
