var socket = io(); 
window.addEventListener("load", function(){ //when page loads
  var poweron = document.getElementById("poweron");
  var poweroff = document.getElementById("poweroff");
  poweron.addEventListener("click", function() { 
    socket.emit("poweron", Number(1)); 
    console.log('poweron')
  });
  poweroff.addEventListener("click", function() { 
    socket.emit("poweroff", Number(1)); 
    console.log('poweroff')
  });
});

socket.on('light', function (data) { //get button status from client
  document.getElementById("light").checked = data; //change checkbox according to push button on Raspberry Pi
  socket.emit("light", data); //send push button status to back to server
});