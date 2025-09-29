import React, { useState } from 'react';
import { verifyToken } from './services/auth';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext.jsx';
import AppNavbar from './components/common/Navbar';
import ScrollToTop from './components/common/ScrollToTop';
import Footer from './components/common/Footer';
import ScrollToTopButton from './components/common/ScrollToTopButton';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import Modal from './components/common/Modal';
import ProfilePage from './pages/ProfilePage';
import OrderHistoryPage from './pages/OrderHistoryPage';
// 🆕 Import the new SavedAddressesPage component
import SavedAddressesPage from './pages/SavedAddressesPage';

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  React.useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const result = await verifyToken(token);
        if (!result || !result.valid) {
          setUser(null);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      }
    };
    checkToken();
  }, []);

  React.useEffect(() => {
    if (location.pathname === '/login') {
      setShowLogin(true);
      setShowRegister(false);
    } else if (location.pathname === '/register') {
      setShowRegister(true);
      setShowLogin(false);
    } else {
      setShowLogin(false);
      setShowRegister(false);
    }
  }, [location.pathname]);

  React.useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }, [user]);

  return (
    <CartProvider user={user}>
      <ScrollToTop />
      <AppNavbar user={user} setUser={setUser} />
      <main className="py-4" style={{ position: 'relative', minHeight: '100vh', paddingBottom: 80 }}>
        <Modal show={showLogin} onClose={() => setShowLogin(false)}>
          {showLogin && <LoginPage setUser={setUser} onClose={() => setShowLogin(false)} />}
        </Modal>
        <Modal show={showRegister} onClose={() => setShowRegister(false)}>
          <RegisterPage onClose={() => setShowRegister(false)} onSuccessRegister={() => {
            setShowRegister(false);
            setShowLogin(true);
          }} />
        </Modal>
        <Routes>
          <Route path="/" element={<HomePage user={user} setShowLogin={setShowLogin} />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/profile" element={<ProfilePage user={user} />} />
          <Route path="/orders" element={<OrderHistoryPage />} />
          {/* 🆕 Add this new route for Saved Addresses */}
          <Route path="/profile/addresses" element={<SavedAddressesPage user={user} />} />
          {/* Dummy routes for modal logic to avoid warnings */}
          <Route path="/login" element={null} />
          <Route path="/register" element={null} />
        </Routes>
      </main>
      {location.pathname === '/' && <ScrollToTopButton />}
      {location.pathname === '/' && <Footer />}
    </CartProvider>
  );
}

const AppWithRouter = () => (
  <Router>
    <App />
  </Router>
);

export default AppWithRouter;