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
import { createProduct } from "../api/products";
import { styles } from "../styles/CreateProductScreenStyles";
import OptimizedImage from "../components/OptimizedImage"; // Add this import

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

    if (!formData.file) {
      newErrors.file = "Product image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        quality: 0.8,
        allowsEditing: true,
        aspect: [1, 1],
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

        // Clear image error if it exists
        if (errors.file) {
          setErrors((prev) => ({
            ...prev,
            file: "",
          }));
        }
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

      console.log("📤 Creating product:", productPayload);

      const result = await createProduct(productPayload);

      console.log("✅ Product created successfully:", result);

      Alert.alert("Success", "Product created successfully!", [
        {
          text: "OK",
          onPress: () => {
            navigation.goBack();
          },
        },
      ]);
    } catch (error) {
      console.error("❌ Create product error:", error);

      let userMessage = "Failed to create product. Please try again.";
      if (error.message) {
        userMessage = error.message;
      }

      Alert.alert("Error Creating Product", userMessage, [{ text: "OK" }]);
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
          {/* Header */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>Create New Product</Text>
            <Text style={styles.subtitle}>
              Fill in the details to add a new product to your inventory
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
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
                      console.log("🔄 Category selected:", value);
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
            <Text style={styles.sectionTitle}>
              Product Image <Text style={styles.required}>*</Text>
            </Text>

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
                    onPress={pickImage}
                    style={[styles.imageButton, styles.changeButton]}
                  >
                    <FontAwesome name="camera" size={16} color="#fff" />
                    <Text style={styles.buttonText}>Change Image</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={removeImage}
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
                style={[
                  styles.imagePickerButton,
                  errors.file && styles.imagePickerError,
                ]}
              >
                <FontAwesome name="camera" size={32} color="#999" />
                <Text style={styles.imagePickerText}>Select Product Image</Text>
                <Text style={styles.imagePickerSubtext}>
                  Tap to choose from gallery
                </Text>
              </TouchableOpacity>
            )}
            {renderFormError("file")}
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
                <FontAwesome name="plus" size={18} color="#fff" />
                <Text style={styles.submitButtonText}>Create Product</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateProductScreen;
