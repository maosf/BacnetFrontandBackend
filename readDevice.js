const bacnet = require("bacstack");

// Initialize BACStack
const client = new bacnet({ apduTimeout: 6000 });

// Discover Devices
client.on("error", (err) => {
  console.log("Error occurred: ", err);
  client.close();
});
client.on("iAm", (device) => {
  console.log("address: ", device.address);
  console.log("deviceId: ", device.deviceId);
  console.log("maxApdu: ", device.maxApdu);
  console.log("segmentation: ", device.segmentation);
  console.log("vendorId: ", device.vendorId);
});
client.whoIs();

// Read Device Object
const requestArray = [
  {
    objectId: { type: 8, instance: 14 },
    properties: [{ id: 8 }],
  },
];
client.readPropertyMultiple("192.168.10.30", requestArray, (err, value) => {
  console.log("value: ", value);
});
