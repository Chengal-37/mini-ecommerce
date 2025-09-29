import React from 'react';
import { useNavigate } from 'react-router-dom';

const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          setOrders([]);
          // Optionally, show error message
          console.error('Order fetch error:', data.message || data.error || data);
        }
      } catch {
        setOrders([]);
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);
  return (
    <div style={{ minHeight: '80vh', background: 'linear-gradient(90deg, #1976d2 60%, #42a5f5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 0' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', background: '#fff', borderRadius: 18, boxShadow: '0 6px 32px #1976d233', padding: '2.5rem 2rem', border: '2px solid #ffd600', width: '100%', position: 'relative' }}>
        <button
          onClick={() => navigate('/')}
          style={{ position: 'absolute', left: 24, top: 24, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 18px', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 2px 8px #1976d244', transition: 'background 0.2s' }}
          onMouseOver={e => (e.currentTarget.style.background = '#1565c0')}
          onMouseOut={e => (e.currentTarget.style.background = '#1976d2')}
        >
          ← Back
        </button>
        <h2 style={{ color: '#1976d2', fontWeight: 900, fontSize: 28, marginBottom: 24, textAlign: 'center' }}>Order History</h2>
        {loading ? (
          <div style={{ color: '#888', fontSize: 16, textAlign: 'center' }}>Loading orders...</div>
        ) : orders.length === 0 ? (
          <div style={{ color: '#888', fontSize: 16, textAlign: 'center' }}>No orders yet.</div>
        ) : (
          <div>
            {orders.map(order => (
              <div key={order.id || order._id || order.createdAt} style={{ background: '#fff', borderRadius: 14, boxShadow: '0 6px 32px #1976d233', border: '2px solid #ffd600', marginBottom: 32, padding: '2rem 1.5rem', position: 'relative' }}>
                <div style={{ fontWeight: 800, color: '#1976d2', marginBottom: 8, fontSize: 18 }}>Order Date: {new Date(order.created_at || order.createdAt).toLocaleString()}</div>
                <div style={{ fontWeight: 700, color: '#ffd600', marginBottom: 8, fontSize: 17 }}>Total: ${Number(order.total).toFixed(2)}</div>
                <div style={{ marginBottom: 16 }}>
                  <span style={{ fontWeight: 700, color: '#1976d2', display: 'block', marginBottom: 4, fontSize: 16 }}>Shipping Address:</span>
                  <div style={{ background: '#fff', borderRadius: 10, boxShadow: '0 6px 24px #1976d233', border: '1.5px solid #ffd600', padding: '1.5rem', marginBottom: 4 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15, color: '#333' }}>
                      <tbody>
                        <tr>
                          <td style={{ fontWeight: 700, color: '#1976d2', padding: '8px 10px', width: 120 }}>Name</td>
                          <td style={{ padding: '8px 10px', color: '#ffd600', fontWeight: 700 }}>{order.shipping.full_name}</td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: 700, color: '#1976d2', padding: '8px 10px' }}>Street</td>
                          <td style={{ padding: '8px 10px', color: '#ffd600', fontWeight: 700 }}>{order.shipping.street_address}</td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: 700, color: '#1976d2', padding: '8px 10px' }}>City</td>
                          <td style={{ padding: '8px 10px', color: '#ffd600', fontWeight: 700 }}>{order.shipping.city}</td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: 700, color: '#1976d2', padding: '8px 10px' }}>State</td>
                          <td style={{ padding: '8px 10px', color: '#ffd600', fontWeight: 700 }}>{order.shipping.state}</td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: 700, color: '#1976d2', padding: '8px 10px' }}>Country</td>
                          <td style={{ padding: '8px 10px', color: '#ffd600', fontWeight: 700 }}>{order.shipping.country}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div>
                  <span style={{ fontWeight: 700, color: '#1976d2', fontSize: 16 }}>Items:</span>
                  <ul style={{ margin: '8px 0 0 0', padding: 0, listStyle: 'none' }}>
                    {order.items.map((item, idx) => (
                      <li key={item.productId || item.id || idx} style={{ marginBottom: 6 }}>
                        <span style={{ color: '#1976d2', fontWeight: 700 }}>{item.title}</span> x{item.quantity} - <span style={{ color: '#ffd600', fontWeight: 700 }}>${item.price.toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
