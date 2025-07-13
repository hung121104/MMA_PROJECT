import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import {
  getCart,
  updateCartItem,
  removeMultipleFromCart,
  removeFromCart,
} from "../api/cart";
import CartScreenStyles from "../styles/CartScreenStyles";
import GlobalStyles, { colors } from "../styles/GlobalStyles";
import OptimizedImage from "../components/OptimizedImage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CheckBox } from "react-native-elements";
import { Picker } from "@react-native-picker/picker";

export default function CartScreen({ navigation }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [addresses, setAddresses] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [editing, setEditing] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [variations, setVariations] = useState({});
  const debounceTimeout = useRef(null);
  const [lastQtyChange, setLastQtyChange] = useState(null);
  const [deletedIds, setDeletedIds] = useState([]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const cartData = await getCart();
      setCart(cartData);
      if (cartData.items && cartData.items.length > 0) {
        const initialSelected = new Set(
          cartData.items.map((item) => item.product._id)
        );
        setSelectedItems(initialSelected);
      }
    } catch (err) {
      setCart({ items: [], totalAmount: 0 });
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      const saved = await AsyncStorage.getItem("userAddresses");
      if (saved) {
        setAddresses(JSON.parse(saved));
      } else {
        setAddresses([]);
      }
    } catch (e) {
      setAddresses([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCart();
      fetchAddresses();
    }, [])
  );

  const handleDeleteAddress = async (index) => {
    try {
      const updated = addresses.filter((_, i) => i !== index);
      await AsyncStorage.setItem("userAddresses", JSON.stringify(updated));
      setAddresses(updated);
    } catch (e) {}
  };

  const toggleItemSelection = (productId) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems(new Set());
    } else {
      const allProductIds = new Set(
        cart?.items?.map((item) => item.product._id)
      );
      setSelectedItems(allProductIds);
    }
    setSelectAll(!selectAll);
  };

  const handleDeleteSelected = () => {
    if (!cart || !cart.items) return;
    const remaining = cart.items.filter(
      (item) => !selectedItems.has(item.product._id)
    );
    const toDelete = cart.items.filter((item) =>
      selectedItems.has(item.product._id)
    );
    setCart({ ...cart, items: remaining });
    setSelectedItems(new Set());
    setSelectAll(false);

    setDeletedIds(toDelete.map((item) => item.product._id));
  };

  const getSelectedItems = () => {
    if (!cart || !cart.items) return [];
    return cart.items.filter((item) => selectedItems.has(item.product._id));
  };

  const getSelectedItemsTotal = () => {
    const selected = getSelectedItems();
    return selected.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleProceedToPayment = () => {
    const selectedCartItems = getSelectedItems();
    if (selectedCartItems.length === 0) {
      alert("Please select at least one item to proceed.");
      return;
    }
    const selectedTotal = getSelectedItemsTotal();
    const orderId = `order_${Date.now()}`;
    navigation.navigate("Payment", {
      orderId: orderId,
      totalAmount: selectedTotal,
      selectedCartItems: selectedCartItems,
    });
  };

  // Quantity controls
  const handleQuantityChange = (productId, delta) => {
    // Find the cart item and its stock
    const item = cart.items.find((item) => item.product._id === productId);
    const stock = item.product.stock || 1; // default to 1 if stock is missing
    const currentQty = quantities[productId] || item.quantity || 1;
    const newQty = currentQty + delta;

    if (delta > 0 && newQty > stock) {
      alert("Insufficient stock");
      return;
    }
    if (newQty < 1) return; // Prevent going below 1

    setQuantities((prev) => ({
      ...prev,
      [productId]: newQty,
    }));

    setCart((prevCart) => {
      if (!prevCart) return prevCart;
      const updatedItems = prevCart.items.map((item) =>
        item.product._id === productId ? { ...item, quantity: newQty } : item
      );
      setLastQtyChange({ productId, quantity: newQty });
      return { ...prevCart, items: updatedItems };
    });
  };

  // Variation controls
  const handleVariationChange = (productId, value) => {
    setVariations((prev) => ({ ...prev, [productId]: value }));
  };

  // Debounce for quantity change
  useEffect(() => {
    if (!lastQtyChange) return;
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      updateCartItem(lastQtyChange.productId, lastQtyChange.quantity).catch(
        () => alert("Failed to update cart on server")
      );
      setLastQtyChange(null);
    }, 500);
    return () => clearTimeout(debounceTimeout.current);
  }, [lastQtyChange]);

  // Debounce for delete
  useEffect(() => {
    if (!deletedIds.length) return;
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      removeMultipleFromCart(
        deletedIds.map((id) => ({ productId: id, quantity: 1 }))
      ).catch(() => alert("Failed to update cart on server"));
      setDeletedIds([]);
    }, 500);
    return () => clearTimeout(debounceTimeout.current);
  }, [deletedIds]);

  const handleDeleteProduct = async (productId) => {
    setCart((prevCart) => {
      if (!prevCart) return prevCart;
      const updatedItems = prevCart.items.filter(
        (item) => item.product._id !== productId
      );
      return { ...prevCart, items: updatedItems };
    });
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      newSet.delete(productId);
      return newSet;
    });

    try {
      await removeFromCart(productId);
    } catch (err) {
      alert("Failed to delete product from cart");
    }
  };

  if (loading) {
    return (
      <View style={CartScreenStyles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const cartItems = cart?.items || [];

  return (
    <View style={CartScreenStyles.container}>
      {/* Sticky Header */}
      <View style={CartScreenStyles.stickyHeader}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={GlobalStyles.iconButton}
        >
          <FontAwesome name="angle-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={CartScreenStyles.headerTitle}>
          Shopping Cart ({cartItems.length})
        </Text>
      </View>

      {/* Cart Items List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 180 }}
      >
        {cartItems.length === 0 ? (
          <View style={CartScreenStyles.centered}>
            <Text style={CartScreenStyles.emptyText}>Your cart is empty</Text>
          </View>
        ) : (
          cartItems.map((item, idx) => (
            <View
              key={item.product._id || idx}
              style={CartScreenStyles.cartItemRow}
            >
              <View>
                <CheckBox
                  checked={selectedItems.has(item.product._id)}
                  onPress={() => toggleItemSelection(item.product._id)}
                  checkedColor={colors.primary}
                  uncheckedColor={colors.mediumGray}
                  containerStyle={{ padding: 0, margin: 0 }}
                />
              </View>

              <OptimizedImage
                source={
                  item.product.images?.[0]?.url ||
                  "https://via.placeholder.com/100x100?text=No+Image"
                }
                style={CartScreenStyles.cartItemImage}
                width={80}
                height={80}
                quality={80}
                fallbackText="No image"
              />
              <View style={CartScreenStyles.cartItemInfo}>
                <Text style={CartScreenStyles.cartItemName} numberOfLines={2}>
                  {item.product.name}
                </Text>

                <View style={CartScreenStyles.cartItemPriceRow}>
                  <Text style={CartScreenStyles.cartItemPrice}>
                    ${item.price.toLocaleString()}
                  </Text>
                  {item.product.oldPrice && (
                    <Text style={CartScreenStyles.cartItemOldPrice}>
                      ${item.product.oldPrice.toLocaleString()}
                    </Text>
                  )}
                </View>
                <View style={CartScreenStyles.cartItemQtyRow}>
                  <TouchableOpacity
                    onPress={() => handleQuantityChange(item.product._id, -1)}
                    style={CartScreenStyles.qtyBtn}
                  >
                    <FontAwesome
                      name="minus"
                      size={16}
                      color={colors.textPrimary}
                    />
                  </TouchableOpacity>
                  <Text style={CartScreenStyles.cartItemQty}>
                    {quantities[item.product._id] || item.quantity || 1}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleQuantityChange(item.product._id, 1)}
                    style={CartScreenStyles.qtyBtn}
                    disabled={
                      (quantities[item.product._id] || item.quantity || 1) >=
                      (item.product.stock || 1)
                    }
                  >
                    <FontAwesome
                      name="plus"
                      size={16}
                      color={
                        (quantities[item.product._id] || item.quantity || 1) >=
                        (item.product.stock || 1)
                          ? colors.mediumGray
                          : colors.textPrimary
                      }
                    />
                  </TouchableOpacity>
                </View>
                <Text style={{ color: colors.mediumGray, fontSize: 12 }}>
                  In stock: {item.product.stock}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleDeleteProduct(item.product._id)}
                style={{ marginLeft: 8, padding: 4 }}
              >
                <FontAwesome
                  name="trash"
                  size={20}
                  color={colors.danger || "red"}
                />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {/* Fixed Action Bar (Check Out) */}
      <View style={CartScreenStyles.fixedActionBarContainer}>
        <View style={CartScreenStyles.actionBarLeft}>
          <CheckBox
            checked={selectAll}
            onPress={handleSelectAll}
            checkedColor={colors.primary}
            uncheckedColor={colors.mediumGray}
            containerStyle={{ padding: 0, margin: 0 }}
          />
          <Text style={CartScreenStyles.actionBarText}>All</Text>
        </View>
        <View style={CartScreenStyles.actionBarRight}>
          <Text style={CartScreenStyles.actionBarTotal}>
            ${getSelectedItemsTotal().toLocaleString()}
          </Text>
          <TouchableOpacity
            style={[
              CartScreenStyles.payButton,
              getSelectedItems().length === 0 &&
                CartScreenStyles.payButtonDisabled,
            ]}
            onPress={handleProceedToPayment}
            disabled={getSelectedItems().length === 0}
          >
            <Text style={CartScreenStyles.payButtonText}>
              Check Out ({getSelectedItems().length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
