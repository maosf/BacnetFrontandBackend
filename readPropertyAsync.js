const express =require( 'express');
const bacnet =require( 'bacstack');
const cors=require('cors');
const app = express();
//const {readBacnetPresentValue} =require ('./readProAsync');

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
    const value= await readBacnetPresentValue(objectInstance);
    console.log(value);
    res.status(200).json({ value });
//   }
//     // Read the BACnet object property
//     client.readProperty(deviceAddress, { type: objectType, instance: objectInstance }, propertyId, (err, value) => {
//       if (err) {
//         console.error('Error:', err);
//         res.status(500).json({ error: 'Failed to read property' });
//         return;
//       }
//       res.status(200).json({ value });
//     });
  } catch (error) {
    console.error('Error:', error);
    res.status(400).json({ error: 'Invalid request' });
  }
});
async function readBacnetPresentValue(objectId) {
    return new Promise((resolve, reject) => {
      client.readProperty(
        '192.168.10.30', // IP address of your BACnet device
        { type: 2, instance: objectId },
        85, // Property ID for Present Value
        (err, value) => {
          if (err) {
            reject(err);
          } else {
            resolve(value.values[0].value);
          }
        }
      );
    });
  }
  
const port=3000;
app.listen(port, ()=>console.log(`server is running on port ${port}`));
//http://localhost:3000/api?type=2&instance=30&property=85