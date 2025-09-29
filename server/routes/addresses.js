// File: routes/addresses.js

const express = require('express');
const router = express.Router();
const db = require('../config/db'); 
const auth = require('../middleware/authMiddleware');

// GET all addresses for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM addresses WHERE user_id = $1', [req.user.id]);
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// POST a new address
router.post('/', auth, async (req, res) => {
  const { full_name, street_address, city, state, postal_code, country, phone_number } = req.body;
  try {
    const { rows } = await db.query(
      `INSERT INTO addresses (user_id, full_name, street_address, city, state, postal_code, country, phone_number)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [req.user.id, full_name, street_address, city, state, postal_code, country, phone_number]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// PUT (update) an address
router.put('/:addressId', auth, async (req, res) => {
  const { addressId } = req.params;
  const { full_name, street_address, city, state, postal_code, country, phone_number } = req.body;
  try {
    const { rows } = await db.query(
      `UPDATE addresses
       SET full_name = $1, street_address = $2, city = $3, state = $4, postal_code = $5, country = $6, phone_number = $7
       WHERE id = $8 AND user_id = $9 RETURNING *`,
      [full_name, street_address, city, state, postal_code, country, phone_number, addressId, req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ msg: 'Address not found or unauthorized' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// DELETE an address
router.delete('/:addressId', auth, async (req, res) => {
  const { addressId } = req.params;
  try {
    const { rowCount } = await db.query('DELETE FROM addresses WHERE id = $1 AND user_id = $2', [addressId, req.user.id]);
    if (rowCount === 0) {
      return res.status(404).json({ msg: 'Address not found or unauthorized' });
    }
    res.json({ msg: 'Address deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;