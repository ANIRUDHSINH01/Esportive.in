// Simplified tournaments.js for static website without backend dependencies

// Sample tournament data (in a real app, this would come from a database)
const sampleTournaments = [
    {
        id: 1,
        name: "BGMI Championship 2024",
        game: "BGMI",
        entryFee: 50,
        prizePool: 10000,
        maxParticipants: 100,
        participants: 45,
        date: "2024-12-15",
        time: "18:00",
        status: "open",
        image: "assets/games/bgmi.jpg"
    },
    {
        id: 2,
        name: "Free Fire World Cup",
        game: "Free Fire",
        entryFee: 25,
        prizePool: 5000,
        maxParticipants: 50,
        participants: 32,
        date: "2024-12-20",
        time: "19:00",
        status: "open",
        image: "assets/games/freefire.jpg"
    },
    {
        id: 3,
        name: "Call of Duty Tournament",
        game: "Call of Duty",
        entryFee: 100,
        prizePool: 15000,
        maxParticipants: 64,
        participants: 64,
        date: "2024-12-10",
        time: "20:00",
        status: "full",
        image: "assets/games/cod.jpg"
    }
];

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

// Initialize page
const initializePage = () => {
    const user = checkAuth();
    if (!user) return;

    // Update profile container
    updateProfileContainer(user);
    
    // Load tournaments
    loadTournaments();
    
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

// Load and display tournaments
const loadTournaments = () => {
    const container = document.getElementById('tournaments-grid');
    if (!container) return;

    container.innerHTML = sampleTournaments.map(tournament => `
        <div class="bg-gray-900 rounded-lg overflow-hidden shadow-lg">
            <div class="aspect-video bg-gray-800 flex items-center justify-center">
                <i class="fas fa-gamepad text-4xl text-gray-600"></i>
            </div>
            <div class="p-4">
                <h3 class="font-bold text-lg mb-2">${tournament.name}</h3>
                <div class="flex items-center justify-between text-sm text-gray-400 mb-2">
                    <span><i class="fas fa-gamepad mr-1"></i>${tournament.game}</span>
                    <span><i class="fas fa-calendar mr-1"></i>${tournament.date}</span>
                </div>
                <div class="flex items-center justify-between text-sm text-gray-400 mb-3">
                    <span><i class="fas fa-coins mr-1"></i>₹${tournament.entryFee}</span>
                    <span><i class="fas fa-trophy mr-1"></i>₹${tournament.prizePool}</span>
                </div>
                <div class="flex items-center justify-between text-sm mb-3">
                    <span class="text-gray-400">Participants</span>
                    <span class="text-white">${tournament.participants}/${tournament.maxParticipants}</span>
                </div>
                <div class="w-full bg-gray-700 rounded-full h-2 mb-3">
                    <div class="bg-red-600 h-2 rounded-full" style="width: ${(tournament.participants / tournament.maxParticipants) * 100}%"></div>
                </div>
                <button onclick="joinTournament(${tournament.id})" 
                        class="w-full py-2 px-4 rounded-lg font-bold transition-colors ${
                            tournament.status === 'full' 
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                                : 'bg-red-600 hover:bg-red-700 text-white'
                        }" 
                        ${tournament.status === 'full' ? 'disabled' : ''}>
                    ${tournament.status === 'full' ? 'Tournament Full' : 'Join Tournament'}
                </button>
            </div>
        </div>
    `).join('');
};

// Join tournament function
window.joinTournament = (tournamentId) => {
    const tournament = sampleTournaments.find(t => t.id === tournamentId);
    if (!tournament) return;

    if (tournament.status === 'full') {
        alert('This tournament is full!');
        return;
    }

    const user = getCurrentUser();
    if (!user) {
        alert('Please login to join tournaments');
        return;
    }

    // In a static site, we can't actually process payments or register users
    // This is just for demonstration
    alert(`You would join "${tournament.name}" for ₹${tournament.entryFee}. In a real app, this would process payment and registration.`);
};

// Logout function
window.logout = () => {
    localStorage.removeItem('esportive_user');
    window.location.href = 'index.html';
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

    // Social links toggle
    const socialsToggle = document.getElementById('socials-toggle');
    const socialLinks = document.getElementById('social-links');
    
    if (socialsToggle && socialLinks) {
        socialsToggle.addEventListener('click', () => {
            socialLinks.classList.toggle('hidden');
            socialsToggle.querySelector('i').classList.toggle('rotate-180');
        });
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage);
