const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DetailOption = sequelize.define('DetailOption', {
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
    cmd_detail_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    option_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = DetailOption;