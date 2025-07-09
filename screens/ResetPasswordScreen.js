import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { resetPassword } from '../api/auth';
import ResetPasswordScreenStyles from '../styles/ResetPasswordScreenStyles';

export default function ResetPasswordScreen({ navigation, route }) {
  const [email, setEmail] = useState(route?.params?.email || '');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !otp || !newPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const data = await resetPassword(email, otp, newPassword);
      if (data.success) {
        Alert.alert('Success', 'Your password has been reset.');
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', data.message || 'Failed to reset password.');
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={ResetPasswordScreenStyles.container}>
      <Text style={ResetPasswordScreenStyles.title}>Reset Password</Text>
      <View style={ResetPasswordScreenStyles.inputContainer}>
        <TextInput
          style={ResetPasswordScreenStyles.input}
          placeholder="Enter your email address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>
      <View style={ResetPasswordScreenStyles.inputContainer}>
        <TextInput
          style={ResetPasswordScreenStyles.input}
          placeholder="Enter OTP"
          value={otp}
          onChangeText={setOtp}
          keyboardType="number-pad"
        />
      </View>
      <View style={ResetPasswordScreenStyles.inputContainer}>
        <TextInput
          style={ResetPasswordScreenStyles.input}
          placeholder="Enter new password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />
      </View>
      <TouchableOpacity style={ResetPasswordScreenStyles.submitButton} onPress={handleSubmit} disabled={loading}>
        <Text style={ResetPasswordScreenStyles.submitButtonText}>Reset Password</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
} 