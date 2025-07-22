import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
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
import { createCategory } from "../api/categories";
import { styles } from "../styles/CreateCategoryScreenStyles";

const CreateCategoryScreen = () => {
  const [formData, setFormData] = useState({
    category: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.category.trim()) {
      newErrors.category = "Category name is required";
    } else if (formData.category.trim().length < 2) {
      newErrors.category = "Category name must be at least 2 characters";
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

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await createCategory({
        category: formData.category.trim(),
      });

      Alert.alert("Success", "Category created successfully!", [
        {
          text: "OK",
          onPress: () => {
            // Reset form
            setFormData({ category: "" });
            setErrors({});
          },
        },
      ]);
    } catch (error) {
      console.error("Create category error:", error);

      let errorMessage = "Failed to create category. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ category: "" });
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
            <Text style={styles.title}>Create New Category</Text>
            <Text style={styles.subtitle}>Add a new product category</Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Category Name *</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.category && styles.inputError,
                ]}
              >
                <FontAwesome
                  name="tag"
                  size={20}
                  color="#666"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter category name (e.g., Electronics, Clothing)"
                  value={formData.category}
                  onChangeText={(value) => handleInputChange("category", value)}
                  autoCapitalize="words"
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                />
              </View>
              {errors.category && (
                <Text style={styles.errorText}>{errors.category}</Text>
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
                disabled={loading || !formData.category.trim()}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <FontAwesome name="plus" size={16} color="#fff" />
                    <Text style={styles.submitButtonText}>Create Category</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Info Card */}
          <View style={styles.infoCard}>
            <FontAwesome name="info-circle" size={16} color="#2a6ef7" />
            <Text style={styles.infoText}>
              Categories help organize products and make it easier for customers
              to find what they're looking for.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateCategoryScreen;
