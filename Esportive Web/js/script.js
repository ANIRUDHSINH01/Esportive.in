const menuToggle = document.getElementById('menu-toggle');
const menuIcon = document.getElementById('menu-icon');
const sidebar = document.getElementById('sidebar');
const socialsToggle = document.getElementById('socials-toggle');
const socialLinks = document.getElementById('social-links');

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

document.addEventListener('DOMContentLoaded', () => {
    const tournamentsContainer = document.getElementById('tournaments-container');
    const videosContainer = document.getElementById('videos-container');
    const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRA4wuYi-9mQm_jqQJcX_o5biFNxBbS45jsp-J1bbVd3i4LEZDvgUWWDk29uqovv7aTAssL6M_I4YFG/pub?output=csv';

    // Cookie pop-up functionality
    const cookieConsent = document.getElementById('cookie-consent');
    const acceptButton = document.getElementById('accept-cookies');
    const declineButton = document.getElementById('decline-cookies');

    // Show cookie pop-up if consent has not been given
    if (!localStorage.getItem('cookieAccepted')) {
        cookieConsent.classList.remove('hidden');
    }

    const hideCookieConsent = () => {
        cookieConsent.classList.add('hidden');
    };

    acceptButton.addEventListener('click', () => {
        localStorage.setItem('cookieAccepted', 'true');
        hideCookieConsent();
    });

    declineButton.addEventListener('click', () => {
        localStorage.setItem('cookieAccepted', 'true'); // Treat decline as a choice to not show again
        hideCookieConsent();
    });
    
    // Function to fetch and render tournaments from CSV
    async function fetchAndRenderTournaments() {
        try {
            const response = await fetch(csvUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const csvText = await response.text();
            const lines = csvText.split('\n').slice(1); // Skip the header row
            
            if (lines.length === 0 || (lines.length === 1 && lines[0].trim() === '')) {
                tournamentsContainer.innerHTML = '<div class="text-gray-400">No featured tournaments found.</div>';
                return;
            }

            // Limit to the first 5 cards
            const limitedLines = lines.slice(0, 5);
            tournamentsContainer.innerHTML = ''; // Clear loading message

            limitedLines.forEach(line => {
                const parts = line.split(',');
                // Check if the row has enough columns for our data
                if (parts.length >= 10) {
                    const title = parts[0].trim();
                    const prize = parts[1].trim(); 
                    const game = parts[9].trim();
                    
                    const card = document.createElement('div');
                    card.className = 'w-64 flex-shrink-0 bg-gray-900 rounded-lg p-4 shadow-lg flex flex-col items-center justify-between transition-all duration-300 transform hover:scale-105';
                    card.innerHTML = `
                        <div class="text-center">
                            <h3 class="text-lg font-semibold text-center truncate w-full">${title}</h3>
                            <p class="text-sm text-gray-400 mt-1">${game}</p>
                            <div class="mt-2 text-center">
                                <span class="text-xl font-bold text-red-600">${prize}</span>
                                <p class="text-xs text-gray-500">Prize Pool</p>
                            </div>
                        </div>
                        <button onclick="window.location.href='login.html'" class="w-full mt-4 px-4 py-2 text-white border-2 border-red-600 rounded-full text-center text-sm font-semibold transition-all duration-300 hover:bg-red-600">
                            Register Now
                        </button>
                    `;
                    tournamentsContainer.appendChild(card);
                } else {
                     console.warn('Skipping malformed CSV row:', line);
                }
            });

        } catch (error) {
            console.error('There was a problem fetching or parsing the tournaments:', error);
            tournamentsContainer.innerHTML = '<div class="text-red-400">Failed to load tournaments. Please check the CSV link and try again.</div>';
        }
    }

    // Function to fetch and render YouTube videos
    async function fetchAndRenderVideos() {
        const apiKey = 'AIzaSyAkUf-Vwi0KbLw49xTryOsrNx9PvR3ph-8';
        const channelId = 'UCJKmT7fdYF7F2tqijFEzDgQ'; 
        const youtubeApiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&channelId=${channelId}&order=date&type=video&key=${apiKey}`;

        try {
            const response = await fetch(youtubeApiUrl);
            if (!response.ok) {
                throw new Error(`YouTube API error: ${response.statusText}`);
            }
            const data = await response.json();
            
            videosContainer.innerHTML = ''; // Clear loading message

            if (!data.items || data.items.length === 0) {
                 videosContainer.innerHTML = '<div class="text-gray-400">No videos found.</div>';
                 return;
            }

            data.items.forEach(item => {
                const videoId = item.id.videoId;
                const videoTitle = item.snippet.title;
                
                const card = document.createElement('div');
                // Video card width changed from w-80 to w-64
                card.className = 'w-64 flex-shrink-0 bg-gray-900 rounded-lg overflow-hidden shadow-lg flex flex-col'; 
                
                card.innerHTML = `
                    <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank">
                        <img src="${item.snippet.thumbnails.high.url}" alt="${videoTitle}" class="w-full h-auto rounded-t-lg">
                        <p class="text-sm font-semibold text-gray-300 truncate">${videoTitle}</p>
                    </a>
                `;
                videosContainer.appendChild(card);
            });

        } catch (error) {
            console.error('There was a problem fetching YouTube videos:', error);
            videosContainer.innerHTML = '<div class="text-red-400">Failed to load videos. Please check your API key and channel ID.</div>';
        }
    }

    fetchAndRenderTournaments();
    fetchAndRenderVideos();
});