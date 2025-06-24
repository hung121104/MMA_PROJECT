import React, { useEffect, useState } from 'react';
import { View, Text, Image, Button, ActivityIndicator } from 'react-native';
import { getProductById } from '../api/products';

export default function ProductDetailScreen({ route }) {
  const { id } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductById(id).then((data) => {
      setProduct(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <ActivityIndicator className="mt-10" size="large" />;
  if (!product) return <Text>Product not found</Text>;

  return (
    <View className="flex-1 p-4 bg-white">
      {product.images && product.images[0] && (
        <Image source={{ uri: product.images[0].url }} style={{ width: '100%', height: 200, resizeMode: 'contain' }} />
      )}
      <Text className="text-2xl font-bold mt-4">{product.name}</Text>
      <Text className="text-lg mt-2">{product.description}</Text>
      <Text className="text-xl font-bold mt-2">${product.price}</Text>
      <Button title="Add to Cart" onPress={() => {}} />
    </View>
  );
} 