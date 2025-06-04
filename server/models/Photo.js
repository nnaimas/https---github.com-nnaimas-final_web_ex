const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  file_name: {
    type: String,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date_time: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Thêm virtual field
photoSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'photo',
});

photoSchema.set('toObject', { virtuals: true });
photoSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model("Photo", photoSchema);
