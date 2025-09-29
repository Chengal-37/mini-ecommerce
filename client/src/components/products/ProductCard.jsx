import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext.jsx';

import WarningModal from '../common/WarningModal';

const ProductCard = ({ product, user }) => {
  const { cartItems, addToCart, updateQuantity, removeFromCart } = useContext(CartContext);
  const cartItem = cartItems.find(item => item.id === product.id);
  const [showWarn, setShowWarn] = useState(false);
  const [addedAnim, setAddedAnim] = useState(false);
  const [showAddedMsg, setShowAddedMsg] = useState(false);

  const handleAdd = () => {
    if (!user) {
      setShowWarn(true);
      return;
    }
    if (cartItem) {
      updateQuantity(product.id, cartItem.quantity + 1);
    } else {
      addToCart(product);
    }
    setAddedAnim(false); // reset in case of rapid clicks
    setTimeout(() => setAddedAnim(true), 10); // trigger animation
    setShowAddedMsg(true);
    setTimeout(() => {
      setAddedAnim(false);
      setShowAddedMsg(false);
    }, 1200); // 1.2s animated message
  };

  const handleSubtract = () => {
    if (cartItem) {
      if (cartItem.quantity > 1) {
        updateQuantity(product.id, cartItem.quantity - 1);
      } else {
        // Remove from cart if quantity goes to 0
        removeFromCart(product.id);
      }
    }
  };

  return (
    <div className="product-card" style={{
      border: '2px solid #ffd600',
      borderRadius: 14,
      padding: 18,
      background: '#fff',
      boxShadow: '0 6px 24px #1976d233',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      transition: 'box-shadow 0.2s',
      position: 'relative',
    }}>
  <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', flex: 1 }}>
        <img src={product.image || product.thumbnail} alt={product.title} style={{ width: '100%', height: 200, objectFit: 'contain', background: '#f5f6fa', borderRadius: 10, border: '1.5px solid #ffd600', boxShadow: '0 2px 8px #ffd60022' }} />
        <h3 style={{ fontSize: 20, margin: '14px 0 4px', color: '#1976d2', fontWeight: 800, letterSpacing: 0.5 }}>{product.title}</h3>
        <div style={{ color: '#ffd600', fontWeight: 700, fontSize: 15, marginBottom: 4, textTransform: 'capitalize' }}>{product.category}</div>
        <p style={{ fontWeight: 800, color: '#ffd600', fontSize: 20, marginBottom: 6 }}>${product.price}</p>
        <div style={{ fontSize: 14, color: '#1976d2', fontWeight: 700, marginBottom: 6 }}>Rating: <span style={{ color: '#ffb300' }}>★ {product.rating || 'N/A'}</span></div>
      </Link>
  <div style={{ marginTop: 'auto', position: 'relative' }}>
  {cartItem ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8 }}>
            <button onClick={handleSubtract} style={{ padding: '2px 10px', borderRadius: 6, border: 'none', background: '#ffd600', color: '#1976d2', fontWeight: 900, fontSize: 16, cursor: 'pointer', minWidth: 28 }}>-</button>
            <span style={{ fontWeight: 800, color: '#1976d2', fontSize: 16 }}>{cartItem.quantity}</span>
            <button onClick={handleAdd} style={{ padding: '2px 10px', borderRadius: 6, border: 'none', background: '#1976d2', color: '#fff', fontWeight: 900, fontSize: 16, cursor: 'pointer', minWidth: 28 }}>+</button>
          </div>
        ) : (
          <>
            <button
              style={{
                marginTop: 8,
                width: '100%',
                background: '#1976d2',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: 10,
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: 16,
                boxShadow: '0 2px 8px #ffd60044',
                transition: 'background 0.2s',
                animation: addedAnim ? 'cartPulse 0.7s cubic-bezier(.4,2,.6,1)' : 'none',
              }}
              onClick={handleAdd}
            >
              + Add to Cart
            </button>
            {showAddedMsg && (
              <div style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: -40,
                margin: '0 auto',
                width: '90%',
                background: '#ffd600',
                color: '#1976d2',
                fontWeight: 900,
                fontSize: 18,
                borderRadius: 8,
                boxShadow: '0 2px 8px #ffd60044',
                textAlign: 'center',
                padding: '10px 0',
                opacity: showAddedMsg ? 1 : 0,
                transform: showAddedMsg ? 'translateY(0)' : 'translateY(-20px)',
                transition: 'opacity 0.6s, transform 0.6s',
                zIndex: 10,
                pointerEvents: 'none',
              }}>
                Added to cart!
              </div>
            )}
            <WarningModal show={showWarn} onClose={() => setShowWarn(false)} message="Please login first to order." />
          </>
  )}
      </div>
    </div>
  );
};

export default ProductCard;