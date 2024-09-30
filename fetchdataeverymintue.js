const express = require('express');
const app = express();
const port = 3000;

// Example API endpoint to fetch data (replace with your API endpoint)
const fetchData = async () => {
  try {
    const response = await fetch('https://api.example.com/data');
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};

// Send data to client every 2 minutes
setInterval(async () => {
  const data = await fetchData();
  if (data) {
    io.emit('data', data); // Send data to connected clients
  }
}, 2 * 60 * 1000); // 2 minutes in milliseconds

// Start the server
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Set up WebSocket
const io = require('socket.io')(server);
io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});
