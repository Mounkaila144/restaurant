const router = require('express').Router();
const { getProfile, updateProfile, getAllUsers } = require('../controllers/user.controller');
const { authMiddleware, isAdmin } = require('../middleware/auth.middleware');

router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.get('/all', [authMiddleware, isAdmin], getAllUsers);

module.exports = router;