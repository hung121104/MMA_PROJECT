import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { removeToken } from '../api/auth';
import ProfileScreenStyles from '../styles/ProfileScreenStyles';

export default function ProfileScreen({ onLogout, navigation }) {
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await removeToken();
    if (onLogout) {
      onLogout();
    } else if (navigation && navigation.navigate) {
      navigation.navigate('Login');
    } else {
      Alert.alert('Logged out', 'Token removed.');
    }
    setLoggingOut(false);
  };

  return (
    <View style={ProfileScreenStyles.container}>
      <Text style={ProfileScreenStyles.title}>Profile Screen (Coming Soon)</Text>
      <TouchableOpacity
        style={ProfileScreenStyles.logoutButton}
        onPress={handleLogout}
        disabled={loggingOut}
      >
        <Text style={ProfileScreenStyles.logoutButtonText}>{loggingOut ? 'Logging out...' : 'Log Out'}</Text>
      </TouchableOpacity>
    </View>
  );
} 