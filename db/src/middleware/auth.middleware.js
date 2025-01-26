const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');

// Middleware d'authentification avec vérification du tenant
const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token manquant' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        // Vérification que l'utilisateur appartient au même tenant que la requête
        if (decoded.tenant_id !== req.tenant.id) {
            return res.status(403).json({
                message: 'Accès non autorisé - Tenant invalide',
                details: 'Vous ne pouvez pas accéder aux ressources d\'un autre tenant'
            });
        }

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token invalide' });
    }
};

// Middleware pour vérifier les permissions admin dans le contexte du tenant
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin' || req.user.tenant_id !== req.tenant.id) {
        return res.status(403).json({ message: 'Accès non autorisé' });
    }
    next();
};

// Middleware générique pour filtrer les requêtes par tenant
const tenantFilter = (model) => async (req, res, next) => {
    try {
        // Ajoute automatiquement le filtre tenant_id à toutes les requêtes
        req.tenantFilter = { tenant_id: req.tenant.id };

        // Si la requête contient un ID spécifique, vérifie qu'il appartient au bon tenant
        if (req.params.id) {
            const resource = await model.findOne({
                where: {
                    id: req.params.id,
                    tenant_id: req.tenant.id
                }
            });

            if (!resource) {
                return res.status(404).json({
                    message: 'Ressource non trouvée',
                    details: 'La ressource demandée n\'existe pas ou n\'appartient pas à votre tenant'
                });
            }
        }

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    authMiddleware,
    isAdmin,
    tenantFilter
};