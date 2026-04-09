const { Router } = require('express');
const controller = require('../controllers/authors-controller');
const { asyncHandler } = require('../middleware/async-handler');

const router = Router();

router.get('/', asyncHandler(controller.listAuthors));
router.get('/:slug', asyncHandler(controller.authorProfile));
router.get('/:slug/articles', asyncHandler(controller.authorArticles));

module.exports = router;
