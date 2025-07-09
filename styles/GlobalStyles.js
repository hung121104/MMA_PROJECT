import { StyleSheet } from 'react-native';

const GlobalStyles = StyleSheet.create({
  // Input and Button
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 16,
    marginBottom: 24,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Text Color Styles
  textPrimary: {
    color: '#111',
  },
  textSecondary: {
    color: '#333',
  },
  textMuted: {
    color: '#888',
  },
  textError: {
    color: '#2563eb',
  },
  // Text Styles
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111',
  },
  subtitle: {
    fontSize: 20,
    color: '#333',
  },
  bodyText: {
    fontSize: 16,
    color: '#444',
  },
  errorText: {
    color: '#2563eb',
    fontSize: 14,
  },
  // Container/Card
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  // Spacing Utilities
  mb16: { marginBottom: 16 },
  mt16: { marginTop: 16 },
  ph24: { paddingHorizontal: 24 },
  // Icon Button
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 999,
    marginHorizontal: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Divider
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 16,
  },
});

export const colors = {
  background: '#f8f8f8',
  secondary: '#fff',
  card: '#fff',
  border: '#eee',
  primary: '#2563eb',
  primaryBlue: '#2563eb',
  textPrimary: '#111',
  textSecondary: '#333',
  textMuted: '#888',
  textError: '#2563eb',
  success: '#10b981',
  warning: '#f59e0b',
  info: '#3b82f6',
  lightGray: '#f3f4f6',
  mediumGray: '#6b7280',
  darkGray: '#374151',
  // Add any other colors you need
};

export default GlobalStyles; 