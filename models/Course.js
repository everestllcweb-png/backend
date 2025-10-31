// backend/models/Course.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    // Your admin UI uses "name" (required)
    name: { type: String, required: true },

    // Your admin UI uses "category", but the old schema had "level" (required)
    // We keep both and mirror them in hooks so either key works.
    level: { type: String, default: "" },     // legacy
    category: { type: String, default: "" },  // current UI

    duration: { type: String, default: "" },
    description: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Keep legacy/new fields in sync so either can be supplied
function mirrorFields(doc) {
  if (!doc.category && doc.level) doc.category = doc.level;
  if (!doc.level && doc.category) doc.level = doc.category;
}

courseSchema.pre('validate', function (next) {
  mirrorFields(this);
  next();
});

courseSchema.pre('save', function (next) {
  mirrorFields(this);
  next();
});

module.exports = mongoose.model('Course', courseSchema);
