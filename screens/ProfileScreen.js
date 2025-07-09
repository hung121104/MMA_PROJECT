import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { removeToken } from '../api/auth';

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
    <View style={styles.container}>
      <Text style={styles.title}>Profile Screen (Coming Soon)</Text>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        disabled={loggingOut}
      >
        <Text style={styles.logoutButtonText}>{loggingOut ? 'Logging out...' : 'Log Out'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 32,
  },
  logoutButton: {
    backgroundColor: '#F43F5E',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 