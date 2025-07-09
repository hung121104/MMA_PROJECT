import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { getProductById } from '../api/products';
import OptimizedImage from '../components/OptimizedImage';
import { addToCart } from '../api/cart';

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
    <View style={styles.container}>
      {product.images && product.images[0] && (
        <OptimizedImage
          source={product.images[0].url}
          style={styles.image}
          width={400}
          height={300}
          quality="85"
          fallbackText="Product Image"
        />
      )}
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.description}>{product.description}</Text>
      <Text style={styles.price}>${product.price}</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#6b7280' }]}
          onPress={handleAddToCart}
          disabled={adding}
        >
          <Text style={styles.buttonText}>{adding ? 'Adding...' : 'Add to Cart'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#2563eb' }]}
          onPress={handleBuyNow}
        >
          <Text style={styles.buttonText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 