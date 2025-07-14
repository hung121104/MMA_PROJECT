import React from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { resetPassword } from '../api/auth';
import ResetPasswordScreenStyles from '../styles/ResetPasswordScreenStyles';
import * as yup from 'yup';
import useFormValidation from '../hook/useFormValidation';
import FormError from '../components/common/FormError';
import { getToken } from '../api/auth';

const resetSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  otp: yup.string().required('OTP is required'),
  newPassword: yup.string().min(6, 'Password must be at least 6 characters').required('New password is required'),
});

export default function ResetPasswordScreen({ navigation, route }) {
  const form = useFormValidation(
    { email: route?.params?.email || '', otp: '', newPassword: '' },
    resetSchema,
    async (values) => {
      try {
        const data = await resetPassword(values.email, values.otp, values.newPassword);
        if (data.success) {
          Alert.alert('Success', 'Your password has been reset.');
          const token = await getToken();
            navigation.navigate('Login');
        } else {
          Alert.alert('Error', data.message || 'Failed to reset password.');
        }
      } catch (err) {
        Alert.alert('Error', 'Something went wrong.');
      }
    }
  );

  return (
    <SafeAreaView style={ResetPasswordScreenStyles.container}>
      <Text style={ResetPasswordScreenStyles.title}>Reset Password</Text>
      <View style={ResetPasswordScreenStyles.inputContainer}>
        <TextInput
          style={ResetPasswordScreenStyles.input}
          placeholder="Enter your email address"
          value={form.values.email}
          onChangeText={text => form.handleChange('email', text)}
          autoCapitalize="none"
          keyboardType="email-address"
          onBlur={() => form.validate()}
        />
        <FormError error={form.errors.email} />
      </View>
      <View style={ResetPasswordScreenStyles.inputContainer}>
        <TextInput
          style={ResetPasswordScreenStyles.input}
          placeholder="Enter OTP"
          value={form.values.otp}
          onChangeText={text => form.handleChange('otp', text)}
          keyboardType="number-pad"
          onBlur={() => form.validate()}
        />
        <FormError error={form.errors.otp} />
      </View>
      <View style={ResetPasswordScreenStyles.inputContainer}>
        <TextInput
          style={ResetPasswordScreenStyles.input}
          placeholder="Enter new password"
          value={form.values.newPassword}
          onChangeText={text => form.handleChange('newPassword', text)}
          secureTextEntry
          onBlur={() => form.validate()}
        />
        <FormError error={form.errors.newPassword} />
      </View>
      <TouchableOpacity style={ResetPasswordScreenStyles.submitButton} onPress={form.handleSubmit} disabled={form.submitting}>
        <Text style={ResetPasswordScreenStyles.submitButtonText}>Reset Password</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
} 