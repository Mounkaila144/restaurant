const sequelize = require('../config/database');

// Charger Tenant en premier
const Tenant = require('./Tenant');
const User = require('./User');
const Category = require('./Category');
const Product = require('./Product');
const Option = require('./Option');
const Order = require('./Order');
const OrderDetail = require('./OrderDetail');
const DetailOption = require('./DetailOption');
const Reservation = require('./Reservation');
const Review = require('./Review');
const Alert = require('./Alert');

// Définition des relations CORE (Tenant en premier)
Tenant.hasMany(User, { foreignKey: 'tenant_id' });
User.belongsTo(Tenant, { foreignKey: 'tenant_id' });

// Relations existantes
Category.hasMany(Product, { foreignKey: 'categorie_id' });
Product.belongsTo(Category, { foreignKey: 'categorie_id' });

Product.hasMany(Option, { foreignKey: 'plat_id' });
Option.belongsTo(Product, { foreignKey: 'plat_id' });

User.hasMany(Order, { foreignKey: 'user_id' });
Order.belongsTo(User, { foreignKey: 'user_id' });

Order.hasMany(OrderDetail, { foreignKey: 'cmd_id' });
OrderDetail.belongsTo(Order, { foreignKey: 'cmd_id' });

Product.hasMany(OrderDetail, { foreignKey: 'plat_id' });
OrderDetail.belongsTo(Product, { foreignKey: 'plat_id' });

OrderDetail.belongsToMany(Option, {
    through: DetailOption,
    foreignKey: 'cmd_detail_id'
});
Option.belongsToMany(OrderDetail, {
    through: DetailOption,
    foreignKey: 'option_id'
});

User.hasMany(Reservation, { foreignKey: 'user_id' });
Reservation.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Review, { foreignKey: 'user_id' });
Review.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Alert, { foreignKey: 'user_id' });
Alert.belongsTo(User, { foreignKey: 'user_id' });

// Ajouter Tenant aux exports
module.exports = {
    sequelize,
    Tenant, // <-- Ajout crucial
    User,
    Category,
    Product,
    Option,
    Order,
    OrderDetail,
    DetailOption,
    Reservation,
    Review,
    Alert
};