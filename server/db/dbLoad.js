const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Connect to MongoDB
const DB_URL = process.env.DB_URL || 'mongodb+srv://Naimas:0cUgKI5YEybJiraG@naimas.gh2k3.mongodb.net/?retryWrites=true&w=majority&appName=Naimas';
mongoose.connect(DB_URL)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import models
const User = require('../models/User');
const Photo = require('../models/Photo');

// Sample data
const users = [
  {
    login_name: 'user1',
    password: 'password123',
    first_name: 'Nguyễn',
    last_name: 'Văn A',
    location: 'Hà Nội',
    description: 'Nhiếp ảnh gia chuyên nghiệp',
    occupation: 'Photographer'
  },
  {
    login_name: 'user2',
    password: 'password123',
    first_name: 'Trần',
    last_name: 'Thị B',
    location: 'TP.HCM',
    description: 'Du lịch và chụp ảnh',
    occupation: 'Travel Blogger'
  }
];

const photos = [
  {
    file_name: 'sample1.jpg',
    user_id: null, // Will be set after user creation
    comments: [
      {
        comment: 'Ảnh đẹp quá!',
        user_id: null, // Will be set after user creation
        date_time: new Date()
      }
    ],
    date_time: new Date()
  },
  {
    file_name: 'sample2.jpg',
    user_id: null, // Will be set after user creation
    comments: [],
    date_time: new Date()
  }
];

// Load data
async function loadData() {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Photo.deleteMany({});

    // Create users
    const createdUsers = [];
    for (const user of users) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      const newUser = await User.create({
        ...user,
        password: hashedPassword
      });
      createdUsers.push(newUser);
    }

    // Create photos with user references
    for (const photo of photos) {
      photo.user_id = createdUsers[0]._id;
      if (photo.comments.length > 0) {
        photo.comments[0].user_id = createdUsers[1]._id;
      }
      await Photo.create(photo);
    }

    console.log('Done loading');
    process.exit(0);
  } catch (error) {
    console.error('Error loading data:', error);
    process.exit(1);
  }
}

loadData(); 