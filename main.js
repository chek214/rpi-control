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
var envases          = 4

var configs          = null
var sconfig          = null

http.listen(80)

app.get('/', function(req, res) {
  res.sendFile(path.join(public, 'index.htm'))
})

app.use('/', express.static(public))

fs.readFile('configs.json', 'utf8' , (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  configs = JSON.parse(data)
  sconfig = configs.config[configs.last]
})

io.sockets.on('connection', function (socket) {
  socket.on('config', function() {
    socket.emit('config', sconfig)
  })
  socket.on('power', async function(data) {
    //console.log('power' + data)    
    if (data && !busy){
      if (fillsensor.readSync() == 0 && arrivalsensor.readSync() == 0) {
        busy = true
        band.writeSync(1)
        //console.log('move band')
        await sleep(bandtime)
        band.writeSync(0)
        //console.log('stop band')
        await sleep(bandtime)
        busy = false
      }
      else if (fillsensor.readSync() == 1 && arrivalsensor.readSync() == 0) {
        busy = true
        fill.writeSync(1)
        //console.log('fill')
        await sleep(filltime)
        fill.writeSync(0)
        //console.log('stop fill')
        await sleep(filltime)
        busy = false
      }
      else if (fillsensor.readSync() == 0 && arrivalsensor.readSync() == 1) {
        //console.log('do nothing 0 1')
        band.writeSync(0)
        fill.writeSync(0)
      }
      else if (fillsensor.readSync() == 1 && arrivalsensor.readSync() == 1) {
        //console.log('do nothing 1 1')
        band.writeSync(0)
        fill.writeSync(0)
      }
    }
  })

  function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    })
  } 

  socket.on('bandtime', function(data) {
    //console.log('bandtime' + data) 
    bandtime = data
  })

  socket.on('filltime', function(data) {
    //console.log('filltime' + data)    
    filltime = data
  })

  socket.on('saveconfig', function(data) {
    if (configs !== null){
    //  fs.writeFile('configs.json', JSON.stringify(configs), function (err) {
    //    if (err) return console.log(err)
    //    console.log('saved')
    // })
    }
    console.log(data)
    })

    socket.on('readconfig', function(data) {
      fs.readFile('configs.json', 'utf8', (err, data) => {
        if (err) {
              console.error(err)
              return
        }
        configs = JSON.parse(data)
        console.log(configs.config[0].bandtime)
      })

    })


})


process.on('SIGINT', function () { 
  band.writeSync(0) 
  band.unexport()
  fill.writeSync(0) 
  fill.unexport()
  fillsensor.unexport()
  arrivalsensor.unexport()
  process.exit()
})