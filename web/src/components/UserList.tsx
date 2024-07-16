// src/components/UserList.tsx

import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { User } from '../types';

const UserList: React.FC = () => {
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
    <div>
      <h2>Users</h2>
      <ul>
        {users.map(user => (
          <li key={user.userId}>{user.name} - Team: {user.teamId}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;