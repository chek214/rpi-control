var express          = require('express')
var path             = require('path')
var public           = path.join(__dirname, 'public')
var app              = express()
var http             = require('http').Server(app)
var fs               = require('fs')
var io               = require('socket.io')(http, {allowEIO3: true})
var Gpio             = require('onoff').Gpio

const { exec }       = require("child_process")

var band             = new Gpio(22, 'out')
var fill             = new Gpio(27, 'out')
var fillsensor       = new Gpio(4, 'in', 'both') 
var arrivalsensor    = new Gpio(17, 'in', 'both') 

band.writeSync(0)
fill.writeSync(0)

var power            = false
var busy             = false
var filled           = true

var bandtime         = 4000
var filltime         = 2000
var envases          = 4

var totalenvases     = 0

var configs          = null
var sconfig          = null

http.listen(80)

app.get('/', function(req, res) {
  res.sendFile(path.join(public, 'index.htm'))
})

app.use('/', express.static(public))

fs.readFile(path.resolve(__dirname, 'configs.json'), 'utf8' , (err, data) => {
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
    if (data && !busy){
      if (fillsensor.readSync() == 0 && arrivalsensor.readSync() == 0) {
        if(!filled)
        {
          await sleep(bandtime)
        }
        busy = true
        band.writeSync(1)
        await sleep(bandtime)
        band.writeSync(0)
        busy = false
        filled = false
      }
      else if (fillsensor.readSync() == 1 && arrivalsensor.readSync() == 0) {
        if (filled)
        {
          busy = true
          band.writeSync(1)
          await sleep(bandtime)
          band.writeSync(0)
          busy = false
          filled = false
        }
	      else {
        busy = true
        fill.writeSync(1)
        await sleep(filltime)
        fill.writeSync(0)
        busy = false
        filled = true
        countenvases()
	      }
      }
      else if (fillsensor.readSync() == 0 && arrivalsensor.readSync() == 1) {
        band.writeSync(0)
        fill.writeSync(0)
        await sleep(bandtime)
      }
      else if (fillsensor.readSync() == 1 && arrivalsensor.readSync() == 1) {
        band.writeSync(0)
        fill.writeSync(0)
        await sleep(bandtime)
      }
    }
  })

  function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    })
  } 

  function countenvases() {
    totalenvases = totalenvases + envases
    socket.emit('totalenvases', totalenvases)
  }

  socket.on('bandtime', function(data) {
    bandtime = data
  })

  socket.on('filltime', function(data) {
    filltime = data
  })

  socket.on('saveconfig', function(config) {
    if (configs !== null){
      configs.config[config.name] = config
      fs.writeFile('configs.json', JSON.stringify(configs), function (err) {
        if (err) return console.log(err)
     })
    }
    console.log(configs)
    })

    socket.on('readconfig', function(name) {
       fs.readFile('configs.json', 'utf8', (err, data) => {
         if (err) {
               console.error(err)
               return
         }
         configs = JSON.parse(data)
         socket.emit('config', configs.config[name])
       })
    })

    socket.on('poweroffsys', function(data) {
      console.log('shuting down')   
      exec('sudo shutdown now')
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
