import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  Image,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getOrders } from "../api/orders";
import moment from "moment";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

const statusColors = {
  pending: "#f5a623",
  paid: "#32be60",
  shipped: "#6ac259",
  delivered: "#6ac259",
  processing: "#2980ef",
  cancelled: "#eb5757",
  refunded: "#7b8fa7",
};

// List of filter statuses, including "all"
const orderStatusOptions = [
  "all",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export default function AdminOrdersScreen() {
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchOrders = async () => {
    setError("");
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Token not found");
      const data = await getOrders(token);
      setOrders(data);
    } catch (err) {
      setError("Error fetching orders list");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchOrders();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  // Function to change filter status
  const onSelectStatus = (status) => {
    setFilterStatus(status);
  };

  // Filter orders based on selected status, "all" shows all orders
  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((o) => o.orderStatus === filterStatus);

  const renderOrderItem = (orderItem) => (
    <View key={orderItem._id} style={styles.productRow}>
      <Image source={{ uri: orderItem.image }} style={styles.productImage} />
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: "bold" }} numberOfLines={1}>
          {orderItem.name}
        </Text>
        <Text style={{ color: "#666" }}>
          Qty: {orderItem.quantity} | Price:{" "}
          {(orderItem.price || 0).toLocaleString()}₫
        </Text>
      </View>
    </View>
  );

  const renderOrder = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("AdminOrderDetail", { orderId: item._id })
      }
      activeOpacity={0.7}
    >
      <View style={styles.orderCard}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={styles.orderId}>
            #{item._id.slice(-6).toUpperCase()}
          </Text>
          <Text style={{ fontSize: 12, color: "#888" }}>
            {moment(item.createdAt).format("DD/MM/YYYY HH:mm")}
          </Text>
        </View>

        <Text style={styles.name}>
          Customer: {item.user?.name || "Hidden"} ({item.user?.phone})
        </Text>
        <Text style={styles.address}>
          Address: {item.shippingInfo?.address}, {item.shippingInfo?.city},{" "}
          {item.shippingInfo?.country}
        </Text>

        <View style={styles.chipsRow}>
          <Text
            style={[
              styles.chip,
              { backgroundColor: statusColors[item.orderStatus] || "#ccc" },
            ]}
          >
            {item.orderStatus.charAt(0).toUpperCase() +
              item.orderStatus.slice(1)}
          </Text>
          <Text
            style={[
              styles.chip,
              {
                backgroundColor: statusColors[item.paymentStatus] || "#00bcd4",
              },
            ]}
          >
            {item.paymentStatus.toUpperCase()}
          </Text>
          <Text style={[styles.payType]}>{item.paymentMethod}</Text>
        </View>

        <Text style={{ marginTop: 8, fontWeight: "500" }}>Products:</Text>
        {item.orderItems.map(renderOrderItem)}

        <View style={styles.sumRow}>
          <Text style={{ color: "#888", fontSize: 13 }}>
            Shipping Fee: {item.shippingCharges.toLocaleString()}₫ | Tax:{" "}
            {item.tax.toLocaleString()}₫
          </Text>
          <Text style={styles.amountTotal}>
            Total: {item.totalAmount.toLocaleString()}₫
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2a6ef7" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Filter status buttons */}
      <View style={styles.filterRow}>
        {orderStatusOptions.map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterBtn,
              {
                backgroundColor:
                  filterStatus === status
                    ? statusColors[status] || "#2a6ef7"
                    : "#eee",
                borderColor:
                  filterStatus === status
                    ? statusColors[status] || "#2a6ef7"
                    : "#ccc",
              },
            ]}
            onPress={() => onSelectStatus(status)}
          >
            <Text
              style={[
                styles.filterBtnText,
                { color: filterStatus === status ? "#fff" : "#333" },
              ]}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredOrders}
        renderItem={renderOrder}
        keyExtractor={(item) => String(item._id)}
        contentContainerStyle={{ paddingBottom: 20, padding: 12 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={{ textAlign: "center", margin: 65, color: "#666" }}>
            No orders found
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f8fc",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
    marginBottom: 18,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  orderId: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2a6ef7",
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    marginTop: 4,
    color: "#222",
    marginBottom: 4,
    fontWeight: "600",
  },
  address: {
    color: "#444",
    fontSize: 15,
    marginBottom: 4,
  },
  chipsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
    gap: 10,
  },
  chip: {
    color: "#fff",
    fontWeight: "bold",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    fontSize: 15,
    marginRight: 10,
  },
  payType: {
    backgroundColor: "#e0e4ee",
    color: "#222",
    borderRadius: 12,
    fontWeight: "700",
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 6,
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 6,
    gap: 10,
  },
  productImage: {
    width: 48,
    height: 48,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: "#eee",
  },
  sumRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 14,
  },
  amountTotal: {
    color: "#D32F2F",
    fontWeight: "bold",
    fontSize: 18,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingVertical: 12,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginHorizontal: 6,
    marginVertical: 6,
  },
  filterBtnText: {
    fontWeight: "600",
    fontSize: 14,
  },
});
