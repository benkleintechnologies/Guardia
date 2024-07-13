import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const signIn = async (email: string, password: string): Promise<string> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Fetch user profile from Firestore
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      await AsyncStorage.setItem('userId', user.uid);
      await AsyncStorage.setItem('teamId', userData.teamId);
    }

    return user.uid;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const signUp = async (name: string, email: string, password: string, teamId: string): Promise<string> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Add user to Firestore with teamId
    await setDoc(doc(db, 'users', user.uid), {
      userId: user.uid,
      teamId,
      name,
      canViewOthers: false,
      role: 'volunteer'
    });

    // Store locally
    await AsyncStorage.setItem('userId', user.uid);
    await AsyncStorage.setItem('teamId', teamId);

    return user.uid;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

export const signOut = async (): Promise<void> => {
  await AsyncStorage.removeItem('userId');
  await AsyncStorage.removeItem('teamId');
  await auth.signOut();
};

export const checkAuthStatus = async (): Promise<boolean> => {
  const userId = await AsyncStorage.getItem('userId');
  return !!userId;
};
