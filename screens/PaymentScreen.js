import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PaymentScreenStyles from "../styles/PaymentScreenStyles";
import { FontAwesome } from "@expo/vector-icons";
import { createOrder } from "../api/orders";
import { removeMultipleFromCart } from "../api/cart";
import { CheckBox } from "react-native-elements";
import OptimizedImage from "../components/OptimizedImage"; // Add this import

export default function PaymentScreen({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressIdx, setSelectedAddressIdx] = useState(0);
  const [selectedCartItems, setSelectedCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("COD");

  // Get data from route params
  const {
    selectedCartItems: cartItems,
    orderItems,
    itemPrice,
    tax,
    shippingCharges,
    totalAmount,
    fromBuyNow,
  } = route.params || {};

  useEffect(() => {
    if (fromBuyNow && orderItems) {
      // Coming from Buy Now - convert orderItems to selectedCartItems format
      const convertedItems = orderItems.map((item) => ({
        product: {
          _id: item.product,
          name: item.name,
          images: item.image ? [{ url: item.image }] : [],
        },
        price: item.price,
        quantity: item.quantity,
      }));
      setSelectedCartItems(convertedItems);
    } else if (cartItems && selectedCartItems.length === 0) {
      // Coming from Cart
      setSelectedCartItems(cartItems);
    }
  }, [route.params]);

  useEffect(() => {
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
    fetchAddresses();
  }, []);

  // Listen for address selection changes from OrdersPaymentInfoScreen
  useEffect(() => {
    if (route.params?.selectedAddressIdx !== undefined) {
      setSelectedAddressIdx(route.params.selectedAddressIdx);
    }
  }, [route.params?.selectedAddressIdx]);

  const handleAddressSelect = () => {
    navigation.navigate("PaymentMethod", {
      selectedAddressIdx,
      selectedCartItems,
      fromBuyNow,
      orderItems,
      itemPrice,
      tax,
      shippingCharges,
      totalAmount,
    });
  };

  const handlePlaceOrder = async () => {
    if (!addresses[selectedAddressIdx]) {
      Alert.alert("Error", "Please select a delivery address.");
      return;
    }
    if (selectedCartItems.length === 0) {
      Alert.alert("Error", "No items selected for order.");
      return;
    }

    setSubmitting(true);
    try {
      const shippingInfo = addresses[selectedAddressIdx];

      let orderData;

      if (fromBuyNow) {
        // Use the pre-calculated values from Buy Now
        orderData = {
          shippingInfo,
          orderItems: orderItems,
          paymentMethod,
          itemPrice: itemPrice || 0,
          tax: tax || 0,
          shippingCharges: shippingCharges || 0,
          totalAmount: totalAmount || 0,
        };
      } else {
        // Calculate from cart items
        const orderItemsFromCart = selectedCartItems.map((item) => ({
          name: item.product.name,
          price: item.price,
          quantity: item.quantity,
          image:
            item.product.images && item.product.images[0]
              ? item.product.images[0].url
              : "",
          product: item.product._id,
        }));

        const selectedTotal = selectedCartItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        orderData = {
          shippingInfo,
          orderItems: orderItemsFromCart,
          paymentMethod,
          itemPrice: selectedTotal,
          tax: 0,
          shippingCharges: 0,
          totalAmount: selectedTotal,
        };
      }

      await createOrder(orderData);

      // Only remove from cart if this was a cart purchase (not Buy Now)
      if (!fromBuyNow && selectedCartItems.length > 0) {
        try {
          const itemsToRemove = selectedCartItems.map((item) => ({
            productId: item.product._id,
            quantity: item.quantity,
          }));
          await removeMultipleFromCart(itemsToRemove);
        } catch (error) {
          Alert.alert(
            "Warning",
            "Order placed but there was an issue clearing your cart."
          );
        }
      }

      Alert.alert("Success", "Order placed successfully!");
      navigation.navigate("MainTabs", { screen: "Orders" });
    } catch (err) {
      Alert.alert(
        "Error",
        err?.response?.data?.message || "Failed to place order"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={PaymentScreenStyles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const selectedAddress = addresses[selectedAddressIdx];

  // Calculate total based on source
  const selectedTotal = fromBuyNow
    ? totalAmount || 0
    : selectedCartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

  return (
    <View style={PaymentScreenStyles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Address Card */}
        {selectedAddress && (
          <View style={PaymentScreenStyles.addressCard}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome
                name="map-marker"
                size={20}
                color={
                  PaymentScreenStyles.fixedPayButtonTotal?.color || "#2563eb"
                }
                style={{ marginRight: 8 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={PaymentScreenStyles.addressPhone}>
                  Phone: {selectedAddress.phone}
                </Text>
                <Text style={PaymentScreenStyles.addressText}>
                  Address: {selectedAddress.address}, {selectedAddress.city},{" "}
                  {selectedAddress.country}
                </Text>
              </View>
              <TouchableOpacity onPress={handleAddressSelect}>
                <FontAwesome
                  name="angle-right"
                  size={20}
                  color={
                    PaymentScreenStyles.fixedPayButtonTotal?.color || "#2563eb"
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Payment Method Selection */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 8,
            marginVertical: 12,
            padding: 16,
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 8 }}>
            Payment Method
          </Text>
          <TouchableOpacity
            onPress={() => setPaymentMethod("COD")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <FontAwesome
              name={paymentMethod === "COD" ? "dot-circle-o" : "circle-o"}
              size={20}
              color={paymentMethod === "COD" ? "#2563eb" : "#bbb"}
              style={{ marginRight: 8 }}
            />
            <Text style={{ fontSize: 15 }}>Cash on Delivery (COD)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setPaymentMethod("ONLINE")}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <FontAwesome
              name={paymentMethod === "ONLINE" ? "dot-circle-o" : "circle-o"}
              size={20}
              color={paymentMethod === "ONLINE" ? "#2563eb" : "#bbb"}
              style={{ marginRight: 8 }}
            />
            <Text style={{ fontSize: 15 }}>Online Payment</Text>
          </TouchableOpacity>
        </View>

        {/* Product List */}
        <View style={PaymentScreenStyles.shopCard}>
          {selectedCartItems.map((item, idx) => (
            <View key={idx} style={PaymentScreenStyles.productRow}>
              <OptimizedImage
                source={{
                  uri:
                    item.product.images?.[0]?.url ||
                    "https://via.placeholder.com/100x100?text=No+Image",
                }}
                style={PaymentScreenStyles.productImage}
                width={100}
                height={100}
                quality="70"
                fallbackText={
                  item.product.name?.charAt(0)?.toUpperCase() || "P"
                }
              />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={PaymentScreenStyles.productName}>
                  {item.product.name}
                </Text>
                <Text style={PaymentScreenStyles.productDesc}>
                  {item.product.variations?.[0] || ""}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 4,
                  }}
                >
                  <Text style={PaymentScreenStyles.productPrice}>
                    ${item.price.toLocaleString()}
                  </Text>
                  {item.product.oldPrice && (
                    <Text style={PaymentScreenStyles.productOldPrice}>
                      ${item.product.oldPrice.toLocaleString()}
                    </Text>
                  )}
                  <Text style={PaymentScreenStyles.productQty}>
                    x{item.quantity}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Order Summary */}
        <View style={PaymentScreenStyles.orderSummaryRow}>
          <Text style={PaymentScreenStyles.orderSummaryLabel}>
            Total {selectedCartItems.length} Item(s)
          </Text>
          <Text style={PaymentScreenStyles.orderSummaryValue}>
            ${selectedTotal.toLocaleString()}
          </Text>
        </View>
        <View style={PaymentScreenStyles.orderSummaryRow}>
          <Text style={PaymentScreenStyles.orderSummaryLabel}>
            Payment Method
          </Text>
          <Text style={PaymentScreenStyles.orderSummaryValue}>
            {paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment"}
          </Text>
        </View>
      </ScrollView>

      {/* Fixed Bottom Bar */}
      <View style={PaymentScreenStyles.fixedPayButtonContainer}>
        <View style={PaymentScreenStyles.fixedPayButtonRow}>
          <View>
            <Text style={PaymentScreenStyles.fixedPayButtonTotal}>
              ${selectedTotal.toLocaleString()}
            </Text>
          </View>
          <TouchableOpacity
            style={PaymentScreenStyles.fixedPayButton}
            onPress={handlePlaceOrder}
            disabled={submitting || !selectedAddress}
          >
            <Text style={PaymentScreenStyles.fixedPayButtonText}>
              {submitting ? "Placing Order..." : "Place Order"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
