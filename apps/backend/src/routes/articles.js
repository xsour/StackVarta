const { Router } = require('express');
const controller = require('../controllers/articles-controller');
const { asyncHandler } = require('../middleware/async-handler');

const router = Router();

router.get('/', asyncHandler(controller.listArticles));
router.get('/:slug/related', asyncHandler(controller.getRelated));
router.get('/:slug', asyncHandler(controller.getArticle));
router.post('/:id/view', asyncHandler(controller.incrementView));

module.exports = router;
