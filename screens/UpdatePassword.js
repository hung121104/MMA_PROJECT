import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { updatePassword } from '../api/users';
import ProfileScreenStyles from '../styles/ProfileScreenStyles';
import { colors } from '../styles/GlobalStyles';
import { getToken } from '../api/users'; // If you want to check login status
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function UpdatePasswordScreen() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [updating, setUpdating] = useState(false);
  const navigation = useNavigation();

  const handleUpdatePassword = async () => {
    if (!oldPassword || !newPassword) {
      Alert.alert('Error', 'Please enter both old and new passwords.');
      return;
    }
    setUpdating(true);
    try {
      const data = await updatePassword(oldPassword, newPassword);
      if (data && data.success) {
        Alert.alert('Success', 'Password updated successfully.');
        setOldPassword('');
        setNewPassword('');
        navigation.goBack();
      } else {
        Alert.alert('Error', data?.message || 'Failed to update password.');
      }
    } catch (err) {
      Alert.alert('Error', err?.message || 'Something went wrong.');
    }
    setUpdating(false);
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView
        style={{ backgroundColor: '#fff' }}
        contentContainerStyle={ProfileScreenStyles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={ProfileScreenStyles.headerTitle}>Update Password</Text>
        <View style={ProfileScreenStyles.infoSection}>
          <View style={ProfileScreenStyles.inputGroup}>
            <Text style={ProfileScreenStyles.inputLabel}>Old Password</Text>
            <View style={ProfileScreenStyles.inputBox}>
              <TextInput
                value={oldPassword}
                onChangeText={setOldPassword}
                placeholder="Enter old password"
                secureTextEntry
                style={ProfileScreenStyles.inputText}
              />
            </View>
          </View>
          <View style={ProfileScreenStyles.inputGroup}>
            <Text style={ProfileScreenStyles.inputLabel}>New Password</Text>
            <View style={ProfileScreenStyles.inputBox}>
              <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                secureTextEntry
                style={ProfileScreenStyles.inputText}
              />
            </View>
          </View>
          <TouchableOpacity
            style={ProfileScreenStyles.refreshButton}
            onPress={handleUpdatePassword}
            disabled={updating}
          >
            {updating ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={ProfileScreenStyles.refreshButtonText}>Update Password</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginTop: 16, alignSelf: 'center' }}
            onPress={handleForgotPassword}
          >
            <Text style={{ color: colors.primary, fontWeight: '500', fontSize: 15 }}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 