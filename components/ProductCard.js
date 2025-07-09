import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import OptimizedImage from './OptimizedImage';

export default function ProductCard({ product }) {
  // Helper to render stars
  const renderStars = () => {
    const stars = [];
    const rating = Math.round(product.rating || 0);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesome
          key={i}
          name={i <= rating ? 'star' : 'star-o'}
          size={16}
          color="#FFD700"
          style={{ marginRight: 2 }}
        />
      );
    }
    return stars;
  };

  return (
    <View style={styles.card}>
      {product.images && product.images[0] && (
        <OptimizedImage
          source={{ uri: product.images[0].url }}
          style={styles.image}
          width={180}
          height={120}
          quality="80"
          fallbackText="Product"
        />
      )}
      <View style={styles.content}>
        {/* Title */}
        <Text
          style={styles.title}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {product.name || ''}
        </Text>
        {/* Description (always reserve 2 lines) */}
        <Text
          style={styles.description}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {product.description || ' '}
        </Text>
        {/* Price Row (always reserve space) */}
        <View style={styles.priceRow}>
          <Text style={styles.price}>
            {product.price ? `$${product.price}` : ' '}
          </Text>
        </View>
        {/* Rating and review count (always reserve space) */}
        <View style={styles.ratingRow}>
          {renderStars()}
          <Text style={styles.reviewCount}>
            {product.numReviews !== undefined ? product.numReviews : ' '}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    margin: 3,
    width: 180,
    height: 250,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: '100%',
    height: 120,
  },
  content: {
    padding: 12,
    flex: 1,
    justifyContent: 'flex-start',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
    marginBottom: 2,
    height: 22, // 1 line
  },
  description: {
    color: '#888',
    fontSize: 13,
    marginBottom: 4,
    height: 36, // 2 lines
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    height: 20, // fixed height for price row
  },
  price: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
    marginRight: 6,
  },
  oldPrice: {
    fontSize: 14,
    color: '#888',
    textDecorationLine: 'line-through',
    marginRight: 6,
  },
  discount: {
    fontSize: 14,
    color: '#f77c2a',
    fontWeight: 'bold',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    height: 20, // fixed height for rating row
  },
  reviewCount: {
    fontSize: 13,
    color: '#888',
    marginLeft: 6,
  },
}); 