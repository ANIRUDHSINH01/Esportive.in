#!/usr/bin/env node

/**
 * Demo script to test the authentication API endpoints
 * This shows how the authentication flow would work with a real Google ID token
 */

const fetch = require('node-fetch'); // You would need to install this: npm install node-fetch

const BASE_URL = 'http://localhost:5000/api';

// Demo function to show API usage
async function demoAuthFlow() {
  console.log('🚀 Esportive.in Authentication API Demo');
  console.log('=====================================\n');

  try {
    // 1. Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('   ✅ Health:', healthData);

    // 2. Test protected endpoint without auth (should fail)
    console.log('\n2. Testing protected endpoint without auth...');
    const profileResponse = await fetch(`${BASE_URL}/auth/profile`);
    const profileData = await profileResponse.json();
    console.log('   ❌ Profile (no auth):', profileData);

    // 3. Test refresh endpoint without cookie (should fail)
    console.log('\n3. Testing refresh endpoint without cookie...');
    const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST'
    });
    const refreshData = await refreshResponse.json();
    console.log('   ❌ Refresh (no cookie):', refreshData);

    // 4. Test logout endpoint
    console.log('\n4. Testing logout endpoint...');
    const logoutResponse = await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST'
    });
    const logoutData = await logoutResponse.json();
    console.log('   ✅ Logout:', logoutData);

    console.log('\n📝 Notes:');
    console.log('   - Google authentication requires a valid Google ID token');
    console.log('   - MongoDB must be running for full functionality');
    console.log('   - In a real scenario, you would get the ID token from @react-oauth/google');
    console.log('   - Access tokens would be sent in Authorization header: "Bearer <token>"');
    console.log('   - Refresh tokens are automatically sent via httpOnly cookies');

  } catch (error) {
    console.error('❌ Demo failed:', error.message);
  }
}

// Example of how to make an authenticated API call
function exampleAuthenticatedCall() {
  console.log('\n📋 Example: Making an authenticated API call');
  console.log('============================================');
  
  const exampleCode = `
// Frontend React code example:
import { useAuth } from './hooks/useAuth';

function MyComponent() {
  const { apiCall } = useAuth();
  
  const fetchUserProfile = async () => {
    try {
      const response = await apiCall('/api/auth/profile');
      if (response.ok) {
        const userData = await response.json();
        console.log('User profile:', userData);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };
  
  return (
    <button onClick={fetchUserProfile}>
      Get My Profile
    </button>
  );
}

// The apiCall function automatically:
// 1. Adds Authorization header with access token
// 2. Includes credentials for refresh token cookie
// 3. Handles token refresh if access token expires
// 4. Retries the original request with new token
  `;
  
  console.log(exampleCode);
}

// Run the demo
if (require.main === module) {
  demoAuthFlow().then(() => {
    exampleAuthenticatedCall();
  });
}

module.exports = { demoAuthFlow, exampleAuthenticatedCall };