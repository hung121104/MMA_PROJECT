import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getAllProducts } from '../api/products';
import ProductCard from '../components/ProductCard';

export default function ProductListScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <ActivityIndicator className="mt-10" size="large" />;

  return (
    <View className="flex-1 p-4 bg-gray-100">
      <Text className="text-xl font-bold mb-4">Products</Text>
      <FlatList
        data={products}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('ProductDetail', { id: item._id })}>
            <ProductCard product={item} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
} 