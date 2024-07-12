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

        return () => {
            BackgroundGeolocation.removeAllListeners();
        };
    }, [userId, teamId]);

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
        
    return (
        <View style={styles.container}>
            <Map mapRef={mapRef} onCenterPress={centerOnUser} onRefocusPress={refocusOnAllLocations} setLocations={setLocations} />
            <View style={styles.overlay}>
                 <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                    <Text style={styles.signOutButtonText}>Sign Out</Text>
                </TouchableOpacity>
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
    signOutButton: {
        backgroundColor: '#e74c3c',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    signOutButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default MainScreen;
