// src/components/Dashboard.tsx

import React from 'react';
import Map from './Map';
import UserList from './UserList';
import SOSMessages from './SOSMessages';

const Dashboard: React.FC = () => {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 3 }}>
        <Map />
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <UserList />
        <SOSMessages />
      </div>
    </div>
  );
};

export default Dashboard;