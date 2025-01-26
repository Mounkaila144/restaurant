router = require('express').Router();
const { upload } = require('../config/multer'); // Import correct avec déstructuration
const { getAllCategories, createCategory, updateCategory,deleteCategory } = require('../controllers/category.controller');
const { authMiddleware, isAdmin,tenantFilter } = require('../middleware/auth.middleware');
const { Category } = require('../models');


router.get('/', getAllCategories);
router.post('/', [authMiddleware,tenantFilter(Category), isAdmin, upload.single('image')], createCategory);
router.put('/:id', [authMiddleware,tenantFilter(Category), isAdmin, upload.single('image')], updateCategory);
router.delete('/:id', [authMiddleware,tenantFilter(Category), isAdmin], deleteCategory);

module.exports = router;