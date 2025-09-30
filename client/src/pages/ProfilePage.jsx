import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';

const ProfilePage = ({ user }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user?.id) return;
    api.get(`/auth/user/${user.id}`) // Use api.get and remove '/api' from the path
    .then(res => {
      const data = res.data; // Axios puts the response data in the 'data' property
      setProfile(data);
      setForm({ username: data.username, email: data.email, password: '' });
    })
    .catch(err => {
        console.error("Failed to fetch profile:", err);
    });
  }, [user]);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSave = async e => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await api.put(`/auth/user/${user.id}`, form); // Use api.put, Axios handles JSON
      setProfile(res.data);
      setEdit(false);
      setMessage('Profile updated!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Update failed');
    }
  };

  if (!profile) return <div style={{ textAlign: 'center', marginTop: 60 }}>Loading...</div>;
  return (
    <div style={{ minHeight: '80vh', background: 'linear-gradient(90deg, #1976d2 60%, #42a5f5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 0' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', background: '#fff', borderRadius: 18, boxShadow: '0 6px 32px #1976d233', padding: '2.5rem 2rem', border: '2px solid #ffd600', width: '100%', position: 'relative' }}>
        <button
          onClick={() => navigate('/')}
          style={{ position: 'absolute', left: 24, top: 24, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 18px', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 2px 8px #1976d244', transition: 'background 0.2s' }}
          onMouseOver={e => (e.currentTarget.style.background = '#1565c0')}
          onMouseOut={e => (e.currentTarget.style.background = '#1976d2')}
        >
          ← Back
        </button>
        <h2 style={{ color: '#1976d2', fontWeight: 900, fontSize: 28, marginBottom: 24, textAlign: 'center' }}>Profile Details</h2>
        {message && <div style={{ color: '#1976d2', marginBottom: 12, textAlign: 'center' }}>{message}</div>}
        {!edit ? (
          <>
            <div style={{ fontWeight: 700, color: '#1976d2', fontSize: 18, marginBottom: 10, textAlign: 'center' }}>👤 {profile.username}</div>
            <div style={{ color: '#555', fontSize: 16, marginBottom: 2, textAlign: 'center' }}>Email: <span style={{ color: '#1976d2' }}>{profile.email}</span></div>
            <button
              style={{ marginTop: 18, background: '#ffd600', color: '#1976d2', border: 'none', borderRadius: 8, padding: '8px 22px', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px #ffd60044', transition: 'background 0.2s', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
              onClick={() => setEdit(true)}
              onMouseOver={e => (e.currentTarget.style.background = '#ffe066')}
              onMouseOut={e => (e.currentTarget.style.background = '#ffd600')}
            >
              Edit
            </button>
          </>
        ) : (
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 340, margin: '0 auto' }}>
            <label style={{ color: '#1976d2', fontWeight: 700 }}>Username
              <input name="username" value={form.username} onChange={handleChange} style={{ width: '100%', padding: 10, borderRadius: 6, border: '1.5px solid #ffd600', marginTop: 4 }} />
            </label>
            <label style={{ color: '#1976d2', fontWeight: 700 }}>Email
              <input name="email" value={form.email} onChange={handleChange} style={{ width: '100%', padding: 10, borderRadius: 6, border: '1.5px solid #ffd600', marginTop: 4 }} />
            </label>
            <label style={{ color: '#1976d2', fontWeight: 700 }}>Password
              <input name="password" type="password" value={form.password} onChange={handleChange} style={{ width: '100%', padding: 10, borderRadius: 6, border: '1.5px solid #ffd600', marginTop: 4 }} placeholder="Leave blank to keep current password" />
            </label>
            <div style={{ display: 'flex', gap: 12, marginTop: 10, justifyContent: 'center' }}>
              <button type="submit" style={{ background: '#ffd600', color: '#1976d2', border: 'none', borderRadius: 8, padding: '8px 22px', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px #ffd60044', transition: 'background 0.2s' }}>Save</button>
              <button type="button" style={{ background: '#fff', color: '#1976d2', border: '2px solid #ffd600', borderRadius: 8, padding: '8px 22px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }} onClick={() => setEdit(false)}>Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
