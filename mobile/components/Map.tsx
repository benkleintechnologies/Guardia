/**
 * Map.tsx
 * 
 * This component renders a map with markers for user locations.
 * It uses react-native-maps for the map functionality and integrates with Firebase for real-time location updates.
 */

import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker, MapViewProps } from 'react-native-maps';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Location } from '../types';
import { FontAwesome } from '@expo/vector-icons';

interface MapProps extends MapViewProps {
  mapRef: React.RefObject<MapView>;
  onCenterPress: () => void;
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
const Map = ({ mapRef, onCenterPress }: MapProps) => {
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    // Set up real-time listener for location updates from Firebase
    const unsubscribe = onSnapshot(collection(db, 'locations'), (snapshot) => {
      const locationsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Location)
      })) as Location[];
      setLocations(locationsData);

      // Fit map to show all markers
      if (locationsData.length > 0) {
        const coordinates = locationsData.map(loc => ({
          latitude: loc.latitude,
          longitude: loc.longitude
        }));
        mapRef.current?.fitToCoordinates(coordinates, {
          edgePadding: { top: 100, right: 50, bottom: 100, left: 50 },
          animated: true,
        });
      }
    });

    console.log("mapRef from inside Map.tsx", mapRef);

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, [mapRef]);

  return (
    <View style={styles.container}>
      <MapView ref={mapRef} style={styles.map}>
        {/* Render markers for each location */}
        {locations.map(location => (
          <Marker
            key={location.userId}
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            title={`User: ${location.userId}`}
            description={`Team: ${location.teamId}`}
          />
        ))}
      </MapView>
      {/* Button to center the map on the user's location */}
      <TouchableOpacity style={styles.centerButton} onPress={onCenterPress}>
        <FontAwesome name="location-arrow" size={24} color="black" />
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
    bottom: 130,
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
});

export default Map;
