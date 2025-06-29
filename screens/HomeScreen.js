import React from 'react';
import { View, Text, Button, ScrollView } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView className="flex-1 p-4 bg-gray-100">
      <Text className="text-2xl font-bold mb-4">Welcome to SDN E-Commerce</Text>
      <Button title="Browse Products" onPress={() => navigation.navigate('ProductList')} />
      <Button title="Categories" onPress={() => navigation.navigate('Categories')} />
      <Button title="Cart" onPress={() => navigation.navigate('Cart')} />
      <Button title="Orders" onPress={() => navigation.navigate('Orders')} />
      <Button title="Profile" onPress={() => navigation.navigate('Profile')} />
      <Button title="Payment" onPress={() => navigation.navigate('Payment')} />
    </ScrollView>
  );
}
