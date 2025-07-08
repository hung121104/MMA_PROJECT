// ... existing imports ...
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { requestRegister, registerUser } from '../api/auth';
import styles from '../styles/RegisterScreenStyles';
import GlobalStyles from '../styles/GlobalStyles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const RegisterScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRequestRegister = async () => {
    if (form.password !== form.confirmPassword) {
      Alert.alert('Passwords do not match');
      return;
    }
    if (!form.name || !form.email || !form.password) {
      Alert.alert('Please fill all fields');
      return;
    }
    try {
      const res = await requestRegister({ name: form.name, email: form.email, password: form.password});
      if (res.success) {
        setStep(2);
        Alert.alert('OTP sent to your email');
      } else {
        Alert.alert(res.message || 'Failed to send OTP');
      }
    } catch (err) {
      Alert.alert('Network or server error');
    }
  };

  const handleRegister = async () => {
    if (!otp) {
      Alert.alert('Please enter the OTP');
      return;
    }
    try {
      const res = await registerUser({ email: form.email, otp });
      if (res.success) {
        Alert.alert('Registration successful');
        navigation.navigate('Login');
      } else {
        Alert.alert(res.message || 'Registration failed');
      }
    } catch (err) {
      Alert.alert('Network or server error');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, GlobalStyles.textPrimary]}>Create an{"\n"}account</Text>
      {step === 1 ? (
        <>
          {/* Name Field */}
          <View style={styles.inputContainer}>
            <FontAwesome name="user" size={20} color="#888" style={styles.inputIcon} />
            <TextInput
              placeholder="Full Name"
              value={form.name}
              onChangeText={text => setForm({ ...form, name: text })}
              style={styles.input}
              placeholderTextColor="#888"
            />
          </View>
          {/* Email Field */}
          <View style={styles.inputContainer}>
            <FontAwesome name="envelope" size={20} color="#888" style={styles.inputIcon} />
            <TextInput
              placeholder="Email"
              value={form.email}
              onChangeText={text => setForm({ ...form, email: text })}
              style={styles.input}
              placeholderTextColor="#888"
            />
          </View>
          {/* Password Field */}
          <View style={styles.inputContainer}>
            <FontAwesome name="lock" size={20} color="#888" style={styles.inputIcon} />
            <TextInput
              placeholder="Password"
              secureTextEntry={!showPassword}
              value={form.password}
              onChangeText={text => setForm({ ...form, password: text })}
              style={styles.input}
              placeholderTextColor="#888"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <FontAwesome name={showPassword ? 'eye-slash' : 'eye'} size={20} color="#888" />
            </TouchableOpacity>
          </View>
          {/* Confirm Password Field */}
          <View style={styles.inputContainer}>
            <FontAwesome name="lock" size={20} color="#888" style={styles.inputIcon} />
            <TextInput
              placeholder="ConfirmPassword"
              secureTextEntry={!showConfirmPassword}
              value={form.confirmPassword}
              onChangeText={text => setForm({ ...form, confirmPassword: text })}
              style={styles.input}
              placeholderTextColor="#888"
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <FontAwesome name={showConfirmPassword ? 'eye-slash' : 'eye'} size={20} color="#888" />
            </TouchableOpacity>
          </View>
          <Text style={GlobalStyles.textMuted}>
            By clicking the <Text style={GlobalStyles.textError}>Register</Text> button, you agree{"\n"}to the public offer
          </Text>
          <TouchableOpacity onPress={handleRequestRegister} style={styles.button}>
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>
          <Text style={GlobalStyles.textMuted}>- OR Continue with -</Text>
          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialIcon}>
              <FontAwesome name="google" size={24} color="#EA4335" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon}>
              <FontAwesome name="apple" size={24} color="#111" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon}>
              <FontAwesome name="facebook" size={24} color="#1877F3" />
            </TouchableOpacity>
          </View>
          <View style={styles.loginRow}>
            <Text style={GlobalStyles.textPrimary}>I Already Have an Account</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={GlobalStyles.textError}>Login</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Enter OTP"
              value={otp}
              onChangeText={setOtp}
              style={styles.input}
              placeholderTextColor="#888"
            />
          </View>
          <TouchableOpacity onPress={handleRegister} style={styles.button}>
            <Text style={styles.buttonText}>Verify & Register</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default RegisterScreen;