const express = require('express');
const router = express.Router();

const Location = require('../models/Location');
const Trip = require('../models/Trip');

// POST /api/location
router.post('/location', async (req, res) => {
  try {
    console.log('📥 POST /api/location received');
    console.log('📦 Body:', req.body);

    const { userId, latitude, longitude, timestamp } = req.body;

    if (!userId || !latitude || !longitude) {
      console.warn('⚠️ Missing required fields for /location');
      return res.status(400).json({ error: 'Missing fields' });
    }

    const location = new Location({ userId, latitude, longitude, timestamp });
    await location.save();

    console.log(`✅ Location saved for user ${userId}: (${latitude}, ${longitude})`);
    res.status(201).json({ message: '📍 Location saved' });
  } catch (err) {
    console.error('❌ Error saving location:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ GET all locations (for admin)
router.get('/locations', async (req, res) => {
  try {
    const locations = await Location.find({});
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});

// POST /api/trip
router.post('/trip', async (req, res) => {
  try {
    console.log('📥 POST /api/trip received');
    console.log('📦 Body:', req.body);

    const { userId, startTime, endTime, duration } = req.body;

    if (!userId || !startTime || !endTime || duration === undefined) {
      console.warn('⚠️ Missing required fields for /trip');
      return res.status(400).json({ error: 'Missing fields' });
    }

    const trip = new Trip({ userId, startTime, endTime, duration });
    await trip.save();

    console.log(`✅ Trip saved for user ${userId}: Duration ${duration}s`);
    res.status(201).json({ message: '✅ Trip saved' });
  } catch (err) {
    console.error('❌ Error saving trip:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
