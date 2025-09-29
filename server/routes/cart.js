const express = require('express');
const router = express.Router();
const { getCart, saveCart, deleteCart } = require('../controllers/cartController');

router.get('/:userId', getCart);
router.post('/:userId', saveCart);
router.delete('/:userId', deleteCart);

module.exports = router;
