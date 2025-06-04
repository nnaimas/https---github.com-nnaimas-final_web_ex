const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { requireLogin } = require('../middleware/auth');

// Get list of users
router.get('/list', requireLogin, async (req, res) => {
  try {
    const users = await User.find({}, '_id first_name last_name');
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send({ error: 'Lỗi lấy danh sách user' });
  }
});

// Get user details
router.get('/:id', requireLogin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(400).send({ error: 'User không tồn tại' });

    const { _id, first_name, last_name, location, description, occupation } = user;
    res.status(200).send({ _id, first_name, last_name, location, description, occupation });
  } catch (err) {
    res.status(400).send({ error: 'ID không hợp lệ' });
  }
});

module.exports = router; 