// src/components/LocationTracker.tsx
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, doc, addDoc, updateDoc, onSnapshot, query, where } from 'firebase/firestore';

// Define an interface for the component props
interface LocationTrackerProps {
    userId: string; // Assuming userId is of type string
    teamId: string; // Assuming teamId is also of type string
}

interface Location {
    userId: string,
    teamId: string,
    latitude: number,
    longitude: number,
    timestamp: Date
}

export const LocationTracker = ({ userId, teamId }: LocationTrackerProps) => {
    const [locations, setLocations] = useState<Location[]>([]);

    // Function to update user permissions in the database, i.e. whether the user can view others' locations
    const updateUserPermissions = async (userId: string, canViewOthers: boolean) => {
        try {
            await updateDoc(doc(db, 'users', userId), { canViewOthers });
            console.log('User permissions updated successfully');
        } catch (error) {
            console.error('Error updating user permissions:', error);
        }
    };

    // Subscribe to location updates for the team
    // This effect will run once when the component mounts, and again whenever the teamId changes
    // It will fetch the locations for the specified team and update the state in real-time
    useEffect(() => {
        const q = query(collection(db, 'locations'), where('teamId', '==', teamId));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newLocations = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data() as Omit<Location, 'id'> // Cast the document data to the expected type, excluding 'id'
            }));
            setLocations(newLocations);
        });

        return () => unsubscribe();
    }, [teamId]);

    // Render map using google maps API with the locations shown on it
    

};