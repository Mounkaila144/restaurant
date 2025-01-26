const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Option = sequelize.define('Option', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    plat_id: {
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
    nom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    prix: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
});

module.exports = Option;