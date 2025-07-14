import { useEffect, useState, useCallback } from 'react';
import { getProfile, getToken } from '../api/users';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_PROFILE_KEY = 'user_profile';

export const useUserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch from API and save to AsyncStorage
  const fetchAndStoreUserProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error('No token found');
      const userData = await getProfile(token);
      await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(userData));
      setUser(userData);
    } catch (err) {
      setError(err);
      // Try to load from AsyncStorage if API fails
      const stored = await AsyncStorage.getItem(USER_PROFILE_KEY);
      if (stored) setUser(JSON.parse(stored));
    } finally {
      setLoading(false);
    }
  }, []);

  // Load from AsyncStorage on mount
  useEffect(() => {
    const loadStored = async () => {
      const stored = await AsyncStorage.getItem(USER_PROFILE_KEY);
      if (stored) setUser(JSON.parse(stored));
      setLoading(false);
    };
    loadStored();
  }, []);

  return {
    user,
    loading,
    error,
    refresh: fetchAndStoreUserProfile,
  };
}; 