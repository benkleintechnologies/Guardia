// components/Map.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { db } from '../firebase';
import { collection, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { Location } from '../types'; // Import the Location interface

const Map = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [userNames, setUserNames] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'locations'), (snapshot) => {
      const locationsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Location)
      })) as Location[];
      setLocations(locationsData);
    });

    return () => unsubscribe();
  }, []);

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

  return (
    <View style={styles.container}>
      <MapView style={styles.map}>
        {locations.map(location => (
          <Marker
            key={location.userId}
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            title={`User: ${userNames[location.userId] || 'Loading...'}`}
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
