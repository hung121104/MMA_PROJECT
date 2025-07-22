import { FontAwesome } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "../api/categories";
import { styles } from "../styles/CategoriesScreenStyles";

const CategoriesScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modal states for update
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updateCategoryName, setUpdateCategoryName] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);

  const fetchCategories = async (showLoading = true) => {
    if (showLoading) setLoading(true);

    try {
      const categoriesData = await getAllCategories();
      setCategories(categoriesData || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      Alert.alert("Error", "Failed to fetch categories. Please try again.", [
        { text: "OK" },
      ]);
      setCategories([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load categories when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchCategories();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCategories(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setUpdateCategoryName(category.category);
    setUpdateModalVisible(true);
  };

  const handleUpdateCategory = async () => {
    if (!updateCategoryName.trim()) {
      Alert.alert("Error", "Category name cannot be empty");
      return;
    }

    if (updateCategoryName.trim() === selectedCategory.category) {
      setUpdateModalVisible(false);
      return;
    }

    setUpdateLoading(true);
    try {
      await updateCategory(selectedCategory._id, updateCategoryName.trim());

      Alert.alert("Success", "Category updated successfully!", [
        { text: "OK" },
      ]);

      // Refresh the list
      await fetchCategories(false);
      setUpdateModalVisible(false);
    } catch (error) {
      console.error("Update category error:", error);

      let errorMessage = "Failed to update category. Please try again.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDeleteCategory = (category) => {
    Alert.alert(
      "Delete Category",
      `Are you sure you want to delete "${category.category}"?\n\nThis action cannot be undone.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCategory(category._id);

              Alert.alert("Success", "Category deleted successfully!", [
                { text: "OK" },
              ]);

              // Refresh the list
              await fetchCategories(false);
            } catch (error) {
              console.error("Delete category error:", error);

              let errorMessage = "Failed to delete category. Please try again.";
              if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
              } else if (error.message) {
                errorMessage = error.message;
              }

              Alert.alert("Error", errorMessage);
            }
          },
        },
      ]
    );
  };

  const renderCategoryItem = ({ item, index }) => (
    <View style={styles.categoryCard}>
      <View style={styles.categoryHeader}>
        <View style={styles.categoryIcon}>
          <FontAwesome name="tag" size={20} color="#2a6ef7" />
        </View>
        <View style={styles.categoryContent}>
          <Text style={styles.categoryName}>{item.category}</Text>
          <Text style={styles.categoryId}>ID: {item._id}</Text>
        </View>
        <View style={styles.categoryIndex}>
          <Text style={styles.indexText}>#{index + 1}</Text>
        </View>
      </View>

      <View style={styles.categoryFooter}>
        <View style={styles.dateInfo}>
          <FontAwesome name="calendar" size={12} color="#666" />
          <Text style={styles.dateText}>
            Created: {formatDate(item.createdAt)}
          </Text>
        </View>
        {item.updatedAt !== item.createdAt && (
          <View style={styles.dateInfo}>
            <FontAwesome name="edit" size={12} color="#666" />
            <Text style={styles.dateText}>
              Updated: {formatDate(item.updatedAt)}
            </Text>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEditCategory(item)}
          activeOpacity={0.8}
        >
          <FontAwesome name="edit" size={16} color="#fff" />
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteCategory(item)}
          activeOpacity={0.8}
        >
          <FontAwesome name="trash" size={16} color="#fff" />
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <FontAwesome name="folder-open" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No Categories Found</Text>
      <Text style={styles.emptySubtitle}>
        Create your first category to get started
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => navigation.navigate("CreateCategory")}
      >
        <FontAwesome name="plus" size={16} color="#fff" />
        <Text style={styles.emptyButtonText}>Create Category</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <FontAwesome name="list" size={24} color="#2a6ef7" />
        <Text style={styles.headerTitle}>Categories</Text>
      </View>
      <View style={styles.headerRight}>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{categories.length}</Text>
        </View>
      </View>
    </View>
  );

  const renderUpdateModal = () => (
    <Modal
      visible={updateModalVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setUpdateModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <FontAwesome name="edit" size={24} color="#2a6ef7" />
            <Text style={styles.modalTitle}>Update Category</Text>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.modalLabel}>Category Name</Text>
            <TextInput
              style={styles.modalInput}
              value={updateCategoryName}
              onChangeText={setUpdateCategoryName}
              placeholder="Enter category name"
              autoFocus
              selectTextOnFocus
            />
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setUpdateModalVisible(false)}
              disabled={updateLoading}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modalUpdateButton,
                updateLoading && styles.disabledButton,
              ]}
              onPress={handleUpdateCategory}
              disabled={updateLoading || !updateCategoryName.trim()}
            >
              {updateLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.modalUpdateText}>Update</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2a6ef7" />
          <Text style={styles.loadingText}>Loading categories...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}

      <FlatList
        data={categories}
        keyExtractor={(item) => item._id}
        renderItem={renderCategoryItem}
        contentContainerStyle={[
          styles.listContainer,
          categories.length === 0 && styles.emptyListContainer,
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#2a6ef7"
            colors={["#2a6ef7"]}
          />
        }
        ListEmptyComponent={renderEmptyState}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CreateCategory")}
        activeOpacity={0.8}
      >
        <FontAwesome name="plus" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Update Modal */}
      {renderUpdateModal()}
    </SafeAreaView>
  );
};

export default CategoriesScreen;
