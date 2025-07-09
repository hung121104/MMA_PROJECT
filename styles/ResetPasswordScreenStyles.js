import { StyleSheet } from 'react-native';
import GlobalStyles, { colors } from './GlobalStyles';

const ResetPasswordScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.card,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    ...GlobalStyles.title,
    fontSize: 32,
    marginTop: 32,
    marginBottom: 32,
    lineHeight: 40,
  },
  inputContainer: {
    ...GlobalStyles.inputContainer,
    height: 56,
  },
  input: {
    ...GlobalStyles.input,
  },
  submitButton: {
    ...GlobalStyles.button,
    marginTop: 8,
  },
  submitButtonText: {
    ...GlobalStyles.buttonText,
  },
});

export default ResetPasswordScreenStyles; 