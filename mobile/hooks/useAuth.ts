import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const checkAuthStatus = async () => {
    const userId = await AsyncStorage.getItem('userId');
    setIsAuthenticated(!!userId);
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const signIn = async (userId: string) => {
    await AsyncStorage.setItem('userId', userId);
    setIsAuthenticated(true);
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('userId');
    setIsAuthenticated(false);
  };

  return { isAuthenticated, signIn, signOut, checkAuthStatus };
};