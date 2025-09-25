// Simplified publish-tournament.js for static website

// Get current user from localStorage
const getCurrentUser = () => {
    const userStr = localStorage.getItem('esportive_user');
    return userStr ? JSON.parse(userStr) : null;
};

// Check authentication and redirect if not logged in
const checkAuth = () => {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'index.html';
        return null;
    }
    return user;
};

// Logout function
window.logout = () => {
    localStorage.removeItem('esportive_user');
    window.location.href = 'index.html';
};

// Initialize page
const initializePage = () => {
    const user = checkAuth();
    if (!user) return;

    // Update profile container
    updateProfileContainer(user);
    
    // Setup event listeners
    setupEventListeners();
};

// Update profile container with user info
const updateProfileContainer = (user) => {
    const profileContainer = document.getElementById('profile-container');
    if (profileContainer) {
        if (user.photoURL) {
            profileContainer.innerHTML = `
                <img src="${user.photoURL}" alt="User Profile" class="h-8 w-8 rounded-full border-2 border-red-600 cursor-pointer">
            `;
        } else {
            profileContainer.innerHTML = `
                <div class="h-8 w-8 rounded-full border-2 border-red-600 bg-gray-600 flex items-center justify-center cursor-pointer">
                    <span class="text-white text-sm font-bold">${user.name.charAt(0).toUpperCase()}</span>
                </div>
            `;
        }
    }
};

// Setup event listeners
const setupEventListeners = () => {
    // Menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const menuIcon = document.getElementById('menu-icon');
    const sidebar = document.getElementById('sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            if (sidebar.classList.contains('open')) {
                menuIcon.classList.remove('fa-bars');
                menuIcon.classList.add('fa-xmark');
            } else {
                menuIcon.classList.remove('fa-xmark');
                menuIcon.classList.add('fa-bars');
            }
        });
    }

    // Profile dropdown
    const profileContainer = document.getElementById('profile-container');
    const profileDropdown = document.getElementById('profile-dropdown');
    
    if (profileContainer && profileDropdown) {
        profileContainer.addEventListener('click', () => {
            profileDropdown.classList.toggle('hidden');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!profileContainer.contains(e.target) && !profileDropdown.contains(e.target)) {
                profileDropdown.classList.add('hidden');
            }
        });
    }

    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage);
