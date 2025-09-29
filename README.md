
# Mini E-commerce Platform

A full-stack mini e-commerce platform built with **React**, **Node.js/Express**, and **PostgreSQL**. This project demonstrates a modern shopping experience with cart management, order history, authentication, and a clean UI.

## Features

- User registration and login (JWT authentication)
- Product listing and details
- Add to cart, update quantity, remove items
- Checkout flow with address selection and order review
- Order history with detailed order and shipping info
- Persistent cart (syncs with backend and localStorage)
- Responsive, modern UI with React and Vite
- Backend API with Express and PostgreSQL

## Tech Stack

- **Frontend:** React, Vite, React Router, Axios, Bootstrap
- **Backend:** Node.js, Express, PostgreSQL, JWT, bcrypt
- **Database:** PostgreSQL (automatic table creation for orders and carts)
- **Other:** ESLint, Nodemon

## Project Structure

```
mini-ecommerce/
├── client/         # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   ├── public/
│   ├── package.json
│   └── ...
├── server/         # Node.js/Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── server.js
│   ├── package.json
│   └── ...
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL database

### Backend Setup

1. Install dependencies:
	```bash
	cd server
	npm install
	```
2. Create a `.env` file in `server/` with your PostgreSQL connection string:
	```
	DATABASE_URL=postgres://username:password@localhost:5432/yourdb
	JWT_SECRET=your_jwt_secret
	```
3. Start the backend server:
	```bash
	npm run dev
	```
	The server runs on `http://localhost:5000`.

### Frontend Setup

1. Install dependencies:
	```bash
	cd client
	npm install
	```
2. Start the frontend (Vite dev server):
	```bash
	npm run dev
	```
	The app runs on `http://localhost:5173` (or as shown in terminal).

### API Endpoints

- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login and get JWT
- `GET /api/orders` — Get order history (auth required)
- `POST /api/orders` — Place new order
- `GET /api/cart` — Get cart items
- `POST /api/cart` — Update cart
- `DELETE /api/cart` — Clear cart
- `GET /api/profile/addresses` — Get saved addresses

## Customization

- Add products to your database for a richer catalog.
- Update UI styles in `client/src/components/` for your brand.
- Extend backend logic in `server/controllers/` for more features.

## License

This project is licensed under the MIT License.
