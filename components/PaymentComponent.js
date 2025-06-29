import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Modal,
} from 'react-native';
import {
  CardField,
  useStripe,
  useConfirmPayment,
} from '@stripe/stripe-react-native';
import axios from 'axios';
import { getToken } from '../api/users';
import { updatePaymentStatus } from '../api/orders';

/**
 * PaymentComponent - A React Native component for processing Stripe payments
 * 
 * @param {string} orderId - The ID of the order to be paid
 * @param {number} totalAmount - The total amount to be charged (in cents)
 * @param {string} currency - The currency code (default: 'usd')
 * @param {function} onPaymentSuccess - Callback function called when payment succeeds
 * @param {function} onPaymentError - Callback function called when payment fails
 * @param {string} apiBaseUrl - Base URL for your backend API (default: 'http://localhost:3000')
 * @param {object} navigation - Navigation object for redirecting after payment
 */
const PaymentComponent = ({
  orderId,
  totalAmount,
  currency = 'usd',
  onPaymentSuccess,
  onPaymentError,
  apiBaseUrl = 'http://localhost:3000',
  navigation,
}) => {
  const { confirmPayment } = useConfirmPayment();
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState(null);
  const [error, setError] = useState(null);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  // Step 1: Get the client secret from your backend
  useEffect(() => {
    const getClientSecret = async () => {
      if (!orderId || !totalAmount) {
        setError('Order ID and total amount are required');
        return;
      }

      // Don't get client secret if payment is already completed
      if (paymentCompleted) {
        return;
      }

      // Don't get client secret if we already have one
      if (clientSecret) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Get the authentication token
        const token = await getToken();
        if (!token) {
          throw new Error('Authentication token not found. Please login again.');
        }
        
        const response = await axios.post(`${apiBaseUrl}/order/payments`, {
          orderId,
          totalAmount,
          currency,
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.data && response.data.client_secret) {
          setClientSecret(response.data.client_secret);
        } else {
          throw new Error(`Invalid response from server. Expected client_secret, got: ${JSON.stringify(response.data)}`);
        }
      } catch (err) {
        if (err.response?.status === 401) {
          setError('Authentication failed. Please login again.');
        } else if (err.response?.data) {
          setError(`Server error: ${err.response.data.message || JSON.stringify(err.response.data)}`);
        } else if (err.message) {
          setError(`Network error: ${err.message}`);
        } else {
          setError('Failed to initialize payment. Please check your connection.');
        }
        
        if (onPaymentError) {
          onPaymentError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    getClientSecret();
  }, [orderId, totalAmount, currency, apiBaseUrl, paymentCompleted]);

  // Step 2: Handle payment confirmation
  const handlePayment = async () => {
    if (!clientSecret || !cardDetails?.complete) {
      setError('Please complete your card details');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Step 3: Confirm the payment with Stripe
      const { error: paymentError, paymentIntent } = await confirmPayment(
        clientSecret,
        {
          paymentMethodType: 'Card',
          paymentMethodData: {
            billingDetails: {
              // You can add billing details here if needed
              // email: 'customer@example.com',
              // name: 'Customer Name',
            },
          },
        }
      );

      if (paymentError) {
        setError(paymentError.message || 'Payment failed');
        if (onPaymentError) {
          onPaymentError(paymentError);
        }
      } else if (paymentIntent) {
        // Mark payment as completed
        setPaymentCompleted(true);
        
        // Step 4: Update payment status in your backend
        try {
          await updatePaymentStatus(orderId, paymentIntent.id);
        } catch (updateError) {
          // Don't fail the payment if status update fails
          // Payment was successful, just status update failed
        }
        
        setError(null);
        if (onPaymentSuccess) {
          onPaymentSuccess(paymentIntent);
        }
        
        // Show success alert
        Alert.alert(
          'Payment Successful!',
          'Your payment has been processed successfully!',
          [
            {
              text: 'View Orders',
              onPress: () => {
                if (navigation) {
                  navigation.navigate('Orders');
                }
              },
            },
            {
              text: 'Continue Shopping',
              onPress: () => {
                if (navigation) {
                  navigation.navigate('Home');
                }
              },
            },
          ]
        );
      } else {
        setError('Payment processing failed. Please try again.');
      }
    } catch (err) {
      setError('Payment processing failed. Please try again.');
      if (onPaymentError) {
        onPaymentError(err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Format amount for display (convert from dollars to display format)
  const formatAmount = (amount) => {
    return amount.toFixed(2);
  };

  if (loading && !clientSecret) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Initializing payment...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Details</Text>
      
      <View style={styles.orderInfo}>
        <Text style={styles.orderText}>Order ID: {orderId}</Text>
        <Text style={styles.amountText}>
          Total Amount: ${formatAmount(totalAmount)}
        </Text>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.cardContainer}>
        <Text style={styles.label}>Card Information</Text>
        <CardField
          postalCodeEnabled={false}
          placeholder={{
            number: '4242 4242 4242 4242',
          }}
          cardStyle={styles.cardField}
          style={styles.cardFieldContainer}
          onCardChange={(cardDetails) => {
            setCardDetails(cardDetails);
            setError(null); 
          }}
        />
      </View>

      <TouchableOpacity
        style={[
          styles.payButton,
          (!cardDetails?.complete || loading) && styles.payButtonDisabled,
        ]}
        onPress={handlePayment}
        disabled={!cardDetails?.complete || loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={styles.payButtonText}>
            Pay ${formatAmount(totalAmount)}
          </Text>
        )}
      </TouchableOpacity>

      <Text style={styles.disclaimer}>
        Your payment information is secure and encrypted by Stripe.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    margin: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333333',
  },
  orderInfo: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  orderText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 4,
  },
  amountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  errorContainer: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  errorText: {
    color: '#721c24',
    fontSize: 14,
  },
  cardContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333333',
  },
  cardFieldContainer: {
    height: 50,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  cardField: {
    backgroundColor: '#ffffff',
    textColor: '#333333',
  },
  payButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  payButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  payButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disclaimer: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
});

export default PaymentComponent; 