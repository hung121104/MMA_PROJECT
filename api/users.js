import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const BASE_URL = 'http://192.168.6.61:3000/api/v1';

export const loginUser = async (email, password) => {
  const res = await axios.post(`${BASE_URL}/user/login`, { email, password });
  return res.data;
};

export const registerUser = async (userData) => {
  const res = await axios.post(`${BASE_URL}/user/register`, userData);
  return res.data;
};

export const getProfile = async (token) => {
  const res = await axios.get(`${BASE_URL}/user/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.user;
};

export const setToken = async (token) => {
  await AsyncStorage.setItem('token', token);
};

export const getToken = async () => {
  return await AsyncStorage.getItem('token');
};

export const removeToken = async () => {
  await AsyncStorage.removeItem('token');
}; 