var power = false
var socket = io()
window.addEventListener("load", function(){ //when page loads
  var poweron = document.getElementById("poweron")
  var poweroff = document.getElementById("poweroff")
  poweron.addEventListener("click", function() { 
    //socket.emit("poweron", Number(1))
    console.log('poweron')
    power = true
  })
  poweroff.addEventListener("click", function() { 
    //socket.emit("poweroff", Number(1))
    console.log('poweroff')
    power = false
  })
  setInterval(function(){
    if (power){
      socket.emit('power')
    }
  }, 200)
})

function poweron() {
  power = true
  console.log('power on')
}

function poweroff() {
  power = false
  console.log('power off')
}

