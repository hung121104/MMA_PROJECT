import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Image, Alert, StyleSheet } from 'react-native';
import { requestResetPassword } from '../api/auth';

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
      <Text style={styles.title}>Forgot{"\n"}password?</Text>
      <View style={styles.inputContainer}>
        <Image source={require('../assets/icon.png')} style={styles.inputIcon} />
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
        <Text style={{ color: '#F43F5E' }}>* </Text>
        We will send you a message to set or reset your new password
      </Text>
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 32,
    marginBottom: 32,
    lineHeight: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    height: 56,
  },
  inputIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
    tintColor: '#888',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  infoText: {
    color: '#6b7280',
    marginBottom: 32,
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#F43F5E',
    borderRadius: 10,
    paddingVertical: 16,
    marginBottom: 24,
    marginTop: 8,
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 