
const bacnet = require ('bacstack');

const client = new bacnet();


export async function readBacnetPresentValue(objectId) {
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
  