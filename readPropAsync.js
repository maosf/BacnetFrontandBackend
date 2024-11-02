const bacnet = require("bacstack");

const client = new bacnet();

export async function readPropAsync(ip, type, instance, present) {
  return new Promise((resolve, reject) => {
    client.readProperty(
      ip, // IP address of your BACnet device
      { type: type, instance: instance },
      present, // Property ID for Present Value
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
