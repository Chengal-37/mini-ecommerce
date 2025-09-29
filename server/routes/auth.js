const express = require('express');
const router = express.Router();
const { register, login, getUser, updateUser, verifyToken } = require('../controllers/authController');


// User registration and login
router.post('/register', register);
router.post('/login', login);

// User profile routes
router.get('/user/:id', getUser);
router.put('/user/:id', updateUser);

// Token verification route
router.get('/verify', verifyToken);

module.exports = router;
