const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Ensure users and addresses tables exist on startup
pool.query(`CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`);

// 🆕 Add this block to create the addresses table
pool.query(`CREATE TABLE IF NOT EXISTS addresses (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    street_address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
)`);

// Register new user
exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
            [username, email, hashedPassword]
        );
        res.status(201).json({ user: result.rows[0] });
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ message: 'Username or email already exists.' });
        }
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// User login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        const user = result.rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
        res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get user details by ID
exports.getUser = async (req, res) => {
    const userId = req.params.id;
    try {
        const result = await pool.query('SELECT id, username, email FROM users WHERE id = $1', [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Update user details by ID
exports.updateUser = async (req, res) => {
    const userId = req.params.id;
    const { username, email, password } = req.body;
    try {
        let updateQuery = 'UPDATE users SET';
        const updateFields = [];
        const values = [];
        let idx = 1;
        if (username) {
            updateFields.push(` username = $${idx++}`);
            values.push(username);
        }
        if (email) {
            updateFields.push(` email = $${idx++}`);
            values.push(email);
        }
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateFields.push(` password = $${idx++}`);
            values.push(hashedPassword);
        }
        if (updateFields.length === 0) {
            return res.status(400).json({ message: 'No fields to update.' });
        }
        updateQuery += updateFields.join(',') + ` WHERE id = $${idx} RETURNING id, username, email`;
        values.push(userId);
        const result = await pool.query(updateQuery, values);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ message: 'Username or email already exists.' });
        }
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Token verification endpoint
exports.verifyToken = (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ valid: false, message: 'No token provided.' });
    const jwt = require('jsonwebtoken');
    jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
        if (err) return res.status(401).json({ valid: false, message: 'Invalid token.' });
        res.json({ valid: true, user });
    });
};