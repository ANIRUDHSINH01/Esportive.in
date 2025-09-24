import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithCredential, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

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

// Check for existing user on page load
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, redirect to the tournaments page
        window.location.href = "tournaments.html";
    }
});

// Function to handle the Google Sign-In response
window.handleCredentialResponse = async (response) => {
    try {
        // Build a Firebase credential with the Google ID token.
        const credential = GoogleAuthProvider.credential(response.credential);

        // Sign in with the credential and redirect to tournaments page on success.
        await signInWithCredential(auth, credential);

    } catch (error) {
        console.error("Error during Google Sign-in:", error);
    }
}