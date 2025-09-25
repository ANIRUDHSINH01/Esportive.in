// Simplified login.js for static website without backend dependencies

// Check for existing user in localStorage (simplified auth)
const checkExistingAuth = () => {
    const user = localStorage.getItem('esportive_user');
    if (user) {
        window.location.href = "tournaments.html";
    }
};

// Check auth state on page load
checkExistingAuth();

// Function to handle the Google Sign-In response
window.handleCredentialResponse = async (response) => {
    try {
        console.log("Google credential received");
        
        // For static site, we'll just decode the JWT token client-side
        // In a real app, this should be validated server-side
        const credential = response.credential;
        const payload = JSON.parse(atob(credential.split('.')[1]));
        
        const user = {
            id: payload.sub,
            name: payload.name,
            email: payload.email,
            photoURL: payload.picture
        };
        
        // Store user info in localStorage
        localStorage.setItem('esportive_user', JSON.stringify(user));
        
        console.log("User signed in:", user);
        
        // Redirect to tournaments page
        window.location.href = "tournaments.html";
        
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
    }
};

// Initialize Google Sign-In when the page loads
window.addEventListener('load', () => {
    // Google Sign-In will be initialized by the GSI script
    console.log("Login page loaded");
});
