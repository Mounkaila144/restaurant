const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Media = sequelize.define('Media', {
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
    type: {
        type: DataTypes.ENUM('image', 'video', 'document'),
        allowNull: false
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    titre: DataTypes.STRING,
    desc: DataTypes.TEXT
});

module.exports = Media;