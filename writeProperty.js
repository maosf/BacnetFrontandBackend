const bacnet = require('bacstack');

// Create a new instance of the BACnet client
const client = new bacnet();

// Define BACnet device settings
const deviceAddress = '192.168.10.30'; // Replace with your device's IP address
const deviceId = 14; // Replace with your device's ID

// Define BACnet object settings
const objectType = 2; // Analog Input 0, Analog value 2
const objectInstance = 30; // Instance ID of the Analog Input object
const propertyId = bacnet.enum.PropertyIdentifier.PRESENT_VALUE;
const value = 25.0; // Value to write
// async function readBacnetPresentValue(objectId) {
//   return new Promise((resolve, reject) => {
//     client.readProperty(
//       '192.168.10.30', // IP address of your BACnet device
//       { type: 2, instance: objectId },
//       85, // Property ID for Present Value
//       (err, value) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(value.values[0].value);
//         }
//       }
//     );
//   });
// }
client.readProperty('192.168.10.30', {type: 2, instance: 30}, propertyId, (err, value) => {
  console.log('value: ', value);
});
//Write the value to the BACnet object property
// client.writeProperty(deviceAddress, 2,30, 85,12, [
//     {tag: bacnet.enum.ApplicationTags.BACNET_APPLICATION_TAG_REAL, value: 100}
//   ], (err,value) => {
//         console.log("write property:",value);
//         console.log('Error:', err);
 
client.writeProperty('192.168.10.30',{type:2, instance:30}, propertyId,  [
  {type: bacnet.enum.ApplicationTags.REAL,value:77.7}
  ], (err, value)=> { 
    if (err){console.error('Error: ', err);}
    else{console.log('writeProperty: ', value);}
  
  });

// const values = [
//     {objectId: {type: 2, instance: 30}, values: [
//       {property: {id: 85, index:7}, value: [{type: bacnet.enum.ApplicationTags.REAL, value: 100}], priority: 8}
//     ]}
//   ];
//   client.writePropertyMultiple('192.168.10.30', values, (err, value) => {
//     console.log('value: ', value);
//   });