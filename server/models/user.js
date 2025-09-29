const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const pool = require('../config/db');

const createUser = async (username, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
    [username, email, hashedPassword]
  );
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

module.exports = { createUser, findUserByEmail };
