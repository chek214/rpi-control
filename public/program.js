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
    //socket.emit("poweroff", Number(1))
    console.log('poweroff')
    power = false
    app.power = false
  })
  setInterval(function(){
    socket.emit('power', power)
    console.log('no funciona')
  }, 200)
})



