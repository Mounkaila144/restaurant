router = require('express').Router();
const { upload } = require('../config/multer'); // Import correct avec déstructuration
const { Product } = require('../models');
const { getAllProducts, createProduct, updateProduct, deleteProduct} = require('../controllers/product.controller');
const { authMiddleware, isAdmin,tenantFilter } = require('../middleware/auth.middleware');

router.get('/', getAllProducts);
router.post('/', [authMiddleware, isAdmin,tenantFilter(Product),  upload.single('image')], createProduct);
router.put('/:id', [authMiddleware, isAdmin,tenantFilter(Product),  upload.single('image')], updateProduct);
router.delete('/:id', [authMiddleware, isAdmin,tenantFilter(Product)], deleteProduct);

module.exports = router;