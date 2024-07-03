import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
  isAuthenticated: boolean | null;
  userId: string | null;
  signIn: (newUserId: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const checkAuthStatus = useCallback(async () => {
    console.log('Checking auth status...');
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      console.log('Stored userId:', storedUserId);
      setIsAuthenticated(!!storedUserId);
      setUserId(storedUserId);
      console.log('Auth status updated. isAuthenticated:', !!storedUserId);
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
      setUserId(null);
    }
  }, []);

  useEffect(() => {
    console.log('AuthProvider mounted. Checking initial auth status...');
    checkAuthStatus();
  }, [checkAuthStatus]);

  const signIn = useCallback(async (newUserId: string) => {
    console.log('Signing in with userId:', newUserId);
    try {
      await AsyncStorage.setItem('userId', newUserId);
      setIsAuthenticated(true);
      setUserId(newUserId);
      console.log('Sign in successful');
    } catch (error) {
      console.error('Error signing in:', error);
    }
  }, []);

  const signOut = useCallback(async () => {
    console.log('Signing out...');
    try {
      await AsyncStorage.removeItem('userId');
      setIsAuthenticated(false);
      setUserId(null);
      console.log('Sign out successful');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, []);

  console.log('AuthProvider rendering. isAuthenticated:', isAuthenticated, 'userId:', userId);

  return (
    <AuthContext.Provider 
      value={{ isAuthenticated, userId, signIn, signOut, checkAuthStatus }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};