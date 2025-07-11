const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api');
const { initSocket } = require('./socket'); // Updated: use named import

const app = express();
const server = http.createServer(app);
const PORT = 4000;

// 👉 Middleware
app.use(cors());
app.use(bodyParser.json());

// 👉 MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/walk-tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connected');
});

// 👉 Routes
app.use('/api', apiRoutes);

// 👉 Initialize Socket.IO
initSocket(server);

// 👉 Start Server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running at http://192.168.1.31:${PORT}`);
});
