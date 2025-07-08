import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { loginUser, setToken } from '../api/auth';
import styles from '../styles/LoginScreenStyles';
import GlobalStyles from '../styles/GlobalStyles';

export default function LoginScreen({ navigation, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await loginUser(email, password);
      if (res && res.token) {
        await setToken(res.token);
        onLoginSuccess();
      } else {
        Alert.alert('Login Failed', res.message || 'Invalid credentials');
      }
    } catch (err) {
      Alert.alert('Login Failed', err?.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={[styles.title, GlobalStyles.textPrimary]}>Welcome{"\n"}Back!</Text>
      {/* Username/Email Input */}
      <View style={styles.inputContainer}>
        <FontAwesome name="user" size={20} color="#888" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Username or Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
      </View>
      {/* Password Input */}
      <View style={styles.inputContainer}>
        <FontAwesome name="lock" size={20} color="#888" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color="#888" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.forgotPassword} onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={GlobalStyles.textError}>Forgot Password?</Text>
      </TouchableOpacity>
      {/* Login Button */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={GlobalStyles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>
      {/* OR Continue with */}
      <Text style={GlobalStyles.textMuted}>- OR Continue with -</Text>
      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton} onPress={() => {}}>
          <FontAwesome name="google" size={24} color="#EA4335" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton} onPress={() => {}}>
          <FontAwesome name="apple" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton} onPress={() => {}}>
          <FontAwesome name="facebook" size={24} color="#1877F3" />
        </TouchableOpacity>
      </View>
      {/* Sign Up Link */}
      <View style={styles.signupContainer}>
        <Text style={GlobalStyles.textMuted}>Create An Account </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={GlobalStyles.textError}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
