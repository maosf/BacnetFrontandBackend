const express = require("express");
const fs = require("fs");
const bacnet = require("bacstack");
const ejs = require("ejs");
const http = require("http");
const exp = require("constants");
const cors = require("cors");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const client = new bacnet();
const deviceIP = "192.168.10.30";
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
  32: "room 33",
};

app.get("/", (req, res) => {
  const sensorData = {};
  let count = 0;
  sensorObjectIDs.forEach((objectId) => {
    client.readProperty(
      deviceIP,
      { type: bacnet.enum.ObjectType.ANALOG_VALUE, instance: objectId },
      85,
      (err, value) => {
        if (err) {
          console.error(`Error reading sensor ${objectId}:`, err);
          sensorData[objectId] = "error";
        } else {
          sensorData[objectId] = value.values[0].value.toFixed(1);
        }
        count++;
        if (count === sensorObjectIDs.length) {
          //   console.log(sensorData);
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

app.get("/loginForm", (req, res) => {
  res.redirect("/loginForm.html");
});
//read by objectId array api
app.get("/home", (req, res) => {
  const sensorData = {};
  let count = 0;
  sensorObjectIDs.forEach((objectId) => {
    client.readProperty(
      deviceIP,
      { type: bacnet.enum.ObjectType.ANALOG_VALUE, instance: objectId },
      85,
      (err, value) => {
        if (err) {
          console.error(`Error reading sensor ${objectId}:`, err);
          sensorData[objectId] = "error";
        } else {
          const temp = Number(value.values[0].value).toFixed(1);
          console.log(temp);
          sensorData[objectId] = temp;
        }
        count++;
        if (count === sensorObjectIDs.length) {
          res.render("home", { data: sensorData });
        }
      }
    );
  });
});
// api for react data fetch
app.get("/api", (req, res) => {
  const sensorData = {};
  let count = 0;
  sensorObjectIDs.forEach((objectId) => {
    client.readProperty(
      deviceIP,
      { type: bacnet.enum.ObjectType.ANALOG_VALUE, instance: objectId },
      85,
      (err, value) => {
        if (err) {
          console.error(`Error reading sensor ${objectId}:`, err);
          sensorData[objectId] = "error";
        } else {
          const temp = Number(value.values[0].value).toFixed(1);
          console.log(temp);
          sensorData[objectId] = temp;
        }
        count++;
        if (count === sensorObjectIDs.length) {
          res.send(sensorData);
        }
      }
    );
  });
});

//writeProperty function in client.js add '|| 16 'after priority: options.priority
//localhost/set   body form-encoded name: value,,value: 40
app.post("/set/:value/:type", (req, res) => {
  // console.log(req);
  // const setvalue = req.body.value;
  const setValue = req.params.value;
  const setType = req.params.type;
  console.log(setValue);
  client.writeProperty(
    "192.168.10.30",
    { type: setType, instance: 30 },
    85,
    [{ type: bacnet.enum.ApplicationTags.REAL, value: setValue }],
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
app.listen(port, () => console.log(`server is running on port ${port}`));
