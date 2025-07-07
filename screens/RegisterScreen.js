// ... existing imports ...
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { requestRegister, registerUser } from '../api/auth';

const RegisterScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [otp, setOtp] = useState('');

  const handleRequestRegister = async () => {
    if (form.password !== form.confirmPassword) {
      Alert.alert('Passwords do not match');
      return;
    }
    if (!form.name || !form.email || !form.phone || !form.password) {
      Alert.alert('Please fill all fields');
      return;
    }
    try {
      const res = await requestRegister({ name: form.name, email: form.email, password: form.password, phone: form.phone });
      console.log('Register response:', res);
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
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <Text style={{ fontSize: 32, fontWeight: 'bold' }}>Create an{"\n"}account</Text>
      {step === 1 ? (
        <>
          <TextInput
            placeholder="Full Name"
            value={form.name}
            onChangeText={text => setForm({ ...form, name: text })}
            style={{ /* your styles */ }}
          />
          <TextInput
            placeholder="Email"
            value={form.email}
            onChangeText={text => setForm({ ...form, email: text })}
            keyboardType="email-address"
            style={{ /* your styles */ }}
          />
          <TextInput
            placeholder="Phone Number"
            value={form.phone}
            onChangeText={text => setForm({ ...form, phone: text })}
            keyboardType="phone-pad"
            style={{ /* your styles */ }}
          />
          <TextInput
            placeholder="Password"
            secureTextEntry
            value={form.password}
            onChangeText={text => setForm({ ...form, password: text })}
            style={{ /* your styles */ }}
          />
          <TextInput
            placeholder="Confirm Password"
            secureTextEntry
            value={form.confirmPassword}
            onChangeText={text => setForm({ ...form, confirmPassword: text })}
            style={{ /* your styles */ }}
          />
          <TouchableOpacity onPress={handleRequestRegister} style={{ /* button styles */ }}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Create Account</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            placeholder="Enter OTP"
            value={otp}
            onChangeText={setOtp}
            style={{ /* your styles */ }}
          />
          <TouchableOpacity onPress={handleRegister} style={{ /* button styles */ }}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Verify & Register</Text>
          </TouchableOpacity>
        </>
      )}
      {/* Add social login and navigation to LoginScreen as in your design */}
    </View>
  );
};

export default RegisterScreen;