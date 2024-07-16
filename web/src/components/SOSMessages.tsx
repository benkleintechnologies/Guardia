// src/components/SOSMessages.tsx

import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { SosData } from '../types';

const SOSMessages: React.FC = () => {
  const [sosMessages, setSosMessages] = useState<SosData[]>([]);

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
    <div>
      <h2>SOS Messages</h2>
      <ul>
        {sosMessages.map((sos, index) => (
          <li key={index}>
            User ID: {sos.userId} - Team: {sos.teamId} - Time: {sos.timestamp.toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SOSMessages;