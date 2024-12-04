const express = require('express');
const router = express.Router();
const prodController = require('../controllers/productController');
const authenticate = require('../middleware/authMiddleware');


router.get('/v1/products/search', prodController.searchCategories);
router.get('/v1/products/:id', prodController.getProductById);
router.post('/v1/products/', authenticate, prodController.createProduct);
router.put('/v1/products/:id', authenticate, prodController.updateProduct);
router.delete('/v1/products/:id', authenticate, prodController.deleteProduct);



module.exports = router;
