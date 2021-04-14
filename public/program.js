var power = false
app.power = false
var socket = io()
window.addEventListener("load", function(){ //when page loads
  var poweron = document.getElementById("poweron")
  var poweroff = document.getElementById("poweroff")
  poweron.addEventListener("click", function() { 
    //socket.emit("poweron", Number(1))
    console.log('poweron')
    power = true
    app.power = true
  })
  poweroff.addEventListener("click", function() { 
    console.log('poweroff')
    power = false
    app.power = false
  })
  setInterval(function(){
    socket.emit('power', power)
    socket.emit('bandtime', app.bandtime)
    socket.emit('filltime', app.filltime)
  }, 200)
})



