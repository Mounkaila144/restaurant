const { Alert } = require('../models');

const getUserAlerts = async (req, res) => {
    try {
        const alerts = await Alert.findAll({
            where: { user_id: req.user.id },
            order: [['createdAt', 'DESC']]
        });
        res.json(alerts);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des alertes', error: error.message });
    }
};

const markAlertAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const alert = await Alert.findByPk(id);
        if (!alert) return res.status(404).json({ message: 'Alerte non trouvée' });

        await alert.update({ vue: true });
        res.json(alert);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'alerte', error: error.message });
    }
};

module.exports = { getUserAlerts, markAlertAsRead };