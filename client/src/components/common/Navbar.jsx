// ...existing code...
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext.jsx';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import { useState, useEffect, useRef } from 'react';

const Navbar = ({ user, setUser }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef();

  useEffect(() => {
    if (!showDropdown) return;
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showDropdown]);
  const { cartItems, clearCart } = useContext(CartContext);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav style={{ padding: '1rem 2rem', background: 'linear-gradient(90deg, #1976d2 60%, #42a5f5 100%)', color: '#fff', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '3px solid #ffd600', boxShadow: '0 2px 12px #1976d233' }}>
      <div style={{ fontWeight: 900, fontSize: 24, letterSpacing: 1 }}>
        <Link to="/" style={{ color: '#ffd600', textDecoration: 'none', textShadow: '0 2px 8px #1976d299' }}>ShopNest</Link>
      </div>
      <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
        <Link
          to="/"
          style={{ color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: 17, padding: '4px 12px', borderRadius: 6, transition: 'background 0.2s', border: '2px solid transparent', display: 'flex', alignItems: 'center', gap: 6 }}
          onMouseOver={e => e.currentTarget.style.background = '#ffd60022'}
          onMouseOut={e => e.currentTarget.style.background = 'none'}
          onClick={() => setTimeout(() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }), 0)}
        >
          <span role="img" aria-label="Home" style={{fontSize:20,marginRight:2}}>🏠</span>
        </Link>
        <Link to="/cart" style={{ color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: 17, padding: '4px 12px', borderRadius: 6, transition: 'background 0.2s', border: '2px solid #ffd600', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span role="img" aria-label="Cart" style={{fontSize:20,marginRight:2}}>🛒</span>
          {totalItems > 0 && <span style={{ background: '#ffd600', color: '#1976d2', borderRadius: '50%', padding: '2px 10px', marginLeft: 8, fontSize: 15, fontWeight: 800, boxShadow: '0 1px 4px #ffd60055' }}>{totalItems}</span>}
        </Link>
        {user ? (
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }} ref={dropdownRef}>
            <span
              title="Profile"
              style={{ color: '#ffd600', fontSize: 28, marginLeft: 8, marginRight: 2, display: 'flex', alignItems: 'center', cursor: 'pointer' }}
              onClick={() => setShowDropdown((v) => !v)}
              tabIndex={0}
            >
              <FaUserCircle />
            </span>
            {showDropdown && (
              <div className="profile-dropdown">
                <div className="profile-dropdown-item" onClick={() => { setShowDropdown(false); navigate('/profile'); }}>Profile Details</div>
                {/* 🆕 Add this line for the "Saved Addresses" option */}
                <div className="profile-dropdown-item" onClick={() => { setShowDropdown(false); navigate('/profile/addresses'); }}>Saved Addresses</div>
                <div className="profile-dropdown-item" onClick={() => { setShowDropdown(false); navigate('/orders'); }}>Order History</div>
                <div style={{ borderTop: '1px solid #eee', margin: '6px 0' }} />
                <div className="profile-dropdown-item logout" onClick={() => { setShowDropdown(false); setUser(null); localStorage.removeItem('user'); localStorage.removeItem('token'); window.location.replace('/'); }}>Logout</div>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" className="navbar-login-btn" style={{ textDecoration: 'none', fontWeight: 700, fontSize: 17, padding: '4px 18px', borderRadius: 8, border: '2px solid #ffd600', marginLeft: 4 }}>Login</Link>
            <Link to="/register" className="home-register-btn gold-register-btn navbar-register-btn" style={{ textDecoration: 'none', fontWeight: 700, fontSize: 17, padding: '4px 18px', borderRadius: 8, border: '2px solid #1976d2', marginLeft: 4 }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;