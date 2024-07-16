// src/services/auth.ts
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

export const signUp = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

export const signIn = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = () => {
    return signOut(auth);
};