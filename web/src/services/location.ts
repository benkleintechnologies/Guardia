// src/services/location.ts
import { db } from '../firebase';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';

export const addLocation = async (userId: string, teamId: string, latitude: number, longitude: number) => {
  await addDoc(collection(db, 'locations'), {
    userId,
    teamId,
    latitude,
    longitude,
    timestamp: new Date(),
  });
};

export const updateLocation = async (locationId: string, latitude: number, longitude: number) => {
  await updateDoc(doc(db, 'locations', locationId), {
    latitude,
    longitude,
    timestamp: new Date(),
  });
};