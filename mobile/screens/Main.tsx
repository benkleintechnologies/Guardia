/**
 * Main.tsx
 * 
 * This component represents the main screen of the application after user authentication.
 * It displays a map with user locations and handles background location tracking.
 */

import React, { useEffect, useState , useRef} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundGeolocation from 'react-native-background-geolocation';
import { updateLocation } from '../services/location';
import Map from '../components/Map';
import { Location } from '../types';
import { signOut as apiSignOut } from '../services/auth';
import { useAuth } from '../hooks/useAuth';
import * as ExpoLocation from 'expo-location';
import MapView from 'react-native-maps';
import { collection, doc, getDocs, setDoc, query, orderBy, limit, onSnapshot, where } from 'firebase/firestore';
import { db, serverTimestamp } from '../firebase';

/**
 * MainScreen Component
 * 
 * This component handles the main functionality of the app, including:
 * - Displaying the map
 * - Managing background location updates
 * - Handling user sign out
 */
const MainScreen = () => {
    const [userId, setUserId] = useState<string | null>(null);
    const [teamId, setTeamId] = useState<string | null>(null);
    const [locations, setLocations] = useState<Location[]>([]);
    const { signOut } = useAuth();
    const mapRef = useRef<MapView>(null);
    const isInitialRender = useRef(true);
    
    console.log('Main component rendering, userID:', userId, ', teamId: ', teamId);

    useEffect(() => {
        // Fetch user data from AsyncStorage
        const fetchUserData = async () => {
            const storedUserId = await AsyncStorage.getItem('userId');
            const storedTeamId = await AsyncStorage.getItem('teamId');
            setUserId(storedUserId);
            setTeamId(storedTeamId);
        };

        fetchUserData();

        // Set up background geolocation
        BackgroundGeolocation.requestPermission().then((status) => {
            console.log('Permissions status:', status);
        });

        // Handle location updates
        BackgroundGeolocation.onLocation(
            (location) => {
                console.log('[location] -', location);
                if (userId && teamId) {
                    updateLocation(userId, teamId, location.coords.latitude, location.coords.longitude);
                }
            },
            (error) => {
                console.error('[location] ERROR -', error);
            }
        );

        BackgroundGeolocation.ready({
            desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
            distanceFilter: 5,
            stopOnTerminate: false,
            startOnBoot: true,
        }, (state) => {
            if (!state.enabled) {
                BackgroundGeolocation.start();
            }
        });

        // Update location when component mounts
        updateCurrentLocation();

        return () => {
            BackgroundGeolocation.removeAllListeners();
        };
    }, [userId, teamId]);

    /**
     * Updates the current location when the component mounts
     */
    const updateCurrentLocation = async () => {
        let { status } = await ExpoLocation.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission to access location was denied');
            return;
        }

        let location = await ExpoLocation.getCurrentPositionAsync({});
        if (userId && teamId) {
            updateLocation(userId, teamId, location.coords.latitude, location.coords.longitude);
            console.log('Initial location updated:', location.coords);
        }
    };

    /**
     * Handles user sign out
     */
    const handleSignOut = async () => {
        try{ 
            await apiSignOut();
            console.log('Sign out successful');
            
            // Update authentication state
            await signOut();
            console.log('Authentication state updated');
            console.log('Authentication Logout Successful');
        } catch (error) {
            console.error('Logout error:', error);
            Alert.alert('Authentication Error', 'Sign Out failed. Please try again.');
        }
    };

    /**
     * Centers the map on the user's current location
     */
    const centerOnUser = async () => {
        console.log("centerOnUser called");
        let { status } = await ExpoLocation.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission to access location was denied');
            return;
        }
        console.log("mapRef: ", mapRef);
        let location = await ExpoLocation.getCurrentPositionAsync({});
        if (mapRef.current) {
            console.log("center on user location: long-" + location.coords.longitude + ", lat-" + location.coords.latitude);
            mapRef.current.animateToRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            }, 1000);
        }
    };
    
    const refocusOnAllLocations = () => {
        console.log("refocusOnAllLocations called");
        if (mapRef.current && locations.length > 0) {
            const coordinates = locations.map(loc => ({
                latitude: loc.latitude,
                longitude: loc.longitude
            }));
            mapRef.current.fitToCoordinates(coordinates, {
                edgePadding: { top: 100, right: 50, bottom: 100, left: 50 },
                animated: true,
            });
        }
    };

    const sendSOS = async () => {
        try {
            const sosDocRef = doc(collection(db, 'sos'));
            let location = await ExpoLocation.getCurrentPositionAsync({});
            const userId = await AsyncStorage.getItem('userId');
            const teamId = await AsyncStorage.getItem('teamId');

            await setDoc(sosDocRef, {
                userId,
                teamId,
                timestamp: serverTimestamp(),
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });

            console.log('SOS sent', 'Your SOS signal has been sent to all users.');
        } catch (error) {
            console.error('Error sending SOS:', error);
        }
    };

    // Receive SOS Alerts and display as a notification
    useEffect(() => {
        const sosQuery = query(collection(db, 'sos'), orderBy('timestamp', 'desc'), limit(1));
        const unsubscribe = onSnapshot(sosQuery, snapshot => {
            if (isInitialRender.current) {
                isInitialRender.current = false;
                return;
            }

            snapshot.docChanges().forEach(async change => {
            if (change.type === 'added') {
                const sosData = change.doc.data();
                // Alert when there's a new SOS. In the future make this a notification
                // Get the name of the user who sent the SOS
                const usersQuery = query(collection(db, 'users'), where('userId', '==', sosData.userId));
                const querySnapshot = await getDocs(usersQuery);
                let name = '';

                if (!querySnapshot.empty) {
                    // Assuming a single user document per userID, so we take the first
                    const userDoc = querySnapshot.docs[0];
                    const userData = userDoc.data();
                    name = userData.name;
                }

                Alert.alert(
                    "SOS Alert",
                    `SOS from: ${name}`,
                    [{ text: "Dismiss" }]
                );
            }
            });
        });

        return () => unsubscribe();
    }, []);

        
    return (
        <View style={styles.container}>
            <Map mapRef={mapRef} onCenterPress={centerOnUser} onRefocusPress={refocusOnAllLocations} setLocations={setLocations} />
            <View style={styles.overlay}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                        <Text style={styles.buttonText}>Sign Out</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.sosButtonContainer} onPress={sendSOS}>
                        <Text style={styles.buttonText}>SOS</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

// Styles for the component
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    overlay: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        right: 10,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
    },
    info: {
        marginBottom: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Optional: to distribute buttons evenly
    },
    signOutButton: {
        flex: 1, // Make buttons equal width
        backgroundColor: '#f39c12',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    sosButtonContainer: {
        flex: 1, // Make buttons equal width
        backgroundColor: '#e74c3c',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginHorizontal: 5,
    },
});

export default MainScreen;
