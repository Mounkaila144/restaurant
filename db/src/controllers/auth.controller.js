const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Tenant } = require('../models'); // Ajout du modèle Tenant
const { JWT_SECRET, BCRYPT_ROUNDS } = require('../config/config');
const register = async (req, res) => {
    try {
        const { email, password, nom, prenom, phone, adresse } = req.body;

        // Vérification de l'email existant
        const existingUser = await User.findOne({
            where: {
                email,
                tenant_id: req.tenant.id // <-- Vérifie l'email uniquement dans le tenant actuel
            }
        });
        if (existingUser) {
            return res.status(400).json({ message: 'Email déjà utilisé' });
        }

        // Récupération du tenant par défaut
        if (!req.tenant) {
            return res.status(500).json({
                message: "Tenant non détecté",
                error: "Vérifiez votre configuration de sous-domaine"
            });
        }

        // Hash du mot de passe
        const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

        // Création de l'utilisateur avec tenant_id
        const user = await User.create({
            email,
            password: hashedPassword,
            nom,
            prenom,
            tenant_id: req.tenant.id, // Utilisation dynamique
            phone,
            adresse
        });

        // Génération du token JWT
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
                tenant_id: user.tenant_id // Ajout du tenant_id dans le token
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Réponse
        res.status(201).json({
            message: 'Inscription réussie',
            token,
            user: {
                id: user.id,
                email: user.email,
                nom: user.nom,
                prenom: user.prenom,
                role: user.role,
                tenant_id: user.tenant_id // Ajout du tenant_id dans la réponse
            }
        });

    } catch (error) {
        if (error.name === 'SequelizeEmptyResultError') {
            return res.status(500).json({
                message: 'Erreur système : Aucun tenant configuré',
                error: 'Le tenant par défaut est introuvable'
            });
        }
        res.status(500).json({
            message: 'Erreur lors de l\'inscription',
            error: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            where: {
                email,
                tenant_id: req.tenant.id // <-- Ajout crucial
            }
        });

        if (!user) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
                tenant_id: user.tenant_id // Ajout du tenant_id dans le token
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Connexion réussie',
            token,
            user: {
                id: user.id,
                email: user.email,
                nom: user.nom,
                prenom: user.prenom,
                role: user.role,
                tenant_id: user.tenant_id // Ajout du tenant_id dans la réponse
            }
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la connexion',
            error: error.message
        });
    }
};

module.exports = { register, login };