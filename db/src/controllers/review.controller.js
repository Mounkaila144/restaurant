const { Review, User } = require('../models');

const createReview = async (req, res) => {
    try {
        const { note, comment } = req.body;
        const user_id = req.user.id;

        const review = await Review.create({
            user_id,
            note,
            comment
        });

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création de l\'avis', error: error.message });
    }
};

const validateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await Review.findByPk(id);
        if (!review) return res.status(404).json({ message: 'Avis non trouvé' });

        await review.update({ valide: true });
        res.json(review);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la validation de l\'avis', error: error.message });
    }
};

const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.findAll({
            include: [{ model: User }],
            order: [['createdAt', 'DESC']]
        });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des avis', error: error.message });
    }
};

module.exports = { createReview, validateReview, getAllReviews };