import React from 'react';

const WarningModal = ({ show, onClose, message }) => {
  if (!show) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
        <button className="modal-close" onClick={onClose} title="Close">×</button>
        <div style={{ color: '#d32f2f', fontWeight: 800, fontSize: 22, marginBottom: 16 }}>
          ⚠️
        </div>
        <div style={{ color: '#ffd600', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
          {message || 'Please login first to order.'}
        </div>
      </div>
    </div>
  );
};

export default WarningModal;
