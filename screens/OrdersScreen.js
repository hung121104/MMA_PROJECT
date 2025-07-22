import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getMyOrders } from "../api/orders";
import OrdersScreenStyles from "../styles/OrdersScreenStyles";

export default function OrdersScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all"); // Add filter state

  const loadOrders = async () => {
    try {
      const ordersData = await getMyOrders();
      setOrders(ordersData);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const handlePayment = (order) => {
    const orderId = order._id || `order_${Date.now()}`;
    const totalAmount = order.totalAmount; // Convert to cents
    navigation.navigate("PaymentWithStripeScreen", {
      orderId: orderId,
      totalAmount: totalAmount,
      orderDetails: order,
    });
  };

  const handleViewOrderDetail = (orderId) => {
    navigation.navigate("OrderDetail", { orderId });
  };

  // Filter orders based on selected filter
  const getFilteredOrders = () => {
    if (selectedFilter === "all") return orders;
    return orders.filter(
      (order) =>
        (order.orderStatus || order.status)?.toLowerCase() === selectedFilter
    );
  };

  // Get order counts for each status
  const getOrderCounts = () => {
    const counts = {
      all: orders.length,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancel: 0,
    };

    orders.forEach((order) => {
      const status = (order.orderStatus || order.status)?.toLowerCase();
      if (counts[status] !== undefined) {
        counts[status]++;
      }
    });

    return counts;
  };

  const orderCounts = getOrderCounts();
  const filteredOrders = getFilteredOrders();

  // Filter options with labels and counts
  const filterOptions = [
    { key: "all", label: "All", count: orderCounts.all },
    { key: "processing", label: "Processing", count: orderCounts.processing },
    { key: "shipped", label: "Shipped", count: orderCounts.shipped },
    { key: "delivered", label: "Delivered", count: orderCounts.delivered },
    { key: "cancel", label: "Cancelled", count: orderCounts.cancel },
  ];

  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case "processing":
        return {
          text: "Processing",
          color: "#3b82f6",
          backgroundColor: "#dbeafe",
        };
      case "shipped":
        return {
          text: "Shipped",
          color: "#8b5cf6",
          backgroundColor: "#e9d5ff",
        };
      case "delivered":
        return {
          text: "Delivered",
          color: "#059669",
          backgroundColor: "#d1fae5",
        };
      case "cancel":
        return {
          text: "Cancelled",
          color: "#ef4444",
          backgroundColor: "#fee2e2",
        };
      default:
        return {
          text: "Unknown",
          color: "#6b7280",
          backgroundColor: "#f3f4f6",
        };
    }
  };

  const getPaymentStatusInfo = (paymentStatus) => {
    switch (paymentStatus?.toLowerCase()) {
      case "pending":
        return {
          text: "Pending",
          color: "#f59e0b",
          backgroundColor: "#fef3c7",
        };
      case "complete":
        return {
          text: "Complete",
          color: "#10b981",
          backgroundColor: "#d1fae5",
        };
      default:
        return {
          text: "Unknown",
          color: "#6b7280",
          backgroundColor: "#f3f4f6",
        };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount) => {
    return amount?.toFixed(2) || "0.00";
  };

  const renderFilterButton = (option) => {
    const isSelected = selectedFilter === option.key;
    return (
      <TouchableOpacity
        key={option.key}
        style={[
          OrdersScreenStyles.filterButton,
          isSelected && OrdersScreenStyles.filterButtonActive,
        ]}
        onPress={() => setSelectedFilter(option.key)}
      >
        <Text
          style={[
            OrdersScreenStyles.filterButtonText,
            isSelected && OrdersScreenStyles.filterButtonTextActive,
          ]}
        >
          {option.label}
        </Text>
        {option.count > 0 && (
          <View
            style={[
              OrdersScreenStyles.filterBadge,
              isSelected && OrdersScreenStyles.filterBadgeActive,
            ]}
          >
            <Text
              style={[
                OrdersScreenStyles.filterBadgeText,
                isSelected && OrdersScreenStyles.filterBadgeTextActive,
              ]}
            >
              {option.count}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderOrderItem = ({ item: order }) => {
    // Use orderStatus instead of status for better compatibility
    const statusInfo = getStatusInfo(order.orderStatus || order.status);
    const paymentStatusInfo = getPaymentStatusInfo(order.paymentStatus);

    return (
      <TouchableOpacity
        style={OrdersScreenStyles.orderCard}
        onPress={() => handleViewOrderDetail(order._id)}
        activeOpacity={0.7}
      >
        <View style={OrdersScreenStyles.orderHeader}>
          <Text style={OrdersScreenStyles.orderIdText}>
            Order #{order._id?.slice(-8) || "N/A"}
          </Text>
          <View style={OrdersScreenStyles.statusContainer}>
            <View
              style={[
                OrdersScreenStyles.statusBadge,
                { backgroundColor: statusInfo.backgroundColor },
              ]}
            >
              <Text
                style={[
                  OrdersScreenStyles.statusText,
                  { color: statusInfo.color },
                ]}
              >
                {statusInfo.text}
              </Text>
            </View>
            <View
              style={[
                OrdersScreenStyles.paymentStatusBadge,
                { backgroundColor: paymentStatusInfo.backgroundColor },
              ]}
            >
              <Text
                style={[
                  OrdersScreenStyles.paymentStatusText,
                  { color: paymentStatusInfo.color },
                ]}
              >
                {paymentStatusInfo.text}
              </Text>
            </View>
          </View>
        </View>

        <View style={OrdersScreenStyles.orderDetails}>
          <Text style={OrdersScreenStyles.dateText}>
            {formatDate(order.createdAt)}
          </Text>

          <View style={OrdersScreenStyles.itemsContainer}>
            <Text style={OrdersScreenStyles.itemsTitle}>Items:</Text>
            {order.orderItems &&
              order.orderItems.slice(0, 2).map((item, index) => (
                <Text key={index} style={OrdersScreenStyles.itemText}>
                  • {item.name} x{item.quantity}
                </Text>
              ))}
            {order.orderItems && order.orderItems.length > 2 && (
              <Text style={OrdersScreenStyles.moreItems}>
                +{order.orderItems.length - 2} more items
              </Text>
            )}
          </View>
        </View>

        <View style={OrdersScreenStyles.amountContainer}>
          <Text style={OrdersScreenStyles.amountLabel}>Total:</Text>
          <Text style={OrdersScreenStyles.amountValue}>
            ${formatAmount(order.totalAmount)}
          </Text>
        </View>

        <View style={OrdersScreenStyles.actionContainer}>
          <TouchableOpacity
            style={OrdersScreenStyles.viewButton}
            onPress={() => handleViewOrderDetail(order._id)}
          >
            <Text style={OrdersScreenStyles.viewButtonText}>View Details</Text>
          </TouchableOpacity>

          {/* Updated condition to match your enum values */}
          {order.paymentStatus === "pending" &&
            order.paymentMethod === "ONLINE" && (
              <TouchableOpacity
                style={OrdersScreenStyles.payButton}
                onPress={() => handlePayment(order)}
              >
                <Text style={OrdersScreenStyles.payButtonText}>Pay Now</Text>
              </TouchableOpacity>
            )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={OrdersScreenStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={OrdersScreenStyles.loadingText}>Loading orders...</Text>
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={OrdersScreenStyles.emptyContainer}>
        <Text style={OrdersScreenStyles.emptyTitle}>No Orders Yet</Text>
        <Text style={OrdersScreenStyles.emptyText}>
          You haven't placed any orders yet. Start shopping to see your orders
          here!
        </Text>
        <TouchableOpacity
          style={OrdersScreenStyles.shopButton}
          onPress={() => navigation.navigate("MainTabs", { screen: "Home" })}
        >
          <Text style={OrdersScreenStyles.shopButtonText}>Start Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={OrdersScreenStyles.container}>
      <View style={OrdersScreenStyles.header}>
        <Text style={OrdersScreenStyles.headerTitle}>My Orders</Text>
        <Text style={OrdersScreenStyles.headerSubtitle}>
          {filteredOrders.length} of {orders.length} order
          {orders.length !== 1 ? "s" : ""}
        </Text>
      </View>

      {/* Filter Buttons */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={OrdersScreenStyles.filterContainer}
        contentContainerStyle={OrdersScreenStyles.filterContent}
      >
        {filterOptions.map(renderFilterButton)}
      </ScrollView>

      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item._id}
        renderItem={renderOrderItem}
        contentContainerStyle={OrdersScreenStyles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={OrdersScreenStyles.emptyFilterContainer}>
            <Text style={OrdersScreenStyles.emptyFilterTitle}>
              No {selectedFilter === "all" ? "" : selectedFilter} orders found
            </Text>
            <Text style={OrdersScreenStyles.emptyFilterText}>
              Try selecting a different filter or check back later.
            </Text>
          </View>
        )}
      />
    </View>
  );
}
