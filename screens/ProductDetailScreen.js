import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getProductById } from '../api/products';
import OptimizedImage from '../components/OptimizedImage';

export default function ProductDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductById(id).then((data) => {
      setProduct(data);
      setLoading(false);
    });
  }, [id]);

  const handleBuyNow = () => {
    const orderId = `order_${Date.now()}`;
    const totalAmount = Math.round(product.price * 100); // Convert to cents
    
    navigation.navigate('Payment', {
      orderId: orderId,
      totalAmount: totalAmount,
    });
  };

  if (loading) return <ActivityIndicator className="mt-10" size="large" />;
  if (!product) return <Text>Product not found</Text>;

  return (
    <View className="flex-1 p-4 bg-white">
      {product.images && product.images[0] && (
        <OptimizedImage 
          source={product.images[0].url} 
          style={{ width: '100%', height: 200, resizeMode: 'contain' }}
          width={400}
          height={300}
          quality="85"
          fallbackText="Product Image"
        />
      )}
      <Text className="text-2xl font-bold mt-4">{product.name}</Text>
      <Text className="text-lg mt-2">{product.description}</Text>
      <Text className="text-xl font-bold mt-2">${product.price}</Text>
      
      <View className="flex-row space-x-4 mt-4">
        <TouchableOpacity 
          className="flex-1 bg-gray-500 py-3 px-4 rounded-lg"
          onPress={() => {}}
        >
          <Text className="text-white text-center font-bold">Add to Cart</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="flex-1 bg-blue-600 py-3 px-4 rounded-lg"
          onPress={handleBuyNow}
        >
          <Text className="text-white text-center font-bold">Buy Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} 