import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/authService';

const RegisterPage = ({ onClose, onSuccessRegister }) => {
	const navigate = useNavigate();
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setLoading(true);
		try {
			await register(username, email, password);
			setLoading(false);
			onSuccessRegister();
		} catch (err) {
			setLoading(false);
			setError(err.response?.data?.message || 'Registration failed');
		}
	};

	return (
					<div className="auth-modal">
						<h2 style={{marginBottom: 18}}>Register</h2>
						<form onSubmit={handleSubmit}>
							<div className="mb-3">
								<input
									type="text"
									placeholder="Username"
									value={username}
									onChange={e => setUsername(e.target.value)}
									required
									autoFocus
								/>
							</div>
							<div className="mb-3">
								<input
									type="email"
									placeholder="Email"
									value={email}
									onChange={e => setEmail(e.target.value)}
									required
								/>
							</div>
							<div className="mb-3" style={{position:'relative'}}>
								<input
									type={showPassword ? 'text' : 'password'}
									placeholder="Password"
									value={password}
									onChange={e => setPassword(e.target.value)}
									required
								/>
								<span
									style={{position:'absolute',right:12,top:10,cursor:'pointer',fontSize:18,color:'#888'}}
									onClick={() => setShowPassword(v => !v)}
									title={showPassword ? 'Hide password' : 'Show password'}
								>
									{showPassword ? '🙈' : '👁️'}
								</span>
							</div>
							{error && <div style={{color:'red',marginBottom:10}}>{error}</div>}
							<button type="submit" disabled={loading} style={{width:'100%',marginTop:8}}>
								{loading ? 'Registering...' : 'Register'}
							</button>
						</form>
						<button onClick={() => { window.location.replace('/'); if (onClose) onClose(); }} style={{marginTop:16,background:'none',border:'none',color:'#1976d2',cursor:'pointer'}}>Close</button>
					</div>
	);
};

export default RegisterPage;
