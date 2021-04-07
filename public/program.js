var socket = io()
window.addEventListener("load", function(){ //when page loads
  var poweron = document.getElementById("poweron")
  var poweroff = document.getElementById("poweroff")
  poweron.addEventListener("click", function() { 
    socket.emit("poweron", Number(1))
    console.log('poweron')
  })
  poweroff.addEventListener("click", function() { 
    socket.emit("poweroff", Number(1))
    console.log('poweroff')
  })
  setInterval(function(){
    socket.emit('every 200')
  }, 200)
})

function power() {

}
