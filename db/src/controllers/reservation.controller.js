const { Reservation, User } = require('../models');

const createReservation = async (req, res) => {
    try {
        const { date, heure, personnes, notes } = req.body;
        const user_id = req.user.id;

        const reservation = await Reservation.create({
            user_id,
            date,
            heure,
            personnes,
            notes
        });

        res.status(201).json(reservation);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création de la réservation', error: error.message });
    }
};

const getUserReservations = async (req, res) => {
    try {
        const reservations = await Reservation.findAll({
            where: { user_id: req.user.id },
            include: [{ model: User }],
            order: [['date', 'DESC']]
        });
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des réservations', error: error.message });
    }
};

const updateReservationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { statut } = req.body;

        const reservation = await Reservation.findByPk(id);
        if (!reservation) return res.status(404).json({ message: 'Réservation non trouvée' });

        await reservation.update({ statut });
        res.json(reservation);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour de la réservation', error: error.message });
    }
};

module.exports = { createReservation, getUserReservations, updateReservationStatus };