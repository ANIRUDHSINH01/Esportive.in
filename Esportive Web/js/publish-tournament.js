import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-analytics.js";

// Your web app's Firebase configuration
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
const analytics = getAnalytics(app);

onAuthStateChanged(auth, (user) => {
    const profileContainer = document.getElementById('profile-container');
    const profileDropdown = document.getElementById('profile-dropdown');
    
    if (user) {
        if (user.photoURL) {
            profileContainer.innerHTML = `
                <img src="${user.photoURL}" alt="User Profile" class="h-8 w-8 rounded-full border-2 border-red-600 cursor-pointer">
            `;
        } else {
            profileContainer.innerHTML = `
                <i class="fas fa-user-circle text-2xl text-white cursor-pointer"></i>
            `;
        }
    } else {
        window.location.href = '../index.html'; // Redirect to login if not authenticated
    }
    
    // Add event listener for the profile dropdown
    profileContainer.addEventListener('click', () => {
        profileDropdown.classList.toggle('hidden');
    });
});

// Add event listener to Logout button
document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            try {
                await signOut(auth);
                window.location.href = '../index.html';
            } catch (error) {
                console.error("Error signing out:", error);
            }
        });
    }
});