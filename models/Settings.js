const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  companyName: { type: String, default: "" },
  footerDescription: { type: String, default: "" },
  logoUrl: { type: String, default: "" },

  email: { type: String, default: "" },
  mobile: { type: String, default: "" },
  telephone: { type: String, default: "" },
  address: { type: String, default: "" },

  facebookUrl: { type: String, default: "" },
  whatsappUrl: { type: String, default: "" },
  tiktokUrl: { type: String, default: "" },
  instagramUrl: { type: String, default: "" },

  // Keep older optional fields if needed
  tagline: { type: String, default: "" },
  phone: { type: String, default: "" }, // alias to mobile, ok to keep
  facebook: { type: String, default: "" },
  instagram: { type: String, default: "" },
  twitter: { type: String, default: "" },
  linkedin: { type: String, default: "" },
  whatsapp: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
