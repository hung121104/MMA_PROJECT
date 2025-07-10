import React, { useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { getCart } from '../api/cart';
import CartScreenStyles from '../styles/CartScreenStyles';
import GlobalStyles, { colors } from '../styles/GlobalStyles';
import OptimizedImage from '../components/OptimizedImage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CheckBox } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';

export default function CartScreen({ navigation }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [addresses, setAddresses] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [editing, setEditing] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [variations, setVariations] = useState({});

  const fetchCart = async () => {
    setLoading(true);
    try {
      const cartData = await getCart();
      setCart(cartData);
      if (cartData.items && cartData.items.length > 0) {
        const initialSelected = new Set(cartData.items.map(item => item.product._id));
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
      const saved = await AsyncStorage.getItem('userAddresses');
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
      await AsyncStorage.setItem('userAddresses', JSON.stringify(updated));
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
      const allProductIds = new Set(cart?.items?.map(item => item.product._id));
      setSelectedItems(allProductIds);
    }
    setSelectAll(!selectAll);
  };

  const handleDeleteSelected = () => {
    if (!cart || !cart.items) return;
    const remaining = cart.items.filter(item => !selectedItems.has(item.product._id));
    setCart({ ...cart, items: remaining });
    setSelectedItems(new Set());
    setSelectAll(false);
    // TODO: Also update backend if needed
  };

  const getSelectedItems = () => {
    if (!cart || !cart.items) return [];
    return cart.items.filter(item => selectedItems.has(item.product._id));
  };

  const getSelectedItemsTotal = () => {
    const selected = getSelectedItems();
    return selected.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleProceedToPayment = () => {
    const selectedCartItems = getSelectedItems();
    if (selectedCartItems.length === 0) {
      alert('Please select at least one item to proceed.');
      return;
    }
    const selectedTotal = getSelectedItemsTotal();
    const orderId = `order_${Date.now()}`;
    navigation.navigate('Payment', {
      orderId: orderId,
      totalAmount: selectedTotal,
      selectedCartItems: selectedCartItems,
    });
  };

  // Quantity controls
  const handleQuantityChange = (productId, delta) => {
    setQuantities(prev => {
      const newQty = Math.max(1, (prev[productId] || 1) + delta);
      return { ...prev, [productId]: newQty };
    });
  };

  // Variation controls
  const handleVariationChange = (productId, value) => {
    setVariations(prev => ({ ...prev, [productId]: value }));
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
        <TouchableOpacity onPress={() => navigation.goBack()} style={GlobalStyles.iconButton}>
          <FontAwesome name="angle-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={CartScreenStyles.headerTitle}>Shopping Cart ({cartItems.length})</Text>
        <TouchableOpacity onPress={() => setEditing(!editing)}>
          <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: 16 }}>{editing ? 'Done' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>

      {/* Address Slider */}
      {/* <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12, paddingBottom:30 }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          {addresses.length === 0 ? (
            <TouchableOpacity style={CartScreenStyles.addressCard} onPress={() => navigation.navigate('PaymentMethod')}>
              <Text style={CartScreenStyles.addressText}>No address found. Tap to add one.</Text>
            </TouchableOpacity>
          ) : (
            addresses.map((addr, idx) => (
              <View key={idx} style={[CartScreenStyles.addressCard, { minWidth: 170, maxWidth: 210, marginRight: 12 }]}> 
                <View style={CartScreenStyles.addressTopRow}>
                  <Text style={CartScreenStyles.addressLabel}>Address :</Text>
                  <View style={CartScreenStyles.addressActions}>
                    <TouchableOpacity style={CartScreenStyles.editIcon} onPress={() => navigation.navigate('PaymentMethod')}>
                      <FontAwesome name="pencil" size={16} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={CartScreenStyles.trashIcon} onPress={() => handleDeleteAddress(idx)}>
                      <FontAwesome name="trash" size={16} color={colors.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={CartScreenStyles.addressText}>{addr.address}</Text>
              </View>
            ))
          )}
          <TouchableOpacity style={[CartScreenStyles.addAddressCard, { minWidth: 56, minHeight: 56 }]} onPress={() => navigation.navigate('PaymentMethod')}>
            <FontAwesome name="plus-circle" size={32} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </ScrollView> */}

      {/* Cart Items List */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 180 }}>
        {cartItems.length === 0 ? (
          <View style={CartScreenStyles.centered}>
            <Text style={CartScreenStyles.emptyText}>Your cart is empty</Text>
          </View>
        ) : (
          cartItems.map((item, idx) => (
            <View key={item.product._id || idx} style={CartScreenStyles.cartItemRow}>
              <CheckBox
                checked={selectedItems.has(item.product._id)}
                onPress={() => toggleItemSelection(item.product._id)}
                checkedColor={colors.primary}
                uncheckedColor={colors.mediumGray}
                containerStyle={{ padding: 0, margin: 0 }}
              />
              <OptimizedImage
                source={item.product.images?.[0]?.url || 'https://via.placeholder.com/100x100?text=No+Image'}
                style={CartScreenStyles.cartItemImage}
                width={80}
                height={80}
                quality={80}
                fallbackText="No image"
              />
              <View style={CartScreenStyles.cartItemInfo}>
                <Text style={CartScreenStyles.cartItemName} numberOfLines={2}>{item.product.name}</Text>
                <View style={CartScreenStyles.cartItemVariationRow}>
                  <Picker
                    selectedValue={variations[item.product._id] || (item.product.variations?.[0] || '')}
                    style={CartScreenStyles.cartItemPicker}
                    onValueChange={value => handleVariationChange(item.product._id, value)}
                  >
                    {(item.product.variations || []).map((v, i) => (
                      <Picker.Item key={i} label={v} value={v} />
                    ))}
                  </Picker>
                </View>
                <View style={CartScreenStyles.cartItemPriceRow}>
                  <Text style={CartScreenStyles.cartItemPrice}>${item.price.toLocaleString()}</Text>
                  {item.product.oldPrice && (
                    <Text style={CartScreenStyles.cartItemOldPrice}>${item.product.oldPrice.toLocaleString()}</Text>
                  )}
                </View>
                <View style={CartScreenStyles.cartItemQtyRow}>
                  <TouchableOpacity onPress={() => handleQuantityChange(item.product._id, -1)} style={CartScreenStyles.qtyBtn}>
                    <FontAwesome name="minus" size={16} color={colors.textPrimary} />
                  </TouchableOpacity>
                  <Text style={CartScreenStyles.cartItemQty}>{quantities[item.product._id] || item.quantity || 1}</Text>
                  <TouchableOpacity onPress={() => handleQuantityChange(item.product._id, 1)} style={CartScreenStyles.qtyBtn}>
                    <FontAwesome name="plus" size={16} color={colors.textPrimary} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Voucher/Summary Bar */}
      {/* <View style={CartScreenStyles.summaryBar}>
        <Text style={CartScreenStyles.summaryVoucher}><FontAwesome name="ticket" size={16} color={colors.primary} />  Shopee Vouchers</Text>
        <TouchableOpacity>
          <Text style={CartScreenStyles.summaryVoucherBtn}>Free Shipping Voucher</Text>
        </TouchableOpacity>
      </View> */}
      {/* <View style={CartScreenStyles.summaryBar}>
        <Text style={CartScreenStyles.summaryCoin}><FontAwesome name="circle" size={16} color={colors.warning} />  Insufficient Coin Balance</Text>
      </View> */}

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
              getSelectedItems().length === 0 && CartScreenStyles.payButtonDisabled
            ]}
            onPress={handleProceedToPayment}
            disabled={getSelectedItems().length === 0}
          >
            <Text style={CartScreenStyles.payButtonText}>Check Out ({getSelectedItems().length})</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
