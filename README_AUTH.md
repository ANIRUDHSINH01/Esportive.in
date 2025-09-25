# Secure Google Authentication with JWT Implementation

This implementation provides a complete secure authentication system using Google OAuth with JWT access tokens and refresh tokens.

## 🚀 Features

- **Secure JWT Authentication**: Short-lived access tokens (15 minutes) and long-lived refresh tokens (7 days)
- **Google OAuth Integration**: Using `@react-oauth/google` for seamless Google Sign-In
- **Automatic Token Refresh**: Frontend automatically refreshes expired access tokens
- **HttpOnly Cookies**: Refresh tokens stored securely in httpOnly cookies
- **MongoDB Integration**: User data and refresh tokens stored in MongoDB
- **Production Ready**: Proper error handling, CORS configuration, and security headers

## 🏗️ Architecture

### Backend (Node.js + Express + MongoDB)
- **JWT Access Tokens**: Expire in 15 minutes, used for API authentication
- **JWT Refresh Tokens**: Expire in 7 days, stored in database and httpOnly cookies
- **Google OAuth Verification**: Server-side verification of Google ID tokens
- **Secure Endpoints**: Protected routes with middleware authentication

### Frontend (React)
- **Google OAuth Button**: Integration with Google Sign-In
- **useAuth Hook**: Centralized authentication state management
- **Auto Token Refresh**: Seamless token refresh on API calls
- **Persistent Sessions**: Automatic login on page refresh if valid tokens exist

## 📋 API Endpoints

### Authentication Routes (`/api/auth/`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/google` | Accept Google ID token, return access token + set refresh token cookie | No |
| POST | `/refresh` | Use refresh token to get new access token | No |
| POST | `/logout` | Clear refresh token from cookie and database | No |
| GET | `/profile` | Get current user profile information | Yes |

### Request/Response Examples

#### Google Authentication
```javascript
// Request
POST /api/auth/google
{
  "idToken": "google_id_token_here"
}

// Response
{
  "accessToken": "jwt_access_token",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "picture": "profile_picture_url",
    "isAdmin": false
  }
}
```

#### Token Refresh
```javascript
// Request (refresh token sent automatically via cookie)
POST /api/auth/refresh

// Response
{
  "accessToken": "new_jwt_access_token",
  "user": { /* user info */ }
}
```

## 🔧 Setup Instructions

### 1. Environment Variables

Create a `.env` file in the root directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/esportive

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
REFRESH_SECRET=your-super-secret-refresh-key-here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id-here

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend Configuration (for CORS)
CLIENT_URL=http://localhost:3000
```

### 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google Sign-In API
4. Create OAuth 2.0 credentials
5. Add authorized JavaScript origins:
   - `http://localhost:3000` (development)
   - Your production domain
6. Copy the Client ID to your `.env` file

### 3. Frontend Environment

Create `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id-here
```

### 4. Install Dependencies

```bash
# Backend dependencies
npm install

# Frontend dependencies
cd frontend
npm install
```

### 5. Start the Application

```bash
# Terminal 1: Start backend server
npm start

# Terminal 2: Start frontend development server
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 💻 Usage Examples

### Frontend Usage

#### Using the useAuth Hook

```javascript
import { useAuth } from './hooks/useAuth';

function MyComponent() {
  const { 
    user, 
    isAuthenticated, 
    loginWithGoogle, 
    logout, 
    apiCall 
  } = useAuth();

  // Make authenticated API calls
  const fetchData = async () => {
    try {
      const response = await apiCall('/api/some-protected-endpoint');
      const data = await response.json();
      // Token refresh is handled automatically
    } catch (error) {
      console.error('API call failed:', error);
    }
  };

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

#### Google Login Integration

```javascript
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from './hooks/useAuth';

function Login() {
  const { loginWithGoogle } = useAuth();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await loginWithGoogle(credentialResponse.credential);
      // User is now logged in
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleGoogleSuccess}
      onError={() => console.log('Login Failed')}
    />
  );
}
```

### Backend Usage

#### Protecting Routes

```javascript
const { auth } = require('./middleware/auth');

// Protected route example
app.get('/api/protected-data', auth, async (req, res) => {
  // req.user contains the authenticated user
  res.json({ 
    message: 'This is protected data',
    user: req.user 
  });
});
```

## 🔒 Security Features

1. **Short-lived Access Tokens**: 15-minute expiration reduces exposure risk
2. **HttpOnly Cookies**: Refresh tokens inaccessible to JavaScript
3. **Secure Cookie Settings**: Production cookies use secure, sameSite settings
4. **CORS Configuration**: Proper CORS setup with credentials support
5. **JWT Verification**: Server-side verification of all tokens
6. **Google Token Verification**: Server validates Google ID tokens with Google's servers
7. **Database Token Storage**: Refresh tokens stored and validated in database

## 🚨 Error Handling

The system includes comprehensive error handling for:
- Invalid or expired tokens
- Database connection issues
- Google authentication failures
- Network timeouts
- Malformed requests

## 🧪 Testing

You can test the authentication flow manually:

1. Start both backend and frontend servers
2. Navigate to http://localhost:3000
3. Click the Google Sign-In button
4. Complete Google authentication
5. You should be redirected to the Profile page
6. Access tokens will automatically refresh when they expire
7. Use the logout button to clear the session

## 📦 Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in your environment
2. Use HTTPS for your frontend domain
3. Update `CLIENT_URL` to your production frontend URL
4. Set secure MongoDB connection string
5. Use strong, unique secrets for JWT tokens
6. Configure your production Google OAuth settings

## 🛠️ Customization

The authentication system is designed to be easily customizable:

- **Token Expiration**: Modify `generateAccessToken` and `generateRefreshToken` functions
- **User Schema**: Extend the User model in `models/User.js`
- **Authentication Flow**: Customize the frontend components in `components/`
- **API Endpoints**: Add new protected routes as needed

## 📝 Database Schema

### User Model
```javascript
{
  name: String,           // User's display name
  email: String,          // User's email (unique)
  password: String,       // Hashed password (optional for Google users)
  googleId: String,       // Google account ID
  picture: String,        // Profile picture URL
  photoURL: String,       // Alternative picture field (legacy)
  refreshToken: String,   // Current refresh token
  isAdmin: Boolean,       // Admin flag
  registeredTournaments: Array, // Tournament registrations
  createdAt: Date,        // Account creation date
  updatedAt: Date         // Last update date
}
```

This implementation provides a solid foundation for secure authentication in your esports tournament platform!