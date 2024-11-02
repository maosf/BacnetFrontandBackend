const express = require("express");
const bacnet = require("node-bacnet");
// const cors=require('cors');
const app = express();
hostname = "192.168.68.65";
const deviceAddress = "192.168.10.30"; // Replace with your device's IP address
const deviceAddress300 = "192.168.10.24"; // Replace with your device's IP address
const objectId = { type: 2, instance: 4 }; // Example object type and instance
const propertyId = 85; // Property ID (e.g., 85 for 'presentValue')
const deviceId = 14; // Replace with your device's ID
const client = new bacnet();
// app.use(cors());
const mstpDevice = {
  address: "192.168.10.24",
  net: 2,
  adr: [2],
};
let data = {};
// Function to read property from the MSTP device
const readPropertyFromMSTP = (
  mstpDevice,
  objectId,
  propertyId,
  retries = 3
) => {
  client.readProperty(routerAddress, objectId, propertyId, (err, value) => {
    if (err) {
      console.error("Error reading property:", err);

      if (retries > 0) {
        setTimeout(
          () =>
            readPropertyFromMSTP(
              routerAddress,
              objectId,
              propertyId,
              retries - 1
            ),
          1000
        );
      }
    } else {
      if (value != undefined && value != null) {
        const t = Number(value.values[0].value).toFixed(1);
        // data[id] = t;
        if (data[objectId.instance] !== t) {
          data[objectId.instance] = t;
          // console.log(data);
        }
      }
    }
  });
};
// Route to read BACnet object property and export the data
app.get("/api", async (req, res) => {
  try {
    //const objectType = parseInt(req.query.type );
    const objectInstance = parseInt(req.query.instance);
    // const propertyId = parseInt(req.query.property );
    const value = await readBacnetPresentValue(objectInstance);
    console.log(value);
    res.status(200).json({ room: objectInstance, roomTemp: value });
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
    console.error("Error:", error);
    res.status(400).json({ error: "Invalid request" });
  }
});
async function readBacnetPresentValue(objectId) {
  return new Promise((resolve, reject) => {
    client.readProperty(
      mstpDevice, // IP address,net,adr of your BACnet device
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

const port = 3000;
app.listen(port, hostname, () =>
  console.log(`server is running on port ${port}`)
);
//http://localhost:3000/api?type=2&instance=30&property=85
