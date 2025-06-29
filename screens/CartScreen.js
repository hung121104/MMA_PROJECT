import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function CartScreen({ navigation }) {
  // Example cart data - replace with your actual cart state
  const [cartItems] = useState([
    { id: 1, name: 'Product 1', price: 1500, quantity: 2 },
    { id: 2, name: 'Product 2', price: 1000, quantity: 1 },
  ]);

  // Calculate total amount
  const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const orderId = `order_${Date.now()}`; // Generate a unique order ID

  const handleProceedToPayment = () => {
    navigation.navigate('Payment', {
      orderId: orderId,
      totalAmount: totalAmount,
    });
  };

  return (
    <View className="flex-1 p-4">
      <Text className="text-2xl font-bold mb-4">Shopping Cart</Text>
      
      {cartItems.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg text-gray-500">Your cart is empty</Text>
        </View>
      ) : (
        <>
          {/* Cart Items */}
          <View className="flex-1">
            {cartItems.map((item) => (
              <View key={item.id} className="bg-white p-4 rounded-lg mb-3 shadow-sm">
                <Text className="text-lg font-semibold">{item.name}</Text>
                <Text className="text-gray-600">Quantity: {item.quantity}</Text>
                <Text className="text-lg font-bold text-blue-600">
                  ${(item.price * item.quantity / 100).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>

          {/* Total and Payment Button */}
          <View className="bg-white p-4 rounded-lg shadow-sm">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold">Total:</Text>
              <Text className="text-xl font-bold text-blue-600">
                ${(totalAmount / 100).toFixed(2)}
              </Text>
            </View>
            
            <TouchableOpacity
              className="bg-blue-600 py-4 px-6 rounded-lg"
              onPress={handleProceedToPayment}
            >
              <Text className="text-white text-center text-lg font-bold">
                Proceed to Payment
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}
