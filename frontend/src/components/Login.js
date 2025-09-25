import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const { loginWithGoogle, loading } = useAuth();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await loginWithGoogle(credentialResponse.credential);
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed: ' + error.message);
    }
  };

  const handleGoogleError = () => {
    console.error('Google Login Failed');
    alert('Google Login Failed');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p>Signing you in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-4 bg-gray-900">
      <div className="w-full max-w-sm mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col items-center mb-6">
          <img 
            src="/Esportive%20Web/assets/navbar/logo.png" 
            alt="Esportive Logo" 
            className="h-8 mb-2"
          />
          <h1 className="text-xl font-bold text-gray-900">Welcome Back Goat!</h1>
          <p className="text-xs text-gray-500 mt-1">Sign in to find your next tournament.</p>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              size="large"
              theme="outline"
              text="signin_with"
              shape="pill"
              logo_alignment="left"
            />
          </div>
          
          <p className="mt-2 text-center text-xs text-gray-500">
            By signing in you agree to our{' '}
            <a href="/pages/terms-of-use" className="text-red-600 hover:underline">
              Terms of Use
            </a>{' '}
            and{' '}
            <a href="/pages/privacy-policy" className="text-red-600 hover:underline">
              Privacy Policy
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;