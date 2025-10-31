
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  name: { type: String, required: true },      // <-- server expects "name"
  email: { type: String, required: true },
  phone: { type: String, required: true },
  preferredDate: String,
  preferredTime: String,
  message: String,
  status: { type: String, default: 'pending', enum: ['pending', 'confirmed', 'completed', 'cancelled'] }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
