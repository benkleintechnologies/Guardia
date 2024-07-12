/**
 * auth.ts
 * 
 * This file contains authentication-related functions for the application.
 * It handles user sign-in, sign-up, sign-out, and checking authentication status.
 * It interacts with Firebase Authentication and Firestore for user management.
 */

import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDocs, setDoc, query, where, collection } from 'firebase/firestore';
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

    // Obtain the login token
    const token = await user.getIdToken();
    // Save the token locally for persistent login
    await AsyncStorage.setItem('loginToken', token);  // Store loginToken locally

    // Fetch user profile from Firestore
    // Create a query against the 'users' collection where 'userId' field matches 'user.uid'
    const usersQuery = query(collection(db, 'users'), where('userId', '==', user.uid));
    const querySnapshot = await getDocs(usersQuery);

    // querySnapshot.docs will contain the list of documents that match the query
    // If you are expecting a single document, you can access it with querySnapshot.docs[0] if it exists
    if (!querySnapshot.empty) {
      // Assuming a single user document per userID, so we take the first
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      console.log('userDoc data: ', userData);
      await AsyncStorage.setItem('userId', user.uid);  // Store userId locally
      await AsyncStorage.setItem('teamId', userData.teamId);  // Store teamId locally
      teamId = userData.teamId;
    } else {
      console.log('No user document found');
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

    // Obtain the login token
    const token = await user.getIdToken();
    // Save the token locally for persistent login
    await AsyncStorage.setItem('loginToken', token);  // Store loginToken locally

    // Add user to Firestore with teamId
    await setDoc(doc(db, 'users', user.uid), {
      userId: user.uid,
      teamId: teamId,
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
  await AsyncStorage.removeItem('loginToken');
  await auth.signOut();
};

/**
 * Checks the current authentication status
 * 
 * @returns Promise resolving to a boolean indicating if the user is authenticated
 */
export const checkAuthStatus = async (): Promise<boolean> => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    try {
      // This will automatically refresh the token if it's expired
      const idToken = await currentUser.getIdToken(true);
      await AsyncStorage.setItem('loginToken', idToken);
      return true;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return false;
    }
  }
  return false;
};

export const getIdToken = async (): Promise<string | null> => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    try {
      // This will automatically refresh the token if it's expired
      return await currentUser.getIdToken(true);
    } catch (error) {
      console.error('Error getting ID token:', error);
      return null;
    }
  }
  return null;
};