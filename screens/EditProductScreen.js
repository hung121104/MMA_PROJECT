import { FontAwesome } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAllCategories } from "../api/categories";
import { updateProduct, updateProductImage } from "../api/products";
import { styles } from "../styles/EditProductScreenStyles";
import OptimizedImage from "../components/OptimizedImage"; // Add this import

const EditProductScreen = ({ navigation, route }) => {
  const { product } = route.params;

  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    category:
      (typeof product?.category === "object"
        ? product?.category?._id
        : product?.category) || "",
    stock: product?.stock?.toString() || "",
    file: null,
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Load categories on component mount
  useEffect(() => {
    fetchCategories();
    // Debug log current product data
    console.log("🔍 EditProduct - Current product:", {
      id: product?._id,
      name: product?.name,
      category: product?.category,
      categoryType: typeof product?.category,
      categoryId:
        typeof product?.category === "object"
          ? product?.category?._id
          : product?.category,
    });
  }, []);

  const fetchCategories = async () => {
    try {
      const categoriesData = await getAllCategories();
      setCategories(categoriesData || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      Alert.alert("Error", "Failed to load categories");
    } finally {
      setCategoriesLoading(false);
    }
  };

  const updateFormData = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required field validations
    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (
      !formData.price ||
      isNaN(parseFloat(formData.price)) ||
      parseFloat(formData.price) <= 0
    ) {
      newErrors.price = "Price must be a valid positive number";
    }

    if (
      !formData.stock ||
      isNaN(parseInt(formData.stock)) ||
      parseInt(formData.stock) < 0
    ) {
      newErrors.stock = "Stock must be a valid non-negative number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setFormData((prev) => ({
          ...prev,
          file: {
            uri: asset.uri,
            type: asset.type || "image/jpeg",
            name: asset.fileName || `product-${Date.now()}.jpg`,
          },
        }));
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const removeNewImage = () => {
    setFormData((prev) => ({
      ...prev,
      file: null,
    }));
  };

  const handleUpdateImage = async () => {
    if (!formData.file) {
      Alert.alert("No Image", "Please select an image first");
      return;
    }

    Alert.alert(
      "Update Image",
      "This will update the product image. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Update",
          onPress: async () => {
            setImageLoading(true);
            try {
              await updateProductImage(product._id, formData.file);
              Alert.alert("Success", "Product image updated successfully!");
              setFormData((prev) => ({ ...prev, file: null }));
              navigation.goBack();
            } catch (error) {
              console.error("Error updating image:", error);
              Alert.alert("Error", "Failed to update image. Please try again.");
            } finally {
              setImageLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const productPayload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category: formData.category || null,
      };

      console.log("📤 Updating product:", {
        id: product._id,
        payload: productPayload,
        originalCategory: product?.category,
        newCategoryId: formData.category,
      });

      const result = await updateProduct(product._id, productPayload);

      console.log("✅ Product updated successfully:", result);

      Alert.alert("Success", "Product updated successfully!", [
        {
          text: "OK",
          onPress: () => {
            navigation.goBack();
          },
        },
      ]);
    } catch (error) {
      console.error("❌ Update product error:", error);

      let userMessage = "Failed to update product. Please try again.";
      if (error.message) {
        userMessage = error.message;
      }

      Alert.alert("Error Updating Product", userMessage, [{ text: "OK" }]);
    } finally {
      setLoading(false);
    }
  };

  const renderFormError = (field) => {
    if (errors[field]) {
      return (
        <View style={styles.errorContainer}>
          <FontAwesome name="exclamation-circle" size={12} color="#dc3545" />
          <Text style={styles.errorText}>{errors[field]}</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Current Product Info */}
          <View style={styles.currentProductSection}>
            <Text style={styles.sectionTitle}>Current Product</Text>
            <View style={styles.currentProductInfo}>
              {product?.images && product.images.length > 0 && (
                <OptimizedImage
                  source={{ uri: product.images[0].url }}
                  style={styles.currentProductImage}
                  width={80}
                  height={80}
                  quality="75"
                  fallbackText="📦"
                />
              )}
              <View style={styles.currentProductDetails}>
                <Text style={styles.currentProductName}>{product?.name}</Text>
                <Text style={styles.currentProductPrice}>
                  ${product?.price}
                </Text>
              </View>
            </View>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Update Information</Text>

            {/* Product Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Product Name <Text style={styles.required}>*</Text>
              </Text>
              <View
                style={[styles.inputWrapper, errors.name && styles.inputError]}
              >
                <FontAwesome
                  name="shopping-bag"
                  size={20}
                  color="#666"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(value) => updateFormData("name", value)}
                  placeholder="Enter product name"
                  placeholderTextColor="#999"
                />
              </View>
              {renderFormError("name")}
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Description <Text style={styles.required}>*</Text>
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  styles.textAreaWrapper,
                  errors.description && styles.inputError,
                ]}
              >
                <FontAwesome
                  name="align-left"
                  size={20}
                  color="#666"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.description}
                  onChangeText={(value) => updateFormData("description", value)}
                  placeholder="Enter product description"
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={4}
                />
              </View>
              {renderFormError("description")}
            </View>

            {/* Price */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Price ($) <Text style={styles.required}>*</Text>
              </Text>
              <View
                style={[styles.inputWrapper, errors.price && styles.inputError]}
              >
                <FontAwesome
                  name="dollar"
                  size={20}
                  color="#666"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={formData.price}
                  onChangeText={(value) => updateFormData("price", value)}
                  placeholder="0.00"
                  placeholderTextColor="#999"
                  keyboardType="decimal-pad"
                />
              </View>
              {renderFormError("price")}
            </View>

            {/* Stock */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Stock Quantity <Text style={styles.required}>*</Text>
              </Text>
              <View
                style={[styles.inputWrapper, errors.stock && styles.inputError]}
              >
                <FontAwesome
                  name="cubes"
                  size={20}
                  color="#666"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={formData.stock}
                  onChangeText={(value) => updateFormData("stock", value)}
                  placeholder="0"
                  placeholderTextColor="#999"
                  keyboardType="number-pad"
                />
              </View>
              {renderFormError("stock")}
            </View>

            {/* Category */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                <FontAwesome name="tag" size={16} color="#666" /> Category
              </Text>

              {/* Current Category Display */}
              {product?.category && (
                <View style={styles.currentCategoryContainer}>
                  <Text style={styles.currentCategoryLabel}>Current: </Text>
                  <Text style={styles.currentCategoryValue}>
                    {typeof product?.category === "object"
                      ? product.category.category
                      : "Unknown Category"}
                  </Text>
                </View>
              )}

              {categoriesLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#2a6ef7" />
                  <Text style={styles.loadingText}>Loading categories...</Text>
                </View>
              ) : (
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={formData.category}
                    onValueChange={(value) => {
                      console.log("🔄 Category changed:", {
                        from: formData.category,
                        to: value,
                        selectedCategory: categories.find(
                          (cat) => cat._id === value
                        ),
                      });
                      updateFormData("category", value);
                    }}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select Category (Optional)" value="" />
                    {categories.map((category) => (
                      <Picker.Item
                        key={category._id}
                        label={category.category}
                        value={category._id}
                      />
                    ))}
                  </Picker>
                </View>
              )}
            </View>
          </View>

          {/* Image Section */}
          <View style={styles.imageSection}>
            <Text style={styles.sectionTitle}>Update Image</Text>

            {/* New Image Selection */}
            {formData.file ? (
              <View style={styles.imageContainer}>
                <OptimizedImage
                  source={{ uri: formData.file.uri }}
                  style={styles.selectedImage}
                  width={200}
                  height={200}
                  quality="80"
                  fallbackText="📷"
                />
                <View style={styles.imageActions}>
                  <TouchableOpacity
                    onPress={handleUpdateImage}
                    style={[styles.imageButton, styles.updateButton]}
                    disabled={imageLoading}
                  >
                    {imageLoading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <>
                        <FontAwesome name="upload" size={16} color="#fff" />
                        <Text style={styles.buttonText}>Update Image</Text>
                      </>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={removeNewImage}
                    style={[styles.imageButton, styles.removeButton]}
                  >
                    <FontAwesome name="trash" size={16} color="#fff" />
                    <Text style={styles.buttonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                onPress={pickImage}
                style={styles.imagePickerButton}
              >
                <FontAwesome name="camera" size={32} color="#999" />
                <Text style={styles.imagePickerText}>Select New Image</Text>
                <Text style={styles.imagePickerSubtext}>
                  Tap to choose from gallery
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>

        {/* Submit Button */}
        <View style={styles.submitContainer}>
          <TouchableOpacity
            onPress={handleSubmit}
            style={[styles.submitButton, loading && styles.disabledButton]}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <FontAwesome name="save" size={18} color="#fff" />
                <Text style={styles.submitButtonText}>Update Product</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditProductScreen;
