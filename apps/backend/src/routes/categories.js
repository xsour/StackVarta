const { Router } = require('express');
const controller = require('../controllers/categories-controller');
const { asyncHandler } = require('../middleware/async-handler');

const router = Router();

router.get('/', asyncHandler(controller.listCategories));
router.get('/:slug', asyncHandler(controller.getCategory));
router.get('/:slug/articles', asyncHandler(controller.categoryArticles));

module.exports = router;
