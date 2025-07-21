import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import styles from "../styles/HomeScreenStyles";
import GlobalStyles, { colors } from "../styles/GlobalStyles";
import { getAllProducts } from "../api/products";
import { getAllCategories } from "../api/categories";
import { FontAwesome } from "@expo/vector-icons";
import ProductCard from "../components/ProductCard";

export default function HomeScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState(""); // Add search state

  useEffect(() => {
    const fetchCategories = async () => {
      const cats = await getAllCategories();
      setCategories(cats);
    };
    fetchCategories();

    const fetchProducts = async () => {
      const products = await getAllProducts();
      setProducts(products);
    };
    fetchProducts();
  }, []);

  // Filter products by selected category and search query
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      !selectedCategory ||
      (product.category && product.category.category === selectedCategory);
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Header component for FlatList
  const ListHeader = (
    <>
      {/* Top Bar */}
      <View
        style={[
          styles.topBar,
          GlobalStyles.mb16,
          { flexDirection: "row", alignItems: "center" },
        ]}
      >
        {/* Search Bar */}
        <View style={[styles.searchBar, { flexShrink: 1, marginBottom: 0 }]}>
          <FontAwesome
            name="search"
            size={20}
            color={colors.border}
            style={{ marginRight: 8 }}
          />
          <TextInput
            placeholder="Search any Product..."
            style={[GlobalStyles.bodyText, { flex: 1 }]}
            placeholderTextColor={GlobalStyles.textMuted.color}
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity
          style={[GlobalStyles.iconButton, { marginLeft: 8 }]}
          onPress={() => navigation.navigate("Profile")}
        >
          <FontAwesome name="user" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <Text style={[GlobalStyles.subtitle, GlobalStyles.mb16]}>
        All Featured
      </Text>
      <View style={{ height: 40, marginBottom: 8 }}>
        <FlatList
          data={[{ _id: "all", category: "All" }, ...categories]}
          horizontal
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                { alignItems: "center", marginHorizontal: 0 },
                selectedCategory === item.category && {
                  backgroundColor: colors.primary,
                },
                item.category === "All" &&
                  selectedCategory === null && {
                    backgroundColor: colors.primary,
                  },
              ]}
              onPress={() =>
                item.category === "All"
                  ? setSelectedCategory(null)
                  : setSelectedCategory(item.category)
              }
            >
              <Text style={GlobalStyles.bodyText}>{item.category}</Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 0, gap: 4 }}
        />
      </View>

      {/* Banner */}
      {/* <View
        style={[
          GlobalStyles.card,
          { marginVertical: 16, borderRadius: 12, overflow: "hidden" },
        ]}
      >
        <Image
          source={require("../assets/favicon.png")}
          style={{ width: "100%", height: 120 }}
        />
      </View> */}
    </>
  );

  return (
    <FlatList
      data={filteredProducts.slice(0, 10)}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => navigation.navigate("ProductDetail", { id: item._id })}
          style={{ flex: 1, margin: 4 }} // Add margin for spacing
        >
          <ProductCard product={item} />
        </TouchableOpacity>
      )}
      numColumns={2} // <-- Show 2 products per row
      ListHeaderComponent={ListHeader}
      contentContainerStyle={{
        justifyContent: "center",
        paddingHorizontal: 8,
        paddingBottom: 16,
        gap: 8,
      }}
      showsVerticalScrollIndicator={false}
    />
  );
}
