import axios from 'axios';
const BASE_URL = 'http://0.0.0.0:3000/api/v1';

export const getAllCategories = async () => {
  const res = await axios.get(`${BASE_URL}/category/all`);
  return res.data.categories;
}; 