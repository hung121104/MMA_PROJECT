import { StyleSheet } from 'react-native';
import GlobalStyles, { colors } from './GlobalStyles';

const PaymentScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.card,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...GlobalStyles.title,
    fontSize: 24,
    marginBottom: 16,
    color: colors.textPrimary,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: colors.textPrimary,
  },
  itemSummary: {
    backgroundColor: colors.lightGray,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: colors.textPrimary,
  },
  itemDetail: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 2,
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  infoBox: {
    backgroundColor: colors.lightGray,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  infoButton: {
    ...GlobalStyles.button,
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  infoButtonText: {
    ...GlobalStyles.buttonText,
  },
  submitButton: {
    ...GlobalStyles.button,
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 32,
  },
  submitButtonDisabled: {
    backgroundColor: colors.mediumGray,
  },
  submitButtonText: {
    ...GlobalStyles.buttonText,
  },
});

export default PaymentScreenStyles;