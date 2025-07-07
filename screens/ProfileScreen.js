import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { removeToken } from '../api/auth';

export default function ProfileScreen({ onLogout }) {
  const handleLogout = async () => {
    await removeToken();
    if (onLogout) onLogout();
    else Alert.alert('Logged out', 'Token removed.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Screen (Coming Soon)</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
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