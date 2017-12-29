const path=require('path');
const express=require('express');
const socketIO=require('socket.io');
const http=require('http');

const publicPath=path.join(__dirname,'../public');
const port=process.env.PORT || 3000;
var app=express();
var server=http.createServer(app);  //this
//var server=app.listen(3000);
//var io=require('socket.io').listen(server);
var io=socketIO(server);  //this
app.use(express.static(publicPath));

io.on('connection',(socket) => {
  console.log('New user connected');

  socket.on('createMessage', (message)=> {
    console.log('createMessage',message);
    io.emit('newMessage',{
      from:message.from,
      text:message.text,
      createdAt:new Date().getTime()
    });
  });
  socket.on('disconnect',()=> {
  console.log('User was disconnected');
  });
});

// app.listen(port,() => {
//   console.log(`Server is up on port ${port}`);
// });
//console.log(publicPath);
