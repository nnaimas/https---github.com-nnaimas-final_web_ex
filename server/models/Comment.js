const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  photo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Photo',
    required: true
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
commentSchema.index({ photo: 1, createdAt: -1 });
commentSchema.index({ user: 1 });

module.exports = mongoose.model('Comment', commentSchema); 