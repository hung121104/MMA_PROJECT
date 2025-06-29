import React from 'react';
import { View, Text } from 'react-native';
import OptimizedImage from './OptimizedImage';

export default function ProductCard({ product }) {
  return (
    <View className="mb-2 p-4 bg-white rounded shadow flex-row items-center">
      {product.images && product.images[0] && (
        <OptimizedImage 
          source={product.images[0].url} 
          style={{ width: 60, height: 60, marginRight: 12, borderRadius: 8 }}
          width={120}
          height={120}
          quality="80"
          fallbackText="Product"
        />
      )}
      <View>
        <Text className="text-lg font-bold">{product.name}</Text>
        <Text>${product.price}</Text>
      </View>
    </View>
  );
} 