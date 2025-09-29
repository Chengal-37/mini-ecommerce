import api from './api';

export const getCart = async (userId) => {
  const res = await api.get(`/cart/${userId}`);
  return res.data.items;
};


export const saveCart = async (userId, items) => {
  await api.post(`/cart/${userId}`, { items });
};

export const deleteCart = async (userId) => {
  await api.delete(`/cart/${userId}`);
};
