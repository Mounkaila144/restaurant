const router = require('express').Router();
const { createOrder, getUserOrders } = require('../controllers/order.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

router.post('/', authMiddleware, createOrder);
router.get('/user', authMiddleware, getUserOrders);

module.exports = router;