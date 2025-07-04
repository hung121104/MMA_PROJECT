import axios from 'axios';
import {API_URL} from '@env';

export const getAllCategories = async () => {
  const res = await axios.get(`${API_URL}/category/all`);
  return res.data.categories;
}; 