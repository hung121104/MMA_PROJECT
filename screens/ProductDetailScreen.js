import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { getProductById } from '../api/products';
import OptimizedImage from '../components/OptimizedImage';
import { addToCart } from '../api/cart';
import ProductDetailScreenStyles from '../styles/ProductDetailScreenStyles';

export default function ProductDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

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

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    try {
      await addToCart(product._id, 1);
      Alert.alert('Success', 'Product added to cart!');
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} size="large" />;
  if (!product) return <Text>Product not found</Text>;

  return (
    <View style={ProductDetailScreenStyles.container}>
      {product.images && product.images[0] && (
        <OptimizedImage
          source={product.images[0].url}
          style={ProductDetailScreenStyles.image}
          width={400}
          height={300}
          quality="85"
          fallbackText="Product Image"
        />
      )}
      <Text style={ProductDetailScreenStyles.title}>{product.name}</Text>
      <Text style={ProductDetailScreenStyles.description}>{product.description}</Text>
      <Text style={ProductDetailScreenStyles.price}>${product.price}</Text>

      <View style={ProductDetailScreenStyles.buttonRow}>
        <TouchableOpacity
          style={[ProductDetailScreenStyles.button, { backgroundColor: '#6b7280' }]}
          onPress={handleAddToCart}
          disabled={adding}
        >
          <Text style={ProductDetailScreenStyles.buttonText}>{adding ? 'Adding...' : 'Add to Cart'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[ProductDetailScreenStyles.button, { backgroundColor: '#2563eb' }]}
          onPress={handleBuyNow}
        >
          <Text style={ProductDetailScreenStyles.buttonText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} 