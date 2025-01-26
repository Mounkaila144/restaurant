const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING,
        unique: 'email_tenant_unique',
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tenant_id: {
        type: DataTypes.INTEGER,
        unique: 'email_tenant_unique',
        allowNull: false,
        references: {
            model: 'Tenants',
            key: 'id'
        }
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    prenom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: DataTypes.STRING,
    adresse: DataTypes.TEXT,
    points: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    role: {
        type: DataTypes.ENUM('client', 'admin', 'staff'),
        defaultValue: 'client'
    }
});

module.exports = User;