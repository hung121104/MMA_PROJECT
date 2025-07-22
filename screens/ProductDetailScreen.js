import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { getProductById } from "../api/products";
import OptimizedImage from "../components/OptimizedImage";
import { addToCart } from "../api/cart";
import ProductDetailScreenStyles from "../styles/ProductDetailScreenStyles";

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
    if (!product) return;

    // Check if product is in stock
    if (!product.stock || product.stock <= 0) {
      Alert.alert("Out of Stock", "This product is currently out of stock.");
      return;
    }

    // Create order item for single product purchase
    const orderItem = {
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images && product.images[0] ? product.images[0].url : null,
    };

    // Calculate totals
    const itemPrice = product.price * 1; // quantity is 1
    const tax = 0; // 10% tax
    const shippingCharges = 0; // Fixed shipping
    const totalAmount = itemPrice + tax + shippingCharges;

    // Navigate to payment with complete order data
    navigation.navigate("Payment", {
      orderItems: [orderItem],
      itemPrice: itemPrice,
      tax: tax,
      shippingCharges: shippingCharges,
      totalAmount: totalAmount,
      fromBuyNow: true, // Flag to indicate this is from Buy Now
    });
  };

  const handleAddToCart = async () => {
    if (!product) return;

    // Check if product is in stock
    if (!product.stock || product.stock <= 0) {
      Alert.alert("Out of Stock", "This product is currently out of stock.");
      return;
    }

    setAdding(true);
    try {
      await addToCart(product._id, 1);
      Alert.alert("Success", "Product added to cart!");
    } catch (err) {
      Alert.alert(
        "Error",
        err?.response?.data?.message || "Failed to add to cart"
      );
    } finally {
      setAdding(false);
    }
  };

  if (loading)
    return <ActivityIndicator style={{ marginTop: 40 }} size="large" />;
  if (!product) return <Text>Product not found</Text>;

  const isOutOfStock = !product.stock || product.stock <= 0;

  return (
    <View style={ProductDetailScreenStyles.container}>
      {product.images && product.images[0] && (
        <View style={ProductDetailScreenStyles.imageContainer}>
          <OptimizedImage
            source={product.images[0].url}
            style={[
              ProductDetailScreenStyles.image,
              isOutOfStock && ProductDetailScreenStyles.imageOutOfStock,
            ]}
            width={400}
            height={300}
            quality="85"
            fallbackText="Product Image"
          />
          {isOutOfStock && (
            <View style={ProductDetailScreenStyles.outOfStockOverlay}>
              <Text style={ProductDetailScreenStyles.outOfStockText}>
                Out of Stock
              </Text>
            </View>
          )}
        </View>
      )}

      <Text
        style={[
          ProductDetailScreenStyles.title,
          isOutOfStock && ProductDetailScreenStyles.textOutOfStock,
        ]}
      >
        {product.name}
      </Text>

      <Text
        style={[
          ProductDetailScreenStyles.description,
          isOutOfStock && ProductDetailScreenStyles.textOutOfStock,
        ]}
      >
        {product.description}
      </Text>

      <Text
        style={[
          ProductDetailScreenStyles.price,
          isOutOfStock && ProductDetailScreenStyles.textOutOfStock,
        ]}
      >
        ${product.price}
      </Text>

      {product.stock !== undefined && (
        <Text
          style={[
            ProductDetailScreenStyles.stockText,
            isOutOfStock && ProductDetailScreenStyles.textOutOfStock,
          ]}
        >
          {isOutOfStock ? "Out of Stock" : `${product.stock} in stock`}
        </Text>
      )}

      <View style={ProductDetailScreenStyles.buttonRow}>
        <TouchableOpacity
          style={[
            ProductDetailScreenStyles.button,
            { backgroundColor: isOutOfStock ? "#cccccc" : "#6b7280" },
          ]}
          onPress={handleAddToCart}
          disabled={adding || isOutOfStock}
        >
          <Text style={ProductDetailScreenStyles.buttonText}>
            {adding ? "Adding..." : "Add to Cart"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            ProductDetailScreenStyles.button,
            { backgroundColor: isOutOfStock ? "#cccccc" : "#2563eb" },
          ]}
          onPress={handleBuyNow}
          disabled={isOutOfStock}
        >
          <Text style={ProductDetailScreenStyles.buttonText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
