import api from './api';

export const verifyToken = async (token) => {
  try {
    const res = await api.get('/auth/verify', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (err) {
    return null;
  }
};
