const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Login route
router.post('/login', async (req, res) => {
  try {
    const { login_name, password } = req.body;
    const user = await User.findOne({ login_name });

    if (!user) {
      return res.status(400).json({ error: 'Tên đăng nhập không tồn tại' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Mật khẩu không đúng' });
    }

    req.session.user = {
      _id: user._id,
      login_name: user.login_name,
      first_name: user.first_name,
      last_name: user.last_name
    };

    res.json({
      _id: user._id,
      login_name: user.login_name,
      first_name: user.first_name,
      last_name: user.last_name
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Register route
router.post('/register', async (req, res) => {
  try {
    const { login_name, password, first_name, last_name } = req.body;

    if (!login_name || !password || !first_name || !last_name) {
      return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin' });
    }

    const existingUser = await User.findOne({ login_name });
    if (existingUser) {
      return res.status(400).json({ error: 'Tên đăng nhập đã tồn tại' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      login_name,
      password: hashedPassword,
      first_name,
      last_name
    });

    await user.save();

    req.session.user = {
      _id: user._id,
      login_name: user.login_name,
      first_name: user.first_name,
      last_name: user.last_name
    };

    res.json({
      _id: user._id,
      login_name: user.login_name,
      first_name: user.first_name,
      last_name: user.last_name
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  if (!req.session.user) {
    return res.status(400).json({ error: 'Chưa đăng nhập' });
  }
  req.session.destroy();
  res.json({ message: 'Đăng xuất thành công' });
});

// Check auth status
router.get('/check-auth', (req, res) => {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ error: 'Chưa xác thực' });
  }
});

module.exports = router; 