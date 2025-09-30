import React, { useContext, useState } from 'react';
import api from '../services/api.js';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext.jsx';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useContext(CartContext);
  const [step, setStep] = useState('form'); // 'form' | 'review' | 'done'
  const [orderDetails, setOrderDetails] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    street_address: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    phone_number: '',
  });
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [addressError, setAddressError] = useState('');
  // Debug addresses array structure
  console.log('addresses:', addresses);
  // Fetch saved addresses on mount
  React.useEffect(() => {
    const fetchAddresses = async () => {
      setLoadingAddresses(true);
      setAddressError('');
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/profile/addresses', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAddresses(response.data);
      } catch (err) {
        setAddressError('Failed to fetch addresses.');
      } finally {
        setLoadingAddresses(false);
      }
    };
    fetchAddresses();
  }, []);


  if (step === 'review' && orderDetails) {
    // Only show review if a valid address is selected
  const selectedAddress = addresses.find(a => String(a.id) === selectedAddressId);
    if (!selectedAddress) {
      return (
        <div style={{ minHeight: '90vh', background: 'linear-gradient(90deg, #1976d2 60%, #42a5f5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 0' }}>
          <div style={{ maxWidth: 500, width: '100%', background: '#fff', borderRadius: 14, boxShadow: '0 6px 32px #1976d233', padding: '2.5rem 2rem', border: '2px solid #ffd600', textAlign: 'center' }}>
            <h2 style={{ color: '#d32f2f', fontWeight: 900, marginBottom: 24 }}>No address selected</h2>
            <p style={{ color: '#1976d2', fontWeight: 700, marginBottom: 24 }}>Please select a delivery address before reviewing your order.</p>
            <button onClick={() => setStep('form')} style={{ background: 'linear-gradient(90deg, #ffd600 60%, #1976d2 100%)', color: '#fff', fontWeight: 800, padding: '10px 32px', borderRadius: 8, fontSize: 16, border: 'none', cursor: 'pointer' }}>&larr; Back to Checkout</button>
          </div>
        </div>
      );
    }
    if (orderPlaced) {
      setTimeout(() => {
        navigate('/');
      }, 4000);
      return (
        <div style={{ minHeight: '90vh', background: 'linear-gradient(90deg, #1976d2 60%, #42a5f5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 0' }}>
          <div style={{ maxWidth: 500, width: '100%', background: '#fff', borderRadius: 14, boxShadow: '0 6px 32px #1976d233', padding: '2.5rem 2rem', border: '2px solid #ffd600', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <svg width="32" height="32" viewBox="0 0 40 40" style={{ marginRight: 10, verticalAlign: 'middle' }}>
                <circle cx="20" cy="20" r="20" fill="#1976d2" />
                <polyline points="12,22 18,28 28,14" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <h2 style={{ color: '#1976d2', fontWeight: 900, margin: 0, fontSize: 28, verticalAlign: 'middle' }}>Order Placed!</h2>
            </div>
            <p style={{ color: '#1976d2', fontWeight: 500, marginTop: 10, fontSize: 16 }}>Thank you for your purchase. You will be redirect to the home page shortly...</p>
          </div>
        </div>
      );
    }
    return (
      <div style={{ minHeight: '90vh', background: 'linear-gradient(90deg, #1976d2 60%, #42a5f5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 0' }}>
        <div style={{ maxWidth: 900, width: '100%', background: '#fff', borderRadius: 14, boxShadow: '0 6px 32px #1976d233', padding: '2.5rem 2rem', border: '2px solid #ffd600' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 16 }}>
            <button onClick={() => setStep('form')} style={{ background: 'none', border: 'none', color: '#1976d2', fontWeight: 700, fontSize: 18, cursor: 'pointer', textAlign: 'left' }}>&larr; Back</button>
          </div>
          <h2 style={{ color: '#1976d2', fontWeight: 900, marginBottom: 24, textAlign: 'center' }}>Review Your Order</h2>
          <h3 style={{ color: '#1976d2', fontWeight: 800, marginBottom: 12 }}>Cart Details</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 16 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ffd600', background: '#f5f6fa' }}>
                <th style={{ textAlign: 'left', color: '#1976d2', fontWeight: 700 }}>Product</th>
                <th style={{ color: '#1976d2', fontWeight: 700 }}>Qty</th>
                <th style={{ color: '#ffd600', fontWeight: 700 }}>Price</th>
                <th style={{ color: '#ffd600', fontWeight: 700 }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.items.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ color: '#1976d2', fontWeight: 600 }}>{item.title}</td>
                  <td style={{ color: '#1976d2', fontWeight: 600, textAlign: 'center' }}>{item.quantity}</td>
                  <td style={{ color: '#ffd600', fontWeight: 600, textAlign: 'center' }}>${item.price}</td>
                  <td style={{ color: '#ffd600', fontWeight: 700, textAlign: 'center' }}>${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ textAlign: 'right', fontWeight: 900, color: '#1976d2', fontSize: 18, marginBottom: 12 }}>
            Total: <span style={{ color: '#ffd600' }}>${orderDetails.total.toFixed(2)}</span>
          </div>
          <h3 style={{ color: '#1976d2', fontWeight: 800, marginBottom: 12, marginTop: 32 }}>Delivery Address</h3>
          <div style={{ background: '#fff', borderRadius: 10, boxShadow: '0 6px 24px #1976d233', border: '1.5px solid #ffd600', marginBottom: 24, padding: '1.5rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 16, color: '#333' }}>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 700, color: '#1976d2', padding: '10px 12px', width: 160 }}>Name</td>
                  <td style={{ padding: '10px 12px', color: '#ffd600', fontWeight: 700 }}>{selectedAddress.full_name || selectedAddress.name || '-'}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 700, color: '#1976d2', padding: '10px 12px' }}>Street</td>
                  <td style={{ padding: '10px 12px', color: '#ffd600', fontWeight: 700 }}>{selectedAddress.street_address || '-'}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 700, color: '#1976d2', padding: '10px 12px' }}>City</td>
                  <td style={{ padding: '10px 12px', color: '#ffd600', fontWeight: 700 }}>{selectedAddress.city || '-'}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 700, color: '#1976d2', padding: '10px 12px' }}>State</td>
                  <td style={{ padding: '10px 12px', color: '#ffd600', fontWeight: 700 }}>{selectedAddress.state || '-'}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 700, color: '#1976d2', padding: '10px 12px' }}>Postal Code</td>
                  <td style={{ padding: '10px 12px', color: '#ffd600', fontWeight: 700 }}>{selectedAddress.postal_code || '-'}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 700, color: '#1976d2', padding: '10px 12px' }}>Country</td>
                  <td style={{ padding: '10px 12px', color: '#ffd600', fontWeight: 700 }}>{selectedAddress.country || '-'}</td>
                </tr>
                {selectedAddress.phone_number ? (
                  <tr>
                    <td style={{ fontWeight: 700, color: '#1976d2', padding: '10px 12px' }}>Phone</td>
                    <td style={{ padding: '10px 12px', color: '#ffd600', fontWeight: 700 }}>{selectedAddress.phone_number}</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <button
              type="button"
              style={{ background: 'linear-gradient(90deg, #1976d2 60%, #ffd600 100%)', color: '#fff', fontWeight: 800, padding: '12px 32px', borderRadius: 8, fontSize: 18, boxShadow: '0 2px 8px #1976d233', border: 'none', transition: 'background 0.2s', letterSpacing: 1, cursor: 'pointer', marginTop: 8 }}
              onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(90deg, #ffd600 60%, #1976d2 100%)'}
              onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #1976d2 60%, #ffd600 100%)'}
              onClick={async () => {
                try {
                  const token = localStorage.getItem('token');
                  await api.post('/orders', {
                    items: cartItems,
                    shipping: selectedAddress,
                    total: getTotalPrice(),
                  }, {
                    headers: { Authorization: `Bearer ${token}` }
                  });
                  setOrderPlaced(true);
                  clearCart();
                } catch (err) {
                  alert('Failed to place order. Please try again.');
                }
              }}
            >
              Confirm Order
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '90vh',
        background:
          'linear-gradient(90deg, #1976d2 60%, #42a5f5 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 0',
      }}
    >
      <div
        style={{
          maxWidth: 900,
          width: '100%',
          background: '#fff',
          borderRadius: 14,
          boxShadow: '0 6px 32px #1976d233',
          padding: '2.5rem 2rem',
          border: '2px solid #ffd600',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 16 }}>
          <button onClick={() => navigate('/cart')} style={{ background: 'none', border: 'none', color: '#1976d2', fontWeight: 700, fontSize: 18, cursor: 'pointer', textAlign: 'left' }}>&larr; Back</button>
        </div>
        <h1 style={{ marginBottom: 24, color: '#1976d2', fontWeight: 900, textAlign: 'center' }}>Checkout</h1>
        <div style={{ marginBottom: 18, textAlign: 'center' }}>
          <span style={{ color: '#1976d2', fontWeight: 700, fontSize: 18 }}>Your cart total is: </span>
          <span style={{ color: '#ffd600', fontWeight: 900, fontSize: 20 }}>${getTotalPrice().toFixed(2)}</span>
        </div>
        {/* Address selection UI */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ color: '#1976d2', fontWeight: 800, marginBottom: 12 }}>Select Delivery Address</h3>
          {loadingAddresses ? (
            <div style={{ color: '#1976d2', fontWeight: 700 }}>Loading addresses...</div>
          ) : (
            <>
              {addresses.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <select
                    value={selectedAddressId}
                    onChange={e => {
                      const value = String(e.target.value);
                      setSelectedAddressId(value);
                      setAddressError('');
                      const addr = addresses.find(a => String(a.id) === value);
                      if (addr) setFormData({ ...addr });
                    }}
                    style={{ width: '100%', padding: '10px', borderRadius: 6, border: '1.5px solid #1976d2', fontSize: 16 }}
                  >
                    <option value="">-- Select an address --</option>
                    {addresses.map((addr, idx) => {
                      const val = String(addr.id);
                      return (
                        <option key={val} value={val}>
                          {addr.full_name || addr.name || '-'}, {addr.street_address || '-'}, {addr.city || '-'}, {addr.state || '-'}, {addr.country || '-'}
                        </option>
                      );
                    })}
                  </select>
                  {addressError && (
                    <div style={{ color: '#d32f2f', background: '#fffde7', borderRadius: 8, padding: '12px', marginTop: 8, fontWeight: 700 }}>{addressError}</div>
                  )}
                </div>
              )}
              <button
                type="button"
                style={{
                  background: 'linear-gradient(90deg, #ffd600 60%, #fffde7 100%)',
                  color: '#222',
                  fontWeight: 700,
                  fontSize: 16,
                  padding: '10px 24px',
                  borderRadius: 8,
                  boxShadow: '0 2px 8px #ffd60022',
                  border: 'none',
                  cursor: 'pointer',
                  marginBottom: 8,
                  transition: 'background 0.2s',
                  marginRight: 12,
                }}
                onClick={() => { setIsAdding(!isAdding); setFormData({ full_name: '', street_address: '', city: '', state: '', postal_code: '', country: '', phone_number: '' }); setSelectedAddressId(''); }}
                onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(90deg, #fffde7 60%, #ffd600 100%)'}
                onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #ffd600 60%, #fffde7 100%)'}
              >
                {isAdding ? 'Cancel New Address' : 'Add New Address'}
              </button>
            </>
          )}
        </div>
        {/* New address form (if adding) */}
        {isAdding && (
          <div style={{ background: '#f5f6fa', borderRadius: 14, boxShadow: '0 2px 8px #1976d233', padding: '2rem', marginBottom: 24 }}>
            <h4 style={{ marginBottom: 18, color: '#1976d2', fontWeight: 800 }}>Add New Address</h4>
            <form
              onSubmit={async e => {
                e.preventDefault();
                const token = localStorage.getItem('token');
                setLoadingAddresses(true);
                try {
                  const saveRes = await axios.post('/api/profile/addresses', formData, {
                    headers: { Authorization: `Bearer ${token}` }
                  });
                  setIsAdding(false);
                  // Refresh addresses
                  const response = await axios.get('/api/profile/addresses', {
                    headers: { Authorization: `Bearer ${token}` }
                  });
                  setAddresses(response.data);
                  // Select the newly added address
                  if (saveRes.data && saveRes.data._id) {
                    setSelectedAddressId(saveRes.data._id);
                    setFormData({ ...saveRes.data });
                  } else if (response.data.length > 0) {
                    // fallback: select last address
                    setSelectedAddressId(response.data[response.data.length - 1]._id);
                    setFormData({ ...response.data[response.data.length - 1] });
                  }
                  setLoadingAddresses(false);
                } catch (err) {
                  setAddressError('Failed to save address.');
                  setLoadingAddresses(false);
                }
              }}
            >
              <div style={{ marginBottom: 14 }}>
                <label style={{ color: '#1976d2', fontWeight: 700, marginBottom: 6, display: 'block' }}>Full Name</label>
                <input type="text" name="full_name" value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} required style={{ width: '100%', padding: '10px', borderRadius: 6, border: '1.5px solid #1976d2', fontSize: 16, marginTop: 4 }} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ color: '#1976d2', fontWeight: 700, marginBottom: 6, display: 'block' }}>Street Address</label>
                <input type="text" name="street_address" value={formData.street_address} onChange={e => setFormData({ ...formData, street_address: e.target.value })} required style={{ width: '100%', padding: '10px', borderRadius: 6, border: '1.5px solid #1976d2', fontSize: 16, marginTop: 4 }} />
              </div>
              <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ color: '#1976d2', fontWeight: 700, marginBottom: 6, display: 'block' }}>City</label>
                  <input type="text" name="city" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} required style={{ width: '100%', padding: '10px', borderRadius: 6, border: '1.5px solid #1976d2', fontSize: 16, marginTop: 4 }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ color: '#1976d2', fontWeight: 700, marginBottom: 6, display: 'block' }}>State</label>
                  <input type="text" name="state" value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} required style={{ width: '100%', padding: '10px', borderRadius: 6, border: '1.5px solid #1976d2', fontSize: 16, marginTop: 4 }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ color: '#1976d2', fontWeight: 700, marginBottom: 6, display: 'block' }}>Postal Code</label>
                  <input type="text" name="postal_code" value={formData.postal_code} onChange={e => setFormData({ ...formData, postal_code: e.target.value })} required style={{ width: '100%', padding: '10px', borderRadius: 6, border: '1.5px solid #1976d2', fontSize: 16, marginTop: 4 }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ color: '#1976d2', fontWeight: 700, marginBottom: 6, display: 'block' }}>Country</label>
                  <input type="text" name="country" value={formData.country} onChange={e => setFormData({ ...formData, country: e.target.value })} required style={{ width: '100%', padding: '10px', borderRadius: 6, border: '1.5px solid #1976d2', fontSize: 16, marginTop: 4 }} />
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ color: '#1976d2', fontWeight: 700, marginBottom: 6, display: 'block' }}>Phone Number (Optional)</label>
                <input type="tel" name="phone_number" value={formData.phone_number} onChange={e => setFormData({ ...formData, phone_number: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: 6, border: '1.5px solid #1976d2', fontSize: 16, marginTop: 4 }} />
              </div>
              <button type="submit" style={{ background: 'linear-gradient(90deg, #1976d2 60%, #ffd600 100%)', color: '#fff', fontWeight: 800, padding: '10px 32px', borderRadius: 8, fontSize: 16, boxShadow: '0 2px 8px #1976d233', border: 'none', marginRight: 12, cursor: 'pointer', transition: 'background 0.2s' }}>Save Address</button>
            </form>
          </div>
        )}
        {/* Review order and address step button */}
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <button
            type="button"
            style={{ background: 'linear-gradient(90deg, #1976d2 60%, #ffd600 100%)', color: '#fff', fontWeight: 800, padding: '12px 32px', borderRadius: 8, fontSize: 18, boxShadow: '0 2px 8px #1976d233', border: 'none', transition: 'background 0.2s', letterSpacing: 1, cursor: 'pointer', marginTop: 8 }}
            onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(90deg, #ffd600 60%, #1976d2 100%)'}
            onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #1976d2 60%, #ffd600 100%)'}
            onClick={() => {
              const selectedAddress = addresses.find(a => String(a.id) === selectedAddressId);
              if (!selectedAddressId || !selectedAddress) {
                setAddressError('Please select an address to proceed.');
                return;
              }
              setOrderDetails({
                items: cartItems,
                total: getTotalPrice(),
                shipping: selectedAddress,
              });
              setStep('review');
              setAddressError('');
            }}
          >
            Review Order & Address
          </button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;

