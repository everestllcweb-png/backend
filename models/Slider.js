const mongoose = require('mongoose');

const sliderSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: String,
  description: String,
  imageUrl: String,
  buttonText: String,
  buttonLink: String,
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Slider', sliderSchema);
