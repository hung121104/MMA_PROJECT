import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
  ScrollView,
  RefreshControl
} from 'react-native';
import { removeToken, requestResetPassword } from '../api/auth';
import ProfileScreenStyles from '../styles/ProfileScreenStyles';
import GlobalStyles, { colors } from '../styles/GlobalStyles';
import { useUserProfile } from '../hook/useUserProfile';
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen({ onLogout, navigation }) {
  const [loggingOut, setLoggingOut] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { user, loading, error, refresh } = useUserProfile();

  const handleLogout = async () => {
    setLoggingOut(true);
    await removeToken();
    if (onLogout) {
      onLogout();
    } else if (navigation && navigation.navigate) {
      navigation.navigate('Login');
    }
    setLoggingOut(false);
  };

  // Change Password Handler (now navigates to UpdatePassword screen)
  const handleChangePassword = () => {
    navigation.navigate('UpdatePassword');
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView
        style={{ backgroundColor: '#fff' }}
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
          <Image
            source={require('../assets/icon.png')}
            style={ProfileScreenStyles.avatar}
          />
        </View>

        {/* User Info */}
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 32 }} />
        ) : error ? (
          <View style={ProfileScreenStyles.centered}>
            <Text style={ProfileScreenStyles.errorText}>Error: {error.message}</Text>
            <TouchableOpacity onPress={refresh} style={ProfileScreenStyles.retryButton}>
              <Text style={ProfileScreenStyles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : user ? (
          <View style={ProfileScreenStyles.infoSection}>
            <Text style={ProfileScreenStyles.sectionTitle}>Personal Details</Text>
            <View style={ProfileScreenStyles.inputGroup}>
              <Text style={ProfileScreenStyles.inputLabel}>Name</Text>
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
                <Text style={ProfileScreenStyles.changePasswordButtonText}>Change Password</Text>
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
          <Text style={ProfileScreenStyles.noDataText}>No user data found.</Text>
        )}

        {/* Logout Button */}
        <TouchableOpacity
          style={ProfileScreenStyles.logoutButton}
          onPress={handleLogout}
          disabled={loggingOut}
        >
          <Text style={ProfileScreenStyles.logoutButtonText}>
            {loggingOut ? 'Logging out...' : 'Log Out'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
