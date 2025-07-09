import React, { useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { getCart } from '../api/cart';
import CartScreenStyles from '../styles/CartScreenStyles';

export default function CartScreen({ navigation }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState(new Set());

  const fetchCart = async () => {
    setLoading(true);
    try {
      const cartData = await getCart();
      setCart(cartData);
      // Initialize all items as selected by default
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

  useFocusEffect(
    useCallback(() => {
      fetchCart();
    }, [])
  );

  const toggleItemSelection = (productId) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedItems(newSelected);
  };

  const selectAllItems = () => {
    if (cart && cart.items) {
      const allProductIds = new Set(cart.items.map(item => item.product._id));
      setSelectedItems(allProductIds);
    }
  };

  const deselectAllItems = () => {
    setSelectedItems(new Set());
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

  if (loading) {
    return (
      <View style={CartScreenStyles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const cartItems = cart?.items || [];

  return (
    <View style={CartScreenStyles.container}>
      <Text style={CartScreenStyles.title}>Shopping Cart</Text>
      
      {cartItems.length === 0 ? (
        <View style={CartScreenStyles.centered}>
          <Text style={CartScreenStyles.emptyText}>Your cart is empty</Text>
        </View>
      ) : (
        <>
          {/* Select All/Deselect All Buttons */}
          <View style={CartScreenStyles.selectAllContainer}>
            <TouchableOpacity style={CartScreenStyles.selectAllButton} onPress={selectAllItems}>
              <Text style={CartScreenStyles.selectAllText}>Select All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={CartScreenStyles.selectAllButton} onPress={deselectAllItems}>
              <Text style={CartScreenStyles.selectAllText}>Deselect All</Text>
            </TouchableOpacity>
          </View>

          {/* Cart Items */}
          <FlatList
            data={cartItems}
            keyExtractor={item => item.product?._id || item.product}
            renderItem={({ item }) => (
              <View style={CartScreenStyles.itemCard}>
                <TouchableOpacity 
                  style={CartScreenStyles.checkboxContainer}
                  onPress={() => toggleItemSelection(item.product._id)}
                >
                  <FontAwesome 
                    name={selectedItems.has(item.product._id) ? 'check-square-o' : 'square-o'} 
                    size={20} 
                    color={selectedItems.has(item.product._id) ? '#2563eb' : '#666'} 
                  />
                </TouchableOpacity>
                
                <View style={CartScreenStyles.itemContent}>
                  <Text style={CartScreenStyles.itemName}>{item.product?.name || 'Product'}</Text>
                  <Text style={CartScreenStyles.itemDetail}>Quantity: {item.quantity}</Text>
                  <Text style={CartScreenStyles.itemPrice}>
                    ${(item.price * item.quantity / 100).toFixed(2)}
                  </Text>
                </View>
              </View>
            )}
            style={{ flexGrow: 0 }}
          />

          {/* Selected Items Summary */}
          <View style={CartScreenStyles.summaryContainer}>
            <Text style={CartScreenStyles.summaryText}>
              Selected: {getSelectedItems().length} of {cartItems.length} items
            </Text>
            <Text style={CartScreenStyles.summaryTotal}>
              Selected Total: ${(getSelectedItemsTotal() / 100).toFixed(2)}
            </Text>
          </View>

          {/* Total and Payment Button */}
          <View style={CartScreenStyles.totalCard}>
            <View style={CartScreenStyles.totalRow}>
              <Text style={CartScreenStyles.totalLabel}>Selected Total:</Text>
              <Text style={CartScreenStyles.totalAmount}>
                ${(getSelectedItemsTotal() / 100).toFixed(2)}
              </Text>
            </View>
            <TouchableOpacity
              style={[
                CartScreenStyles.payButton,
                getSelectedItems().length === 0 && CartScreenStyles.payButtonDisabled
              ]}
              onPress={handleProceedToPayment}
              disabled={getSelectedItems().length === 0}
            >
              <Text style={CartScreenStyles.payButtonText}>
                Proceed to Payment ({getSelectedItems().length} items)
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}
