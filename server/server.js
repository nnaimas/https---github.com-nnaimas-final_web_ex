const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
const multer = require('multer');
require('dotenv').config();
const bcrypt = require('bcrypt');
const { requireLogin } = require('./middleware/auth');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Configure multer for photo upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'images');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Chỉ chấp nhận file ảnh'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// MongoDB connection
const DB_URL = process.env.DB_URL || 'mongodb+srv://Naimas:0cUgKI5YEybJiraG@naimas.gh2k3.mongodb.net/?retryWrites=true&w=majority&appName=Naimas';
mongoose.connect(DB_URL)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// Serve static files from images directory
app.use('/images', express.static(path.join(__dirname, 'images')));

// Add a route to check if image exists
app.get('/images/:filename', (req, res, next) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, 'images', filename);
  
  fs.access(filepath, fs.constants.F_OK, (err) => {
    if (err) {
      console.log('Image not found:', filename);
      return res.status(404).json({ error: 'Image not found' });
    }
    next();
  });
});



// Import models
const User = require('./models/User');
const Photo = require('./models/Photo');
const Comment = require('./models/Comment');

// Import routes
const authRoutes = require('./routes/auth');
const photoRoutes = require('./routes/photos');
const commentRoutes = require('./routes/comments');
const userRoutes = require('./routes/users');
const likeRoutes = require('./routes/likes');

// Use routes
app.use('/admin', authRoutes);
app.use('/photos', photoRoutes);
app.use('/comments', commentRoutes);
app.use('/user', userRoutes);
app.use('/likes', likeRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 