// backend/models/Blog.js
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    excerpt: { type: String, default: "" },
    content: { type: String, default: "" },
    author: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    category: { type: String, default: "" },
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Blog', blogSchema);
