const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authenticate = require('../middleware/authMiddleware');

router.get('/v1/category/search', categoryController.searchCategories);
router.get('/v1/category/:id', categoryController.getCategoryById);
router.post('/v1/category/', authenticate, categoryController.createCategory);
router.put('/v1/category/:id', authenticate,  categoryController.updateCategory);
router.delete('/v1/category/:id', authenticate,  categoryController.deleteCategory);

module.exports = router;
