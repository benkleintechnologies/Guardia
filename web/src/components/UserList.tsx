import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { User, Location } from '../types';
import { List, ListItem, ListItemText } from '@mui/material';

interface UserListProps {
  onUserClick: (userId: string) => void;
  locations: Location[];
  currentTeamId: string;
}

const UserList: React.FC<UserListProps> = ({ onUserClick, locations, currentTeamId }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [sharedTeams, setSharedTeams] = useState<string[]>([]);

  useEffect(() => {
    const fetchSharedTeams = async () => {
      const sharingQuery = query(collection(db, 'sharing'), where('to', '==', currentTeamId));
      const unsubscribe = onSnapshot(sharingQuery, (snapshot) => {
        const sharedTeamIds = snapshot.docs.map(doc => doc.data().from);
        setSharedTeams(sharedTeamIds);
      });

      return unsubscribe;
    };

    const unsubscribe = fetchSharedTeams();
    return () => {
      unsubscribe.then(unsub => unsub());
    };
  }, [currentTeamId]);

  useEffect(() => {
    const visibleTeams = [currentTeamId, ...sharedTeams];

    const unsubscribe = onSnapshot(
      query(collection(db, 'users'), where('teamId', 'in', visibleTeams)),
      (snapshot) => {
        const usersData = snapshot.docs.map(doc => ({
          firestoreId: doc.id,
          ...(doc.data() as User)
        }));
        setUsers(usersData);
      }
    );

    return () => unsubscribe();
  }, [currentTeamId, sharedTeams]);

  const sortedUsers = users.sort((a, b) => {
    const aHasLocation = locations.some(loc => loc.userId === a.userId);
    const bHasLocation = locations.some(loc => loc.userId === b.userId);

    if (aHasLocation && !bHasLocation) return -1;
    if (!aHasLocation && bHasLocation) return 1;
    return 0;
  });

  return (
    <List>
      {sortedUsers.map(user => {
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
  );
};

export default UserList;