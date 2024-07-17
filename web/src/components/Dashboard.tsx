import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut, User as FirebaseUser } from 'firebase/auth';
import { auth, db } from '../firebase';
import { collection, onSnapshot, query, where, doc, getDoc } from 'firebase/firestore';
import Map from './Map';
import UserList from './UserList';
import SOSMessages from './SOSMessages';
import TeamSharing from './TeamSharing';
import { 
  Button, AppBar, Toolbar, Typography, Box, Tooltip, IconButton, Paper
} from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Location } from '../types';
import { updateTeamVisibility } from '../services/user';

// Define a custom User type that extends FirebaseUser and includes teamId
interface User extends FirebaseUser {
  teamId: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [locations, setLocations] = useState<Location[]>([]);
  const [focusedLocation, setFocusedLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [teamLocationsVisible, setTeamLocationsVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch additional user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setCurrentUser({ ...firebaseUser, teamId: userData.teamId } as User);
        } else {
          // Handle the case where user document doesn't exist
          console.error('User document not found');
          navigate('/auth');
        }
      } else {
        setCurrentUser(null);
        navigate('/auth');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!currentUser?.teamId) return;

    const fetchLocations = async () => {
      // Fetch locations for the current team
      const teamLocationsQuery = query(collection(db, 'locations'), where('teamId', '==', currentUser.teamId));
      const teamLocationsUnsubscribe = onSnapshot(teamLocationsQuery, (snapshot) => {
        const teamLocationsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Location, 'id'>),
          timestamp: doc.data().timestamp.toDate(),
        }));
        setLocations(prevLocations => [...prevLocations.filter(loc => loc.teamId !== currentUser.teamId), ...teamLocationsData]);
      });

      // Fetch shared team IDs
      const sharingQuery = query(collection(db, 'sharing'), where('to', '==', currentUser.teamId));
      const sharingUnsubscribe = onSnapshot(sharingQuery, (snapshot) => {
        const sharedTeamIds = snapshot.docs.map(doc => doc.data().from);
        
        // Fetch locations for shared teams
        sharedTeamIds.forEach(teamId => {
          const sharedLocationsQuery = query(collection(db, 'locations'), where('teamId', '==', teamId));
          onSnapshot(sharedLocationsQuery, (snapshot) => {
            const sharedLocationsData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...(doc.data() as Omit<Location, 'id'>),
              timestamp: doc.data().timestamp.toDate(),
            }));
            setLocations(prevLocations => [...prevLocations.filter(loc => loc.teamId !== teamId), ...sharedLocationsData]);
          });
        });
      });

      return () => {
        teamLocationsUnsubscribe();
        sharingUnsubscribe();
      };
    };

    fetchLocations();
  }, [currentUser]);

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

  const handleToggleTeamLocations = async () => {
    const newValue = !teamLocationsVisible;
    setTeamLocationsVisible(newValue);
    if (currentUser) {
      await updateTeamVisibility(currentUser.uid, currentUser.teamId, newValue);
    }
  };

  if (!currentUser) {
    return <div>Loading...</div>; // or some loading component
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Guardia
          </Typography>
          <Tooltip title="Toggle whether team members can see each other's locations">
            <IconButton color="inherit" onClick={handleToggleTeamLocations}>
              {teamLocationsVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          </Tooltip>
          <Typography variant="body2" sx={{ mr: 10 }}>
            {teamLocationsVisible ? "Team Locations Visible" : "Team Locations Hidden"}
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
        <Box sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          p: 2, 
          gap: 2,
          height: '100%',
          overflow: 'hidden'
        }}>
          <Paper elevation={3} sx={{ p: 2, flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              Users
            </Typography>
            <Box sx={{ flex: 1, overflow: 'auto' }}>
              <UserList onUserClick={handleUserClick} locations={locations} currentTeamId={currentUser.teamId} />
            </Box>
          </Paper>
          <Paper elevation={3} sx={{ p: 2, flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              SOS Messages
            </Typography>
            <Box sx={{ flex: 1, overflow: 'auto' }}>
              <SOSMessages onSosClick={handleSosClick} currentTeamId={currentUser.teamId} />
            </Box>
          </Paper>
          <Paper elevation={3} sx={{ p: 2, flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              Team Sharing
            </Typography>
            <Box sx={{ flex: 1, overflow: 'auto' }}>
              <TeamSharing currentTeamId={currentUser.teamId} />
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;