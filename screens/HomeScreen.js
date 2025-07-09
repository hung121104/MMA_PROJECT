import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TextInput, TouchableOpacity, FlatList } from 'react-native';
import styles from '../styles/HomeScreenStyles';
import GlobalStyles, { colors } from '../styles/GlobalStyles';
import { getAllProducts } from '../api/products';
import { getAllCategories } from '../api/categories';
import OptimizedImage from '../components/OptimizedImage';
import { FontAwesome } from '@expo/vector-icons';
import ProductCard from '../components/ProductCard';

export default function HomeScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const cats = await getAllCategories();
      // console.log('Fetched cats:', cats); 
      setCategories(cats);
    };
    fetchCategories();


    const fetchProducts = async () => {
      const products = await getAllProducts();
      // console.log('Fetched cats:', cats); 
      setProducts(products);
    };
    fetchProducts();
  }, []);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ justifyContent: 'center', paddingHorizontal: 8 }}
    >
      {/* Top Bar */}
      <View style={[styles.topBar, GlobalStyles.mb16]}>
      <FontAwesome name="bars" size={30}  style={{ marginRight: 8 }} />

        <TouchableOpacity style={GlobalStyles.iconButton} onPress={() => navigation.navigate('Profile')}>
          <FontAwesome name="user" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchBar, GlobalStyles.mb16]}>
        <FontAwesome name="search" size={20} color={colors.border} style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Search any Product..."
          style={[GlobalStyles.bodyText, { flex: 1 }]}
          placeholderTextColor={GlobalStyles.textMuted.color}
        />
        <FontAwesome name="microphone" size={20} color={colors.border} style={{ marginLeft: 8 }} />
      </View>

      {/* Categories */}
      <Text style={[GlobalStyles.subtitle, GlobalStyles.mb16]}>All Featured</Text>
      <FlatList
        data={categories}
        horizontal
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.categoryButton,{ alignItems: 'center', marginHorizontal: 0 }]}>
            <Text style={GlobalStyles.bodyText}>{item.category}</Text>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 0, gap:4, }}
      />

      {/* Banner */}
      <View style={[GlobalStyles.card, { marginVertical: 16, borderRadius: 12, overflow: 'hidden' }]}> 
        <Image source={require('../assets/favicon.png')} style={{ width: '100%', height: 120 }} />
      </View>

      {/* Products */}
      <Text style={[GlobalStyles.subtitle, GlobalStyles.mb16]}>Deal of the Day</Text>
      <FlatList
        data={products.slice(0, 10)}
        horizontal
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('ProductDetail', { id: item._id })}>
            <ProductCard product={item} />
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[GlobalStyles.mb16,{ gap: 8, paddingHorizontal: 0, }]}
      />

      {/* Add more sections as needed, always using GlobalStyles for text and containers */}
    </ScrollView>
  );
}
