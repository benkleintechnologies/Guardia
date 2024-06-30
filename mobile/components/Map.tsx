// components/Map.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Location } from '../types'; // Import the Location interface


const Map = () => {
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'locations'), (snapshot) => {
      const locationsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Location, 'id'>)
      })) as Location[];
      setLocations(locationsData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <MapView style={styles.map}>
        {locations.map(location => (
          <Marker
            key={location.userId}
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            title={`User: ${location.userId}`}
            description={`Team: ${location.teamId}`}
          />
        ))}
      </MapView>
    </View>
  );
};

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
});

export default Map;
