import React from 'react';

const ProfileModal = ({ show, onClose, user }) => {
  if (!show) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ minWidth: 320, maxWidth: 400, textAlign: 'center', padding: '2.2rem 1.5rem 1.5rem' }}>
        <button className="modal-close" onClick={onClose} title="Close">×</button>
        <h2 style={{ color: '#ffd600', fontWeight: 900, fontSize: 26, marginBottom: 18 }}>Profile</h2>
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontWeight: 700, color: '#1976d2', fontSize: 18, marginBottom: 6 }}>👤 {user?.name || 'User Name'}</div>
          <div style={{ color: '#555', fontSize: 15, marginBottom: 2 }}>Email: <span style={{ color: '#1976d2' }}>{user?.email || 'user@email.com'}</span></div>
        </div>
        <hr style={{ margin: '18px 0', borderColor: '#ffd60055' }} />
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontWeight: 700, color: '#1976d2', fontSize: 17, marginBottom: 8 }}>Order History</div>
          <div style={{ color: '#888', fontSize: 15 }}>
            {/* Placeholder for order history */}
            No orders yet.
          </div>
        </div>
        <hr style={{ margin: '18px 0', borderColor: '#ffd60055' }} />
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontWeight: 700, color: '#1976d2', fontSize: 17, marginBottom: 8 }}>Account Actions</div>
          <button style={{ background: '#ffd600', color: '#1976d2', border: 'none', borderRadius: 8, padding: '8px 22px', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px #ffd60044', transition: 'background 0.2s' }} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
