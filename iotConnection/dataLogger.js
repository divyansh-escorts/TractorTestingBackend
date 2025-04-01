
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
const ws = new WebSocket.Server({ port: 3037 });  // WebSocket server running on port 8080

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
      console.log(typeof payload)
      client.send(payload.toString());
      console.log(payload.toString());
    }
  });
});

// WebSocket server listens for connections
ws.on('connection', function(socket) {
  console.log('New client connected');

  // Send a welcome message when a client connects
  // socket.send('Welcome to the WebSocket server!');
});

// Handle WebSocket errors
ws.on('error', function(error) {
  console.error('WebSocket error:', error);
});


module.exports = "";


// const fs = require("fs");
// const WebSocket = require("ws");
// const device = require("../middlewares/awsConnection"); // Your AWS IoT connection file

// const ws = new WebSocket.Server({ port: 8080 }); // WebSocket Server

// // Read JSON data from file
// const rawData = fs.readFileSync("data.json");
// const locationData = JSON.parse(rawData);

// // Function to send JSON objects sequentially
// function sendSequentialData() {
//   console.log("@")
//   let index = 0;

//   const interval = setInterval(() => {
//     if (index < locationData.length) {
//       const data = locationData[index];
//       console.log("Sending:", data);

//       ws.clients.forEach((client) => {
//         if (client.readyState === WebSocket.OPEN) {
//           client.send(JSON.stringify(data)); // Send JSON data
//         }
//       });

//       index++; // Move to the next data point
//     } else {
//       clearInterval(interval); // Stop when all data has been sent
//       console.log("All data sent.");
//     }
//   }, 3000); // Send data every 3 seconds (adjust as needed)
// }

// // Listen for AWS IoT device connection
// device.on("connect", function () {
//   sendSequentialData();
//   console.log("Connected to AWS IoT");

//   // Subscribe to a topic
//   device.subscribe("ASSET_TRACKER");
// });

// // Listen for incoming messages from AWS IoT
// device.on("message", function (topic, payload) {
//   console.log("Received message from AWS IoT:", topic, payload.toString());
//   // payload = JSON.parse(payload.toString());

//   // Convert payload to JSON
//   let jsonData;
//   try {
//     jsonData = JSON.parse(payload.toString());
//   } catch (error) {
//     console.error("Error parsing IoT payload:", error);
//     return;
//   }

//   // Broadcast received data to all WebSocket clients
//   ws.clients.forEach((client) => {
//     if (client.readyState === WebSocket.OPEN) {
//       client.send(JSON.stringify(jsonData));
//     }
//   });
// });



// Start sending data when a WebSocket client connects
// ws.on("connection", (socket) => {
//   console.log("New client connected");

//   // Start sending GPS data
//   sendSequentialData();

//   socket.on("close", () => {
//     console.log("Client disconnected");
//   });
// });

// Handle WebSocket errors
ws.on("error", (error) => {
  console.error("WebSocket error:", error);
});
