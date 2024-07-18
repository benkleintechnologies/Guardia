/**
 * location.ts
 * 
 * This file contains functions for managing user location data.
 * It interacts with Firebase Firestore to store and update user locations.
 */

import { db, serverTimestamp } from '../firebase';
import { collection, query, where, getDocs, setDoc, doc, orderBy, limit } from 'firebase/firestore';

/**
 * Updates the user's location in the database, creating a new document if it doesn't exist
 * 
 * @param userId - The ID of the user
 * @param teamId - The ID of the user's team
 * @param latitude - The latitude coordinate of the user's location
 * @param longitude - The longitude coordinate of the user's location
 */
export const updateLocation = async (userId: string, teamId: string, latitude: number, longitude: number) => {
    try {
        const locationsRef = collection(db, 'locations');
        const q = query(locationsRef, where('userId', '==', userId));

        const querySnapshot = await getDocs(q);
        let docId: string;

        if (querySnapshot.docs.length > 0) {
            // If there's at least one document, use the ID of the first one
            docId = querySnapshot.docs[0].id;
            console.log("Found location document with ID: ", docId);
        } else {
            // If no documents are found, create a new document ID
            const newDocRef = doc(collection(db, 'locations'));
            docId = newDocRef.id;
            console.log("Created location document with ID: ", docId);
        }

        const docRef = doc(db, 'locations', docId);
        await setDoc(docRef, {
            userId,
            teamId,
            latitude,
            longitude,
            timestamp: serverTimestamp(),
        });
        console.log("Location updated successfully!");
    } catch (error) {
        console.error('Error updating location:', error);
    }
};

/**
 * Retrieves the last known location of a user from the database.
 * 
 * @param userId - The ID of the user
 * @param teamId - The ID of the user's team
 * @returns The last known location of the user as an object containing latitude and longitude.
 */
export const getLastKnownLocation = async (userId: string, teamId: string) => {
    try {
        const locationsRef = collection(db, 'locations');
        const q = query(locationsRef, where('userId', '==', userId), orderBy('timestamp', 'desc'), limit(1));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.docs.length > 0) {
            const doc = querySnapshot.docs[0];
            const data = doc.data();
            console.log("Location found for user.")
            return {
                latitude: data.latitude,
                longitude: data.longitude
            };
        } else {
            console.log("No location found for the user.");
            return { latitude: 0, longitude: 0 };
        }
    } catch (error) {
        console.error('Error retrieving last known location:', error);
        return { latitude: 0, longitude: 0 };
    }
};