// src/components/SOSMessages.tsx

import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, where, orderBy, doc, getDoc, Timestamp } from 'firebase/firestore';
import { SosData, User } from '../types';
import { List, ListItem, ListItemText, Typography, Box, ListItemAvatar, Avatar } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

interface SosMessage extends SosData {
  userName: string;
  userImage: string;
  timestamp: Date;
}

interface SOSMessagesProps {
  onSosClick: (latitude: number, longitude: number) => void;
  currentTeamId: string;
}

const SOSMessages: React.FC<SOSMessagesProps> = ({ onSosClick, currentTeamId }) => {
  const [sosMessages, setSosMessages] = useState<SosMessage[]>([]);
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
      query(
        collection(db, 'sos'),
        where('teamId', 'in', visibleTeams),
        where('timestamp', '>', Timestamp.fromMillis(Date.now() - 10 * 60 * 1000)),
        orderBy('timestamp', 'desc')
      ),
      async (snapshot) => {
        const sosData = await Promise.all(snapshot.docs.map(async (snapshotDoc) => {
          const data = snapshotDoc.data() as SosData;
          const userDoc = await getDoc(doc(db, 'users', data.userId));
          const userData = userDoc.data() as User;
          const date = (data.timestamp as unknown as Timestamp).toDate();
          return {
            ...data,
            timestamp: date,
            userName: userData?.name || 'Unknown User',
            userImage: userData?.image || '',
          };
        }));
        setSosMessages(sosData);
      }
    );

    return () => unsubscribe();
  }, [currentTeamId, sharedTeams]);


  return (
    <List>
      {sosMessages.map((sos, index) => (
        <ListItem 
          key={index} 
          divider 
          button 
          onClick={() => onSosClick(sos.latitude, sos.longitude)}
        >
          <ListItemAvatar>
            <Avatar src={sos.userImage} alt={sos.userName}>
              {sos.userName.charAt(0)}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography variant="subtitle1" color="error">
                {sos.userName} - Team: {sos.teamId}
              </Typography>
            }
            secondary={
              <Box component="span" sx={{ display: 'block' }}>
                <Typography variant="body2" color="text.secondary">
                  Time: {sos.timestamp.toLocaleString()}
                </Typography>
              </Box>
            }
          />
          <ErrorIcon color="error" sx={{ ml: 2 }} />
        </ListItem>
      ))}
    </List>
  );
};

export default SOSMessages;