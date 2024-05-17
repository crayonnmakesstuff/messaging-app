// server.js

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;

// Store active users
const activeUsers = {};

io.on('connection', (socket) => {
  console.log('User connected');

  // Set default nickname
  socket.nickname = 'Anonymous';

  // Send active users count
  io.emit('active users count', Object.keys(activeUsers).length);

  // Listen for nickname change
  socket.on('change nickname', (nickname) => {
    const prevNickname = socket.nickname;
    socket.nickname = nickname;
    activeUsers[nickname] = true;
    delete activeUsers[prevNickname];
    io.emit('active users count', Object.keys(activeUsers).length);
    io.emit('chat message', `${prevNickname} changed their nickname to ${nickname}`);
  });

  // Listen for chat messages
  socket.on('chat message', (msg) => {
    const date = new Date();
    const filename = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.txt`;
    const message = `${date.toLocaleTimeString()} - ${socket.nickname}: ${msg}\n`;
    fs.appendFile(path.join(__dirname, 'messages', filename), message, (err) => {
      if (err) throw err;
      io.emit('chat message', message); // Broadcast the message to all connected clients
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
    delete activeUsers[socket.nickname];
    io.emit('active users count', Object.keys(activeUsers).length);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
