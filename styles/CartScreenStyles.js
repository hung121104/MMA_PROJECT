import { StyleSheet } from 'react-native';
import GlobalStyles, { colors } from './GlobalStyles';

const CartScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  title: {
    ...GlobalStyles.title,
    fontSize: 24,
    marginBottom: 16,
    color: colors.textPrimary,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...GlobalStyles.bodyText,
    fontSize: 18,
    color: colors.textMuted,
  },
  selectAllContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  selectAllButton: {
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  selectAllText: {
    fontSize: 14,
    color: colors.primary,
  },
  itemCard: {
    ...GlobalStyles.card,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.card,
  },
  checkboxContainer: {
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: colors.textPrimary,
  },
  itemDetail: {
    color: colors.textMuted,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  summaryContainer: {
    backgroundColor: colors.lightGray,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 4,
  },
  summaryTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  totalCard: {
    ...GlobalStyles.card,
    marginTop: 8,
    padding: 16,
    backgroundColor: colors.card,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  payButton: {
    ...GlobalStyles.button,
    backgroundColor: colors.primary,
    paddingVertical: 14,
  },
  payButtonDisabled: {
    backgroundColor: colors.mediumGray,
  },
  payButtonText: {
    ...GlobalStyles.buttonText,
    textAlign: 'center',
  },
});

export default CartScreenStyles; 