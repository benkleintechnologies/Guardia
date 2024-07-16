// src/components/Map.tsx

import React, { useEffect, useState, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { db } from '../firebase';
import { collection, onSnapshot, doc, getDoc, query, where, orderBy } from 'firebase/firestore';
import { Location, SosData } from '../types';
import CustomMarker from './CustomMarker';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const Map: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [userNames, setUserNames] = useState<{ [key: string]: string }>({});
  const [sosUsers, setSosUsers] = useState<Set<string>>(new Set());
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY!,
  });

  useEffect(() => {
    if (!isLoaded) return;

    const unsubscribeLocations = onSnapshot(collection(db, 'locations'), (snapshot) => {
      const locationsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Location, 'id'>),
        timestamp: doc.data().timestamp.toDate(),
      }));
      setLocations(locationsData);

      if (locationsData.length > 0 && mapRef.current) {
        const bounds = new google.maps.LatLngBounds();
        locationsData.forEach(loc => bounds.extend({ lat: loc.latitude, lng: loc.longitude }));
        mapRef.current.fitBounds(bounds);
      }
    });

    const unsubscribeSos = onSnapshot(
      query(
        collection(db, 'sos'),
        where('timestamp', '>', new Date(Date.now() - 10 * 60 * 1000)),
        orderBy('timestamp', 'desc')
      ),
      (snapshot) => {
        const sosData = snapshot.docs.map(doc => ({
          ...doc.data() as SosData,
          timestamp: doc.data().timestamp.toDate(),
        }));
        const sosUserSet = new Set(sosData.map(sos => sos.userId));
        setSosUsers(sosUserSet);
      }
    );

    return () => {
      unsubscribeLocations();
      unsubscribeSos();
    };
  }, [isLoaded]);

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

  const onMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={10}
      onLoad={onMapLoad}
    >
      {locations.map(location => (
        <Marker
          key={location.userId}
          position={{ lat: location.latitude, lng: location.longitude }}
          title={`User: ${userNames[location.userId] || 'Loading...'}`}
          icon={{
            url: sosUsers.has(location.userId) ? CustomMarker('red') : CustomMarker('blue'),
            scaledSize: new google.maps.Size(30, 30),
          }}
        />
      ))}
    </GoogleMap>
  );
};

export default Map;