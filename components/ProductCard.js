import React from 'react';
import { View, Text, Image } from 'react-native';

export default function ProductCard({ product }) {
  return (
    <View className="mb-2 p-4 bg-white rounded shadow flex-row items-center">
      {product.images && product.images[0] && (
        <Image source={{ uri: product.images[0].url }} style={{ width: 60, height: 60, marginRight: 12, borderRadius: 8 }} />
      )}
      <View>
        <Text className="text-lg font-bold">{product.name}</Text>
        <Text>${product.price}</Text>
      </View>
    </View>
  );
} 