// backend/models/Destination.js
const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true }, // <-- add
    description: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    universityCount: { type: Number, default: 0, min: 0 }, // <-- add
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Destination', destinationSchema);
