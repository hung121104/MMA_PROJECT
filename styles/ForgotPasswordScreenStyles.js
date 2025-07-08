import { StyleSheet } from 'react-native';
import GlobalStyles from './GlobalStyles';

const styles = StyleSheet.create({
  container: {
    ...GlobalStyles.container,
    paddingTop: 40,
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
    height: 56,
  },
  inputIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
    tintColor: '#888',
  },
  input: {
    ...GlobalStyles.input,
  },
  infoText: {
    ...GlobalStyles.textMuted,
    marginBottom: 32,
    fontSize: 14,
  },
  submitButton: {
    ...GlobalStyles.button,
    marginTop: 8,
  },
  submitButtonText: {
    ...GlobalStyles.buttonText,
  },
});

export default styles; 