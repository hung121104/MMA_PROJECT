import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';

// Create payment intent for Stripe
export const createPaymentIntent = async (orderId, totalAmount, currency = 'usd') => {
  const token = await AsyncStorage.getItem('token');
  console.log('API CALL: POST', `${API_URL}/order/payments`, { orderId, totalAmount, currency });
  
  const res = await axios.post(`${API_URL}/order/payments`, {
    orderId,
    totalAmount,
    currency,
  }, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res.data;
};

// Update payment status after successful payment
export const updatePaymentStatus = async (orderId, paymentIntentId) => {
  const token = await AsyncStorage.getItem('token');
  console.log('API CALL: PUT', `${API_URL}/order/update-payment-status`, { orderId, paymentIntentId });
  
  const res = await axios.put(`${API_URL}/order/update-payment-status`, {
    orderId: orderId,
    paymentIntentId: paymentIntentId,
  }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Get payment history for user
export const getPaymentHistory = async () => {
  const token = await AsyncStorage.getItem('token');
  console.log('API CALL: GET', `${API_URL}/order/payment-history`);
  
  const res = await axios.get(`${API_URL}/order/payment-history`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.payments;
};

// Get payment details by payment intent ID
export const getPaymentDetails = async (paymentIntentId) => {
  const token = await AsyncStorage.getItem('token');
  console.log('API CALL: GET', `${API_URL}/order/payment/${paymentIntentId}`);
  
  const res = await axios.get(`${API_URL}/order/payment/${paymentIntentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.payment;
};

// Refund payment
export const refundPayment = async (paymentIntentId, amount, reason) => {
  const token = await AsyncStorage.getItem('token');
  console.log('API CALL: POST', `${API_URL}/order/refund`, { paymentIntentId, amount, reason });
  
  const res = await axios.post(`${API_URL}/order/refund`, {
    paymentIntentId,
    amount,
    reason,
  }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}; 