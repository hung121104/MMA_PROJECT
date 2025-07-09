import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { removeMultipleFromCart } from '../api/cart';

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
    <View style={styles.container}>
      <Text style={styles.title}>Shipping Information</Text>
      
      {/* Show selected items count */}
      <Text style={styles.selectedItemsText}>
        Selected Items: {selectedCartItems.length}
      </Text>
      
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="City"
        value={city}
        onChangeText={setCity}
      />
      <TextInput
        style={styles.input}
        placeholder="Country"
        value={country}
        onChangeText={setCountry}
      />
      <Text style={styles.title}>Payment Method</Text>
      {/* Use Picker for payment method selection */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={paymentMethod}
          style={styles.picker}
          onValueChange={(itemValue) => setPaymentMethod(itemValue)}
        >
          <Picker.Item label="Cash on Delivery (COD)" value="COD" />
          <Picker.Item label="Online Payment" value="ONLINE" />
        </Picker>
      </View>
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={submitting}
      >
        <Text style={styles.submitButtonText}>
          {submitting ? 'Preparing Order...' : 'Continue to Payment'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 16,
  },
  selectedItemsText: {
    fontSize: 16,
    color: '#2563eb',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 24,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  submitButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 