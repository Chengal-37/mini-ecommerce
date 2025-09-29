import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { CartContext } from '../context/CartContext.jsx';
import { getCart } from '../services/cartService';

const LoginPage = ({ setUser, onClose }) => {
		const navigate = useNavigate();
	const { setCartItems } = useContext(CartContext);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	// Clear error and form every time modal is opened
	React.useEffect(() => {
		setError('');
		setEmail('');
		setPassword('');
	}, [onClose]);

		const handleSubmit = async (e) => {
			e.preventDefault();
			setError('');
			setLoading(true);
			try {
				const res = await login(email, password);
				console.log('LOGIN SUCCESS:', res);
				localStorage.setItem('user', JSON.stringify(res.user));
				localStorage.setItem('token', res.token);
				setUser(res.user);
				// Fetch and set cart after login, but do not treat cart fetch failure as login failure
				let cartLoaded = false;
				try {
					const items = await getCart(res.user.id);
					setCartItems(items);
					cartLoaded = true;
				} catch (cartErr) {
					console.log('CART FETCH ERROR:', cartErr);
					setCartItems([]);
					cartLoaded = true;
				}
				setError(''); // Clear error after successful login
				setLoading(false);
				navigate('/');
				onClose();
			} catch (err) {
				console.log('LOGIN ERROR:', err);
				setLoading(false);
				setError(err.response?.data?.message || 'Login failed');
			}
		};

	return (
				<div className="auth-modal">
					<h2 style={{marginBottom: 18}}>Login</h2>
					<form onSubmit={handleSubmit}>
						<div className="mb-3">
							<input
								type="email"
								placeholder="Email"
								value={email}
								onChange={e => setEmail(e.target.value)}
								required
								autoFocus
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
							{loading ? 'Logging in...' : 'Login'}
						</button>
					</form>
					<button onClick={() => { window.location.replace('/'); if (onClose) onClose(); }} style={{marginTop:16,background:'none',border:'none',color:'#1976d2',cursor:'pointer'}}>Close</button>
				</div>
	);
};

export default LoginPage;
