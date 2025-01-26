const router = require('express').Router();
const { createMedia, getAllMedia, deleteMedia } = require('../controllers/media.controller');
const upload = require('../config/multer');
const { authMiddleware, isAdmin } = require('../middleware/auth.middleware');

router.post('/', [authMiddleware, isAdmin, upload.single('file')], createMedia);
router.get('/', getAllMedia);
router.delete('/:id', [authMiddleware, isAdmin], deleteMedia);

module.exports = router;