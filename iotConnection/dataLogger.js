const device = require("../middlewares/awsConnection");
const WebSocket = require('ws');
const fs = require('fs');
const express = require('express');
const app = express();
// const port = 3000; // API server running on port 3000
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

  // Assuming the incoming payload is a JSON string with DEVICE_ID as one of the keys
  const incomingData = JSON.parse(payload.toString());
  const deviceId = incomingData.DEVICE_ID;

  // Create the new data to be saved (raw object)
  const newData = {
    timestamp: new Date(),
    topic: topic,
    message: incomingData // Store the raw message
  };

  // Check if the file for the specific DEVICE_ID exists
  const fileName = `${deviceId}.json`;

  fs.readFile(fileName, 'utf8', (err, data) => {
    if (err) {
      // If the file doesn't exist, create it with DEVICE_ID as the key and an empty array for data
      const initialData = { [deviceId]: { data: [newData] } };

      fs.writeFile(fileName, JSON.stringify(initialData, null, 2), (err) => {
        if (err) {
          console.error('Error creating new file', err);
        } else {
          console.log(`File created with DEVICE_ID: ${deviceId}`);
        }
      });
    } else {
      // If file exists, parse and append the new data
      const parsedData = JSON.parse(data);

      // Check if the data key exists for the DEVICE_ID
      if (parsedData[deviceId] && Array.isArray(parsedData[deviceId].data)) {
        parsedData[deviceId].data.push(newData);
      } else {
        // If data array doesn't exist, create it
        parsedData[deviceId] = { data: [newData] };
      }

      // Write the updated data back to the file
      fs.writeFile(fileName, JSON.stringify(parsedData, null, 2), (err) => {
        if (err) {
          console.error('Error writing to file', err);
        } else {
          console.log(`Data appended to ${fileName}`);
        }
      });
    }
  });

  // Broadcast data to all WebSocket clients
  ws.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload.toString()); // Send the raw payload
    }
  });
});

// WebSocket server listens for connections
ws.on('connection', function(socket) {
  console.log('New client connected');
});

// Handle WebSocket errors
ws.on('error', function(error) {
  console.error('WebSocket error:', error);
});



module.exports = "";
