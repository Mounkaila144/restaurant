const express = require('express');
const cors = require('cors');
const { sequelize } = require('./src/models');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const resolveTenant = require('./src/middleware/tenant');


const app = express();
// At application startup
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(resolveTenant);
// Routes
app.use('/api/auth', require('./src/routes/auth.routes'));
app.use('/api/products', require('./src/routes/product.routes'));
app.use('/api/categories', require('./src/routes/category.routes'));
app.use('/api/orders', require('./src/routes/order.routes'));
app.use('/api/reservations', require('./src/routes/reservation.routes'));
app.use('/api/reviews', require('./src/routes/review.routes'));
app.use('/api/alerts', require('./src/routes/alert.routes'));
app.use('/api/users', require('./src/routes/user.routes'));
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));


// Gestion des erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Une erreur est survenue!', error: err.message });
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true }).then(() => {
    app.listen(PORT, () => {
        console.log(`Serveur démarré sur le port ${PORT}`);
    });
}).catch(err => {
    console.error('Erreur de connexion à la base de données:', err);
});
