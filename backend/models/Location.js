// models/Location.js
const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  latitude: Number,
  longitude: Number,
  timestamp: Date,
});

module.exports = mongoose.model('Location', LocationSchema);
