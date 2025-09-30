import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { FaPlus, FaEdit, FaTrash, FaSpinner } from 'react-icons/fa';

const SavedAddresses = ({ user }) => {
  const [addresses, setAddresses] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchAddresses();
    }
  }, [user, navigate]);

  const fetchAddresses = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/profile/addresses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAddresses(response.data);
    } catch (err) {
      setError('Failed to fetch addresses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUpdateAddress = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const token = localStorage.getItem('token');
    
    try {
      if (editingAddress) {
        // Update existing address
        await api.put(`/profile/addresses/${editingAddress.id}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEditingAddress(null);
      } else {
        // Add new address
        await api.post('/profile/addresses', data, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setIsAdding(false);
      fetchAddresses(); // Refresh the list of addresses
    } catch (err) {
      setError('Failed to save address. Please check your information.');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this address?");
    if (!confirmDelete) return;

    const token = localStorage.getItem('token');
    try {
      await api.delete(`/profile/addresses/${addressId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAddresses(); // Refresh the list
    } catch (err) {
      setError('Failed to delete address.');
    }
  };

  if (!user) {
    return null;
  }

  // Styling similar to CartPage
  return (
    <div
      style={{
        minHeight: '80vh',
        background: 'linear-gradient(90deg, #1976d2 60%, #42a5f5 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 0',
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: '0 auto',
          background: '#fff',
          borderRadius: 18,
          boxShadow: '0 6px 32px #1976d233',
          padding: '2.5rem 2rem',
          border: '2px solid #ffd600',
          width: '100%',
        }}
      >
        <h2 style={{ marginBottom: 32, color: '#1976d2', fontWeight: 900, textAlign: 'center' }}>Saved Addresses</h2>
        {loading && (
          <div style={{ textAlign: 'center', color: '#1976d2', fontWeight: 700 }}>
            <FaSpinner className="fa-spin" /> Loading addresses...
          </div>
        )}
        {error && (
          <div style={{ color: '#d32f2f', background: '#fffde7', borderRadius: 8, padding: '12px', marginBottom: 16, fontWeight: 700 }}>{error}</div>
        )}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
          <button
            onClick={() => { setIsAdding(true); setEditingAddress(null); }}
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
            }}
            onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(90deg, #fffde7 60%, #ffd600 100%)'}
            onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #ffd600 60%, #fffde7 100%)'}
          >
            <FaPlus style={{ marginRight: 8 }} /> Add New Address
          </button>
        </div>
        {(isAdding || editingAddress) && (
          <div style={{ background: '#f5f6fa', borderRadius: 14, boxShadow: '0 2px 8px #1976d233', padding: '2rem', marginBottom: 24 }}>
            <h4 style={{ marginBottom: 18, color: '#1976d2', fontWeight: 800 }}>{editingAddress ? 'Edit Address' : 'Add New Address'}</h4>
            <form onSubmit={handleAddUpdateAddress}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ color: '#1976d2', fontWeight: 700, marginBottom: 6, display: 'block' }}>Full Name</label>
                <input type="text" name="full_name" required defaultValue={editingAddress?.full_name || ''} style={{ width: '100%', padding: '10px', borderRadius: 6, border: '1.5px solid #1976d2', fontSize: 16, marginTop: 4 }} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ color: '#1976d2', fontWeight: 700, marginBottom: 6, display: 'block' }}>Street Address</label>
                <input type="text" name="street_address" required defaultValue={editingAddress?.street_address || ''} style={{ width: '100%', padding: '10px', borderRadius: 6, border: '1.5px solid #1976d2', fontSize: 16, marginTop: 4 }} />
              </div>
              <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ color: '#1976d2', fontWeight: 700, marginBottom: 6, display: 'block' }}>City</label>
                  <input type="text" name="city" required defaultValue={editingAddress?.city || ''} style={{ width: '100%', padding: '10px', borderRadius: 6, border: '1.5px solid #1976d2', fontSize: 16, marginTop: 4 }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ color: '#1976d2', fontWeight: 700, marginBottom: 6, display: 'block' }}>State</label>
                  <input type="text" name="state" required defaultValue={editingAddress?.state || ''} style={{ width: '100%', padding: '10px', borderRadius: 6, border: '1.5px solid #1976d2', fontSize: 16, marginTop: 4 }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ color: '#1976d2', fontWeight: 700, marginBottom: 6, display: 'block' }}>Postal Code</label>
                  <input type="text" name="postal_code" required defaultValue={editingAddress?.postal_code || ''} style={{ width: '100%', padding: '10px', borderRadius: 6, border: '1.5px solid #1976d2', fontSize: 16, marginTop: 4 }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ color: '#1976d2', fontWeight: 700, marginBottom: 6, display: 'block' }}>Country</label>
                  <input type="text" name="country" required defaultValue={editingAddress?.country || ''} style={{ width: '100%', padding: '10px', borderRadius: 6, border: '1.5px solid #1976d2', fontSize: 16, marginTop: 4 }} />
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ color: '#1976d2', fontWeight: 700, marginBottom: 6, display: 'block' }}>Phone Number (Optional)</label>
                <input type="tel" name="phone_number" defaultValue={editingAddress?.phone_number || ''} style={{ width: '100%', padding: '10px', borderRadius: 6, border: '1.5px solid #1976d2', fontSize: 16, marginTop: 4 }} />
              </div>
              <button
                type="submit"
                style={{
                  background: 'linear-gradient(90deg, #1976d2 60%, #ffd600 100%)',
                  color: '#fff',
                  fontWeight: 800,
                  padding: '10px 32px',
                  borderRadius: 8,
                  fontSize: 16,
                  boxShadow: '0 2px 8px #1976d233',
                  border: 'none',
                  marginRight: 12,
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(90deg, #ffd600 60%, #1976d2 100%)'}
                onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #1976d2 60%, #ffd600 100%)'}
              >
                Save Address
              </button>
              <button
                type="button"
                style={{
                  background: '#eee',
                  color: '#1976d2',
                  fontWeight: 700,
                  padding: '10px 24px',
                  borderRadius: 8,
                  fontSize: 16,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onClick={() => { setIsAdding(false); setEditingAddress(null); }}
                onMouseOver={e => { e.currentTarget.style.background = '#1976d2'; e.currentTarget.style.color = '#fff'; }}
                onMouseOut={e => { e.currentTarget.style.background = '#eee'; e.currentTarget.style.color = '#1976d2'; }}
              >
                Cancel
              </button>
            </form>
          </div>
        )}
        {addresses.length === 0 && !loading && !error && (
          <div style={{ color: '#1976d2', background: '#fffde7', borderRadius: 8, padding: '12px', marginBottom: 16, fontWeight: 700 }}>You have no saved addresses.</div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          {addresses.map((address) => (
            <div key={address.id} style={{ background: '#f5f6fa', borderRadius: 14, boxShadow: '0 2px 8px #1976d233', padding: '1.5rem', marginBottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h5 style={{ color: '#1976d2', fontWeight: 800, marginBottom: 8 }}>{address.full_name}</h5>
                <p style={{ color: '#222', fontWeight: 600, marginBottom: 4 }}>{address.street_address}</p>
                <p style={{ color: '#222', fontWeight: 600, marginBottom: 4 }}>{address.city}, {address.state} {address.postal_code}</p>
                <p style={{ color: '#222', fontWeight: 600, marginBottom: 4 }}>{address.country}</p>
                <p style={{ color: '#888', fontWeight: 500, marginBottom: 4 }}>Phone: {address.phone_number}</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
                <button
                  onClick={() => { setIsAdding(true); setEditingAddress(address); }}
                  style={{
                    background: 'linear-gradient(90deg, #ffd600 60%, #fffde7 100%)',
                    color: '#222',
                    fontWeight: 700,
                    padding: '8px 18px',
                    borderRadius: 8,
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 15,
                    transition: 'background 0.2s',
                  }}
                  onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(90deg, #fffde7 60%, #ffd600 100%)'}
                  onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #ffd600 60%, #fffde7 100%)'}
                >
                  <FaEdit style={{ marginRight: 6 }} /> Edit
                </button>
                <button
                  onClick={() => handleDeleteAddress(address.id)}
                  style={{
                    background: 'linear-gradient(90deg, #d32f2f 60%, #ffd600 100%)',
                    color: '#fff',
                    fontWeight: 700,
                    padding: '8px 18px',
                    borderRadius: 8,
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 15,
                    transition: 'background 0.2s',
                  }}
                  onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(90deg, #ffd600 60%, #d32f2f 100%)'}
                  onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #d32f2f 60%, #ffd600 100%)'}
                >
                  <FaTrash style={{ marginRight: 6 }} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SavedAddresses;