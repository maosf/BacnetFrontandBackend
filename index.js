const bacnet = require('bacstack');
const cors=require('cors');
// Create a new instance of the BACnet client
const client = new bacnet();

// Define BACnet device settings
const deviceAddress = '192.168.10.30'; // Replace with your device's IP address
const deviceId = 14; // Replace with your device's ID

// Define BACnet object settings
const objectType = 2; // Analog Input
const objectInstance = 30; // Instance ID of the Analog Input object
const propertyId = bacnet.enum.PropertyIdentifier.PRESENT_VALUE;

// Define HTTP server setting

const http = require('http');
const port = 3000;

// Create HTTP server
const server = http.createServer((req, res) => {
  // Handle GET requests to /read-property
  if (req.method === 'GET' && req.url === '/read-property') {
    // Read BACnet property
    client.readProperty(deviceAddress, { type: objectType, instance: objectInstance }, propertyId, (err, value) => {
      if (err) {
        console.error('Error:', err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error reading property');
      } else {
        console.log('Property Value:', value);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        // res.setHeader('Access-Control-Allow-Origin', '*');
        // res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
        // res.setHeader('Access-Control-Max-Age', 2592000); // 30 days
        // res.setHeader('Access-Control-Allow-Headers', 'content-type');
        // res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end('<h1>temp: '+value.values[0].value+'</h1>')
        //res.end(JSON.stringify( value));
      }
    });
  } else {
    // Handle other requests with a 404 response
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

// Start HTTP server

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
