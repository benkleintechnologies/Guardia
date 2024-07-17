import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import { AuthProvider, useAuth } from './hooks/useAuth';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, initializing } = useAuth();

  if (initializing) {
    return <div>Loading...</div>; // or a spinner
  }

  return <>{currentUser ? children : <Navigate to="/auth" replace />}</>;
};

const App = () => {
  return (
    <AuthProvider>
      <Router basename="/">
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;