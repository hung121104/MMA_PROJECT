import React from 'react';
import { View, StyleSheet } from 'react-native';
import PaymentComponent from '../components/PaymentWithStripe';

export default function PaymentComponentScreen({ navigation, route }) {
  const { orderId, totalAmount, orderDetails } = route.params || {};

  const handlePaymentSuccess = () => {
    // Navigate back to Orders screen after successful payment
    navigation.navigate('MainTabs', { screen: 'Orders' });
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    // You can show an alert or handle the error as needed
  };

  return (
    <View style={styles.container}>
      <PaymentComponent
        orderId={orderId}
        totalAmount={totalAmount}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentError={handlePaymentError}
        navigation={navigation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
}); 