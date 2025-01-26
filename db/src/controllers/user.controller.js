const { User } = require('../models');

const getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du profil', error: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { phone, adresse } = req.body;
        const user = await User.findByPk(req.user.id);

        await user.update({ phone, adresse });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du profil', error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs', error: error.message });
    }
};

module.exports = { getProfile, updateProfile, getAllUsers };