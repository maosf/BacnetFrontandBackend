const BACnet = require("node-bacnet");

const express = require("express");
const fs = require("fs");

const ejs = require("ejs");
const http = require("http");
const exp = require("constants");
const cors = require("cors");

// const readPropAsync = require("readPropAsync");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// const devicePort = 47808;
// Define your parameters
const routerAddress = {
  address: "192.168.10.24", // IP address of the BACnet/IP-MSTP router
  net: 2, // Network number
  adr: [14], // MSTP address of the target device (5 in this case)
};

const objectId = { type: 2, instance: 1 }; // Example object type and instance
const propertyId = 85; // Property ID (e.g., 85 for 'presentValue')

// Initialize the BACnet client
const client = new BACnet({
  apduTimeout: 10000, // Adjust based on network latency
});

// Function to read property from the MSTP device
const readPropertyFromMSTP = (
  routerAddress,
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

function readPropFromMstpAsync(routerAddress, objectId, propertyId) {
  return new Promise((resolve, reject) => {
    client.readProperty(routerAddress, objectId, propertyId, (err, value) => {
      if (err) {
        console.error("Error reading property async:", err);
        reject(err);
      }
      // console.log("Property value:", value);
      resolve(value);
    });
  });
}
// Perform the read property request
// readPropertyFromMSTP(routerAddress, objectId, propertyId);
// readPropFromMstpAsync(routerAddress, objectId, propertyId)
//   .then((resolve) =>
//     console.log("temp:", Number(resolve.values[0].value).toFixed(1))
//   )
//   .catch((reject) => console.log(reject));
let data = {};
async function tempPromise(routerAddress, objectId, propertyId) {
  const msg = await readPropFromMstpAsync(routerAddress, objectId, propertyId);
  const t = Number(msg.values[0].value).toFixed(1);
  return t;
  // console.log(t);
}
// const t = tempPromise(routerAddress, objectId, propertyId);
// t.then((resolve) => console.log(resolve));
const sensorObjectIDs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 30, 31, 32, 33];
const rooms = {
  0: "room 0",
  1: "room 1",
  2: "room 2",
  3: "room 3",
  4: "room 4",
  5: "room 5",
  6: "room 6",
  7: "room 7",
  8: "room 8",
  9: "room 9",
  30: "room 30",
  31: "room 31",
  32: "room 32",
  33: "room 33",
};
const readData = (ids) => {
  ids.forEach((id) => {
    objectId.instance = id;
    readPropertyFromMSTP(routerAddress, objectId, propertyId);
    // client.readProperty(routerAddress, objectId, propertyId, (err, value) => {
    //   if (err) {
    //     console.error("Error reading property async:", err);
    //   }
    //   // console.log("Property value:", value);
    //   // console.log(value);
    //   if (value != undefined && value != null) {
    //     const t = Number(value.values[0].value).toFixed(1);
    //     // data[id] = t;
    //     if (data[id] !== t) {
    //       data[id] = t;
    //       // console.log(data);
    //     }
    //   }
    // });
  });
};

setInterval(() => {
  readData(sensorObjectIDs);
}, 3000);
setInterval(() => {
  console.log(data);
}, 10000);
// tempPromise(routerAddress, objectId, propertyId).then((resolve) => {
//   // const t = Number(resolve.values[0].value).toFixed(1);
//   // data[id] = t;
//   if (data[id] !== resolve) {
//     data[id] = resolve;
//     console.log(data);
//   }
// });

app.get("/", (req, res) => {
  let count = data.length;
  if (count === sensorObjectIDs.length) {
    console.log(data);
    sendResponse();
  }

  function sendResponse() {
    // Read the HTML file
    fs.readFile("app.html", "utf8", (err, data) => {
      if (err) {
        console.error("Error reading HTML file:", err);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
      } else {
        // Replace placeholders in HTML with sensor data

        const htmlWithData = data.replace(
          "{SENSOR_DATA}",
          JSON.stringify(data)
        );
        // htmlWithData = htmlWithData.replace("{rooms}", rooms);

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(htmlWithData);
      }
    });
  }
});

// const port = 3002;
// app.listen(port, () => console.log(`server is running on port ${port}`));
