import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import PaymentComponent from '../components/PaymentComponent';
import StripeProviderWrapper from '../components/StripeProvider';
import PaymentDebug from '../components/PaymentDebug';
import { API_URL } from '@env';

// Replace this with your actual Stripe publishable key
const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_your_publishable_key_here';

export default function PaymentScreen({ route, navigation }) {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [showDebug, setShowDebug] = useState(false);
  
  // Get order data from route params
  const orderId = route.params?.orderId;
  const totalAmount = route.params?.totalAmount;
  const orderDetails = route.params?.orderDetails || null;

  if (!orderId || !totalAmount) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <Text style={{ fontSize: 18, color: '#333', textAlign: 'center', margin: 24 }}>
          There is no order that needs to be paid at this time.
        </Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ backgroundColor: '#0066cc', padding: 12, borderRadius: 8 }}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const orderData = {
    orderId,
    totalAmount,
    currency: 'usd',
    orderDetails,
  };

  // Handle successful payment
  const handlePaymentSuccess = (paymentIntent) => {
    console.log('Payment successful:', paymentIntent);
    setPaymentStatus('success');
    
    // You can navigate to a success screen or update your app state here
    // Alert.alert(
    //   'Payment Successful!',
    //   `Order ${orderData.orderId} has been paid successfully.`,
    //   [
    //     {
    //       text: 'View Orders',
    //       onPress: () => navigation.navigate('Orders'),
    //     },
    //     {
    //       text: 'Continue Shopping',
    //       onPress: () => navigation.navigate('Home'),
    //     },
    //   ]
    // );
  };

  // Handle payment errors
  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    setPaymentStatus('error');
    
    // You can handle different types of errors here
    Alert.alert(
      'Payment Failed',
      'There was an issue processing your payment. Please try again.',
      [{ text: 'OK' }]
    );
  };

  // Format amount for display
  const formatAmount = (amount) => {
    return (amount / 100).toFixed(2);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Complete Payment</Text>
        <Text style={styles.headerSubtitle}>
          Secure payment powered by Stripe
        </Text>
      </View>

      {/* Order Summary */}
      {orderData.orderDetails && (
        <View style={styles.orderSummary}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          
          <View style={styles.orderInfo}>
            <Text style={styles.orderId}>Order #{orderData.orderId}</Text>
            <Text style={styles.orderDate}>
              Created: {formatDate(orderData.orderDetails.createdAt)}
            </Text>
          </View>

          {orderData.orderDetails.orderItems && orderData.orderDetails.orderItems.length > 0 && (
            <View style={styles.itemsContainer}>
              <Text style={styles.itemsTitle}>Items:</Text>
              {orderData.orderDetails.orderItems.map((item, index) => (
                <View key={index} style={styles.itemRow}>
                  <Text style={styles.itemName}>
                    {item.name}
                  </Text>
                  <Text style={styles.itemQuantity}>
                    x{item.quantity}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total Amount:</Text>
            <Text style={styles.totalAmount}>
              ${formatAmount(orderData.totalAmount)}
            </Text>
          </View>
        </View>
      )}

      <StripeProviderWrapper publishableKey={STRIPE_PUBLISHABLE_KEY}>
        <PaymentComponent
          orderId={orderData.orderId}
          totalAmount={orderData.totalAmount}
          currency={orderData.currency}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
          apiBaseUrl={API_URL} // Use the actual API URL from environment
          navigation={navigation} // Pass navigation for redirecting after payment
        />
      </StripeProviderWrapper>

      {paymentStatus && (
        <View style={styles.statusContainer}>
          <Text style={[
            styles.statusText,
            paymentStatus === 'success' ? styles.successText : styles.errorText
          ]}>
            Payment Status: {paymentStatus === 'success' ? 'Success' : 'Failed'}
          </Text>
        </View>
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Test Card Information</Text>
        <Text style={styles.infoText}>
          Use these test card numbers for testing:
        </Text>
        <Text style={styles.cardNumber}>• 4242 4242 4242 4242 (Visa)</Text>
        <Text style={styles.cardNumber}>• 4000 0000 0000 0002 (Visa - declined)</Text>
        <Text style={styles.cardNumber}>• Any future date for expiry</Text>
        <Text style={styles.cardNumber}>• Any 3-digit CVC</Text>
      </View>

      {/* Debug Section - Remove this after fixing the issue */}
      <View style={styles.debugSection}>
        <TouchableOpacity
          style={styles.debugToggle}
          onPress={() => setShowDebug(!showDebug)}
        >
          <Text style={styles.debugToggleText}>
            {showDebug ? 'Hide Debug' : 'Show Debug Tool'}
          </Text>
        </TouchableOpacity>
        
        {showDebug && (
          <PaymentDebug
            orderId={orderData.orderId}
            totalAmount={orderData.totalAmount}
          />
        )}
      </View>
    </ScrollView>
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
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  orderSummary: {
    margin: 16,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  orderInfo: {
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: '#666666',
  },
  itemsContainer: {
    marginBottom: 12,
  },
  itemsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '600',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0066cc',
  },
  statusContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  successText: {
    color: '#28a745',
  },
  errorText: {
    color: '#dc3545',
  },
  infoContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  cardNumber: {
    fontSize: 14,
    color: '#333333',
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  debugSection: {
    margin: 16,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  debugToggle: {
    padding: 12,
    backgroundColor: '#0066cc',
    borderRadius: 8,
    marginBottom: 12,
  },
  debugToggleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
}); 