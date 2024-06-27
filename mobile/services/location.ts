// services/location.ts
import { db, serverTimestamp } from '../firebase';
import { setDoc , doc } from 'firebase/firestore';


// Function to update the user's location in the database, and create it if it doesn't exist
export const updateLocation = async (userId: string, teamId: string, latitude: number, longitude: number) => {
    try {
        const docRef = doc(db, 'locations', `${userId}_${teamId}`);
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