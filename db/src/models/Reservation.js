const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Reservation = sequelize.define('Reservation', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
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
    heure: {
        type: DataTypes.TIME,
        allowNull: false
    },
    personnes: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    statut: {
        type: DataTypes.ENUM('en_attente', 'confirmee', 'annulee'),
        defaultValue: 'en_attente'
    },
    notes: DataTypes.TEXT
});

module.exports = Reservation;