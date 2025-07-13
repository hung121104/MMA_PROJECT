import React from 'react';
import { Text } from 'react-native';

export default function FormError({ error }) {
  if (!error) return null;
  return (
    <Text style={{ color: '#ef4444', fontSize: 13, marginTop: 2 }}>{error}</Text>
  );
} 