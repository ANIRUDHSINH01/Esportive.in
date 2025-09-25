import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useAuth } from './hooks/useAuth';
import Login from './components/Login';
import Profile from './components/Profile';
import './App.css';

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '349035022191-u6vlii5vhhifig720m8ovmmgm1es66ub.apps.googleusercontent.com';

function AppContent() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {isAuthenticated ? <Profile /> : <Login />}
    </div>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AppContent />
    </GoogleOAuthProvider>
  );
}

export default App;