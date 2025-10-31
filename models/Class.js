// backend/models/Class.js
const mongoose = require('mongoose');

const classSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    // "type" was required before but your UI doesn't send it.
    // Make it optional so saves won't fail.
    type: { type: String, default: "" }, // e.g., "online", "offline" (optional)

    // Your UI sends these:
    instructor: { type: String, default: "" },
    schedule: { type: String, default: "" },
    description: { type: String, default: "" },
    imageUrl: { type: String, default: "" },

    // Your UI sends capacity (number). Support null/undefined too.
    capacity: { type: Number, default: null },

    // Keep optional fields available
    duration: { type: String, default: "" },
    price: { type: String, default: "" },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Class', classSchema);
