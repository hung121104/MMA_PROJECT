import { StyleSheet } from 'react-native';
import GlobalStyles, { colors } from './GlobalStyles';

const OrdersPaymentInfoScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.card,
  },
  title: {
    ...GlobalStyles.title,
    fontSize: 20,
    marginBottom: 12,
    marginTop: 16,
    color: colors.textPrimary,
  },
  selectedItemsText: {
    fontSize: 16,
    color: colors.primary,
    marginBottom: 16,
    fontWeight: 'bold',
  },
  input: {
    ...GlobalStyles.input,
    borderWidth: 1,
    borderColor: colors.mediumGray,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: colors.card,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.mediumGray,
    borderRadius: 8,
    marginBottom: 24,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  submitButton: {
    ...GlobalStyles.button,
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    ...GlobalStyles.buttonText,
  },
});

export default OrdersPaymentInfoScreenStyles;