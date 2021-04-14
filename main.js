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
var busy             = false

var bandtime         = 1000
var filltime         = 1000

http.listen(80)

app.get('/', function(req, res) {
  res.sendFile(path.join(public, 'index.htm'))
})

app.use('/', express.static(public))

io.sockets.on('connection', function (socket) {
  socket.on('power', function(data) {
    console.log('power' + data)    
    if (data && !busy){
      if (fillsensor.readSync() == 0 && arrivalsensor.readSync() == 0) {
        busy = true
        band.writeSync(1)
        console.log('move band')
        setTimeout(stopband, bandtime)
        console.log('stop band')
      }
      else if (fillsensor.readSync() == 1 && arrivalsensor.readSync() == 0) {
        busy = true
        fill.writeSync(1)
        console.log('fill')
        setTimeout(stopfill, filltime)
        console.log('stop fill')
      }
      else if (fillsensor.readSync() == 0 && arrivalsensor.readSync() == 1) {
        console.log('do nothing 0 1')
        band.writeSync(0)
        fill.writeSync(0)
      }
      else if (fillsensor.readSync() == 1 && arrivalsensor.readSync() == 1) {
        console.log('do nothing 1 1')
        band.writeSync(0)
        fill.writeSync(0)
      }
    }
  })

  socket.on('bandtime', function(data) {
    console.log('bandtime' + data)    

  })

  socket.on('filltime', function(data) {
    console.log('filltime' + data)    

  })


})

function stopband() {
  band.writeSync(0)
  busy = false
}

function moveband() {
  band.writeSync(1)
  busy = false
}

band.writeSync(1)

function stopfill() {
  fill.writeSync(0)
  busy = false
}

function startfill() {
  fill.writeSync(1)
  busy = false
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