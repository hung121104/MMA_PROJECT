import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import OrdersPaymentInfoScreenStyles from '../styles/OrdersPaymentInfoScreenStyles';

export default function PaymentMethodScreen({ navigation, route }) {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('Vietnam');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [submitting, setSubmitting] = useState(false);

  // Get selected cart items from route params
  const selectedCartItems = route.params?.selectedCartItems || [];

  const handleSubmit = async () => {
    if (!address || !city || !country) {
      Alert.alert('Error', 'Please fill in all shipping fields.');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const data = {
        shippingInfo: { address, city, country },
        paymentMethod,
      };
      
      // Pass data back through navigation params, including selected cart items
      navigation.navigate({
        name: 'Payment',
        params: { 
          paymentData: data,
          selectedCartItems: selectedCartItems // Pass selected cart items back
        },
        merge: true,
      });
      
    } catch (error) {
      console.error('Error preparing order:', error);
      Alert.alert('Error', 'Failed to prepare order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={OrdersPaymentInfoScreenStyles.container}>
      <Text style={OrdersPaymentInfoScreenStyles.title}>Shipping Information</Text>
      
      {/* Show selected items count */}
      <Text style={OrdersPaymentInfoScreenStyles.selectedItemsText}>
        Selected Items: {selectedCartItems.length}
      </Text>
      
      <TextInput
        style={OrdersPaymentInfoScreenStyles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={OrdersPaymentInfoScreenStyles.input}
        placeholder="City"
        value={city}
        onChangeText={setCity}
      />
      <TextInput
        style={OrdersPaymentInfoScreenStyles.input}
        placeholder="Country"
        value={country}
        onChangeText={setCountry}
      />
      <Text style={OrdersPaymentInfoScreenStyles.title}>Payment Method</Text>
      {/* Use Picker for payment method selection */}
      <View style={OrdersPaymentInfoScreenStyles.pickerContainer}>
        <Picker
          selectedValue={paymentMethod}
          style={OrdersPaymentInfoScreenStyles.picker}
          onValueChange={(itemValue) => setPaymentMethod(itemValue)}
        >
          <Picker.Item label="Cash on Delivery (COD)" value="COD" />
          <Picker.Item label="Online Payment" value="ONLINE" />
        </Picker>
      </View>
      <TouchableOpacity
        style={OrdersPaymentInfoScreenStyles.submitButton}
        onPress={handleSubmit}
        disabled={submitting}
      >
        <Text style={OrdersPaymentInfoScreenStyles.submitButtonText}>
          {submitting ? 'Preparing Order...' : 'Continue to Payment'}
        </Text>
      </TouchableOpacity>
    </View>
  );
} 