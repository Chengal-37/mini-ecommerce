const express = require('express');
const router = express.Router();
const { createOrder, getOrdersByUser } = require('../controllers/orderController');
const authenticate = require('../middleware/authMiddleware');

router.post('/', authenticate, createOrder);
router.get('/', authenticate, getOrdersByUser);

module.exports = router;
