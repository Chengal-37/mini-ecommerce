const pool = require('../config/db');

// NOTE: The CREATE TABLE query has been removed from this file.
// It should be run once on your database using a separate script (e.g., init.sql)
// or a migration tool.

exports.createOrder = async (req, res) => {
    try {
        const { items, shipping, total } = req.body;
        const userId = req.user.id || req.user._id;
        // Insert order into orders table
        const orderResult = await pool.query(
            `INSERT INTO orders (user_id, items, shipping, total, created_at)
             VALUES ($1, $2, $3, $4, NOW()) RETURNING *`,
            [
                userId,
                JSON.stringify(items),
                JSON.stringify(shipping),
                total
            ]
        );
        res.status(201).json(orderResult.rows[0]);
    } catch (err) {
        console.error('Order creation error:', err);
        res.status(500).json({ message: 'Failed to create order', error: err.message });
    }
};

exports.getOrdersByUser = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const ordersResult = await pool.query(
            `SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
            [userId]
        );
        // Parse items and shipping from JSON
        let orders = [];
        if (ordersResult.rows && Array.isArray(ordersResult.rows)) {
            orders = ordersResult.rows.map(order => {
                let items, shipping;
                try {
                    items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
                } catch (e) {
                    items = null;
                }
                try {
                    shipping = typeof order.shipping === 'string' ? JSON.parse(order.shipping) : order.shipping;
                } catch (e) {
                    shipping = null;
                }
                // Only return orders with valid items and shipping
                if (items && shipping) {
                    return { ...order, items, shipping };
                }
                return null;
            }).filter(order => order !== null);
        }
        res.json(orders);
    } catch (err) {
        console.error('Order fetch error:', err);
        res.status(500).json([]); // Always return an array on error
    }
};