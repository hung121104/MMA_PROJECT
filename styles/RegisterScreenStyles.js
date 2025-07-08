import { StyleSheet } from 'react-native';
import GlobalStyles from './GlobalStyles';

const styles = StyleSheet.create({
  container: {
    ...GlobalStyles.container,
    // Add or override any RegisterScreen-specific container styles here
  },
  title: {
    ...GlobalStyles.title,
    fontSize: 32,
    marginBottom: 32,
  },
  input: {
    ...GlobalStyles.input,
  },
  inputContainer: {
    ...GlobalStyles.inputContainer,
  },
  button: {
    ...GlobalStyles.button,
  },
  buttonText: {
    ...GlobalStyles.buttonText,
  },
  agreement: {
    fontSize: 13,
    color: '#888',
    marginBottom: 16,
    textAlign: 'left',
  },
  agreementHighlight: {
    color: '#FF3B5C',
    fontWeight: 'bold',
  },
  or: {
    textAlign: 'center',
    color: '#888',
    marginVertical: 16,
    fontSize: 14,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  socialIcon: {
    ...GlobalStyles.iconButton,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  loginText: {
    color: '#111',
    fontSize: 14,
  },
  loginLink: {
    color: '#FF3B5C',
    fontWeight: 'bold',
    marginLeft: 4,
    fontSize: 14,
  },
});

export default styles; 