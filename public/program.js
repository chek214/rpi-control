var power = false
app.power = false
var config = {}
var configreceived = false
var socket = io()
window.addEventListener("load", function(){ //when page loads
  var poweron = document.getElementById("poweron")
  var poweroff = document.getElementById("poweroff")
  var mem1 = document.getElementById("mem1")
  var mem2 = document.getElementById("mem2")
  var mem3 = document.getElementById("mem3")
  var rmem1 = document.getElementById("rmem1")
  var rmem2 = document.getElementById("rmem2")
  var rmem3 = document.getElementById("rmem3")

  socket.emit('config')
  socket.on("config", function(data) {
    app.bandtime = Number(data.bandtime)
    app.filltime = Number(data.filltime)
    app.envases = Number(data.envases)
    config.bandtime = Number(data.bandtime)
    config.filltime = Number(data.filltime)
    config.envases = Number(data.envases)
    config.name = Number(data.name)
    configreceived = true
    console.log(config) 
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
    //config.name = 1
    socket.emit('saveconfig', config, 0)
  })
  mem2.addEventListener("click", function() {
    console.log('mem2')
    //config.name = 1
    socket.emit('saveconfig', config, 1)
  })
  mem3.addEventListener("click", function() {
    console.log('mem3')
    //config.name = 1
    socket.emit('saveconfig', config, 2)
  })
  rmem1.addEventListener("click", function() {
    console.log('rmem1')
    //config.name = 1
    socket.emit('readconfig', 0)
  })
  rmem2.addEventListener("click", function() {
    console.log('rmem2')
    //config.name = 1
    socket.emit('readconfig', 1)
  })
  rmem3.addEventListener("click", function() {
    console.log('rmem3')
    //config.name = 1
    socket.emit('readconfig', 2)
  })
  setInterval(function(){
    socket.emit('power', power)
    if (configreceived){
      socket.emit('bandtime', app.bandtime)
      socket.emit('filltime', app.filltime)
    }
  }, 200)
})