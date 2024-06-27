// App.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import BackgroundGeolocation from 'react-native-background-geolocation';
import Auth from './components/Auth';
import Map from './components/Map';
import { updateLocation } from './services/location';
import { Location } from './types'; // Import the Location interface
import AsyncStorage from '@react-native-async-storage/async-storage';


const App = () => {
    const [userId, setUserId] = useState<string>('');
    const [teamId, setTeamId] = useState<string | null>(null);

    useEffect(() => {
        AsyncStorage.getItem('teamId').then(value => setTeamId(value));
    }, []);

    useEffect(() => {
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
    }, [userId]);

    return (
        <View style={styles.container}>
            <Auth setUserId={setUserId} />
            <Map userId={userId} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default App;
