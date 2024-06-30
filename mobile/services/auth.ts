import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const signIn = async (email: string, password: string): Promise<string> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Fetch user profile from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      await AsyncStorage.setItem('userId', user.uid);  // Store userId locally
      await AsyncStorage.setItem('teamId', userData.teamId);  // Store teamId locally
    }

    return user.uid;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const signUp = async (email: string, password: string, teamId: string): Promise<string> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Add user to Firestore with teamId
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      teamId,
      canViewOthers: false, // Default permission
      role: 'volunteer' // Default role
    });

    // Store locally
    await AsyncStorage.setItem('userId', user.uid);  // Store userId
    await AsyncStorage.setItem('teamId', teamId);  // Store teamId

    return user.uid;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};