/**
 * Map.tsx
 * 
 * This component renders a map with markers for user locations.
 * It uses react-native-maps for the map functionality and integrates with Firebase for real-time location updates.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import MapView, { Marker, MapViewProps } from 'react-native-maps';
import { db } from '../firebase';
import { collection, onSnapshot, doc, getDoc, query, where, orderBy } from 'firebase/firestore';
import { Location } from '../types';
import CustomMarker from './CustomMarker';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface MapProps extends MapViewProps {
  mapRef: React.RefObject<MapView>;
  onCenterPress: () => void;
  onRefocusPress: () => void;
  setLocations: (locations: Location[]) => void;
}

interface SosData {
  userId: string;
  teamId: string;
  timestamp: Date;
  latitude: number;
  longitude: number;
}

/**
 * Map Component
 * 
 * This component displays a map with markers for each user's location.
 * It listens for real-time updates from Firebase and adjusts the map view accordingly.
 * 
 * @param mapRef - Ref to the MapView component
 * @param onCenterPress - Callback function to center the map on the user's location
 */
const Map = ({ mapRef, onCenterPress, onRefocusPress, setLocations }: MapProps) => {
  const [locations, setLocalLocations] = useState<Location[]>([]);
  const [userNames, setUserNames] = useState<{ [key: string]: string }>({});
  const [sosUsers, setSosUsers] = useState<Set<string>>(new Set());
  const [userId, setUserId] = useState<string | null>(null);
  const [teamId, setTeamId] = useState<string | null>(null);
  const [canViewOthers, setCanViewOthers] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const updateSosUsers = useCallback((sosData: SosData[]) => {
    const sosUserSet = new Set(sosData.map(sos => sos.userId));
    setSosUsers(sosUserSet);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const storedUserId = await AsyncStorage.getItem('userId');
        if (!storedUserId) {
          console.error('UserId is null');
          return;
        }
        setUserId(storedUserId);

      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const userDocRef = doc(db, 'users', userId);
    
    const unsubscribeUserDoc = onSnapshot(userDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        setTeamId(userData.teamId);
        setCanViewOthers(userData.canViewOthers);
      }
    }, (error) => {
      console.error("Error listening to user document:", error);
    });

    return () => {
      unsubscribeUserDoc();
    };
  }, [userId]);

  useEffect(() => {
    if (!userId || !teamId) return;

    setIsLoading(true);

    let locationsQuery;
    if (canViewOthers) {
      locationsQuery = query(collection(db, 'locations'), where('teamId', '==', teamId));
    } else {
      locationsQuery = query(collection(db, 'locations'), where('userId', '==', userId));
    }

    const unsubscribeLocations = onSnapshot(locationsQuery, (snapshot) => {
      const locationsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Location)
      })) as Location[];
      setLocalLocations(locationsData);
      setLocations(locationsData);
      setIsLoading(false);
    });

    const unsubscribeSos = onSnapshot(
      query(
        collection(db, 'sos'),
        where('timestamp', '>', new Date(Date.now() - 10 * 60 * 1000)),
        orderBy('timestamp', 'desc')
      ),
      (snapshot) => {
        const sosData = snapshot.docs.map(doc => ({
          userId: doc.data().userId,
          teamId: doc.data().teamId,
          timestamp: doc.data().timestamp.toDate(),
          latitude: doc.data().latitude,
          longitude: doc.data().longitude,
        })) as SosData[];
        
        updateSosUsers(sosData.filter(sos => sos.teamId === teamId));
      }
    );

    return () => {
      unsubscribeLocations();
      unsubscribeSos();
    };
  }, [userId, teamId, canViewOthers, mapRef, updateSosUsers]);

  useEffect(() => {
    const fetchUserNames = async () => {
      const userIds = locations.map(location => location.userId);
      const names: { [key: string]: string } = {};
      
      for (const userId of userIds) {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          names[userId] = userDoc.data().name || 'Unknown';
        }
      }
      
      setUserNames(names);
    };

    if (locations.length > 0) {
      fetchUserNames();
    }
  }, [locations]);

  useEffect(() => {
    if (locations.length > 0) {
      const coordinates = locations.map(loc => ({
        latitude: loc.latitude,
        longitude: loc.longitude
      }));
      mapRef.current?.fitToCoordinates(coordinates, {
        edgePadding: { top: 100, right: 50, bottom: 100, left: 50 },
        animated: true,
      });
    }
  }, [locations, canViewOthers, mapRef]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView ref={mapRef} style={styles.map}>
        {locations.map(location => (
          <Marker
            key={location.userId}
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            title={`User: ${userNames[location.userId] || 'Loading...'}`}
            description={`Team: ${location.teamId}`}
          >
            <CustomMarker color={sosUsers.has(location.userId) ? 'red' : 'blue'} />
          </Marker>
        ))}
      </MapView>
      {/* Button to center the map on the user's location */}
      <TouchableOpacity style={styles.centerButton} onPress={onCenterPress}>
        <MaterialIcons name="my-location" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.refocusButton} onPress={onRefocusPress}>
        <MaterialCommunityIcons name="fullscreen" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  centerButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 4,
  },
  refocusButton: {
    position: 'absolute',
    bottom: 160,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Map;