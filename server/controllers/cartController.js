// Delete cart for user
exports.deleteCart = async (req, res) => {
  const userId = req.params.userId;
  console.log('DELETE /api/cart/:userId called with userId:', userId);
  try {
    const result = await pool.query('DELETE FROM carts WHERE user_id = $1', [userId]);
    console.log(`DELETE /api/cart/${userId}: deleted ${result.rowCount} rows`);
    res.json({ success: true, deleted: result.rowCount });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
const pool = require('../config/db');

// Get cart for user
exports.getCart = async (req, res) => {
  const userId = req.params.userId;
  try {
    const result = await pool.query('SELECT items FROM carts WHERE user_id = $1', [userId]);
    if (result.rows.length === 0) {
      return res.json({ items: [] });
    }
    res.json({ items: result.rows[0].items });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Save/update cart for user
exports.saveCart = async (req, res) => {
  const userId = req.params.userId;
  const { items } = req.body;
  try {
    await pool.query(
      `INSERT INTO carts (user_id, items) VALUES ($1, $2)
       ON CONFLICT (user_id) DO UPDATE SET items = $2`,
      [userId, JSON.stringify(items)]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Ensure carts table exists
pool.query(`CREATE TABLE IF NOT EXISTS carts (
  user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  items JSONB NOT NULL
)`);
