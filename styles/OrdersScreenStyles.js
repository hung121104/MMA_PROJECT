import { StyleSheet } from 'react-native';
import GlobalStyles, { colors } from './GlobalStyles';

const OrdersScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textMuted,
  },
  listContainer: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  paymentStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 8,
  },
  paymentStatusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  orderDetails: {
    marginBottom: 16,
  },
  dateText: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 4,
  },
  itemsContainer: {
    marginTop: 8,
  },
  itemsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  itemText: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 2,
  },
  moreItems: {
    fontSize: 14,
    color: colors.primary,
    fontStyle: 'italic',
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  amountLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  amountValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  actionContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  viewButton: {
    flex: 1,
    backgroundColor: colors.lightGray,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  viewButtonText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  payButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  payButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textMuted,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: colors.background,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  shopButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  shopButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OrdersScreenStyles; 