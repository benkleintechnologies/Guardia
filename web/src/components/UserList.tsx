import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { User, Location } from '../types';
import { List, ListItem, ListItemText, Paper, Typography } from '@mui/material';

interface UserListProps {
  onUserClick: (userId: string) => void;
  locations: Location[];
}

const UserList: React.FC<UserListProps> = ({ onUserClick, locations }) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({
        firestoreId: doc.id,
        ...(doc.data() as User)
      }));
      setUsers(usersData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Paper elevation={3} sx={{ p: 2, maxHeight: '50vh', overflow: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Users
      </Typography>
      <List>
        {users.map(user => {
          const userLocation = locations.find(loc => loc.userId === user.userId);
          return (
            <ListItem
              key={user.userId}
              button
              onClick={() => onUserClick(user.userId)}
              disabled={!userLocation}
            >
              <ListItemText
                primary={user.name}
                secondary={`Team: ${user.teamId}${userLocation ? '' : ' (No location data)'}`}
              />
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
};

export default UserList;