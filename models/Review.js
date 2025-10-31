// backend/models/Review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    // ✅ align with frontend field names
    studentName: { type: String, required: true, trim: true },
    testimonial: { type: String, default: "" },
    rating: { type: Number, required: true, min: 1, max: 5 },

    university: { type: String, default: "" },
    country: { type: String, default: "" },
    imageUrl: { type: String, default: "" },

    // “active/approved” flag for showing on the public site
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
