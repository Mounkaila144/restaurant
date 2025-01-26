const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tenant_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Tenants',
            key: 'id'
        }
    },
    statut: {
        type: DataTypes.ENUM('en_attente', 'confirmee', 'en_preparation', 'en_livraison', 'livree', 'annulee'),
        defaultValue: 'en_attente'
    },
    type: {
        type: DataTypes.ENUM('livraison', 'sur_place', 'a_emporter'),
        allowNull: false
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    paiement: {
        type: DataTypes.ENUM('carte', 'especes', 'points'),
        allowNull: false
    },
    adresse: DataTypes.TEXT,
    notes: DataTypes.TEXT
});

module.exports = Order;