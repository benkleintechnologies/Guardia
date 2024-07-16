// src/components/Dashboard.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import Map from './Map';
import UserList from './UserList';
import SOSMessages from './SOSMessages';
import { Button, AppBar, Toolbar, Typography, Box } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Location } from '../types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [locations, setLocations] = useState<Location[]>([]);
  const [focusedLocation, setFocusedLocation] = useState<{ lat: number, lng: number } | null>(null);
  
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'locations'), (snapshot) => {
      const locationsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Location, 'id'>),
        timestamp: doc.data().timestamp.toDate(),
      }));
      setLocations(locationsData);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleUserClick = (userId: string) => {
    const userLocation = locations.find(loc => loc.userId === userId);
    if (userLocation) {
      setFocusedLocation({ lat: userLocation.latitude, lng: userLocation.longitude });
    }
  };

  const handleSosClick = (latitude: number, longitude: number) => {
    setFocusedLocation({ lat: latitude, lng: longitude });
  };

  const handleViewAllUsers = () => {
    setFocusedLocation(null);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Guardia
          </Typography>
          <Button color="inherit" onClick={handleSignOut} startIcon={<ExitToAppIcon />}>
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        <Box sx={{ flex: 3, position: 'relative' }}>
          <Map 
            locations={locations} 
            focusedLocation={focusedLocation} 
            onViewAllUsers={handleViewAllUsers} 
          />
        </Box>
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          <UserList onUserClick={handleUserClick} locations={locations} />
          <Box sx={{ mt: 2 }}>
            <SOSMessages onSosClick={handleSosClick} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;