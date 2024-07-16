// src/components/SOSMessages.tsx

import React, { useEffect, useState, useRef } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { SosData } from '../types';

import * as ExpoLocation from 'expo-location';
import MapView from 'react-native-maps';


const SOSMessages: React.FC = () => {
  const [sosMessages, setSosMessages] = useState<SosData[]>([]);
  const mapRef = useRef<MapView>(null);

  const centerOnUser = async (userId) => {
    console.log("centerOnUser called (web)");
    let { status } = await ExpoLocation.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        console.log('Permission to access location was denied');
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
    };
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
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
        setSosMessages(sosData);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className="container">
      <h2>SOS Messages</h2>
      <ul className="list">
        {sosMessages.map((sos, index) => (
          <li key={index} className="row">
            <div className="recordText">User ID: {sos.userId} - Team: {sos.teamId} - Time: {sos.timestamp.toLocaleString()}</div>
            <button className="button" onClick={centerOnUser(sos.userId)}>
              Action
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SOSMessages;