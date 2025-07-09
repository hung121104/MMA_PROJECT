import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

// Get the user's cart
export const getCart = async () => {
  const token = await AsyncStorage.getItem('token');
  const res = await axios.get(`${API_URL}/cart/view`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.cart;
};

// Add an item to the cart
export const addToCart = async (productId, quantity = 1) => {
  const token = await AsyncStorage.getItem('token');
  const res = await axios.post(
    `${API_URL}/cart/add`,
    { productId, quantity },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data.cart;
};

// Update the quantity of an item in the cart
export const updateCartItem = async (productId, quantity) => {
  const token = await AsyncStorage.getItem('token');
  const res = await axios.put(
    `${API_URL}/cart/update`,
    { productId, quantity },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data.cart;
};

// Remove an item from the cart
export const removeFromCart = async (productId) => {
  const token = await AsyncStorage.getItem('token');
  const res = await axios.delete(
    `${API_URL}/cart/remove`,
    { 
      headers: { Authorization: `Bearer ${token}` },
      data: { items: [{ productId, quantity: 1 }] }
    }
  );
  return res.data.cart;
};

// Remove multiple items from the cart (bulk delete)
export const removeMultipleFromCart = async (items) => {
  const token = await AsyncStorage.getItem('token');
  const res = await axios.delete(
    `${API_URL}/cart/remove`,
    { 
      headers: { Authorization: `Bearer ${token}` },
      data: { items }
    }
  );
  return res.data.cart;
};

// Clear the cart
export const clearCart = async () => {
  const token = await AsyncStorage.getItem('token');
  const res = await axios.delete(
    `${API_URL}/cart/clear`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data.cart;
}; 