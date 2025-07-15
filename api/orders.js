import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';

// Get all orders (admin)
export const getOrders = async (token) => {
  const res = await axios.get(`${API_URL}/order/get-all-orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.orders;
};

// Get current user's orders
export const getMyOrders = async () => {
  const token = await AsyncStorage.getItem('token');
  const res = await axios.get(`${API_URL}/order/my-orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.orders;
};

// Get specific order by ID
export const getOrderById = async (orderId) => {
  const token = await AsyncStorage.getItem('token');
  const res = await axios.get(`${API_URL}/order/my-orders/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.order;
};

// Create new order
export const createOrder = async (orderData) => {
  const token = await AsyncStorage.getItem('token');
  console.log('Token for createOrder:', token);
  
  const res = await axios.post(`${API_URL}/order/create`, orderData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Update payment status after successful payment
export const updatePaymentStatus = async (orderId, paymentIntentId) => {
  const token = await AsyncStorage.getItem('token');
  const res = await axios.put(`${API_URL}/order/update-payment-status`, {
    orderId: orderId,
    paymentIntentId: paymentIntentId,
  }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}; 

export const getCart = async () => {
  const token = await AsyncStorage.getItem('token');
  const res = await axios.get(`${API_URL}/cart/view`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.cart;
}; 