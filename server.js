// node.js server that reads sensor data from an attached Arduino board and publishes it 
// Arduino must run code "nodeSerialServerArduino.ino"
// uses socket.io to communicate with a single page without reloads
// "http://localhost/" renders the page; 

var sys = require("sys"); // to print debug messages
var io = require('socket.io');

// SETUP SERIAL PORT
var portName = "/dev/tty.usbmodem1451"; //TODO: change for your local system
var serialport = require("serialport");
var SerialPort = serialport.SerialPort; // localize object constructor
var sp = new SerialPort(portName, {
  baudrate: 9600,
  parser: serialport.parsers.readline("\n")
});


var sensorReading="not yet available";

// Set Up HTTP Server
var express = require('express');
var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/assets'));
app.get('/', function(req, res){
  //render the index.jade template
  //don't provide variables - we'll use socket.io for that
  res.render('index');
});


// Start listening on port 80
var server = app.listen(3000);
var io = require('socket.io').listen(server);
console.log('Listening on port 80');

sp.on('open',function() {
    console.log('Port open');
});


// when data arrives on the serial port, relay it via socket
// to page as message "sensorReading"
sp.on("data", function (data) {
    console.log("received value: "+data);
    data = data.split(" ");
    xyz = {
        "x": data[0],
        "y": data[1],
        "z": data[2]
    }
    io.sockets.emit("sensorReading", xyz);
});

// when data arrives via the socket as a "toggle" message, relay to serial port
io.sockets.on('connection', function (socket) {
  socket.on('toggle', function (data) {
    console.log("toggle: "+data);
    sp.write(data, function(err, results) {
        console.log('err ' + err);
        console.log('results ' + results);
      });
  });
});
