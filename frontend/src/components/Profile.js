import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';

const Profile = () => {
  const { user, logout, getProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await getProfile();
    } catch (err) {
      setError('Failed to load profile');
      console.error('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [getProfile]);

  useEffect(() => {
    if (!user) {
      fetchProfile();
    }
  }, [user, fetchProfile]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchProfile}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>

          <div className="flex items-center mb-6">
            {user.picture && (
              <img
                src={user.picture}
                alt={user.name}
                className="w-16 h-16 rounded-full mr-4"
              />
            )}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              {user.isAdmin && (
                <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full mt-1">
                  Admin
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Account Information</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">User ID:</span> {user.id}
                </div>
                <div>
                  <span className="font-medium">Email:</span> {user.email}
                </div>
                <div>
                  <span className="font-medium">Role:</span> {user.isAdmin ? 'Admin' : 'User'}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Tournament Activity</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Registered Tournaments:</span>{' '}
                  {user.registeredTournaments ? user.registeredTournaments.length : 0}
                </div>
                {user.registeredTournaments && user.registeredTournaments.length > 0 && (
                  <div className="mt-2">
                    <h4 className="font-medium mb-1">Recent Registrations:</h4>
                    <ul className="text-xs space-y-1">
                      {user.registeredTournaments.slice(0, 3).map((tournament, index) => (
                        <li key={index} className="text-gray-600">
                          Tournament ID: {tournament.tournamentId}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Quick Actions</h3>
            <div className="flex space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                Browse Tournaments
              </button>
              <button className="border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-600 hover:text-white transition-colors">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;