const router = require('express').Router();
const { getUserAlerts, markAlertAsRead } = require('../controllers/alert.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

router.get('/', authMiddleware, getUserAlerts);
router.put('/:id/read', authMiddleware, markAlertAsRead);

module.exports = router;