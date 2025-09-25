const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration for cookies
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from Esportive Web directory (both with and without URL encoding)
app.use('/Esportive Web', express.static('Esportive Web'));
app.use('/Esportive%20Web', express.static('Esportive Web'));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/esportive';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    console.log('Server will continue running without database. Some features may not work.');
  }
};

connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tournaments', require('./routes/tournaments'));
app.use('/api/users', require('./routes/users'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// EJS Routes
app.get('/', (req, res) => {
  res.render('index', { 
    title: 'Home',
    customJS: 'script.js'
  });
});

app.get('/login', (req, res) => {
  res.render('login', { 
    title: 'Sign-up',
    bodyClass: 'flex flex-col min-h-screen items-center justify-center p-4',
    googleSignIn: true,
    customCSS: 'login.css',
    customJS: 'login.js'
  });
});

app.get('/tournaments', (req, res) => {
  res.render('tournaments', { 
    title: 'Tournaments',
    customJS: 'tournaments.js'
  });
});

app.get('/publish-tournament', (req, res) => {
  res.render('publish-tournament', { 
    title: 'Publish Tournament',
    bodyClass: 'bg-black text-white min-h-screen flex flex-col',
    customCSS: 'publish-tournament.css',
    customJS: 'publish-tournament.js'
  });
});

// Static pages routes (serve original HTML files for now)
app.get('/pages/:page', (req, res) => {
  const page = req.params.page;
  res.sendFile(path.join(__dirname, 'Esportive Web', 'pages', `${page}.html`));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});