import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const useAuth = () => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Store access token in localStorage
  const storeAccessToken = (token) => {
    if (token) {
      localStorage.setItem('accessToken', token);
      setAccessToken(token);
    } else {
      localStorage.removeItem('accessToken');
      setAccessToken(null);
    }
  };

  // API call with automatic token refresh
  const apiCall = useCallback(async (url, options = {}) => {
    const makeRequest = async (token) => {
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      return fetch(url, {
        ...options,
        headers,
        credentials: 'include' // Include cookies for refresh token
      });
    };

    try {
      // First attempt with current access token
      let response = await makeRequest(accessToken);

      // If unauthorized and we have an access token, try to refresh
      if (response.status === 401 && accessToken) {
        try {
          const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            credentials: 'include'
          });

          if (refreshResponse.ok) {
            const { accessToken: newToken } = await refreshResponse.json();
            storeAccessToken(newToken);
            
            // Retry original request with new token
            response = await makeRequest(newToken);
          } else {
            // Refresh failed, clear tokens
            storeAccessToken(null);
            setUser(null);
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          storeAccessToken(null);
          setUser(null);
        }
      }

      return response;
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  }, [accessToken]);

  // Login with Google
  const loginWithGoogle = async (idToken) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ idToken })
      });

      if (response.ok) {
        const data = await response.json();
        storeAccessToken(data.accessToken);
        setUser(data.user);
        return data;
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      storeAccessToken(null);
      setUser(null);
    }
  };

  // Get user profile
  const getProfile = async () => {
    try {
      const response = await apiCall(`${API_BASE_URL}/auth/profile`);
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        return data.user;
      }
    } catch (error) {
      console.error('Get profile error:', error);
    }
  };

  // Check if user is authenticated on mount
  useEffect(() => {
    if (accessToken && !user) {
      getProfile();
    }
  }, [accessToken, user]);

  return {
    user,
    accessToken,
    loading,
    loginWithGoogle,
    logout,
    apiCall,
    getProfile,
    isAuthenticated: !!accessToken && !!user
  };
};