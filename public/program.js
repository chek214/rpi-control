var power = false
app.power = false
var config = "configggg"
var configreceived = false
var socket = io()
window.addEventListener("load", function(){ //when page loads
  var poweron = document.getElementById("poweron")
  var poweroff = document.getElementById("poweroff")
  var saveconfig = document.getElementById("saveconfig")
  var readconfig = document.getElementById("readconfig")

  socket.on("config", function(data) {
    app.bandtime = Number(data.bandtime)
    app.filltime = Number(data.filltime)
    app.envases = Number(data.envases)
    configreceived = true
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
  saveconfig.addEventListener("click", function() { 
    console.log('saveconfig', config)
    socket.emit('saveconfig', config)
  })
  readconfig.addEventListener("click", function() { 
    console.log('readconfig', config)
    socket.emit('readconfig', config)
  })
  setInterval(function(){
    socket.emit('power', power)
    if (configreceived){
      socket.emit('bandtime', app.bandtime)
      socket.emit('filltime', app.filltime)
    }
  }, 200)
})