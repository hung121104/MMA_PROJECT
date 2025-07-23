import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { getOrderById } from "../api/orders";
import { colors } from "../styles/GlobalStyles";
import OptimizedImage from "../components/OptimizedImage"; // Add this import

const OrderDetailScreen = ({ route, navigation }) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrderDetail = async () => {
    try {
      const orderData = await getOrderById(orderId);
      setOrder(orderData);
    } catch (error) {
      console.error("Error fetching order:", error);
      Alert.alert("Error", "Failed to fetch order details");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrderDetail();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [orderId]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "processing":
        return "#2196F3";
      case "shipped":
        return "#9C27B0";
      case "delivered":
        return "#4CAF50";
      case "cancel":
        return "#F44336";
      default:
        return "#666";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "#FFA500";
      case "complete":
        return "#4CAF50";
      default:
        return "#666";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading order details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Order not found</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchOrderDetail}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Order Header */}
        <View style={styles.headerSection}>
          <Text style={styles.orderTitle}>Order #{order._id.slice(-8)}</Text>
          <Text style={styles.orderDate}>
            Placed on {formatDate(order.createdAt)}
          </Text>
        </View>

        {/* Order Status */}
        <View style={styles.statusSection}>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Order Status</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(order.orderStatus) },
              ]}
            >
              <Text style={styles.statusText}>
                {order.orderStatus.toUpperCase()}
              </Text>
            </View>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Payment Status</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getPaymentStatusColor(order.paymentStatus) },
              ]}
            >
              <Text style={styles.statusText}>
                {order.paymentStatus.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          {order.orderItems.map((item, index) => (
            <View key={item._id || index} style={styles.itemCard}>
              <OptimizedImage
                source={{ uri: item.image }}
                style={styles.itemImage}
                width={80}
                height={80}
                quality="70"
                fallbackText="📦"
              />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.itemPrice}>${item.price}</Text>
                <Text style={styles.itemQuantity}>
                  Quantity: {item.quantity}
                </Text>
                <Text style={styles.itemTotal}>
                  Total: ${(item.price * item.quantity).toFixed(2)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Shipping Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <FontAwesome name="map-marker" size={16} color={colors.primary} />
              <Text style={styles.infoText}>{order.shippingInfo.address}</Text>
            </View>
            <View style={styles.infoRow}>
              <FontAwesome name="building" size={16} color={colors.primary} />
              <Text style={styles.infoText}>
                {order.shippingInfo.city}, {order.shippingInfo.country}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <FontAwesome name="phone" size={16} color={colors.primary} />
              <Text style={styles.infoText}>{order.shippingInfo.phone}</Text>
            </View>
          </View>
        </View>

        {/* Payment Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <FontAwesome
                name="credit-card"
                size={16}
                color={colors.primary}
              />
              <Text style={styles.infoText}>
                Payment Method: {order.paymentMethod}
              </Text>
            </View>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Items Total</Text>
              <Text style={styles.summaryValue}>
                ${order.itemPrice.toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax</Text>
              <Text style={styles.summaryValue}>${order.tax.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping Charges</Text>
              <Text style={styles.summaryValue}>
                ${order.shippingCharges.toFixed(2)}
              </Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>
                ${order.totalAmount.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#F44336",
    marginBottom: 20,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  headerSection: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 10,
  },
  orderTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  orderDate: {
    fontSize: 14,
    color: "#666",
  },
  statusSection: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statusItem: {
    flex: 1,
    marginHorizontal: 5,
  },
  statusLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    textAlign: "center",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: "center",
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  section: {
    backgroundColor: "#fff",
    marginBottom: 10,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  itemCard: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginBottom: 10,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
    justifyContent: "space-between",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "bold",
  },
  itemQuantity: {
    fontSize: 14,
    color: "#666",
  },
  itemTotal: {
    fontSize: 14,
    color: "#333",
    fontWeight: "bold",
  },
  infoCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 15,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 10,
    flex: 1,
  },
  summaryCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 15,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
  },
  summaryValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 10,
    marginTop: 5,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
  },
};

export default OrderDetailScreen;
