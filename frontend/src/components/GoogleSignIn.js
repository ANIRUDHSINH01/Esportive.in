import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const GoogleSignIn = () => {
  const { googleLogin } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCredentialResponse = useCallback(async (response) => {
    setIsLoading(true);
    setError('');
    
    try {
      // Send the credential directly to backend for verification
      const result = await fetch('/api/auth/google-verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential: response.credential }),
      });

      const data = await result.json();
      
      if (result.ok) {
        // Store token and user data
        localStorage.setItem('token', data.token);
        
        // Update auth context
        const authResult = await googleLogin({
          token: data.token,
          user: data.user
        });
        
        if (authResult.success) {
          navigate('/tournaments');
        } else {
          setError(authResult.message || 'Authentication failed');
        }
      } else {
        setError(data.message || 'Google sign-in failed');
      }
    } catch (error) {
      console.error('Error during Google Sign-in:', error);
      setError('Failed to sign in with Google. Please try again.');
    }
    
    setIsLoading(false);
  }, [googleLogin, navigate]);

  useEffect(() => {
    // Load Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: "349035022191-u6vlii5vhhifig720m8ovmmgm1es66ub.apps.googleusercontent.com",
          callback: handleCredentialResponse,
          auto_prompt: false
        });

        window.google.accounts.id.renderButton(
          document.getElementById("google-signin-button"),
          { 
            type: "standard",
            size: "large", 
            theme: "outline", 
            text: "sign_in_with",
            shape: "pill",
            logo_alignment: "left",
            width: "100%"
          }
        );
      }
    };

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [handleCredentialResponse]);

  return (
    <div className="w-full">
      {error && (
        <div className="text-red-500 text-sm text-center mb-4">{error}</div>
      )}
      
      <div className="relative">
        <div id="google-signin-button" className={isLoading ? 'opacity-50 pointer-events-none' : ''}></div>
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-center">
        <div className="flex items-center">
          <div className="flex-grow border-t border-gray-600"></div>
          <span className="px-4 text-gray-400 text-sm">or continue with email</span>
          <div className="flex-grow border-t border-gray-600"></div>
        </div>
      </div>
    </div>
  );
};

export default GoogleSignIn;