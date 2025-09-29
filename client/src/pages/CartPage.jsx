import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext.jsx';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  if (!cartItems.length) {
    return <div style={{ minHeight: '60vh', background: 'linear-gradient(90deg, #1976d2 60%, #42a5f5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 6px 32px #1976d233', padding: '2.5rem 2rem', border: '2px solid #ffd600', minWidth: 320, textAlign: 'center', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 16 }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#1976d2', fontWeight: 700, fontSize: 18, cursor: 'pointer', textAlign: 'left' }}>&larr; Back</button>
        </div>
        <h2 style={{ color: '#1976d2', fontWeight: 900, marginBottom: 8, textAlign: 'center' }}>Your Cart</h2>
        <p style={{ color: '#ffd600', fontWeight: 700 }}>Your cart is empty.</p>
      </div>
    </div>;
  }

  // Center card vertically if 1 or 2 products, else let it grow
  const isFewProducts = cartItems.length <= 2;

  return (
    <div
      style={
        isFewProducts
          ? { minHeight: '80vh', background: 'linear-gradient(90deg, #1976d2 60%, #42a5f5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 0' }
          : { minHeight: '80vh', background: 'linear-gradient(90deg, #1976d2 60%, #42a5f5 100%)', padding: '2rem 0' }
      }
    >
      <div style={{ maxWidth: 900, margin: '0 auto', background: '#fff', borderRadius: 18, boxShadow: '0 6px 32px #1976d233', padding: '2.5rem 2rem', border: '2px solid #ffd600', width: '100%' }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#1976d2', fontWeight: 700, fontSize: 18, marginBottom: 16, cursor: 'pointer', textAlign: 'left' }}>&larr; Back</button>
        <h2 style={{ marginBottom: 32, color: '#1976d2', fontWeight: 900, textAlign: 'center' }}>Your Cart</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #ffd60022', overflow: 'hidden' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ffd600', background: '#f5f6fa' }}>
              <th style={{ textAlign: 'left', color: '#1976d2', fontWeight: 800 }}>Product</th>
              <th style={{ color: '#1976d2', fontWeight: 800 }}>Image</th>
              <th style={{ color: '#ffd600', fontWeight: 800 }}>Price</th>
              <th style={{ color: '#1976d2', fontWeight: 800 }}>Qty</th>
              <th style={{ color: '#ffd600', fontWeight: 800 }}>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid #f0f0f0', verticalAlign: 'middle' }}>
                <td style={{ fontWeight: 700, color: '#1976d2' }}>{item.title}</td>
                <td>
                  <img src={item.image || item.thumbnail} alt={item.title} style={{ width: 60, height: 60, objectFit: 'contain', background: '#fafafa', borderRadius: 6, border: '1.5px solid #ffd600' }} />
                </td>
                <td style={{ color: '#ffd600', fontWeight: 700 }}>${item.price}</td>
                <td>
                  <button onClick={() => {
                    if (item.quantity > 1) {
                      updateQuantity(item.id, item.quantity - 1);
                    } else {
                      removeFromCart(item.id);
                    }
                  }} style={{ padding: '2px 10px', borderRadius: 4, border: 'none', background: '#1976d2', color: '#fff', fontWeight: 700, cursor: 'pointer', marginRight: 4 }}>-</button>
                  <span style={{ margin: '0 8px', color: '#1976d2', fontWeight: 700 }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ padding: '2px 10px', borderRadius: 4, border: 'none', background: '#ffd600', color: '#222', fontWeight: 700, cursor: 'pointer', marginLeft: 4 }}>+</button>
                </td>
                <td style={{ color: '#ffd600', fontWeight: 700 }}>${(item.price * item.quantity).toFixed(2)}</td>
                <td><button onClick={() => removeFromCart(item.id)} style={{ color: '#fff', background: '#d32f2f', border: 'none', borderRadius: 4, padding: '4px 12px', fontWeight: 600, cursor: 'pointer' }}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3 style={{ marginTop: 32, textAlign: 'right', color: '#1976d2', fontWeight: 900 }}>Total: <span style={{ color: '#ffd600' }}>${getTotalPrice().toFixed(2)}</span></h3>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
          <button
            type="button"
            style={{
              background: 'linear-gradient(90deg, #d32f2f 60%, #ffd600 100%)',
              color: '#fff',
              fontWeight: 800,
              padding: '12px 32px',
              borderRadius: 8,
              fontSize: 18,
              boxShadow: '0 2px 8px #ffd60033',
              border: 'none',
              transition: 'background 0.2s',
              letterSpacing: 1,
              cursor: 'pointer',
              marginRight: 16,
            }}
            onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(90deg, #ffd600 60%, #d32f2f 100%)'}
            onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #d32f2f 60%, #ffd600 100%)'}
            onClick={() => {
              if (window.confirm('Are you sure you want to delete all items from your cart?')) {
                clearCart();
              }
            }}
          >
            Delete Cart
          </button>
          <a
            href="/checkout"
            style={{
              background: 'linear-gradient(90deg, #1976d2 60%, #ffd600 100%)',
              color: '#fff',
              fontWeight: 800,
              padding: '12px 32px',
              borderRadius: 8,
              textDecoration: 'none',
              fontSize: 18,
              boxShadow: '0 2px 8px #1976d233',
              border: 'none',
              transition: 'background 0.2s',
              letterSpacing: 1,
              cursor: 'pointer',
            }}
            onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(90deg, #ffd600 60%, #1976d2 100%)'}
            onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #1976d2 60%, #ffd600 100%)'}
          >
            Proceed to Checkout
          </a>
        </div>
      </div>
    </div>
  );
};

export default CartPage;