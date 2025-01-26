// models/Tenant.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Tenant = sequelize.define('Tenant', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    domain: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    config: DataTypes.TEXT // Pour des paramètres spécifiques
});

module.exports = Tenant;