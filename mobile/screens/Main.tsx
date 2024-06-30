import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundGeolocation from 'react-native-background-geolocation';
import { updateLocation } from '../services/location';
import Map from '../components/Map';
import { Location } from '../types';
import { signOut } from '../services/auth';


const MainScreen = () => {
    const [userId, setUserId] = useState<string | null>(null);
    const [teamId, setTeamId] = useState<string | null>(null);

    console.log('Main component rendering, userID:', userId, ', teamId: ', teamId);

    useEffect(() => {
        const fetchUserData = async () => {
            const storedUserId = await AsyncStorage.getItem('userId');
            const storedTeamId = await AsyncStorage.getItem('teamId');
            setUserId(storedUserId);
            setTeamId(storedTeamId);
        };

        fetchUserData();

        BackgroundGeolocation.requestPermission().then((status) => {
            console.log('Permissions status:', status);
        });

        BackgroundGeolocation.ready({
            desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
            distanceFilter: 10,
            stopOnTerminate: false,
            startOnBoot: true,
            }, (state) => {
                if (!state.enabled) {
                    BackgroundGeolocation.start();
                }
        });

        BackgroundGeolocation.on('location', (location: Location) => {
            if (userId && teamId) {
                updateLocation(userId, teamId, location.latitude, location.longitude);
            }
        });

        return () => {
            BackgroundGeolocation.removeAllListeners();
        };
    }, [userId, teamId]);

    const handleSignOut = async () => {
        try {
            await signOut();
            // Navigation will be handled automatically by AppNavigator
            // based on the authentication state
        } catch (error) {
            console.error('Error signing out:', error);
            // Optionally, show an error message to the user
        }
    };
        
    return (
        <View style={styles.container}>
            <Map />
            <View style={styles.overlay}>
                <Text style={styles.info}>Main screen with map and other information</Text>
                <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                    <Text style={styles.signOutButtonText}>Sign Out</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

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
