const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Photo = require("../models/Photo");
const { requireLogin } = require("../middleware/auth");

// Configure multer for photo upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "..", "images");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Chỉ chấp nhận file ảnh"));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Upload new photo
router.post("/new", requireLogin, upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Không có file được tải lên" });
    }

    const photo = new Photo({
      file_name: req.file.filename,
      user_id: req.session.user._id,
    });

    await photo.save();
    res.json(photo);
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
});

// Get all photos
router.get("/", requireLogin, async (req, res) => {
  try {
    const photos = await Photo.find().populate(
      "user_id",
      "first_name last_name"
    );
    res.json(photos);
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
});

// Get photos by user
router.get("/user/:userId", requireLogin, async (req, res) => {
  try {
    const photos = await Photo.find({ user_id: req.params.userId }).populate(
      "user_id",
      "first_name last_name"
    );
    res.json(photos);
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
});

module.exports = router;
