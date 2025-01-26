const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tenant_id: {
        type: DataTypes.INTEGER,
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
    desc: DataTypes.TEXT,
    photo: DataTypes.STRING
});

module.exports = Category;