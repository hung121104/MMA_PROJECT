import { StyleSheet } from 'react-native';
import GlobalStyles from './GlobalStyles';

const styles = StyleSheet.create({
  container: {
    ...GlobalStyles.container,
    // Add or override any LoginScreen-specific container styles here
  },
  title: {
    ...GlobalStyles.title,
    fontSize: 36,
    marginTop: 32,
    marginBottom: 32,
    lineHeight: 40,
  },
  inputContainer: {
    ...GlobalStyles.inputContainer,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    ...GlobalStyles.input,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#2563eb',
  },
  loginButton: {
    ...GlobalStyles.button,
  },
  loginButtonText: {
    ...GlobalStyles.buttonText,
  },
  orText: {
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: 16,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  socialButton: {
    ...GlobalStyles.iconButton,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  signupText: {
    color: '#6b7280',
  },
  signupLink: {
    color: '#2563eb',
    fontWeight: 'bold',
  },
});

export default styles; 