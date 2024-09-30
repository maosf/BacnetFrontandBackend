const express =require( 'express');
const bacnet =require( 'bacstack');
const cors=require('cors');
const app = express();

// BACnet device settings
const deviceAddress = '192.168.10.30'; // Replace with your device's IP address
const deviceId = 14; // Replace with your device's ID

// Create a new instance of the BACnet client
const client = new bacnet();
app.use(cors());
// Route to read BACnet object property and export the data
app.get('/api', async (req, res) => {
  try {
    const objectType = parseInt(req.query.type );
    const objectInstance = parseInt(req.query.instance);
    const propertyId = parseInt(req.query.property );

    // Read the BACnet object property
    client.readProperty(deviceAddress, { type: objectType, instance: objectInstance }, propertyId, (err, value) => {
      if (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Failed to read property' });
        return;
      }
      res.status(200).json({ value });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(400).json({ error: 'Invalid request' });
  }
});

const port=3000;
app.listen(port, ()=>console.log(`server is running on port ${port}`));
//http://localhost:3000/api?type=2&instance=30&property=85