import { FontAwesome } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
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
import { createProduct } from "../api/products";
import { styles } from "../styles/CreateProductScreenStyles";

const CreateProductScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    file: null,
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [errors, setErrors] = useState({});

  // Load categories on component mount
  useEffect(() => {
    fetchCategories();
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Product name must be at least 3 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    } else {
      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        newErrors.price = "Price must be a valid positive number";
      }
    }

    if (!formData.stock.trim()) {
      newErrors.stock = "Stock is required";
    } else {
      const stock = parseInt(formData.stock);
      if (isNaN(stock) || stock < 0) {
        newErrors.stock = "Stock must be a valid non-negative number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
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

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      file: null,
    }));
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
        file: formData.file,
      };

      console.log("📤 Submitting product:", {
        ...productPayload,
        file: productPayload.file ? "Selected" : "None (will use placeholder)",
      });

      const response = await createProduct(productPayload);

      console.log("✅ Product created successfully:", response);

      Alert.alert("Success", "Product created successfully!", [
        {
          text: "OK",
          onPress: () => {
            // Reset form and navigate back
            resetForm();
            navigation.goBack();
          },
        },
      ]);
    } catch (error) {
      console.error("❌ Create product error in screen:", error);

      // Show detailed error message to user
      let userMessage = "Failed to create product. Please try again.";

      if (error.message) {
        // Use the detailed error message from API
        userMessage = error.message;
      }

      Alert.alert("Error Creating Product", userMessage, [{ text: "OK" }]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      stock: "",
      file: null,
    });
    setErrors({});
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <FontAwesome name="plus-circle" size={40} color="#2a6ef7" />
            <Text style={styles.title}>Create New Product</Text>
            <Text style={styles.subtitle}>
              Add a new product to your catalog
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Product Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Product Name *</Text>
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
                  style={styles.textInput}
                  placeholder="Enter product name"
                  value={formData.name}
                  onChangeText={(value) => handleInputChange("name", value)}
                  autoCapitalize="words"
                />
              </View>
              {errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}
            </View>

            {/* Description */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Description *</Text>
              <View
                style={[
                  styles.inputWrapper,
                  styles.textAreaWrapper,
                  errors.description && styles.inputError,
                ]}
              >
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  placeholder="Enter product description"
                  value={formData.description}
                  onChangeText={(value) =>
                    handleInputChange("description", value)
                  }
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
              {errors.description && (
                <Text style={styles.errorText}>{errors.description}</Text>
              )}
            </View>

            {/* Price & Stock Row */}
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Price ($) *</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    errors.price && styles.inputError,
                  ]}
                >
                  <FontAwesome
                    name="dollar"
                    size={20}
                    color="#666"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder="0.00"
                    value={formData.price}
                    onChangeText={(value) => handleInputChange("price", value)}
                    keyboardType="decimal-pad"
                  />
                </View>
                {errors.price && (
                  <Text style={styles.errorText}>{errors.price}</Text>
                )}
              </View>

              <View style={styles.halfInput}>
                <Text style={styles.label}>Stock *</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    errors.stock && styles.inputError,
                  ]}
                >
                  <FontAwesome
                    name="cubes"
                    size={20}
                    color="#666"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder="0"
                    value={formData.stock}
                    onChangeText={(value) => handleInputChange("stock", value)}
                    keyboardType="numeric"
                  />
                </View>
                {errors.stock && (
                  <Text style={styles.errorText}>{errors.stock}</Text>
                )}
              </View>
            </View>

            {/* Category */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Category</Text>
              {categoriesLoading ? (
                <View style={styles.loadingCategory}>
                  <ActivityIndicator size="small" color="#2a6ef7" />
                  <Text style={styles.loadingText}>Loading categories...</Text>
                </View>
              ) : (
                <View style={[styles.inputWrapper, styles.pickerWrapper]}>
                  <FontAwesome
                    name="tag"
                    size={20}
                    color="#666"
                    style={styles.inputIcon}
                  />
                  <Picker
                    selectedValue={formData.category}
                    style={styles.picker}
                    onValueChange={(value) =>
                      handleInputChange("category", value)
                    }
                  >
                    <Picker.Item
                      label="Select a category (optional)"
                      value=""
                    />
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

            {/* Image Upload */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Product Image</Text>
              {formData.file ? (
                <View style={styles.imagePreviewContainer}>
                  <Image
                    source={{ uri: formData.file.uri }}
                    style={styles.imagePreview}
                  />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={removeImage}
                  >
                    <FontAwesome name="times" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.imagePickerButton}
                  onPress={pickImage}
                >
                  <FontAwesome name="camera" size={24} color="#666" />
                  <Text style={styles.imagePickerText}>
                    Tap to select image
                  </Text>
                  <Text style={styles.placeholderText}>
                    (Placeholder image will be used if not selected)
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.resetButton}
                onPress={resetForm}
                disabled={loading}
              >
                <FontAwesome name="refresh" size={16} color="#666" />
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.submitButton, loading && styles.disabledButton]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <FontAwesome name="plus" size={16} color="#fff" />
                    <Text style={styles.submitButtonText}>Create Product</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Info Card */}
          <View style={styles.infoCard}>
            <FontAwesome name="info-circle" size={16} color="#2a6ef7" />
            <Text style={styles.infoText}>
              Fill in the product details. All fields marked with * are
              required. Images will be automatically resized and optimized.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateProductScreen;
