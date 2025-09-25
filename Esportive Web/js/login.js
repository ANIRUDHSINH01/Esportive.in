import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDthHTw69Olq2yM1YBRZqLor93zlQkJ3NY",
    authDomain: "esportive-463db.firebaseapp.com",
    projectId: "esportive-463db",
    storageBucket: "esportive-463db.firebasestorage.app",
    messagingSenderId: "461834147360",
    appId: "1:461834147360:web:3228bd4a45928a003fce45",
    measurementId: "G-4QKQ9YC8ML"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Check for existing user token
const checkExistingAuth = () => {
    const token = localStorage.getItem('esportive_token');
    if (token) {
        // Verify token with backend
        fetch('/api/auth/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.ok) {
                window.location.href = "tournaments.html";
            } else {
                localStorage.removeItem('esportive_token');
            }
        })
        .catch(error => {
            console.error('Token verification failed:', error);
            localStorage.removeItem('esportive_token');
        });
    }
};

// Check auth state on page load
checkExistingAuth();

// Function to handle the Google Sign-In response
window.handleCredentialResponse = async (response) => {
    try {
        console.log("Google credential received, sending to backend...");
        
        // Send credential to backend for verification
        const backendResponse = await fetch('/api/auth/google-verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ credential: response.credential }),
        });

        const data = await backendResponse.json();
        
        if (backendResponse.ok) {
            // Store token and redirect
            localStorage.setItem('esportive_token', data.token);
            console.log("Login successful, redirecting...");
            window.location.href = "tournaments.html";
        } else {
            console.error("Backend authentication failed:", data.message);
            alert("Authentication failed: " + data.message);
        }
    } catch (error) {
        console.error("Error during Google Sign-in:", error);
        alert("Sign-in failed. Please try again.");
    }
}