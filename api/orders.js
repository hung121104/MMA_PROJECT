import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";

// Get all orders (admin)
export const getOrders = async (token) => {
  const res = await axios.get(`${API_URL}/order/admin/get-all-orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.orders;
};
//update order status (admin)
export const updateOrderStatus = async (orderId) => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      throw new Error("User not authenticated");
    }

    const res = await axios.put(
      `${API_URL}/order/admin/order/${orderId}`,
      {}, // body có thể để trống nếu logic update status dựa trên trạng thái hiện tại của order trên server
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data; // trả về message hoặc dữ liệu từ server
  } catch (error) {
    console.error(
      "Error updating order status:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Hàm hủy order (admin)
export const cancelOrder = async (orderId, cancelReason) => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      throw new Error("User not authenticated");
    }

    // axios delete nhưng gửi data trong config theo chuẩn axios
    const res = await axios.delete(`${API_URL}/order/admin/order/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        cancelReason,
      },
    });

    return res.data;
  } catch (error) {
    console.error(
      "Error canceling order:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Get current user's orders
export const getMyOrders = async () => {
  const token = await AsyncStorage.getItem("token");
  const res = await axios.get(`${API_URL}/order/my-orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.orders;
};

// Get specific order by ID
export const getOrderById = async (orderId) => {
  const token = await AsyncStorage.getItem("token");
  const res = await axios.get(`${API_URL}/order/my-orders/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.order;
};

// Create new order
export const createOrder = async (orderData) => {
  const token = await AsyncStorage.getItem("token");
  console.log("Token for createOrder:", token);

  const res = await axios.post(`${API_URL}/order/create`, orderData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Update payment status after successful payment
export const updatePaymentStatus = async (orderId, paymentIntentId) => {
  const token = await AsyncStorage.getItem("token");
  const res = await axios.put(
    `${API_URL}/order/update-payment-status`,
    {
      orderId: orderId,
      paymentIntentId: paymentIntentId,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

export const getCart = async () => {
  const token = await AsyncStorage.getItem("token");
  const res = await axios.get(`${API_URL}/cart/view`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.cart;
};
