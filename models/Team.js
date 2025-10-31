// backend/models/Team.js
const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true }, // aka role/title
    imageUrl: { type: String, default: '' },                 // optional
    order: { type: Number, default: 0 },                     // for sorting on site
    isActive: { type: Boolean, default: true },              // show/hide on site
  },
  { timestamps: true }
);

module.exports = mongoose.model('Team', teamSchema);
