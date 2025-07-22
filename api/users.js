// This file is now reserved for user-specific (non-auth) API functions.
// All authentication-related functions have been moved to auth.js.

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";

export const loginUser = async (email, password) => {
  console.log("API CALL: POST", `${API_URL}/user/login`, { email, password });
  const res = await axios.post(`${API_URL}/user/login`, { email, password });
  return res.data;
};

export const requestRegister = async ({ name, email, password, phone }) => {
  const body = { name, email, password, phone };
  console.log("API CALL: POST", `${API_URL}/user/request-register`, body);
  const res = await axios.post(`${API_URL}/user/request-register`, body);
  return res.data;
};

export const registerUser = async ({ email, otp }) => {
  const body = { email, otp };
  console.log("API CALL: POST", `${API_URL}/user/register`, body);
  const res = await axios.post(`${API_URL}/user/register`, body);
  return res.data;
};

export const requestResetPassword = async (email) => {
  console.log("API CALL: POST", `${API_URL}/user/request-reset-password`, {
    email,
  });
  const res = await axios.post(`${API_URL}/user/request-reset-password`, {
    email,
  });
  return res.data;
};

export const resetPassword = async (email, otp, newPassword) => {
  console.log("API CALL: POST", `${API_URL}/user/reset-password`, {
    email,
    otp,
    newPassword,
  });
  const res = await axios.post(`${API_URL}/user/reset-password`, {
    email,
    otp,
    newPassword,
  });
  return res.data;
};

export const getProfile = async (token) => {
  console.log("API CALL: GET", `${API_URL}/user/profile`, { token });
  const res = await axios.get(`${API_URL}/user/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.user;
};

export const setToken = async (token) => {
  await AsyncStorage.setItem("token", token);
};

export const getToken = async () => {
  return await AsyncStorage.getItem("token");
};

export const removeToken = async () => {
  await AsyncStorage.removeItem("token");
};

export const updatePassword = async (oldPassword, newPassword) => {
  const token = await getToken();
  const res = await axios.put(
    `${API_URL}/user/update-password`,
    { oldPassword, newPassword },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

// Update user profile information
export const updateProfile = async (profileData) => {
  const token = await getToken();
  const res = await axios.put(`${API_URL}/user/profile-update`, profileData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Update profile picture/avatar
export const updateProfilePicture = async (imageFile) => {
  const token = await getToken();

  // Create FormData for file upload
  const formData = new FormData();

  // Fix the type to include proper MIME type
  let mimeType = imageFile.type;
  if (mimeType === "image") {
    // If type is just 'image', determine from file extension
    const extension = imageFile.fileName?.split(".").pop()?.toLowerCase();
    if (extension === "png") {
      mimeType = "image/png";
    } else if (extension === "jpg" || extension === "jpeg") {
      mimeType = "image/jpeg";
    } else {
      mimeType = "image/jpeg"; // default fallback
    }
  }

  formData.append("file", {
    uri: imageFile.uri,
    type: mimeType,
    name: imageFile.fileName || "profile.jpg",
  });

  console.log("API CALL: PUT", `${API_URL}/user/update-picture`, {
    fileName: imageFile.fileName,
    type: mimeType,
    uri: imageFile.uri,
  });

  const res = await axios.put(`${API_URL}/user/update-picture`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};
