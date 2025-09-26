# Esportive.in - Express + EJS Tournament Platform

A full-stack esports tournament platform built with Express.js, EJS, and MongoDB.

## Features

- **User Authentication**: JWT-based authentication with support for email/password and Google OAuth
- **Google Sign-In Integration**: Both EJS and static HTML implementations with secure backend verification
- **Tournament Management**: Create, view, and register for tournaments
- **Admin Dashboard**: Admin users can publish and manage tournaments
- **Dual Frontend Support**: Both EJS server-side rendering and static HTML implementations
- **Responsive Design**: Mobile-first responsive UI using TailwindCSS
- **Real-time Updates**: Tournament participant counts and status updates
- **Game Filtering**: Filter tournaments by game type

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (optional, graceful degradation)
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Google Auth Library** - OAuth token verification

### Frontend
- **EJS** - Templating engine for server-side rendering
- **TailwindCSS** - Styling framework
- **Vanilla JavaScript** - Client-side functionality

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Esportive.in
```

2. Install all dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/esportive
JWT_SECRET=your_jwt_secret_key_here
GOOGLE_CLIENT_ID=your_google_client_id_here
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

4. Start MongoDB service (if running locally)

5. Run the application:

Development mode (EJS templates - primary frontend):
```bash
npm run dev
```

Optional React frontend development:
```bash
# Terminal 1 - Backend server
npm run dev

# Terminal 2 - React frontend (if needed)
npm run frontend:dev
```

Production mode:
```bash
npm start
```

## Google OAuth Setup

To enable Google Sign-In functionality:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API or Google Sign-In API
4. Create OAuth 2.0 credentials
5. Add authorized JavaScript origins:
   - `http://localhost:5000` (development)
   - Your production domain
6. Update the client ID in:
   - `.env` file (`GOOGLE_CLIENT_ID`)
   - `frontend/src/components/GoogleSignIn.js`
   - `Esportive Web/login.html`

## Access Points

### EJS Frontend
- Main app: `http://localhost:5000`
- Login page: `http://localhost:5000/login`
- Tournaments: `http://localhost:5000/tournaments`

### Static HTML
- Login: `http://localhost:5000/Esportive%20Web/login.html`
- Tournaments: `http://localhost:5000/Esportive%20Web/tournaments.html`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/google` - Google OAuth login (legacy)
- `POST /api/auth/google-verify` - Google JWT token verification
- `GET /api/auth/me` - Get current user

### Tournaments
- `GET /api/tournaments` - Get all tournaments (with pagination and filtering)
- `GET /api/tournaments/:id` - Get tournament by ID
- `POST /api/tournaments` - Create tournament (admin only)
- `PUT /api/tournaments/:id` - Update tournament (admin only)
- `DELETE /api/tournaments/:id` - Delete tournament (admin only)
- `POST /api/tournaments/:id/register` - Register for tournament

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users` - Get all users (admin only)

## Project Structure

```
├── models/              # Mongoose models
├── routes/              # API routes
├── middleware/          # Custom middleware
├── views/               # EJS templates (primary frontend)
│   ├── partials/        # Reusable EJS partials  
│   └── pages/           # Page templates
├── frontend/            # React frontend source (optional)
│   ├── src/             # React components and hooks
│   └── public/          # React public assets
├── Esportive Web/       # Static HTML pages (alternative frontend)
│   ├── assets/          # Images and media
│   ├── css/             # Stylesheets
│   ├── js/              # JavaScript files
│   └── *.html           # HTML pages
├── .env                 # Environment variables
├── package.json         # All dependencies (unified)
└── server.js            # Server entry point (serves all frontends)
```

## Deployment

The application is designed for single-platform deployment, serving both frontend and backend on the same port:

### Quick Deployment (Recommended)
1. Set up environment variables on your hosting platform:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/esportive
   JWT_SECRET=your_jwt_secret_key_here
   GOOGLE_CLIENT_ID=your_google_client_id_here
   NODE_ENV=production
   ```

2. Deploy to platforms like Heroku, Railway, or any VPS:
   ```bash
   # Single command deployment - unified dependencies
   npm install
   npm start      # Starts the server serving EJS templates and backend
   ```

### Manual Deployment
1. Install all dependencies: `npm install`
2. Start the server: `npm start`

### Access Points
After deployment, both frontends are accessible on the same domain:
- **EJS Templates**: `https://yourdomain.com/` (main application)
- **Static HTML**: `https://yourdomain.com/Esportive%20Web/login.html` (alternative login)
- **API**: `https://yourdomain.com/api/health` (backend endpoints)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.