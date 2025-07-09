import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getMyOrders } from '../api/orders';
import OrdersScreenStyles from '../styles/OrdersScreenStyles';

export default function OrdersScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = async () => {
    try {
      const ordersData = await getMyOrders();
      setOrders(ordersData);
    } catch (error) {
      console.error('Error loading orders:', error);
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
    const orderId = `order_${Date.now()}`;
    const totalAmount = Math.round(order.totalAmount * 100); // Convert to cents
    navigation.navigate('Payment', {
      orderId: orderId,
      totalAmount: totalAmount,
    });
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return { text: 'Pending', color: '#f59e0b', backgroundColor: '#fef3c7' };
      case 'processing':
        return { text: 'Processing', color: '#3b82f6', backgroundColor: '#dbeafe' };
      case 'shipped':
        return { text: 'Shipped', color: '#10b981', backgroundColor: '#d1fae5' };
      case 'delivered':
        return { text: 'Delivered', color: '#059669', backgroundColor: '#d1fae5' };
      case 'cancelled':
        return { text: 'Cancelled', color: '#ef4444', backgroundColor: '#fee2e2' };
      default:
        return { text: 'Unknown', color: '#6b7280', backgroundColor: '#f3f4f6' };
    }
  };

  const getPaymentStatusInfo = (paymentStatus) => {
    switch (paymentStatus) {
      case 'pending':
        return { text: 'Pending', color: '#f59e0b', backgroundColor: '#fef3c7' };
      case 'paid':
        return { text: 'Paid', color: '#10b981', backgroundColor: '#d1fae5' };
      case 'failed':
        return { text: 'Failed', color: '#ef4444', backgroundColor: '#fee2e2' };
      case 'refunded':
        return { text: 'Refunded', color: '#6b7280', backgroundColor: '#f3f4f6' };
      default:
        return { text: 'Unknown', color: '#6b7280', backgroundColor: '#f3f4f6' };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAmount = (amount) => {
    return (amount / 100).toFixed(2);
  };

  const renderOrderItem = ({ item: order }) => {
    const statusInfo = getStatusInfo(order.status);
    const paymentStatusInfo = getPaymentStatusInfo(order.paymentStatus);

    return (
      <View style={OrdersScreenStyles.orderCard}>
        <View style={OrdersScreenStyles.orderHeader}>
          <Text style={OrdersScreenStyles.orderId}>Order #{order._id.slice(-8)}</Text>
          <View style={OrdersScreenStyles.statusContainer}>
            <View style={[OrdersScreenStyles.statusBadge, { backgroundColor: statusInfo.backgroundColor }]}>
              <Text style={[OrdersScreenStyles.statusText, { color: statusInfo.color }]}>
                {statusInfo.text}
              </Text>
            </View>
            <View style={[OrdersScreenStyles.paymentStatusBadge, { backgroundColor: paymentStatusInfo.backgroundColor }]}>
              <Text style={[OrdersScreenStyles.paymentStatusText, { color: paymentStatusInfo.color }]}>
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
            {order.orderItems && order.orderItems.slice(0, 2).map((item, index) => (
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
          <Text style={OrdersScreenStyles.amountValue}>${formatAmount(order.totalAmount)}</Text>
        </View>

        <View style={OrdersScreenStyles.actionContainer}>
          <TouchableOpacity style={OrdersScreenStyles.viewButton}>
            <Text style={OrdersScreenStyles.viewButtonText}>View Details</Text>
          </TouchableOpacity>
          
          {order.paymentStatus === 'pending' && (
            <TouchableOpacity 
              style={OrdersScreenStyles.payButton}
              onPress={() => handlePayment(order)}
            >
              <Text style={OrdersScreenStyles.payButtonText}>Pay Now</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
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
          You haven't placed any orders yet. Start shopping to see your orders here!
        </Text>
        <TouchableOpacity 
          style={OrdersScreenStyles.shopButton}
          onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}
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
          {orders.length} order{orders.length !== 1 ? 's' : ''}
        </Text>
      </View>
      
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={renderOrderItem}
        contentContainerStyle={OrdersScreenStyles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}