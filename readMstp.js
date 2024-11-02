const BACnet = require("node-bacnet");
const express = require("express");
const fs = require("fs");

const ejs = require("ejs");
const http = require("http");
const exp = require("constants");
const cors = require("cors");
const { hostname } = require("os");
// const readPropAsync = require("readPropAsync");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// const hostname = "192.168.68.65";
// Define your parameters
const routerAddress = {
  address: "192.168.10.24", // IP address of the BACnet/IP-MSTP router
  net: 2, // Network number
  adr: [14], // MSTP address of the target device (14 in this case)
};

const objectId = { type: 2, instance: 1 }; // Example object type and instance
const propertyId = 85; // Property ID (e.g., 85 for 'presentValue')

// Initialize the BACnet client
const client = new BACnet({
  apduTimeout: 9000, // Adjust based on network latency
});

// Address to target (through the router)
const targetAddress = {
  address: routerAddress.address,
  net: routerAddress.net,
  adr: routerAddress.adr,
};

// Function to read property from the MSTP device
const readPropertyFromMSTP = (targetAddress, objectId, propertyId) => {
  client.readProperty(targetAddress, objectId, propertyId, (err, value) => {
    if (err) {
      console.error("Error reading property:", err);
      return;
    }
    console.log("Property value:", value);
  });
};

// Perform the read property request
readPropertyFromMSTP(targetAddress, objectId, propertyId);
//
// const client = new bacnet();
// const deviceIP = "192.168.10.30";
const devicePort = 47808;
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
const sensorData = {};
app.get("/", (req, res) => {
  let count = 0;
  sensorObjectIDs.forEach((objectId) => {
    client.readProperty(
      targetAddress,
      { type: 2, instance: objectId },
      85,
      (err, value) => {
        if (err) {
          console.error(`Error reading sensor ${objectId}:`, err);
          //   sensorData[objectId] = "error";
        } else {
          const t = Number(value.values[0].value).toFixed(1);
          if (sensorData[objectId] !== t) {
            sensorData[objectId] = t;
          }
        }
        count++;
        if (count === sensorObjectIDs.length) {
          console.log(sensorData);
          sendResponse();
        }
      }
    );
  });
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
          JSON.stringify(sensorData)
        );
        // htmlWithData = htmlWithData.replace("{rooms}", rooms);

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(htmlWithData);
      }
    });
  }
});
app.get("/api", (req, res) => {
  // const sensorData = {};
  let count = 0;
  sensorObjectIDs.forEach((objectId) => {
    client.readProperty(
      targetAddress,
      { type: 2, instance: objectId },
      85,
      (err, value) => {
        if (err) {
          console.error(`Error reading sensor ${objectId}:`, err);
          // sensorData[objectId] = "error";
        } else {
          const temp = Number(value.values[0].value).toFixed(1);
          // console.log(temp);
          sensorData[objectId] = temp;
        }
        count++;
        if (count === sensorObjectIDs.length) {
          res.send(sensorData);
          console.log(sensorData);
        }
      }
    );
  });
});
app.post("/set/:instance/:value", (req, res) => {
  // console.log(req);
  // const setvalue = req.body.value;
  const setValue = req.params.value;
  const setInstance = req.params.instance;
  console.log(setValue);
  client.writeProperty(
    targetAddress,
    { type: 2, instance: setInstance },
    85,
    [{ type: 4, value: setValue }], //bacnet.enum.ApplicationTags.REAL
    (err) => {
      if (err) {
        console.error("Error: ", err);
      } else {
        res.end("writeProperty successful");
      }
    }
  );
});
const port = 3001;
app.listen(port, "192.168.68.65", () =>
  console.log(`server is running on port ${port}`)
);
// Close the client after some time (to keep the script running for asynchronous operations)
// setTimeout(() => client.close(), 10000); // Adjust as needed for your operations
