
const device = require("../middlewares/awsConnection");
// const { saveMetaPacket } = require("../dbQueries/metaPacketQueries");
// const sendIndividualNotification = require("../middlewares/sendIndividualNotification");
// const { saveNotification } = require("../dbQueries/notificationQueries");
// const { fetchTokens } = require("../dbQueries/androidTokenQueries");
// const { checkFarm } = require("../dbQueries/farmQueries");

// device.on("connect", async function () {
//   // Topic that deals with motor current status
//   device.subscribe("ASSET_TRACKER");
// });
// device.on("message", async function (topic, payload) {
//   payload = JSON.parse(payload.toString());
//   console.log(topic, payload);
// });


// server.js

const WebSocket = require('ws');
const ws = new WebSocket.Server({ port: 8080 });  // WebSocket server running on port 8080

// Listen for AWS IoT device connection
device.on('connect', function() {
  console.log('Connected to AWS IoT');

  // Subscribe to a topic
  device.subscribe('ASSET_TRACKER');
});

// Listen for incoming messages from AWS IoT
device.on('message', function(topic, payload) {
  console.log('Received message from AWS IoT:', topic, payload.toString());

  // Broadcast data to all WebSocket clients
  ws.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload.toString());
    }
  });
});

// WebSocket server listens for connections
ws.on('connection', function(socket) {
  console.log('New client connected');

  // Send a welcome message when a client connects
  socket.send('Welcome to the WebSocket server!');
});

// Handle WebSocket errors
ws.on('error', function(error) {
  console.error('WebSocket error:', error);
});


module.exports = "";