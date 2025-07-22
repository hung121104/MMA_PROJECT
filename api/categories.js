import { API_URL } from "@env";
import axios from "axios";
import { getToken } from "./auth";

export const getAllCategories = async () => {
  const res = await axios.get(`${API_URL}/cat/get-all`);
  return res.data.categories;
};

export const createCategory = async (categoryData) => {
  try {
    const token = await getToken();

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await axios.post(`${API_URL}/cat/create`, categoryData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateCategory = async (categoryId, updatedCategory) => {
  try {
    const token = await getToken();

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await axios.put(
      `${API_URL}/cat/update/${categoryId}`,
      {
        updatedCategory,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    const token = await getToken();

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await axios.delete(`${API_URL}/cat/delete/${categoryId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};
