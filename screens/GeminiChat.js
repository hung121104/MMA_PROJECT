import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY, API_URL } from "@env"; // Thêm API_BASE_URL
import { getAllProducts } from "../api/products";

const API_KEY = GEMINI_API_KEY;

const SYSTEM_PROMPT = `You are an AI shopping assistant. Return JSON with structure:
{
  "message": "Brief response",
  "products": [
    {
      "id": "product_id",
      "name": "product name",
      "description": "brief description",
      "price": price,
      "stock": quantity,
      "category": "category",
      "images": [{"url": "link"}],
      "rating": rating,
      "numReviews": review_count,
      "relevance_reason": "brief reason"
    }
  ]
}


IMPORTANT:
- Return ONLY pure JSON, no markdown
- Maximum 3 products
- Keep descriptions brief
- Ensure complete JSON`;

export default function ProductChatbot({ navigation }) {
  const [inputText, setInputText] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);

  // Fetch all products when component mounts
  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      getAllProducts().then((data) => {
        setProducts(data);
        setLoading(false);
      });
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const runGemini = async () => {
    if (!inputText.trim()) {
      setError("Please enter a search request.");
      return;
    }

    if (products.length === 0) {
      setError("Loading product data, please try again later.");
      return;
    }

    setLoading(true);
    setError("");
    setResponseData(null);

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
      });

      // Create prompt with product list
      const productsJson = JSON.stringify(products, null, 2);
      const fullPrompt = `${SYSTEM_PROMPT}


        PRODUCTS: ${productsJson}


        REQUEST: "${inputText}"


        Return complete JSON:`;

      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      let text = response.text();
      try {
        // console.log("Before: ", text);

        text = text.replace(/```json\n?/g, "");
        text = text.replace(/```\n?/g, "");
        text = text.trim();
        // console.log("After: ", text);
        const parsedResponse = JSON.parse(text);
        setResponseData(parsedResponse);
      } catch (parseError) {
        setResponseData({
          message: text,
          products: [],
        });
      }
    } catch (err) {
      console.error("Error calling Gemini API:", err);
      setError("An error occurred while connecting to AI. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const ProductCard = ({ product }) => (
    <View style={styles.productCard}>
      {product.images && product.images.length > 0 && (
        <Image
          source={{ uri: product.images[0].url }}
          style={styles.productImage}
          resizeMode="cover"
        />
      )}
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productDescription} numberOfLines={2}>
          {product.description}
        </Text>
        <Text style={styles.productPrice}>{formatPrice(product.price)}</Text>
        <View style={styles.productMeta}>
          <Text style={styles.productRating}>
            ⭐ {product.rating || 0} ({product.numReviews || 0} reviews)
          </Text>
          <Text style={styles.productStock}>Stock: {product.stock}</Text>
        </View>
        {product.relevance_reason && (
          <Text style={styles.relevanceReason}>
            💡 {product.relevance_reason}
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>AI Shopping Assistant</Text>

      <TextInput
        style={styles.input}
        placeholder="I'm looking for... (e.g.: cheap phone, men's shirt, kids toys)"
        multiline
        numberOfLines={3}
        value={inputText}
        onChangeText={setInputText}
      />

      <TouchableOpacity
        style={[styles.sendButton, loading && styles.disabledButton]}
        onPress={runGemini}
        disabled={loading}
      >
        <Text style={styles.sendButtonText}>
          {loading ? "Searching..." : "Search Products"}
        </Text>
      </TouchableOpacity>

      {loading && (
        <ActivityIndicator
          size="large"
          color="#007AFF"
          style={styles.spinner}
        />
      )}

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {responseData && (
        <View style={styles.responseContainer}>
          {/* Display AI message */}
          <View style={styles.messageContainer}>
            <Text style={styles.messageTitle}>💬 AI Assistant:</Text>
            <Text style={styles.messageText}>{responseData.message}</Text>
          </View>

          {/* Display recommended products */}
          {responseData.products && responseData.products.length > 0 && (
            <View style={styles.productsContainer}>
              <Text style={styles.productsTitle}>
                🛍️ Recommended Products ({responseData.products.length}):
              </Text>
              {responseData.products.map((product, index) => (
                <TouchableOpacity
                  key={product.id || index}
                  onPress={() => {
                    console.log("Product pressed:", product.id);
                    navigation.navigate("ProductDetail", { id: product.id });
                  }}
                  style={styles.productTouchable}
                  activeOpacity={0.7} // Add visual effect
                >
                  <ProductCard product={product} />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#F8F9FA",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#2C3E50",
  },
  input: {
    width: "100%",
    borderColor: "#E1E5E9",
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    minHeight: 80,
    textAlignVertical: "top",
    backgroundColor: "#FFFFFF",
    fontSize: 16,
  },

  sendButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#A0A0A0",
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  spinner: {
    marginVertical: 20,
  },
  errorText: {
    color: "#DC3545",
    marginTop: 10,
    textAlign: "center",
    fontSize: 16,
  },
  responseContainer: {
    marginTop: 20,
    width: "100%",
  },
  messageContainer: {
    backgroundColor: "#E3F2FD",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  messageTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1976D2",
    marginBottom: 8,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#424242",
  },
  productsContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
  },
  productTouchable: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 15,
  },
  productsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 15,
  },
  productCard: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: "#E9ECEF",
    flexDirection: "row",
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: "#6C757D",
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#28A745",
    marginBottom: 8,
  },
  productMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  productRating: {
    fontSize: 12,
    color: "#FFC107",
  },
  productStock: {
    fontSize: 12,
    color: "#6C757D",
  },
  relevanceReason: {
    fontSize: 12,
    color: "#007AFF",
    fontStyle: "italic",
  },
});
