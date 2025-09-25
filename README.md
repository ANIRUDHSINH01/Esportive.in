# Esportive.in - Simple Static Website

A simple, clean static website for esports tournaments - no complex backend required!

## What Changed?

This website has been simplified from a complex full-stack application to a simple static website that runs anywhere. **No more backend complexity!**

### Before vs After

**Before (Complex):**
- ✖️ Node.js/Express backend with 20+ dependencies
- ✖️ MongoDB database setup required
- ✖️ EJS server-side rendering
- ✖️ API routes and authentication middleware
- ✖️ Complex deployment requirements

**After (Simple):**
- ✅ Pure HTML/CSS/JavaScript static files
- ✅ Works with any web server (even Python's built-in server!)
- ✅ No database or backend setup needed
- ✅ Simple Google Sign-In integration
- ✅ Deploy anywhere - GitHub Pages, Netlify, Vercel, any hosting

## Features

- **Clean Design**: Modern, responsive design using TailwindCSS
- **Google Authentication**: Simple Google Sign-In for user authentication
- **Tournament Display**: Sample tournaments with join functionality
- **Admin Contact**: Easy WhatsApp links to contact tournament administrators
- **Mobile Friendly**: Responsive design works on all devices
- **No Dependencies**: Just static files - no build process needed

## Quick Start

### Option 1: Python Server (Easiest)
```bash
# Clone and serve
git clone https://github.com/ANIRUDHSINH01/Esportive.in.git
cd Esportive.in
python3 -m http.server 8000

# Open http://localhost:8000
```

### Option 2: Node.js Serve
```bash
npm install -g serve
serve .
```

### Option 3: Any Web Server
Just upload all files to any web hosting service!

## File Structure

```
├── index.html           # Homepage
├── login.html          # Login page with Google Sign-In
├── tournaments.html    # Tournaments listing
├── publish-tournament.html # Admin contact for publishing
├── assets/             # Images and media files
├── css/               # Stylesheets
├── js/                # JavaScript files
├── pages/             # Additional pages (privacy, terms, etc.)
└── package.json       # Simple package file for hosting
```

## How It Works

1. **Homepage** (`index.html`): Clean landing page with game logos and information
2. **Login** (`login.html`): Google Sign-In integration for user authentication
3. **Tournaments** (`tournaments.html`): Displays sample tournaments with join functionality
4. **Admin Contact** (`publish-tournament.html`): WhatsApp links to contact administrators

## Google Sign-In Setup

To enable Google Sign-In:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add your domain to authorized origins
4. Update the client ID in `login.html` (line 25)

## Deployment Options

### GitHub Pages
1. Push to GitHub
2. Enable GitHub Pages in repository settings
3. Done! Your site is live

### Netlify
1. Drag and drop the folder to Netlify
2. Done! Instant deployment

### Vercel
1. `vercel` command in the directory
2. Done! Auto-deployment

### Any Hosting Service
Just upload the files - works with any web hosting!

## Screenshots

### Homepage
![Homepage](https://github.com/user-attachments/assets/93c22a8a-9fdc-45b1-b057-5caaefc28fbe)

### Tournaments Page
![Tournaments](https://github.com/user-attachments/assets/bc2c6798-5d13-42ea-bbd8-2f6291901078)

## Customization

- **Add Tournaments**: Edit the `sampleTournaments` array in `js/tournaments.js`
- **Change Styling**: Modify CSS files in the `css/` directory
- **Update Content**: Edit HTML files directly
- **Add Pages**: Create new HTML files and link them

## Support

For questions or support, contact via:
- WhatsApp: Links available in the publish tournament page
- Email: Check the contact links in the footer

## License

MIT License - feel free to use for your own projects!

---

**Simple. Clean. No Backend Required. Just a Website.** 🚀