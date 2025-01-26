const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    categorie_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Categories',
            key: 'id'
        }
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
    prix: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    photo: DataTypes.STRING,
    dispo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
});

module.exports = Product;