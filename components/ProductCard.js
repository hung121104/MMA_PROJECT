import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import OptimizedImage from "./OptimizedImage";

const CARD_MARGIN = 8;
const CARD_WIDTH = Dimensions.get("window").width / 2 - CARD_MARGIN * 2;

export default function ProductCard({ product }) {
  // Helper to render stars
  const renderStars = () => {
    const stars = [];
    const rating = Math.round(product.rating || 0);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesome
          key={i}
          name={i <= rating ? "star" : "star-o"}
          size={16}
          color="#FFD700"
          style={{ marginRight: 2 }}
        />
      );
    }
    return stars;
  };

  const isOutOfStock = !product.stock || product.stock <= 0;

  return (
    <View style={styles.card}>
      {product.images && product.images[0] && (
        <View style={styles.imageContainer}>
          <OptimizedImage
            source={{ uri: product.images[0].url }}
            style={[styles.image, isOutOfStock && styles.imageOutOfStock]}
            width={180}
            height={120}
            quality="80"
            fallbackText="Product"
          />
          {isOutOfStock && (
            <View style={styles.outOfStockOverlay}>
              <Text style={styles.outOfStockText}>Out of Stock</Text>
            </View>
          )}
        </View>
      )}
      <View style={[styles.content, isOutOfStock && styles.contentOutOfStock]}>
        {/* Title */}
        <Text
          style={[styles.title, isOutOfStock && styles.textOutOfStock]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {product.name || ""}
        </Text>
        {/* Description (always reserve 2 lines) */}
        <Text
          style={[styles.description, isOutOfStock && styles.textOutOfStock]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {product.description || " "}
        </Text>
        {/* Price Row (always reserve space) */}
        <View style={styles.priceRow}>
          <Text style={[styles.price, isOutOfStock && styles.textOutOfStock]}>
            {product.price ? `$${product.price}` : " "}
          </Text>
        </View>
        {/* Rating and review count (always reserve space) */}
        <View style={styles.ratingRow}>
          {/* {renderStars()} */}
          {/* <Text
            style={[styles.reviewCount, isOutOfStock && styles.textOutOfStock]}
          >
            {product.numReviews !== undefined ? product.numReviews : " "}
          </Text> */}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    // margin: CARD_MARGIN,
    width: CARD_WIDTH,
    height: 250,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 120,
  },
  image: {
    width: "100%",
    height: 120,
  },
  imageOutOfStock: {
    opacity: 0.5,
  },
  outOfStockOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(128, 128, 128, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  outOfStockText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  content: {
    padding: 12,
    flex: 1,
    justifyContent: "flex-start",
  },
  contentOutOfStock: {
    opacity: 0.6,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#222",
    marginBottom: 2,
    height: 22, // 1 line
  },
  description: {
    color: "#888",
    fontSize: 13,
    marginBottom: 4,
    height: 36, // 2 lines
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    height: 20, // fixed height for price row
  },
  price: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#222",
    marginRight: 6,
  },
  oldPrice: {
    fontSize: 14,
    color: "#888",
    textDecorationLine: "line-through",
    marginRight: 6,
  },
  discount: {
    fontSize: 14,
    color: "#f77c2a",
    fontWeight: "bold",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    height: 20, // fixed height for rating row
  },
  reviewCount: {
    fontSize: 13,
    color: "#888",
    marginLeft: 6,
  },
  textOutOfStock: {
    color: "#999",
  },
});
