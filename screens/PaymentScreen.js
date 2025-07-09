import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { removeMultipleFromCart } from '../api/cart';
import { createOrder } from '../api/orders';
import PaymentScreenStyles from '../styles/PaymentScreenStyles';

export default function PaymentScreen({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [shippingInfo, setShippingInfo] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [selectedCartItems, setSelectedCartItems] = useState([]);

  // Get selected cart items from route params and store them permanently
  useEffect(() => {
    if (route.params?.selectedCartItems && selectedCartItems.length === 0) {
      setSelectedCartItems(route.params.selectedCartItems);
      console.log('Selected cart items loaded:', route.params.selectedCartItems.length);
    }
  }, [route.params?.selectedCartItems]);

  // Listen for payment data from PaymentMethodScreen
  useEffect(() => {
    if (route.params?.paymentData) {
      const { shippingInfo: newShippingInfo, paymentMethod: newPaymentMethod } = route.params.paymentData;
      setShippingInfo(newShippingInfo);
      setPaymentMethod(newPaymentMethod);
      
      // Clear only the payment data, keep selectedCartItems
      navigation.setParams({ paymentData: undefined });
    }
  }, [route.params?.paymentData]);

  const handleCollectPaymentInfo = () => {
    // Pass selected cart items to PaymentMethodScreen
    navigation.navigate('PaymentMethod', {
      selectedCartItems: selectedCartItems
    });
  };

  const handlePlaceOrder = async () => {
    if (!shippingInfo || !paymentMethod) {
      Alert.alert('Error', 'Please fill in shipping and payment info.');
      return;
    }

    if (selectedCartItems.length === 0) {
      Alert.alert('Error', 'No items selected for order.');
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Build orderItems from selected cart items
      const orderItems = selectedCartItems.map(item => ({
        name: item.product.name,
        price: item.price,
        quantity: item.quantity,
        image: item.product.images && item.product.images[0] ? item.product.images[0].url : '',
        product: item.product._id,
      }));
      
      const selectedTotal = selectedCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // Build order JSON
      const orderData = {
        shippingInfo,
        orderItems,
        paymentMethod,
        itemPrice: selectedTotal,
        tax: Math.round(selectedTotal * 0.1), // 10% tax
        shippingCharges: 20, // You can calculate or set as needed
        totalAmount: selectedTotal + Math.round(selectedTotal * 0.1) + 20,
      };
      
      // Place the order first
      await createOrder(orderData);
      
      // Only after successful order placement, delete selected cart items
      if (selectedCartItems.length > 0) {
        try {
          // Prepare items for bulk deletion
          const itemsToRemove = selectedCartItems.map(item => ({
            productId: item.product._id,
            quantity: item.quantity
          }));
          
          console.log('Items to remove from cart:', itemsToRemove);
          
          // Remove items from cart
          await removeMultipleFromCart(itemsToRemove);
          console.log('Selected cart items removed successfully after order placement');
        } catch (error) {
          console.error('Error removing cart items:', error);
          // Don't fail the order if cart removal fails
          Alert.alert('Warning', 'Order placed successfully but there was an issue clearing your cart.');
        }
      }
      
      Alert.alert('Success', 'Order placed successfully!');
      navigation.navigate('MainTabs', { screen: 'Orders' });
      
    } catch (err) {
      console.error('Order placement error:', err);
      Alert.alert('Error', err?.response?.data?.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={PaymentScreenStyles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={PaymentScreenStyles.container}>
      <Text style={PaymentScreenStyles.title}>Payment</Text>
      
      {/* Selected Items Summary */}
      <Text style={PaymentScreenStyles.label}>Selected Items ({selectedCartItems.length}):</Text>
      {selectedCartItems.map((item, index) => (
        <View key={index} style={PaymentScreenStyles.itemSummary}>
          <Text style={PaymentScreenStyles.itemName}>{item.product.name}</Text>
          <Text style={PaymentScreenStyles.itemDetail}>Qty: {item.quantity} x ${(item.price / 100).toFixed(2)}</Text>
          <Text style={PaymentScreenStyles.itemTotal}>${((item.price * item.quantity) / 100).toFixed(2)}</Text>
        </View>
      ))}
      
      {/* Shipping Info Section */}
      <Text style={PaymentScreenStyles.label}>Shipping Info:</Text>
      {shippingInfo ? (
        <View style={PaymentScreenStyles.infoBox}>
          <Text>Address: {shippingInfo.address}</Text>
          <Text>City: {shippingInfo.city}</Text>
          <Text>Country: {shippingInfo.country}</Text>
        </View>
      ) : (
        <TouchableOpacity style={PaymentScreenStyles.infoButton} onPress={handleCollectPaymentInfo}>
          <Text style={PaymentScreenStyles.infoButtonText}>Enter Shipping & Payment Info</Text>
        </TouchableOpacity>
      )}
      
      <Text style={PaymentScreenStyles.label}>Payment Method: {paymentMethod || '-'}</Text>
      
      <TouchableOpacity
        style={[
          PaymentScreenStyles.submitButton,
          (!shippingInfo || !paymentMethod) && PaymentScreenStyles.submitButtonDisabled
        ]}
        onPress={handlePlaceOrder}
        disabled={submitting || !shippingInfo || !paymentMethod}
      >
        <Text style={PaymentScreenStyles.submitButtonText}>
          {submitting ? 'Placing Order...' : 'Place Order'}
        </Text>
      </TouchableOpacity>
    </View>
  );
} 