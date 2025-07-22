import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import moment from "moment";
import { updateOrderStatus, cancelOrder, getOrderById } from "../api/orders"; // sửa đường dẫn đúng với dự án

const statusColors = {
  pending: "#f5a623",
  paid: "#32be60",
  delivered: "#4fd44e",
  processing: "#2196F3",
  cancelled: "#eb5757",
  cancel: "#eb5757",
  refunded: "#7b8fa7",
};

export default function AdminOrderDetailScreen({ route }) {
  const { orderId } = route.params; // Only receive orderId from navigation params
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingCancel, setLoadingCancel] = useState(false);
  const [loadingOrder, setLoadingOrder] = useState(true);

  // Load order details on mount or when orderId changes
  useEffect(() => {
    const fetchOrder = async () => {
      setLoadingOrder(true);
      try {
        const data = await getOrderById(orderId);
        setOrder(data);
      } catch (error) {
        Alert.alert(
          "Error",
          error.response?.data?.message ||
            error.message ||
            "Unable to load order"
        );
      } finally {
        setLoadingOrder(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handleUpdateStatus = async () => {
    if (!order) return;
    setLoading(true);
    try {
      const res = await updateOrderStatus(order._id);
      Alert.alert("Notification", res.message || "Order status updated");

      // Update UI according to the sequential status
      if (order.orderStatus === "processing")
        setOrder({ ...order, orderStatus: "shipped" });
      else if (order.orderStatus === "shipped")
        setOrder({
          ...order,
          orderStatus: "deliverd",
          deliveredAt: new Date().toISOString(),
        });
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          error.message ||
          "Failed to update status"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = () => {
    if (!order) return;
    if (order.orderStatus !== "processing") {
      return Alert.alert(
        "Notification",
        "Only orders with 'processing' status can be cancelled."
      );
    }

    const cancelReason = "Customer requested cancellation"; // can be replaced with input as needed

    Alert.alert(
      "Cancel Order Confirmation",
      "Are you sure you want to cancel this order?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            setLoadingCancel(true);
            try {
              const res = await cancelOrder(order._id, cancelReason);
              Alert.alert("Success", res.message || "Order has been cancelled");
              // Reload newest order info from server
              const freshOrder = await getOrderById(order._id);
              setOrder(freshOrder);
            } catch (error) {
              Alert.alert(
                "Error",
                error.response?.data?.message ||
                  error.message ||
                  "Failed to cancel order"
              );
            } finally {
              setLoadingCancel(false);
            }
          },
        },
      ]
    );
  };

  if (loadingOrder || !order) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#2a6ef7" />
        <Text>Loading order details...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      {/* HEADER */}
      <View style={styles.headerCard}>
        <Text style={styles.heading}>
          Order #{order._id.slice(-6).toUpperCase()}
        </Text>
        <Text style={styles.subHeader}>
          Order Date: {moment(order.createdAt).format("DD/MM/YYYY HH:mm")}
        </Text>
        <View style={styles.badgeRow}>
          <Text
            style={[
              styles.statusBadge,
              { backgroundColor: statusColors[order.orderStatus] || "#666" },
            ]}
          >
            {order.orderStatus.toUpperCase()}
          </Text>
          <Text
            style={[
              styles.statusBadge,
              {
                backgroundColor: statusColors[order.paymentStatus] || "#2980ef",
              },
            ]}
          >
            {order.paymentStatus.toUpperCase()}
          </Text>
          <Text style={styles.payType}>{order.paymentMethod}</Text>
        </View>
      </View>

      {/* CUSTOMER INFO, SHIPPING ADDRESS */}
      <View style={styles.infoBox}>
        <Text style={styles.sectionTitle}>Customer</Text>
        <View style={{ paddingBottom: 4 }}>
          <Text>
            <Text style={styles.label}>Name: </Text>
            <Text style={styles.text}>{order.user?.name || "Hidden"}</Text>
          </Text>
          <Text>
            <Text style={styles.label}>Phone: </Text>
            <Text style={styles.text}>{order.user?.phone}</Text>
          </Text>
          <Text>
            <Text style={styles.label}>Email: </Text>
            <Text style={styles.text}>{order.user?.email}</Text>
          </Text>
        </View>
        <Text style={styles.sectionTitle}>Shipping Address</Text>
        <Text style={styles.text}>
          {order.shippingInfo?.address}, {order.shippingInfo?.city},{" "}
          {order.shippingInfo?.country}
        </Text>
      </View>

      {/* PRODUCTS */}
      <View style={styles.productListBox}>
        <Text style={styles.sectionTitle}>Products</Text>
        {order.orderItems.map((item) => (
          <View key={item._id} style={styles.productRow}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={{ flex: 1 }}>
              <Text numberOfLines={1} style={styles.productName}>
                {item.name}
              </Text>
              <Text style={styles.productProps}>
                Quantity:{" "}
                <Text style={{ fontWeight: "bold" }}>{item.quantity}</Text>{" "}
                Price:{" "}
                <Text style={{ color: "#2a6ef7", fontWeight: "bold" }}>
                  {item.price.toLocaleString()}₫
                </Text>
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* TOTALS */}
      <View style={styles.totalsBox}>
        <Text style={styles.totalsText}>
          Subtotal:{" "}
          <Text style={styles.amount}>{order.itemPrice.toLocaleString()}₫</Text>
        </Text>
        <Text style={styles.totalsText}>
          Shipping Fee:{" "}
          <Text style={styles.amount}>
            {order.shippingCharges.toLocaleString()}₫
          </Text>
        </Text>
        <Text style={styles.totalsText}>
          Tax: <Text style={styles.amount}>{order.tax.toLocaleString()}₫</Text>
        </Text>
        <View style={styles.line} />
        <Text style={styles.totalFinal}>
          Total:{" "}
          <Text style={styles.amountFinal}>
            {order.totalAmount.toLocaleString()}₫
          </Text>
        </Text>
      </View>

      {/* Update status button */}
      <View style={{ marginHorizontal: 16, marginBottom: 10 }}>
        <TouchableOpacity
          onPress={handleUpdateStatus}
          disabled={loading || order.orderStatus === "deliverd"}
          style={{
            backgroundColor:
              loading || order.orderStatus === "deliverd" ? "#aaa" : "#2a6ef7",
            paddingVertical: 12,
            borderRadius: 14,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
            {order.orderStatus === "processing"
              ? "Mark as Shipped"
              : order.orderStatus === "shipped"
              ? "Mark as Delivered"
              : "Delivered"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Cancel order button, only show when status is processing */}
      {order.orderStatus === "processing" && (
        <View style={{ marginHorizontal: 16, marginBottom: 30 }}>
          <TouchableOpacity
            onPress={handleCancelOrder}
            disabled={loadingCancel}
            style={{
              backgroundColor: loadingCancel ? "#aaa" : "#eb5757",
              paddingVertical: 12,
              borderRadius: 14,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
              Cancel Order
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f8fc", padding: 0 },
  headerCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    margin: 16,
    marginBottom: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2a6ef7",
    marginBottom: 2,
  },
  subHeader: {
    fontSize: 13,
    color: "#888",
    paddingBottom: 7,
  },
  badgeRow: { flexDirection: "row", alignItems: "center", gap: 7 },
  statusBadge: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
    borderRadius: 13,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
  },
  payType: {
    backgroundColor: "#e3e7ee",
    color: "#384050",
    fontWeight: "700",
    borderRadius: 10,
    fontSize: 12,
    paddingHorizontal: 9,
    paddingVertical: 2,
    marginLeft: 4,
  },
  infoBox: {
    backgroundColor: "#fff",
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 14,
    elevation: 1,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#2a6ef7",
    marginBottom: 5,
  },
  label: {
    color: "#444",
    fontWeight: "600",
  },
  text: {
    color: "#222",
    fontSize: 15,
  },
  productListBox: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 14,
    marginBottom: 14,
    elevation: 1,
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    marginTop: 3,
  },
  productImage: {
    width: 47,
    height: 47,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: "#eee",
  },
  productName: {
    fontSize: 15,
    color: "#13161A",
    fontWeight: "bold",
    marginBottom: 2,
  },
  productProps: {
    fontSize: 13,
    color: "#6f7284",
  },
  totalsBox: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 14,
    elevation: 1,
  },
  totalsText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 3,
  },
  amount: {
    fontWeight: "bold",
    color: "#2a6ef7",
  },
  line: {
    height: 1,
    backgroundColor: "#eaeaea",
    marginVertical: 8,
  },
  totalFinal: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#1b2436",
    marginTop: 5,
  },
  amountFinal: {
    color: "#D32F2F",
    fontWeight: "bold",
    fontSize: 19,
  },
});
