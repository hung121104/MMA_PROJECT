import { StyleSheet } from 'react-native';
import GlobalStyles, { colors } from './GlobalStyles';

const ProfileScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
  },
  title: {
    fontSize: 20,
    marginBottom: 32,
    color: colors.textPrimary,
  },
  logoutButton: {
    ...GlobalStyles.button,
    paddingHorizontal: 32,
  },
  logoutButtonText: {
    ...GlobalStyles.buttonText,
    fontSize: 16,
  },
});

export default ProfileScreenStyles; 