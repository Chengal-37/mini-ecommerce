import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext.jsx';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { cartItems, addToCart, updateQuantity, removeFromCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch(`https://dummyjson.com/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  const cartItem = cartItems.find(item => item.id === product?.id);

  const handleAdd = () => {
    if (cartItem) {
      updateQuantity(product.id, cartItem.quantity + 1);
    } else {
      addToCart(product);
    }
  };

  const handleSubtract = () => {
    if (cartItem) {
      if (cartItem.quantity > 1) {
        updateQuantity(product.id, cartItem.quantity - 1);
      } else {
        removeFromCart(product.id);
      }
    }
  };

  if (loading) return <div>Loading product...</div>;
  if (error || !product) return <div>Product not found. <Link to="/">Go back</Link></div>;

  return (
    <div style={{ minHeight: '80vh', background: 'linear-gradient(90deg, #1976d2 60%, #42a5f5 100%)', padding: '0.1rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: 900, margin: 0, background: '#fff', borderRadius: 18, boxShadow: '0 6px 32px #1976d233', padding: '2.5rem 2rem', position: 'relative', border: '2px solid #ffd600' }}>
        <Link to="/" style={{ color: '#1976d2', fontWeight: 700, textDecoration: 'none', fontSize: 16, position: 'absolute', left: 32, top: 24 }}>← Back to products</Link>
        <div style={{ display: 'flex', gap: 32, marginTop: 32, flexWrap: 'wrap', alignItems: 'center' }}>
          <img src={product.thumbnail} alt={product.title} style={{ width: 320, height: 320, objectFit: 'contain', background: '#f5f6fa', borderRadius: 14, boxShadow: '0 2px 12px #1976d244', border: '2px solid #ffd600' }} />
          <div style={{ flex: 1, minWidth: 220 }}>
            <h2 style={{ fontWeight: 900, fontSize: 32, color: '#1976d2', marginBottom: 8, letterSpacing: 1 }}>{product.title}</h2>
            <div style={{ color: '#ffd600', fontWeight: 700, fontSize: 16, marginBottom: 8, textTransform: 'capitalize' }}>{product.category}</div>
            <div style={{ fontWeight: 800, fontSize: 28, color: '#ffd600', marginBottom: 12 }}>${product.price}</div>
            <div style={{ fontSize: 18, color: '#222', marginBottom: 16 }}>{product.description}</div>
            <div style={{ fontSize: 16, color: '#1976d2', fontWeight: 700, marginBottom: 18 }}>Rating: <span style={{ color: '#ffb300' }}>★ {product.rating || 'N/A'}</span></div>
            {cartItem ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <button onClick={handleSubtract} style={{ padding: '2px 10px', borderRadius: 6, border: 'none', background: '#ffd600', color: '#1976d2', fontWeight: 900, fontSize: 16, cursor: 'pointer', minWidth: 28 }}>-</button>
                <span style={{ fontWeight: 800, color: '#1976d2', fontSize: 16 }}>{cartItem.quantity}</span>
                <button onClick={handleAdd} style={{ padding: '2px 10px', borderRadius: 6, border: 'none', background: '#1976d2', color: '#fff', fontWeight: 900, fontSize: 16, cursor: 'pointer', minWidth: 28 }}>+</button>
              </div>
            ) : (
              <button onClick={handleAdd} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 800, fontSize: 18, boxShadow: '0 2px 8px #ffd60044', cursor: 'pointer', transition: 'background 0.2s' }}>
                + Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;