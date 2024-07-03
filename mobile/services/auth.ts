/**
 * auth.ts
 * 
 * This file contains authentication-related functions for the application.
 * It handles user sign-in, sign-up, sign-out, and checking authentication status.
 * It interacts with Firebase Authentication and Firestore for user management.
 */

import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Signs in a user with email and password
 * 
 * @param email - User's email
 * @param password - User's password
 * @returns Promise resolving to the user's ID
 */
export const signIn = async (email: string, password: string): Promise<[string, string]> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    let teamId = ""

    // Fetch user profile from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    console.log(userDoc);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      await AsyncStorage.setItem('userId', user.uid);  // Store userId locally
      await AsyncStorage.setItem('teamId', userData.teamId);  // Store teamId locally
      teamId = userData.teamId;
    }

    return [user.uid, teamId];
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

/**
 * Signs up a new user with email, password, and team ID
 * 
 * @param email - User's email
 * @param password - User's password
 * @param teamId - User's team ID
 * @returns Promise resolving to the new user's ID
 */
export const signUp = async (email: string, password: string, teamId: string): Promise<[string, string]> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Add user to Firestore with teamId
    await setDoc(doc(db, 'users', user.uid), {
      userId: user.uid,
      teamId,
      canViewOthers: false, // Default permission
      role: 'volunteer' // Default role
    });

    // Store locally
    await AsyncStorage.setItem('userId', user.uid);  // Store userId
    await AsyncStorage.setItem('teamId', teamId);  // Store teamId

    return [user.uid, teamId];
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

/**
 * Signs out the current user
 */
export const signOut = async (): Promise<void> => {
  await AsyncStorage.removeItem('userId');
  await AsyncStorage.removeItem('teamId');
  await auth.signOut();
};

/**
 * Checks the current authentication status
 * 
 * @returns Promise resolving to a boolean indicating if the user is authenticated
 */
export const checkAuthStatus = async (): Promise<boolean> => {
  const userId = await AsyncStorage.getItem('userId');
  return !!userId;
};