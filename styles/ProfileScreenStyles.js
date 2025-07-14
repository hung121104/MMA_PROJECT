import { StyleSheet } from 'react-native';
import GlobalStyles, { colors } from './GlobalStyles';

export default StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 32,
    alignItems: 'center',
  },
  headerTitle: {
    ...GlobalStyles.fontBold,
    fontSize: 22,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    marginTop: 8,
    width: 120,
    height: 120,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: colors.primary,
    backgroundColor: '#eee',
    resizeMode: 'cover',
  },
  infoSection: {
    width: '100%',
    marginBottom: 32,
  },
  sectionTitle: {
    ...GlobalStyles.fontBold,
    fontSize: 18,
    marginBottom: 16,
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    ...GlobalStyles.fontMedium,
    fontSize: 14,
    color: '#222',
    marginBottom: 4,
  },
  inputBox: {
    backgroundColor: '#F7F7F7',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  inputText: {
    ...GlobalStyles.fontRegular,
    fontSize: 16,
    color: '#222',
  },
  refreshButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 18,
    alignItems: 'center',
  },
  refreshButtonText: {
    ...GlobalStyles.fontBold,
    color: '#fff',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#FF3B5C',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    width: '100%',
    marginTop: 'auto',
    marginBottom: 24,
  },
  logoutButtonText: {
    ...GlobalStyles.fontBold,
    color: '#fff',
    fontSize: 16,
  },
  errorText: {
    color: '#FF3B5C',
    marginBottom: 12,
    textAlign: 'center',
  },
  retryButton: {
    alignSelf: 'center',
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  retryButtonText: {
    color: '#fff',
    ...GlobalStyles.fontMedium,
    fontSize: 15,
  },
  noDataText: {
    color: '#888',
    fontSize: 16,
    marginTop: 24,
    textAlign: 'center',
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  changePasswordButton: {
    alignSelf: 'flex-end',
    marginTop: 6,
    marginBottom: 2,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  changePasswordButtonText: {
    color: '#FF3B5C',
    fontSize: 14,
    fontWeight: '500',
  },
}); 