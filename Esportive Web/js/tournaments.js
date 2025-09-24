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

// Listen for auth state changes to update UI
onAuthStateChanged(auth, (user) => {
    const profileContainer = document.getElementById('profile-container');
    const profileDropdown = document.getElementById('profile-dropdown');
    
    if (user) {
        // User is signed in, update UI
        if (user.photoURL) {
            profileContainer.innerHTML = `
                <img src="${user.photoURL}" alt="User Profile" class="h-8 w-8 rounded-full border-2 border-red-600 cursor-pointer">
            `;
        } else {
            profileContainer.innerHTML = `
                <i class="fas fa-user-circle text-2xl text-white cursor-pointer"></i>
            `;
        }

        profileContainer.addEventListener('click', () => {
            profileDropdown.classList.toggle('hidden');
        });
    } else {
        // User is not signed in, redirect to index.html
        window.location.href = 'index.html';
    }
});

// Add event listener to Logout button
document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            try {
                await signOut(auth);
                window.location.href = 'index.html';
            } catch (error) {
                console.error("Error signing out:", error);
            }
        });
    }

    const menuToggle = document.getElementById('menu-toggle');
    const menuIcon = document.getElementById('menu-icon');
    const sidebar = document.getElementById('sidebar');
    const socialsToggle = document.getElementById('socials-toggle');
    const socialLinks = document.getElementById('social-links');
    const tournamentsContainer = document.getElementById('tournaments-container');
    const gameFilter = document.getElementById('game-filter');
    let allTournaments = [];

    // Sidebar logic
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

    socialsToggle.addEventListener('click', () => {
        socialLinks.classList.toggle('hidden');
        socialsToggle.querySelector('i').classList.toggle('rotate-180');
    });

    // --- DYNAMIC TOURNAMENT CARD LOGIC ---
    // IMPORTANT: The link must be the public "Published to web" CSV link from your Google Sheet.
    const googleSheetsUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRA4wuYi-9mQm_jqQJcX_o5biFNxBbS45jsp-J1bbVd3i4LEZDvgUWWDk29uqovv7aTAssL6M_I4YFG/pub?output=csv';

    // Function to parse CSV data and validate that all required fields are present
    const parseCSV = (csv) => {
        const lines = csv.split('\n').filter(line => line.trim() !== '');
        if (lines.length === 0) {
            console.warn("CSV data is empty.");
            return [];
        }
        
        const headers = lines[0].split(',').map(header => header.trim());
        // REQUIRED HEADERS: Make sure these match the column headers in your Google Sheet exactly.
        const requiredFields = ['Event Name', 'PrizePool', 'ImageURL', 'Slots', 'Format', 'Close Date', 'Organization', 'Social Link', 'Registration', 'Game'];
        
        const parsedData = lines.slice(1).map(line => {
            const values = line.split(',').map(value => value.trim());
            const row = {};
            headers.forEach((header, i) => {
                row[header] = values[i];
            });
            return row;
        });

        const validData = parsedData.filter(row => {
            const isValid = requiredFields.every(field => row[field] && row[field].length > 0);
            if (!isValid) {
                console.error("Skipping a tournament row due to missing required fields:", row);
            }
            return isValid;
        });
        return validData;
    };

    const createCard = (tournament) => {
        const card = document.createElement('div');
        card.className = 'bg-gray-900 rounded-lg p-4 flex flex-col items-center text-center tournament-card';
        
        card.innerHTML = `
            <div class="w-full relative aspect-square">
                <div class="absolute inset-0">
                    <img src="${tournament.ImageURL}" alt="${tournament['Event Name']}" class="h-full w-full object-contain p-4" data-card-image>
                </div>
                <div class="absolute inset-0 p-4 hidden text-left" data-card-details>
                    <p class="text-sm font-semibold mb-2">Tournament Details:</p>
                    <ul class="text-xs text-gray-400 space-y-1">
                        <li>**Event Name:** ${tournament['Event Name']}</li>
                        <li>**Game:** ${tournament.Game}</li>
                        <li>**Prize Pool:** ${tournament.PrizePool}</li>
                        <li>**Slots:** ${tournament.Slots}</li>
                        <li>**Format:** ${tournament.Format}</li>
                        <li>**Close Date:** ${tournament['Close Date']}</li>
                        <li>**Organization:** ${tournament.Organization}</li>
                        <li>**Social Link:** <a href="${tournament['Social Link']}" class="text-blue-400 hover:underline" target="_blank">View Here</a></li>
                    </ul>
                </div>
            </div>
            <div class="mt-4 flex flex-col items-center w-full">
                <h2 class="text-lg font-semibold">${tournament['Event Name']}</h2>
                <p class="text-sm text-gray-400">Game: ${tournament.Game}</p>
                <p class="text-xs text-gray-400">Prize Pool: ${tournament.PrizePool}</p>
                <div class="flex space-x-2 mt-4 w-full justify-center">
                    <button class="flex-1 px-4 py-1 text-sm text-white border-2 border-red-600 rounded-full hover:bg-red-600 transition-colors" data-details-toggle>Details</button>
                    <a href="${tournament.Registration}" target="_blank" class="flex-1 px-4 py-1 text-sm text-center text-white border-2 border-red-600 rounded-full hover:bg-red-600 transition-colors">Register</a>
                </div>
            </div>
        `;
        return card;
    };

    const renderTournaments = (tournaments) => {
        tournamentsContainer.innerHTML = '';
        if (tournaments.length === 0) {
            tournamentsContainer.innerHTML = '<p class="text-center text-gray-500">No tournaments found for this game.</p>';
            return;
        }
        tournaments.forEach(tournament => {
            const card = createCard(tournament);
            tournamentsContainer.appendChild(card);
        });
        document.querySelectorAll('[data-details-toggle]').forEach(button => {
            button.addEventListener('click', () => {
                const card = button.closest('.tournament-card');
                const image = card.querySelector('[data-card-image]');
                const details = card.querySelector('[data-card-details]');
                image.classList.toggle('hidden');
                details.classList.toggle('hidden');
                if (image.classList.contains('hidden')) {
                    button.textContent = 'Back';
                } else {
                    button.textContent = 'Details';
                }
            });
        });
    };

    const createFilterDropdown = () => {
        const games = [
            'BGMI',
            'Free Fire',
            'CODM',
            'Clash Of Clans',
            'Clash Royale',
            'Brawl Stars',
            'Pokemon Unite'
        ];
        
        gameFilter.innerHTML = '<option value="">All Games</option>';
        
        games.forEach(game => {
            const option = document.createElement('option');
            option.value = game;
            option.textContent = game;
            gameFilter.appendChild(option);
        });
    };

    const fetchTournaments = async () => {
        try {
            const response = await fetch(googleSheetsUrl);
            const csvText = await response.text();
            allTournaments = parseCSV(csvText);
            
            createFilterDropdown();
            
            const initialTournaments = allTournaments.slice(0, 10);
            renderTournaments(initialTournaments);

            gameFilter.addEventListener('change', (e) => {
                const gameToFilter = e.target.value;
                let filtered = allTournaments;
                if (gameToFilter) {
                    filtered = allTournaments.filter(t => t['Game'] === gameToFilter);
                }
                renderTournaments(filtered.slice(0, 10));
            });
        } catch (error) {
            console.error("Error fetching tournaments from Google Sheets:", error);
        }
    };

    fetchTournaments();
});