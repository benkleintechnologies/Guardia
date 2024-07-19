/**
 * useAuth.tsx
 * 
 * This file implements a custom React hook and context for managing authentication state.
 * It provides functions for signing in, signing out, and checking authentication status.
 */

import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import { auth } from '../firebase'; // Import Firebase auth
import { checkAuthStatus, signOut as authSignOut, getIdToken } from '../services/auth';

/**
 * Type definition for the authentication context
 */
type AuthContextType = {
  isAuthenticated: boolean | null;
  userId: string | null;
  teamId: string | null;
  signIn: (newUserId: string, newTeamId: string) => Promise<void>;
  signOut: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
};

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider component
 * 
 * Wraps the application and provides authentication context to child components
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [teamId, setTeamId] = useState<string | null>(null);

  /**
   * Checks the current authentication status
   */
  const checkAuth = useCallback(async () => {
    console.log('Checking auth status...');
    try {
      const authStatus = await checkAuthStatus();
      setIsAuthenticated(authStatus);
      if (authStatus) {
        const storedUserId = await AsyncStorage.getItem('userId');
        const storedTeamId = await AsyncStorage.getItem('teamId');
        setUserId(storedUserId);
        setTeamId(storedTeamId);
      } else {
        setUserId(null);
        setTeamId(null);
      }
      console.log('Auth status updated. isAuthenticated:', authStatus);
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
      setUserId(null);
      setTeamId(null);
    }
  }, []);

  // Check authentication status on component mount
  useEffect(() => {
    console.log('AuthProvider mounted. Checking initial auth status...');
    checkAuth();
  }, [checkAuth]);

  /**
   * Signs in a user
   * 
   * @param newUserId - The ID of the user to sign in
   */
  const signIn = useCallback(async (newUserId: string, newTeamId: string) => {
    console.log('Signing in with userId:', newUserId, 'teamId:', newTeamId);
    try {
      await AsyncStorage.setItem('userId', newUserId);
      await AsyncStorage.setItem('teamId', newTeamId);
      setIsAuthenticated(true);
      setUserId(newUserId);
      setTeamId(newTeamId);
      console.log('Sign in successful');
    } catch (error) {
      console.error('Error signing in:', error);
    }
  }, []);

  /**
   * Signs out the current user
   */
  const signOut = useCallback(async () => {
    console.log('Signing out...');
    try {
      await authSignOut();
      setIsAuthenticated(false);
      setUserId(null);
      setTeamId(null);
      console.log('Sign out successful');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, []);

  console.log('AuthProvider rendering. isAuthenticated:', isAuthenticated, 'userId:', userId);

  return (
    <AuthContext.Provider 
      value={{ isAuthenticated, userId, teamId, signIn, signOut, getIdToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use the authentication context
 * 
 * @returns The authentication context
 * @throws Error if used outside of AuthProvider
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};