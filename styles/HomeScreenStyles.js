// MMA_PROJECT/styles/HomeScreenStyles.js
import { StyleSheet } from 'react-native';
import GlobalStyles, { colors } from './GlobalStyles';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    width: 100,
    height: 32,
    resizeMode: 'contain',
  },
  profileIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.border,
  },
  searchBar: {
    margin: 0,
    borderRadius: 8,
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    ...GlobalStyles.title,
    marginVertical: 12,
    marginLeft: 16,
  },
  categoryButton: {
    backgroundColor: colors.card,
    paddingHorizontal:13,
    paddingVertical:10,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.border,
  },
  // Add more styles as needed for banners, categories, products, etc.
});
