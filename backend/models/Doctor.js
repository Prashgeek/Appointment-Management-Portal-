// backend/models/Doctor.js
const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  fee: { type: Number, required: true },
  rating: { type: Number, required: true, default: 4.5 }
});

module.exports = mongoose.model('Doctor', DoctorSchema);
