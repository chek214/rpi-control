var socket = io(); 
window.addEventListener("load", function(){ //when page loads
  var poweron = document.getElementById("poweron");
  poweron.addEventListener("click", function() { //add event listener for when checkbox changes
    socket.emit("poweron", Number(1)); 
  });
});
socket.on('light', function (data) { //get button status from client
  document.getElementById("light").checked = data; //change checkbox according to push button on Raspberry Pi
  socket.emit("light", data); //send push button status to back to server
});