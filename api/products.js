import axios from "axios";
import {API_URL} from '@env';

export const getAllProducts = async () => {
  console.log(API_URL, "/product/get-all");
  const res = await axios.get(`${API_URL}/product/get-all`);
  return res.data.products;
};

export const getProductById = async (id) => {
  const res = await axios.get(`${API_URL}/product/${id}`);
  return res.data.product;
};
