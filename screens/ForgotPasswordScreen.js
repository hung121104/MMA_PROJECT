import React from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Image, Alert } from 'react-native';
import {FontAwesome } from '@expo/vector-icons';
import { requestResetPassword } from '../api/auth';
import styles from '../styles/ForgotPasswordScreenStyles';
import GlobalStyles from '../styles/GlobalStyles';
import * as yup from 'yup';
import useFormValidation from '../hook/useFormValidation';
import FormError from '../components/common/FormError';

const forgotSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
});

export default function ForgotPasswordScreen({ navigation }) {
  const form = useFormValidation(
    { email: '' },
    forgotSchema,
    async (values) => {
      try {
        const data = await requestResetPassword(values.email);
        if (data.success) {
          Alert.alert('Success', 'We have sent you a message to set or reset your new password.');
          navigation.navigate('ResetPassword', { email: values.email });
        } else {
          Alert.alert('Error', data.message || 'Failed to send reset email.');
        }
      } catch (err) {
        Alert.alert('Error', 'Something went wrong.');
      }
    }
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={[styles.title, GlobalStyles.textPrimary]}>Forgot{"\n"}password?</Text>
      <View style={styles.inputContainer}>
        <FontAwesome name="envelope" size={20} color="#888"  />
        <TextInput
          style={styles.input}
          placeholder="Enter your email address"
          value={form.values.email}
          onChangeText={text => form.handleChange('email', text)}
          autoCapitalize="none"
          keyboardType="email-address"
          onBlur={() => form.validate()}
        />
        <FormError error={form.errors.email} />
      </View>
      <Text style={styles.infoText}>
        <Text style={GlobalStyles.textError}>* </Text>
        We will send you a message to set or reset your new password
      </Text>
      <TouchableOpacity style={styles.submitButton} onPress={form.handleSubmit} disabled={form.submitting}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
} 