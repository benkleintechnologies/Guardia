// src/components/SOSMessages.tsx

import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, where, orderBy, doc, getDoc, Timestamp } from 'firebase/firestore';
import { SosData, User } from '../types';
import { List, ListItem, ListItemText, Paper, Typography, Box } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

interface SosMessage extends SosData {
  userName: string;
  timestamp: Date;
}

interface SOSMessagesProps {
  onSosClick: (latitude: number, longitude: number) => void;
}

const SOSMessages: React.FC<SOSMessagesProps> = ({ onSosClick }) => {
  const [sosMessages, setSosMessages] = useState<SosMessage[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, 'sos'),
        where('timestamp', '>', Timestamp.fromMillis(Date.now() - 10 * 60 * 1000)),
        orderBy('timestamp', 'desc')
      ),
      async (snapshot) => {
        const sosData = await Promise.all(snapshot.docs.map(async (snapshotDoc) => {
          const data = snapshotDoc.data() as SosData;
          const userDoc = await getDoc(doc(db, 'users', data.userId));
          const userData = userDoc.data() as User;

          // Convert Firestore Timestamp to JavaScript Date
          const date = (data.timestamp as unknown as Timestamp).toDate();

          return {
            ...data,
            timestamp: date,
            userName: userData?.name || 'Unknown User',
          };
        }));
        setSosMessages(sosData);
      }
    );

    return () => unsubscribe();
  }, []);


  return (
    <Paper elevation={3} sx={{ p: 2, maxHeight: '50vh', overflow: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        SOS Messages
      </Typography>
      <List>
        {sosMessages.map((sos, index) => (
          <ListItem 
            key={index} 
            divider 
            button 
            onClick={() => onSosClick(sos.latitude, sos.longitude)}
          >
            <ErrorIcon color="error" sx={{ mr: 2 }} />
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
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default SOSMessages;