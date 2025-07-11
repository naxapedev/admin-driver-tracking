const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  duration: { type: Number, required: true }, // in seconds
});

module.exports = mongoose.model('Trip', tripSchema);
