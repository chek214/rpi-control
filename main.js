var http = require('http')//.createServer(handler); //require http server, and create server with function handler()
var express = require('express');
var app = express();
var fs = require('fs'); //require filesystem module
var io = require('socket.io')(http) //require socket.io module and pass the http object (server)
var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var banda = new Gpio(4, 'out'); //use GPIO pin 4 as output
var pushButton = new Gpio(17, 'in', 'both'); //use GPIO pin 17 as input, and 'both' button presses, and releases should be handled
var path = require('path');
var public = path.join(__dirname, 'public');



app.get('/', function(req, res) {
  res.sendFile(path.join(public, 'index.htm'));
});

app.use('/', express.static(public));

app.listen(80);

io.sockets.on('connection', function (socket) {// WebSocket Connection
  var lightvalue = 0; //static variable for current status
  pushButton.watch(function (err, value) { //Watch for hardware interrupts on pushButton
    if (err) { //if an error
      console.error('There was an error', err); //output error message to console
      return;
    }
    lightvalue = value;
    socket.emit('light', lightvalue); //send button status to client
  });

  /*socket.on('light', function(data) { //get light switch status from client
    lightvalue = data;
    if (lightvalue != LED.readSync()) { //only change LED if status has changed
      LED.writeSync(lightvalue); //turn LED on or off
    }
  });*/

  socket.on('poweron', function(data) { 
    banda.writeSync(1)
    console.log('poweron')
  });

  socket.on('poweroff', function(data) { 
    banda.writeSync(0)
    console.log('poweroff')
  });

});

process.on('SIGINT', function () { //on ctrl+c
  banda.writeSync(0); // Turn LED off
  banda.unexport(); // Unexport LED GPIO to free resources
  pushButton.unexport(); // Unexport Button GPIO to free resources
  process.exit(); //exit completely
}); 