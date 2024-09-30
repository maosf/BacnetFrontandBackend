const express= require('express');
const fs=require('fs');
const bacnet = require('bacstack');
const http = require('http');

const app = express();
const client= new bacnet();

const deviceIP='192.168.10.30';
const devicePort=47808;
 
const sensorObjectIDs=[30,31,32,33];

app.get('/',(req,res)=>{
    const sensorData={};
    let count=0;
    sensorObjectIDs.forEach(objectId=>{
        client.readProperty(deviceIP,{type:bacnet.enum.ObjectType.ANALOG_VALUE, instance:objectId},85,(err,value)=>{
            if (err){
                console.error(`Error reading sensor ${objectId}:`,err);
                sensorData[objectId]='error';
            }else{
                sensorData[objectId]=value.values[0].value;
            }
            count++;
            if (count===sensorObjectIDs.length){
                sendResponse();
            }
        })
    });
    function sendResponse() {
        // Read the HTML file
        fs.readFile('index.html', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading HTML file:', err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } else {
                // Replace placeholders in HTML with sensor data
                const htmlWithData = data.replace(
                    '{SENSOR_DATA}',
                    JSON.stringify(sensorData)
                );

                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(htmlWithData);
            }
     
    });
}
});
    
       

const port=3000;
app.listen(port, ()=>console.log(`server is running on port ${port}`));
