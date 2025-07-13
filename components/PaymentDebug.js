import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import { API_URL } from '@env';
import { getToken } from '../api/auth';

export default function PaymentDebug({ orderId, totalAmount }) {
  const [debugInfo, setDebugInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const testPaymentEndpoint = async () => {
    setLoading(true);
    setDebugInfo(null);

    try {
      // Get the authentication token
      const token = await getToken();
      if (!token) {
        throw new Error('Authentication token not found. Please login again.');
      }

      console.log('🧪 Testing payment endpoint...');
      console.log('🔗 API URL:', API_URL);
      console.log('📦 Request payload:', { orderId, totalAmount, currency: 'usd' });

      const response = await axios.post(`${API_URL}/order/payments`, {
        orderId,
        totalAmount,
        currency: 'usd',
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('✅ Response received:', response);
      
      setDebugInfo({
        success: true,
        status: response.status,
        data: response.data,
        headers: response.headers,
      });
    } catch (error) {
      console.error('❌ Error:', error);
      
      setDebugInfo({
        success: false,
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Debug Tool</Text>
      
      <View style={styles.infoContainer}>
        <Text style={styles.label}>API URL:</Text>
        <Text style={styles.value}>{API_URL}</Text>
        
        <Text style={styles.label}>Order ID:</Text>
        <Text style={styles.value}>{orderId}</Text>
        
        <Text style={styles.label}>Total Amount:</Text>
        <Text style={styles.value}>{totalAmount} cents (${(totalAmount ).toFixed(2)})</Text>
      </View>

      <TouchableOpacity
        style={styles.testButton}
        onPress={testPaymentEndpoint}
        disabled={loading}
      >
        <Text style={styles.testButtonText}>
          {loading ? 'Testing...' : 'Test Payment Endpoint'}
        </Text>
      </TouchableOpacity>

      {debugInfo && (
        <ScrollView style={styles.debugContainer}>
          <Text style={styles.debugTitle}>
            {debugInfo.success ? '✅ Success Response' : '❌ Error Response'}
          </Text>
          
          <Text style={styles.debugLabel}>Status Code:</Text>
          <Text style={styles.debugValue}>{debugInfo.status}</Text>
          
          {debugInfo.success ? (
            <>
              <Text style={styles.debugLabel}>Response Data:</Text>
              <Text style={styles.debugValue}>
                {JSON.stringify(debugInfo.data, null, 2)}
              </Text>
              
              <Text style={styles.debugLabel}>Has client_secret:</Text>
              <Text style={styles.debugValue}>
                {debugInfo.data?.client_secret ? '✅ Yes' : '❌ No'}
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.debugLabel}>Error Message:</Text>
              <Text style={styles.debugValue}>{debugInfo.error}</Text>
              
              <Text style={styles.debugLabel}>Error Response:</Text>
              <Text style={styles.debugValue}>
                {JSON.stringify(debugInfo.response, null, 2)}
              </Text>
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
    fontFamily: 'monospace',
  },
  testButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 16,
  },
  testButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  debugContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    maxHeight: 400,
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  debugLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginTop: 8,
    marginBottom: 4,
  },
  debugValue: {
    fontSize: 12,
    color: '#666666',
    fontFamily: 'monospace',
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
}); 