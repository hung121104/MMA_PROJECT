import axios from 'axios';
const BASE_URL = 'http://0.0.0.0:3000/api/v1';

export const getOrders = async (token) => {
  const res = await axios.get(`${BASE_URL}/order/all`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.orders;
};

export const createOrder = async (orderData, token) => {
  const res = await axios.post(`${BASE_URL}/order/create`, orderData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}; 