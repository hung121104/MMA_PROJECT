import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
  ScrollView,
  RefreshControl,
  TextInput,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { removeToken, requestResetPassword } from "../api/auth";
import { updateProfile, updateProfilePicture } from "../api/users"; // Import both APIs
import ProfileScreenStyles from "../styles/ProfileScreenStyles";
import GlobalStyles, { colors } from "../styles/GlobalStyles";
import { useUserProfile } from "../hook/useUserProfile";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

export default function ProfileScreen({ onLogout, navigation }) {
  const [loggingOut, setLoggingOut] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [updating, setUpdating] = useState(false);
  const [updatingAvatar, setUpdatingAvatar] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const { user, loading, error, refresh } = useUserProfile();

  const handleLogout = async () => {
    setLoggingOut(true);
    await removeToken();
    if (onLogout) {
      onLogout();
    } else if (navigation && navigation.navigate) {
      navigation.navigate("Login");
    }
    setLoggingOut(false);
  };

  // Change Password Handler
  const handleChangePassword = () => {
    navigation.navigate("UpdatePassword");
  };

  // Edit Name Handler
  const handleEditName = () => {
    setNewName(user?.name || "");
    setShowEditModal(true);
  };

  // Update Name Handler
  const handleUpdateName = async () => {
    if (!newName.trim()) {
      Alert.alert("Error", "Name cannot be empty");
      return;
    }

    if (newName.trim() === user?.name) {
      setShowEditModal(false);
      return;
    }

    setUpdating(true);
    try {
      await updateProfile({ name: newName.trim() });
      Alert.alert("Success", "Name updated successfully");
      setShowEditModal(false);
      refresh();
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to update name");
    } finally {
      setUpdating(false);
    }
  };

  // Avatar Selection Handler
  const handleAvatarPress = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        quality: 0.8,
        allowsEditing: true,
        aspect: [1, 1],
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setSelectedImage({
          uri: asset.uri,
          type: asset.type || "image/jpeg",
          fileName: asset.fileName || `avatar-${Date.now()}.jpg`,
        });
        setShowAvatarModal(true);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  // Update Avatar Handler
  const handleUpdateAvatar = async () => {
    if (!selectedImage) return;

    setUpdatingAvatar(true);
    try {
      await updateProfilePicture(selectedImage);
      Alert.alert("Success", "Profile picture updated successfully");
      setShowAvatarModal(false);
      setSelectedImage(null);
      refresh();
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to update profile picture");
    } finally {
      setUpdatingAvatar(false);
    }
  };

  // Cancel Avatar Update
  const handleCancelAvatar = () => {
    setSelectedImage(null);
    setShowAvatarModal(false);
  };

  // Pull-to-refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        style={{ backgroundColor: "#fff" }}
        contentContainerStyle={ProfileScreenStyles.container}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header */}
        <Text style={ProfileScreenStyles.headerTitle}>Profile</Text>

        {/* Avatar */}
        <View style={ProfileScreenStyles.avatarContainer}>
          <TouchableOpacity onPress={handleAvatarPress}>
            <Image
              source={
                user?.profilePic?.url
                  ? { uri: user.profilePic.url }
                  : require("../assets/icon.png")
              }
              style={ProfileScreenStyles.avatar}
              onError={() => {
                console.log("Failed to load profile image, using default");
              }}
            />
            <View style={ProfileScreenStyles.editIconContainer}>
              <Text style={ProfileScreenStyles.editIcon}>✏️</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* User Info */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={{ marginTop: 32 }}
          />
        ) : error ? (
          <View style={ProfileScreenStyles.centered}>
            <Text style={ProfileScreenStyles.errorText}>
              Error: {error.message}
            </Text>
            <TouchableOpacity
              onPress={refresh}
              style={ProfileScreenStyles.retryButton}
            >
              <Text style={ProfileScreenStyles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : user ? (
          <View style={ProfileScreenStyles.infoSection}>
            <Text style={ProfileScreenStyles.sectionTitle}>
              Personal Details
            </Text>
            <View style={ProfileScreenStyles.inputGroup}>
              <View style={ProfileScreenStyles.nameHeader}>
                <Text style={ProfileScreenStyles.inputLabel}>Name</Text>
                <TouchableOpacity onPress={handleEditName}>
                  <Text style={ProfileScreenStyles.editText}>Edit</Text>
                </TouchableOpacity>
              </View>
              <View style={ProfileScreenStyles.inputBox}>
                <Text style={ProfileScreenStyles.inputText}>{user.name}</Text>
              </View>
            </View>
            <View style={ProfileScreenStyles.inputGroup}>
              <Text style={ProfileScreenStyles.inputLabel}>Email Address</Text>
              <View style={ProfileScreenStyles.inputBox}>
                <Text style={ProfileScreenStyles.inputText}>{user.email}</Text>
              </View>
              {/* Change Password Button */}
              <TouchableOpacity
                style={ProfileScreenStyles.changePasswordButton}
                onPress={handleChangePassword}
              >
                <Text style={ProfileScreenStyles.changePasswordButtonText}>
                  Change Password
                </Text>
              </TouchableOpacity>
            </View>
            <View style={ProfileScreenStyles.inputGroup}>
              <Text style={ProfileScreenStyles.inputLabel}>Role</Text>
              <View style={ProfileScreenStyles.inputBox}>
                <Text style={ProfileScreenStyles.inputText}>{user.role}</Text>
              </View>
            </View>
          </View>
        ) : (
          <Text style={ProfileScreenStyles.noDataText}>
            No user data found.
          </Text>
        )}

        {/* Logout Button */}
        <TouchableOpacity
          style={ProfileScreenStyles.logoutButton}
          onPress={handleLogout}
          disabled={loggingOut}
        >
          <Text style={ProfileScreenStyles.logoutButtonText}>
            {loggingOut ? "Logging out..." : "Log Out"}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Name Modal */}
      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={ProfileScreenStyles.modalOverlay}>
          <View style={ProfileScreenStyles.modalContent}>
            <Text style={ProfileScreenStyles.modalTitle}>Edit Name</Text>

            <TextInput
              style={ProfileScreenStyles.modalInput}
              value={newName}
              onChangeText={setNewName}
              placeholder="Enter your name"
              autoFocus={true}
            />

            <View style={ProfileScreenStyles.modalButtons}>
              <TouchableOpacity
                style={ProfileScreenStyles.modalCancelButton}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={ProfileScreenStyles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={ProfileScreenStyles.modalSaveButton}
                onPress={handleUpdateName}
                disabled={updating}
              >
                <Text style={ProfileScreenStyles.modalSaveText}>
                  {updating ? "Saving..." : "Save"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Avatar Update Modal */}
      <Modal
        visible={showAvatarModal}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCancelAvatar}
      >
        <View style={ProfileScreenStyles.modalOverlay}>
          <View style={ProfileScreenStyles.modalContent}>
            <Text style={ProfileScreenStyles.modalTitle}>
              Update Profile Picture
            </Text>

            {selectedImage && (
              <View style={ProfileScreenStyles.avatarPreviewContainer}>
                <Image
                  source={{ uri: selectedImage.uri }}
                  style={ProfileScreenStyles.avatarPreview}
                />
              </View>
            )}

            <View style={ProfileScreenStyles.modalButtons}>
              <TouchableOpacity
                style={ProfileScreenStyles.modalCancelButton}
                onPress={handleCancelAvatar}
              >
                <Text style={ProfileScreenStyles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={ProfileScreenStyles.modalSaveButton}
                onPress={handleUpdateAvatar}
                disabled={updatingAvatar}
              >
                <Text style={ProfileScreenStyles.modalSaveText}>
                  {updatingAvatar ? "Updating..." : "Update"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
