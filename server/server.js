const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const addressesRoutes = require('./routes/addresses');
const orderRoutes = require('./routes/order');

dotenv.config();

const app = express();
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/profile/addresses', addressesRoutes);
app.use('/api/orders', orderRoutes);

// Catch-all for unmatched API requests (debugging)
app.use('/api', (req, res) => {
	console.log(`Unmatched request: ${req.method} ${req.originalUrl}`);
	res.status(404).send('API route not found');
});

// A simple test route
app.get('/api', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));