// src/services/user.ts
import { db } from '../firebase';
import { getDoc, doc } from 'firebase/firestore';

export const getUser = async (userId: string) => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  return userDoc.exists() ? userDoc.data() : null;
};