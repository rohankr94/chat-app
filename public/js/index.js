var socket = io();
socket.on('connect',function() {
  console.log('Connected to server');
});

socket.on('disconnect',function() {
  console.log('Disonnected from the server');
});

socket.on('newMessage',function(message) {
  console.log('New message ', message);
});
