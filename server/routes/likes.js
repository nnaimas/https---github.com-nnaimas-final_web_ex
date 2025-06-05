const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Like = require('../models/Like');
const Photo = require('../models/Photo');
const { requireLogin } = require('../middleware/auth');

// Like a photo
router.post('/:photoId', requireLogin, async (req, res) => {
  try {
    const { photoId } = req.params;
    const userId = req.session.user._id;

    // Check if photo exists
    const photo = await Photo.findById(photoId);
    if (!photo) {
      return res.status(404).json({ error: 'Không tìm thấy ảnh' });
    }

    // Check if already liked
    const existingLike = await Like.findOne({ user: userId, photo: photoId });
    if (existingLike) {
      return res.status(400).json({ error: 'Bạn đã thích ảnh này' });
    }

    // Create new like
    const like = new Like({
      user: userId,
      photo: photoId
    });

    await like.save();
    res.json({ message: 'Đã thích ảnh' });
  } catch (error) {
    console.error('Error liking photo:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Unlike a photo
router.delete('/:photoId', requireLogin, async (req, res) => {
  try {
    const { photoId } = req.params;
    const userId = req.session.user._id;

    const result = await Like.findOneAndDelete({ user: userId, photo: photoId });
    if (!result) {
      return res.status(404).json({ error: 'Chưa thích ảnh này' });
    }

    res.json({ message: 'Đã bỏ thích ảnh' });
  } catch (error) {
    console.error('Error unliking photo:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Get likes for a photo
router.get('/:photoId', async (req, res) => {
  try {
    const { photoId } = req.params;
    const likes = await Like.find({ photo: photoId })
      .populate('user', 'first_name last_name');
    res.json(likes);
  } catch (error) {
    console.error('Error getting likes:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Check if current user has liked a photo
router.get('/:photoId/check', requireLogin, async (req, res) => {
  try {
    const { photoId } = req.params;
    const userId = req.session.user._id;

    const like = await Like.findOne({ user: userId, photo: photoId });
    res.json({ liked: !!like });
  } catch (error) {
    console.error('Error checking like status:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

module.exports = router; 