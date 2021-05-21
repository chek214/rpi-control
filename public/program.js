var power = false
app.power = false
var config = {}
var configreceived = false
var socket = io()
window.addEventListener("load", function(){ //when page loads
  var poweron              = document.getElementById("poweron")
  var poweroff             = document.getElementById("poweroff")
  var poweroffsys          = document.getElementById("poweroffsys")
  var mem1                 = document.getElementById("mem1")
  var mem2                 = document.getElementById("mem2")
  var mem3                 = document.getElementById("mem3")
  var rmem1                = document.getElementById("rmem1")
  var rmem2                = document.getElementById("rmem2")
  var rmem3                = document.getElementById("rmem3")

  socket.emit('config')
  socket.on("config", function(data) {
    app.bandtime           = Number(data.bandtime)
    app.filltime           = Number(data.filltime)
    app.envases            = Number(data.envases)
    config.bandtime        = Number(data.bandtime)
    config.filltime        = Number(data.filltime)
    config.envases         = Number(data.envases)
    config.name            = Number(data.name)
    configreceived         = true
    console.log(config) 
  })

  socket.on('totalenvases', function(data) {
    app.totalenvases = Number(data)
  })

  poweron.addEventListener("click", function() {
    console.log('poweron')
    power = true
    app.power = true
  })
  poweroff.addEventListener("click", function() { 
    console.log('poweroff')
    power = false
    app.power = false
  })
  mem1.addEventListener("click", function() {
    console.log('mem1')
    config.name = 0
    config.envases = app.envases
    config.bandtime = app.bandtime
    config.filltime = app.filltime
    app.settings = true
    app.savesettings = false
    socket.emit('saveconfig', config)
  })
  mem2.addEventListener("click", function() {
    console.log('mem2')
    config.name = 1
    config.envases = app.envases
    config.bandtime = app.bandtime
    config.filltime = app.filltime
    app.settings = true
    app.savesettings = false
    socket.emit('saveconfig', config)
  })
  mem3.addEventListener("click", function() {
    console.log('mem3')
    config.name = 2
    config.envases = app.envases
    config.bandtime = app.bandtime
    config.filltime = app.filltime
    app.settings = true
    app.savesettings = false
    socket.emit('saveconfig', config)
  })
  rmem1.addEventListener("click", function() {
    console.log('rmem1')
    app.settings = true
    app.retrievesettings = false
    socket.emit('readconfig', 0)
  })
  rmem2.addEventListener("click", function() {
    console.log('rmem2')
    app.settings = true
    app.retrievesettings = false
    socket.emit('readconfig', 1)
  })
  rmem3.addEventListener("click", function() {
    console.log('rmem3')
    app.settings = true
    app.retrievesettings = false
    socket.emit('readconfig', 2)
  })
  poweroffsys.addEventListener("click", function() {
    console.log('poweroffsys')
    socket.emit('poweroffsys')
  })
  setInterval(function(){
    socket.emit('power', power)
    if (configreceived){
      socket.emit('bandtime', app.bandtime)
      socket.emit('filltime', app.filltime)
      socket.emit('envases', app.envases)
    }
  }, 200)
})