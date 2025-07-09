import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  StyleSheet,
} from 'react-native';
import { getMyOrders } from '../api/orders';

export default function OrdersScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load orders on component mount
  useEffect(() => {
    loadOrders();
  }, []);

  // Fetch orders from API
  const loadOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await getMyOrders();
      setOrders(ordersData || []);
    } catch (error) {
      console.error('Error loading orders:', error);
      Alert.alert('Error', 'Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  // Navigate to payment for a specific order
  const handlePayment = (order) => {
    if (!order.totalAmount) {
      Alert.alert('Error', 'Order amount not available');
      return;
    }

    // Send the original amount to backend (backend will handle conversion if needed)
    // Your backend stores amounts in dollars, so send as is
    const totalAmount = order.totalAmount;

    navigation.navigate('PaymentComponent', {
      orderId: order.id || order._id,
      totalAmount: totalAmount,
      orderDetails: order,
    });
  };

  // Get status color and text
  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case 'processing':
        return { color: '#f39c12', text: 'Processing' };
      case 'shipped':
        return { color: '#3498db', text: 'Shipped' };
      case 'delivered':
        return { color: '#27ae60', text: 'Delivered' };
      case 'cancel':
      case 'cancelled':
        return { color: '#e74c3c', text: 'Cancelled' };
      case 'pending':
      case 'unpaid':
        return { color: '#f39c12', text: 'Pending Payment' };
      case 'paid':
      case 'completed':
        return { color: '#27ae60', text: 'Paid' };
      default:
        return { color: '#95a5a6', text: status || 'Unknown' };
    }
  };

  // Get payment status color and text
  const getPaymentStatusInfo = (paymentStatus) => {
    switch (paymentStatus?.toLowerCase()) {
      case 'pending':
      case 'unpaid':
        return { color: '#f39c12', text: 'Payment Pending' };
      case 'paid':
      case 'completed':
        return { color: '#27ae60', text: 'Payment Completed' };
      case 'failed':
        return { color: '#e74c3c', text: 'Payment Failed' };
      case 'refunded':
        return { color: '#9b59b6', text: 'Payment Refunded' };
      default:
        return { color: '#95a5a6', text: paymentStatus || 'Unknown' };
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Format amount - your backend stores amounts in dollars, so display as is
  const formatAmount = (amount) => {
    if (!amount) return '$0.00';
    const numAmount = typeof amount === 'number' ? amount : parseFloat(amount);
    return `$${numAmount.toFixed(2)}`;
  };

  // Render individual order item
  const renderOrderItem = ({ item: order }) => {
    const orderStatusInfo = getStatusInfo(order.orderStatus || order.status);
    const paymentStatusInfo = getPaymentStatusInfo(order.paymentStatus);
    
    // Show payment button for orders that need payment
    const needsPayment = order.paymentStatus?.toLowerCase() === 'pending' || 
                        order.paymentStatus?.toLowerCase() === 'unpaid' ||
                        !order.paymentStatus; // If no payment status, assume unpaid

    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <Text style={styles.orderId}>Order #{order.id || order._id}</Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, { backgroundColor: orderStatusInfo.color }]}>
              <Text style={styles.statusText}>{orderStatusInfo.text}</Text>
            </View>
            {order.paymentStatus && (
              <View style={[styles.paymentStatusBadge, { backgroundColor: paymentStatusInfo.color }]}>
                <Text style={styles.paymentStatusText}>{paymentStatusInfo.text}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.orderDetails}>
          <Text style={styles.dateText}>
            Created: {formatDate(order.createdAt)}
          </Text>
          
          {order.updatedAt && order.updatedAt !== order.createdAt && (
            <Text style={styles.dateText}>
              Updated: {formatDate(order.updatedAt)}
            </Text>
          )}

          {order.orderItems && order.orderItems.length > 0 && (
            <View style={styles.itemsContainer}>
              <Text style={styles.itemsTitle}>Items:</Text>
              {order.orderItems.slice(0, 3).map((item, index) => (
                <Text key={index} style={styles.itemText}>
                  • {item.name} x{item.quantity}
                </Text>
              ))}
              {order.orderItems.length > 3 && (
                <Text style={styles.moreItems}>
                  +{order.orderItems.length - 3} more items
                </Text>
              )}
            </View>
          )}

          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Total Amount:</Text>
            <Text style={styles.amountValue}>
              {formatAmount(order.totalAmount)}
            </Text>
          </View>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => {
              // Navigate to order details (you can create this screen later)
              Alert.alert('Order Details', `Order ID: ${order.id || order._id}`);
            }}
          >
            <Text style={styles.viewButtonText}>View Details</Text>
          </TouchableOpacity>

          {needsPayment && (
            <TouchableOpacity
              style={styles.payButton}
              onPress={() => handlePayment(order)}
            >
              <Text style={styles.payButtonText}>Pay Now</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  // Loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Loading your orders...</Text>
      </View>
    );
  }

  // Empty state
  if (orders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No Orders Yet</Text>
        <Text style={styles.emptyText}>
          You haven't placed any orders yet. Start shopping to see your orders here!
        </Text>
        <TouchableOpacity
          style={styles.shopButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.shopButtonText}>Start Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
        <Text style={styles.headerSubtitle}>
          {orders.length} order{orders.length !== 1 ? 's' : ''} found
        </Text>
      </View>

      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id || item._id || Math.random().toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666666',
  },
  listContainer: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  paymentStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 8,
  },
  paymentStatusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  orderDetails: {
    marginBottom: 16,
  },
  dateText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  itemsContainer: {
    marginTop: 8,
  },
  itemsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  itemText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  moreItems: {
    fontSize: 14,
    color: '#0066cc',
    fontStyle: 'italic',
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  amountLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  amountValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0066cc',
  },
  actionContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  viewButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  viewButtonText: {
    color: '#333333',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  payButton: {
    flex: 1,
    backgroundColor: '#0066cc',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  payButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#f5f5f5',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  shopButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  shopButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});