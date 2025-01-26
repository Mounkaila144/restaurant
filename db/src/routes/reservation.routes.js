const router = require('express').Router();
const { createReservation, getUserReservations, updateReservationStatus } = require('../controllers/reservation.controller');
const { authMiddleware, isAdmin } = require('../middleware/auth.middleware');

router.post('/', authMiddleware, createReservation);
router.get('/user', authMiddleware, getUserReservations);
router.put('/:id/status', [authMiddleware, isAdmin], updateReservationStatus);

module.exports = router;