var express = require('express')
var path = require('path')
var public = path.join(__dirname, 'public')
var app     = express()
var http = require('http').Server(app)
var fs = require('fs')
var io = require('socket.io')(http, {
  allowEIO3: true 
})
var Gpio = require('onoff').Gpio

var band             = new Gpio(22, 'out')
var fill             = new Gpio(27, 'out')
var fillsensor       = new Gpio(4, 'in', 'both') 
var arrivalsensor    = new Gpio(17, 'in', 'both') 

var power            = false

http.listen(80)

app.get('/', function(req, res) {
  res.sendFile(path.join(public, 'index.htm'))
})

app.use('/', express.static(public))

io.sockets.on('connection', function (socket) {
  socket.on('poweron', function(data) {
    power = true
    console.log('poweron')
    //while (power) {
      if (fillsensor.readSync() == 0 && arrivalsensor.readSync() == 0) {
        band.writeSync(1)
        console.log('move band')
        setTimeout(stopband, 1000)
        console.log('stop band')
      }
      else if (fillsensor.readSync() == 1 && arrivalsensor.readSync() == 0) {
        fill.writeSync(1)
        console.log('fill')
        setTimeout(stopfill, 1000)
        console.log('stop fill')
      }
      else if (fillsensor.readSync() == 0 && arrivalsensor.readSync() == 1) {
        console.log('do nothing 0 1')
      }
      else if (fillsensor.readSync() == 1 && arrivalsensor.readSync() == 1) {
        console.log('do nothing 1 1')
      }

    //}
    
  })

  socket.on('poweroff', function(data) { 
    band.writeSync(0)
    fill.writeSync(0)
    power = false
    console.log('poweroff')
  })
})

function stopband() {
  band.writeSync(1)
  //setTimeout(band.writeSync(0), 1000)
}

function stopfill() {
  fill.writeSync(1)
}



process.on('SIGINT', function () { 
  band.writeSync(0) 
  band.unexport()
  fill.writeSync(0) 
  fill.unexport()
  fillsensor.unexport()
  arrivalsensor.unexport()
  process.exit()
})