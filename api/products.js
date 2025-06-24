import axios from "axios";
import { API_URL } from '@env';
const BASE_URL = API_URL;

export const getAllProducts = async () => {
  console.log(BASE_URL, "/product/get-all");
  const res = await axios.get(`${BASE_URL}/product/get-all`);
  return res.data.products;
};

export const getProductById = async (id) => {
  const res = await axios.get(`${BASE_URL}/product/${id}`);
  return res.data.product;
};
