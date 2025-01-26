const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrderDetail = sequelize.define('OrderDetail', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cmd_id: {
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
    plat_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    qte: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    prix: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    notes: DataTypes.TEXT
});

module.exports = OrderDetail;