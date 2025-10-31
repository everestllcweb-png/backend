// backend/models/University.js
const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, default: "" },

    // Support both legacy and new field names
    imageUrl: { type: String, default: "" },   // legacy
    logoUrl:  { type: String, default: "" },   // used by frontend

    description: { type: String, default: "" },
    ranking: { type: String, default: "" },

    // Support both website & websiteUrl
    website:    { type: String, default: "" }, // legacy
    websiteUrl: { type: String, default: "" }, // used by frontend

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

function mirrorFields(doc) {
  // logo/image
  if (!doc.logoUrl && doc.imageUrl) doc.logoUrl = doc.imageUrl;
  if (!doc.imageUrl && doc.logoUrl) doc.imageUrl = doc.logoUrl;

  // website
  if (!doc.websiteUrl && doc.website) doc.websiteUrl = doc.website;
  if (!doc.website && doc.websiteUrl) doc.website = doc.websiteUrl;
}

universitySchema.pre('validate', function (next) {
  mirrorFields(this);
  next();
});

universitySchema.pre('save', function (next) {
  mirrorFields(this);
  next();
});

module.exports = mongoose.model('University', universitySchema);
