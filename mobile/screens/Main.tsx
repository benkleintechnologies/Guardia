import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundGeolocation from 'react-native-background-geolocation';
import { updateLocation } from '../services/location';
import Map from '../components/Map';
import { Location } from '../types';


const MainScreen = () => {
    const [userId, setUserId] = useState<string | null>(null);
    const [teamId, setTeamId] = useState<string | null>(null);

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
        
    return (
        <View style={styles.container}>
            <Map />
            <Text style={styles.info}>Main screen with map and other information</Text>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  info: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
});

export default MainScreen;
