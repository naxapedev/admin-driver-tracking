const socketIO = require('socket.io');
const LocationModel = require('./models/Location'); // adjust path as needed

let io;

const socketUserMap = new Map(); // socket.id => userId

function initSocket(server) {
  io = socketIO(server, {
    cors: {
      origin: '*', // allow any frontend (mobile + web) for now
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`✅ Socket connected: ${socket.id}`);

    // 📍 Receive location from walker
    socket.on('locationUpdate', async (data) => {
      const { userId, latitude, longitude } = data;

      if (!userId || !latitude || !longitude) {
        return console.warn('⚠️ Invalid location data:', data);
      }

      // Map socket.id to userId for disconnect cleanup
      socketUserMap.set(socket.id, userId);

      // Save to DB
      try {
        await LocationModel.findOneAndUpdate(
          { userId },
          {
            userId,
            latitude,
            longitude,
            updatedAt: new Date(),
          },
          { upsert: true, new: true }
        );
      } catch (err) {
        console.error('❌ MongoDB save failed:', err.message);
      }

      // Emit to all clients (admins)
      io.emit('walkerLocation', {
        userId,
        latitude,
        longitude,
        updatedAt: new Date().toISOString(),
      });
    });

    // ❌ Disconnect event
    socket.on('disconnect', () => {
      const userId = socketUserMap.get(socket.id);
      if (userId) {
        console.log(`🔴 Walker disconnected: ${userId}`);
        io.emit('walkerDisconnected', userId);
        socketUserMap.delete(socket.id);
      } else {
        console.log(`🔴 Unknown socket disconnected: ${socket.id}`);
      }
    });
  });
}

module.exports = { initSocket };
