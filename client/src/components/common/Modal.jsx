import React from 'react';

const Modal = ({ show, onClose, children }) => {
	if (!show) return null;
	return (
		<div className="modal-overlay">
			<div className="modal-content">
				<button className="modal-close" onClick={onClose} title="Close">×</button>
				{children}
			</div>
		</div>
	);
};

export default Modal;
