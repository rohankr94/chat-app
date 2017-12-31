const path=require('path');
const express=require('express');
const socketIO=require('socket.io');
const http=require('http');
const {messageGenerator}=require('./utils/message');

const publicPath=path.join(__dirname,'../public');
const port=process.env.PORT || 5000;
var app=express();
var server=app.listen(port);
var io=require('socket.io').listen(server);

app.use(express.static(publicPath));

io.on('connection',(socket) => {
  console.log('New user connected');

  socket.emit('newMessage',messageGenerator('Admin','Welcome to the chat app'));

  socket.broadcast.emit('newMessage',messageGenerator('Admin','New user joined'));


  socket.on('createMessage', (message,callback)=> {
    console.log('createMessage',message);
    // io.emit('newMessage',{
    //   from:message.from,
    //   text:message.text,
    //   createdAt:new Date().getTime()
    // });
    io.emit('newMessage',messageGenerator(message.from,message.text));
    callback('this is from server');
  });

  socket.on('disconnect',()=> {
  console.log('User was disconnected');
  });
});

// app.listen(port,() => {
//   console.log(`Server is up on port ${port}`);
// });
//console.log(publicPath);
