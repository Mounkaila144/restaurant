const router = require('express').Router();
const { createReview, validateReview, getAllReviews } = require('../controllers/review.controller');
const { authMiddleware, isAdmin } = require('../middleware/auth.middleware');

router.post('/', authMiddleware, createReview);
router.get('/', getAllReviews);
router.put('/:id/validate', [authMiddleware, isAdmin], validateReview);

module.exports = router;