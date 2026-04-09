const path = require('node:path');
const fs = require('node:fs');
const { Router } = require('express');
const multer = require('multer');

const controller = require('../controllers/admin-controller');
const { asyncHandler } = require('../middleware/async-handler');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { AppError } = require('../utils/app-error');

const router = Router();
const uploadDir = path.join(__dirname, '..', '..', 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname || '').toLowerCase() || '.bin';
    const baseName = path
      .basename(file.originalname || 'cover', extension)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 60);

    cb(null, `${Date.now()}-${baseName || 'cover'}${extension}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new AppError(400, 'VALIDATION_ERROR', 'Only image uploads are allowed'));
    }
    return cb(null, true);
  }
});

router.use(requireAuth, requireAdmin);

router.get('/articles', asyncHandler(controller.listArticles));
router.post('/articles', asyncHandler(controller.createArticle));
router.put('/articles/:id', asyncHandler(controller.updateArticle));
router.delete('/articles/:id', asyncHandler(controller.deleteArticle));

router.post('/upload', upload.single('file'), asyncHandler(controller.upload));

router.get('/categories', asyncHandler(controller.listCategories));
router.post('/categories', asyncHandler(controller.createCategory));
router.put('/categories/:id', asyncHandler(controller.updateCategory));
router.delete('/categories/:id', asyncHandler(controller.deleteCategory));

router.get('/tags', asyncHandler(controller.listTags));
router.post('/tags', asyncHandler(controller.createTag));
router.put('/tags/:id', asyncHandler(controller.updateTag));
router.delete('/tags/:id', asyncHandler(controller.deleteTag));

router.get('/authors', asyncHandler(controller.listAuthors));

module.exports = router;
