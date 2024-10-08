// src/components/Map.tsx

import React, { useEffect, useState, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { db } from '../firebase';
import { collection, onSnapshot, doc, getDoc, query, where, orderBy } from 'firebase/firestore';
import { Location, SosData, User } from '../types';
import CustomMarker from './CustomMarker';
import CustomInfoWindow from './CustomInfoWindow';
import { Button } from '@mui/material';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    },
    {
      featureType: "transit",
      stylers: [{ visibility: "off" }]
    }
  ]
};

interface MapProps {
  locations: Location[];
  focusedLocation: { lat: number; lng: number } | null;
  onViewAllUsers: () => void;
}

interface UserData {
  name: string;
  image: string;
}

const Map: React.FC<MapProps> = ({ locations, focusedLocation, onViewAllUsers }) => {
  const [userData, setUserData] = useState<{ [key: string]: UserData }>({});
  const [sosUsers, setSosUsers] = useState<Set<string>>(new Set());
  const mapRef = useRef<google.maps.Map | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<Location | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY!,
  });

  useEffect(() => {
    if (!isLoaded) return;

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
      unsubscribeSos();
    };
  }, [isLoaded]);

  useEffect(() => {
    const fetchUserData = async () => {
      const userIds = locations.map(location => location.userId);
      const data: { [key: string]: UserData } = {};
      
      for (const userId of userIds) {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          const user = userDoc.data() as User;
          data[userId] = {
            name: user.name || 'Unknown',
            image: user.image || '',
          };
        }
      }
      
      setUserData(data);
    };

    if (locations.length > 0) {
      fetchUserData();
    }
  }, [locations]);


  // Focus location passed as prop
  useEffect(() => {
    if (isLoaded && mapRef.current) {
      if (focusedLocation) {
        mapRef.current.panTo(focusedLocation);
        mapRef.current.setZoom(18);
      } else {
        const bounds = new google.maps.LatLngBounds();
        locations.forEach(loc => bounds.extend({ lat: loc.latitude, lng: loc.longitude }));
        mapRef.current.fitBounds(bounds);
      }
    }
  }, [isLoaded, locations, focusedLocation]);

  const onMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={10}
      onLoad={onMapLoad}
      options={mapOptions}
    >
      {locations.map(location => (
        <Marker
          key={location.userId}
          position={{ lat: location.latitude, lng: location.longitude }}
          title={`User: ${userData[location.userId]?.name || 'Loading...'}`}
          icon={{
            url: sosUsers.has(location.userId) ? CustomMarker('red') : CustomMarker('blue'),
            scaledSize: new google.maps.Size(50, 50),
          }}
          onClick={() => setSelectedMarker(location)}
        />
      ))}

      {selectedMarker && (
        <CustomInfoWindow
          position={{ lat: selectedMarker.latitude, lng: selectedMarker.longitude }}
          onCloseClick={() => setSelectedMarker(null)}
          userId={userData[selectedMarker.userId]?.name || 'Unknown'}
          teamId={selectedMarker.teamId}
          userImage={userData[selectedMarker.userId]?.image || ''}
        />
      )}
      <Button
        variant="contained"
        color="primary"
        startIcon={<ZoomOutMapIcon />}
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
        }}
        onClick={onViewAllUsers}
      >
        View All Users
      </Button>
    </GoogleMap>
  );
};

export default Map;