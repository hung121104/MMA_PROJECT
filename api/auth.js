import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';

export const loginUser = async (email, password) => {
  console.log('API CALL: POST', `${API_URL}/user/login`, { email, password });
  const res = await axios.post(`${API_URL}/user/login`, { email, password });
  return res.data;
};

export const requestRegister = async ({ name, email, password, phone }) => {
  const body = { name, email, password, phone };
  console.log('API CALL: POST', `${API_URL}/user/request-register`, body);
  const res = await axios.post(`${API_URL}/user/request-register`, body);
  return res.data;
};

export const registerUser = async ({ email, otp }) => {
  const body = { email, otp };
  console.log('API CALL: POST', `${API_URL}/user/register`, body);
  const res = await axios.post(`${API_URL}/user/register`, body);
  return res.data;
};

export const requestResetPassword = async (email) => {
  console.log('API CALL: POST', `${API_URL}/user/request-reset-password`, { email });
  const res = await axios.post(`${API_URL}/user/request-reset-password`, { email });
  return res.data;
};

export const resetPassword = async (email, otp, newPassword) => {
  console.log('API CALL: POST', `${API_URL}/user/reset-password`, { email, otp, newPassword });
  const res = await axios.post(`${API_URL}/user/reset-password`, { email, otp, newPassword });
  return res.data;
};

export const getProfile = async (token) => {
  console.log('API CALL: GET', `${API_URL}/user/profile`, { token });
  const res = await axios.get(`${API_URL}/user/profile`, {
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
  await AsyncStorage.removeItem('userRole');
};

export const setUserRole = async (role) => {
  await AsyncStorage.setItem('userRole', role);
};

export const getUserRole = async () => {
  return await AsyncStorage.getItem('userRole');
};