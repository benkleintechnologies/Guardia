/**
 * location.ts
 * 
 * This file contains functions for managing user location data.
 * It interacts with Firebase Firestore to store and update user locations.
 */

import { db, serverTimestamp } from '../firebase';
import { collection, query, where, getDocs, setDoc , doc } from 'firebase/firestore';

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
    } catch (error) {
        console.error('Error updating location:', error);
    }
};