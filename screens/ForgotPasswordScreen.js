import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Image, Alert } from 'react-native';
import {FontAwesome } from '@expo/vector-icons';
import { requestResetPassword } from '../api/auth';
import styles from '../styles/ForgotPasswordScreenStyles';
import GlobalStyles from '../styles/GlobalStyles';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }
    setLoading(true);
    try {
      const data = await requestResetPassword(email);
      if (data.success) {
        Alert.alert('Success', 'We have sent you a message to set or reset your new password.');
        navigation.navigate('ResetPassword', { email });
      } else {
        Alert.alert('Error', data.message || 'Failed to send reset email.');
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={[styles.title, GlobalStyles.textPrimary]}>Forgot{"\n"}password?</Text>
      <View style={styles.inputContainer}>
      <FontAwesome name="envelope" size={20} color="#888"  />
        <TextInput
          style={styles.input}
          placeholder="Enter your email address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>
      <Text style={styles.infoText}>
        <Text style={GlobalStyles.textError}>* </Text>
        We will send you a message to set or reset your new password
      </Text>
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
} 