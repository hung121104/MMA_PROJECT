import axios from 'axios';
import { getToken } from './users';
import {API_URL} from '@env';

// Get all orders (admin)
export const getOrders = async (token) => {
  const res = await axios.get(`${API_URL}/order/all`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.orders;
};

// Get current user's orders
export const getMyOrders = async () => {
  const token = await getToken();
  const res = await axios.get(`${API_URL}/order/my-orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.orders;
};

// Get specific order by ID
export const getOrderById = async (orderId) => {
  const token = await getToken();
  const res = await axios.get(`${API_URL}/order/my-orders/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.order;
};

// Create new order
export const createOrder = async (orderData, token) => {
  const res = await axios.post(`${API_URL}/order/create`, orderData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Update payment status after successful payment
export const updatePaymentStatus = async (orderId, paymentIntentId) => {
  const token = await getToken();
  const res = await axios.put(`${API_URL}/order/update-payment-status`, {
    orderId: orderId,
    paymentIntentId: paymentIntentId
  }, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  });
  return res.data;
}; 