import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { updateLocation } from './location';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKGROUND_LOCATION_TASK = 'background-location-task';

TaskManager.defineTask(BACKGROUND_LOCATION_TASK, async ({ data, error }) => {
  if (error) {
    console.error(error);
    return;
  }
  if (data) {
    const { locations } = data as { locations: Location.LocationObject[] };
    const location = locations[0];
    if (location) {
      // You'll need to implement a way to get userId and teamId here
      // For example, you could store them in AsyncStorage when the user logs in
      const userId = await AsyncStorage.getItem('userId');
      const teamId = await AsyncStorage.getItem('teamId');
      if (userId && teamId) {
        await updateLocation(userId, teamId, location.coords.latitude, location.coords.longitude);
      }
    }
  }
});

export const startLocationTracking = async () => {
  const { status } = await Location.requestBackgroundPermissionsAsync();
  if (status === 'granted') {
    await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
      accuracy: Location.Accuracy.High,
      distanceInterval: 10,
      timeInterval: 5000,
      foregroundService: {
        notificationTitle: "Location Tracking",
        notificationBody: "Tracking your location for emergency services",
      },
    });
    console.log('Background location tracking started');
  } else {
    console.log('Background location permission not granted');
  }
};

export const stopLocationTracking = async () => {
  const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_LOCATION_TASK);
  if (isRegistered) {
    await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
    console.log('Background location tracking stopped');
  }
};