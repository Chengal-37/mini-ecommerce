
const pool = require('../config/db');

// Ensure orders table exists
pool.query(`CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  items JSONB NOT NULL,
  shipping JSONB NOT NULL,
  total NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`);

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
