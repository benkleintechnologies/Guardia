// src/services/user.ts
import { db } from '../firebase';
import { getDoc, doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';

export const getUser = async (userId: string) => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  return userDoc.exists() ? userDoc.data() : null;
};

export const updateTeamVisibility = async (userId: string, teamId: string, canViewOthers: boolean) => {
  const usersQuery = query(collection(db, 'users'), where('teamId', '==', teamId));
  const querySnapshot = await getDocs(usersQuery);
  
  const updatePromises = querySnapshot.docs.map(userDoc => 
    updateDoc(doc(db, 'users', userDoc.id), { canViewOthers })
  );

  await Promise.all(updatePromises);
};