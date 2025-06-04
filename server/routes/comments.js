const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Comment = require("../models/Comment");
const Photo = require("../models/Photo");
const { requireLogin } = require("../middleware/auth");

// Add comment
// POST /comments
router.post("/", requireLogin, async (req, res) => {
  try {
    const { comment, photo_id } = req.body;
    console.log("Creating comment with data:", { comment, photo_id });

    if (!comment || comment.trim() === "") {
      return res.status(400).json({ error: "Bình luận không được để trống" });
    }

    if (!photo_id) {
      return res.status(400).json({ error: "Thiếu ID của ảnh" });
    }

    // Validate photo_id format
    if (!mongoose.Types.ObjectId.isValid(photo_id)) {
      console.log("Invalid photo_id format:", photo_id);
      return res.status(400).json({ error: "ID ảnh không hợp lệ" });
    }

    // Check if photo exists
    const photo = await Photo.findById(photo_id);
    if (!photo) {
      console.log("Photo not found:", photo_id);
      return res.status(404).json({ error: "Không tìm thấy ảnh" });
    }
    console.log("Found photo:", photo._id);

    // Create new comment
    const newComment = new Comment({
      text: comment.trim(),
      user: req.session.user._id,
      photo: photo_id
    });

    console.log("Saving new comment:", newComment);
    await newComment.save();
    console.log("Comment saved successfully:", newComment._id);

    // Verify comment was saved
    const savedComment = await Comment.findById(newComment._id);
    console.log("Verified saved comment:", savedComment);
    
    const populatedComment = await Comment.findById(newComment._id)
      .populate("user", "first_name last_name");
    console.log("Populated comment:", populatedComment);
    
    res.json(populatedComment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
});

// Get comments by photo ID
//GET /comments/:photoId
router.get("/:photoId", async (req, res) => {
  try {
    const { photoId } = req.params;
    const comments = await Comment.find({ photo: photoId }).sort({ createdAt: -1 })
      .populate("user", "first_name last_name").exec();

    res.json(comments);
  } catch (error) {
    console.error("Error getting comments:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
});

module.exports = router;
