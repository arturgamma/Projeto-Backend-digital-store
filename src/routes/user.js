const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middleware/authMiddleware');


router.get('/v1/user/:id', userController.getUserById);
router.post('/v1/user/', authenticate, userController.createUser);
router.put('/v1/user/:id', authenticate, userController.updateUser);
router.delete('/v1/user/:id', authenticate, userController.deleteUser);


module.exports = router;
