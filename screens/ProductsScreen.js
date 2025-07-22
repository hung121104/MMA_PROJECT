import { FontAwesome } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { deleteProduct, getAllProducts } from "../api/products";
import { styles } from "../styles/ProductsScreenStyles";

const ProductsScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = async (showLoading = true) => {
    if (showLoading) setLoading(true);

    try {
      const productsData = await getAllProducts();
      setProducts(productsData || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      Alert.alert("Error", "Failed to fetch products. Please try again.", [
        { text: "OK" },
      ]);
      setProducts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load products when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts(false);
  };

  const handleDeleteProduct = async (productId, productName) => {
    Alert.alert(
      "Delete Product",
      `Are you sure you want to delete "${productName}"? This action cannot be undone.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteProduct(productId);
              Alert.alert("Success", "Product deleted successfully!");
              fetchProducts();
            } catch (error) {
              console.error("Error deleting product:", error);
              Alert.alert(
                "Error",
                "Failed to delete product. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  const handleEditProduct = (product) => {
    navigation.navigate("EditProduct", { product });
  };

  const formatPrice = (price) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <FontAwesome key={i} name="star" size={12} color="#ffd700" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <FontAwesome key={i} name="star-half-o" size={12} color="#ffd700" />
        );
      } else {
        stars.push(
          <FontAwesome key={i} name="star-o" size={12} color="#ddd" />
        );
      }
    }
    return stars;
  };

  const renderProductItem = ({ item, index }) => (
    <View style={styles.productCard}>
      <View style={styles.productHeader}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          {item.images && item.images.length > 0 ? (
            <Image
              source={{ uri: item.images[0].url }}
              style={styles.productImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderImage}>
              <FontAwesome name="image" size={24} color="#ccc" />
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.productContent}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.productDescription} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={styles.priceStockRow}>
            <Text style={styles.productPrice}>{formatPrice(item.price)}</Text>
            <View style={styles.stockContainer}>
              <FontAwesome
                name="cubes"
                size={12}
                color={item.stock > 0 ? "#28a745" : "#dc3545"}
              />
              <Text
                style={[
                  styles.stockText,
                  item.stock === 0 && styles.outOfStock,
                ]}
              >
                {item.stock > 0 ? `${item.stock} in stock` : "Out of stock"}
              </Text>
            </View>
          </View>

          {/* Rating */}
          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>
              {renderStars(item.rating)}
            </View>
            <Text style={styles.ratingText}>
              {item.rating.toFixed(1)} ({item.numReviews} reviews)
            </Text>
          </View>

          {/* Category */}
          {item.category && (
            <View style={styles.categoryContainer}>
              <FontAwesome name="tag" size={10} color="#666" />
              <Text style={styles.categoryText}>
                {typeof item.category === "object"
                  ? item.category.category
                  : item.category}
              </Text>
            </View>
          )}
        </View>

        {/* Product Index */}
        <View style={styles.productIndex}>
          <Text style={styles.indexText}>#{index + 1}</Text>
        </View>
      </View>

      {/* Product Footer */}
      <View style={styles.productFooter}>
        <View style={styles.dateInfo}>
          <FontAwesome name="calendar" size={12} color="#666" />
          <Text style={styles.dateText}>
            Created: {formatDate(item.createdAt)}
          </Text>
        </View>
        {item.updatedAt !== item.createdAt && (
          <View style={styles.dateInfo}>
            <FontAwesome name="edit" size={12} color="#666" />
            <Text style={styles.dateText}>
              Updated: {formatDate(item.updatedAt)}
            </Text>
          </View>
        )}
        <View style={styles.productId}>
          <Text style={styles.idText}>ID: {item._id}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEditProduct(item)}
          activeOpacity={0.8}
        >
          <FontAwesome name="edit" size={16} color="#fff" />
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteProduct(item._id, item.name)}
          activeOpacity={0.8}
        >
          <FontAwesome name="trash" size={16} color="#fff" />
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <FontAwesome name="shopping-bag" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No Products Found</Text>
      <Text style={styles.emptySubtitle}>
        Products will appear here once they are added to the system
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <FontAwesome name="shopping-bag" size={24} color="#2a6ef7" />
        <Text style={styles.headerTitle}>Products</Text>
      </View>
      <View style={styles.headerRight}>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{products.length}</Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2a6ef7" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}

      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={renderProductItem}
        contentContainerStyle={[
          styles.listContainer,
          products.length === 0 && styles.emptyListContainer,
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#2a6ef7"
            colors={["#2a6ef7"]}
          />
        }
        ListEmptyComponent={renderEmptyState}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CreateProduct")}
        activeOpacity={0.8}
      >
        <FontAwesome name="plus" size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ProductsScreen;
