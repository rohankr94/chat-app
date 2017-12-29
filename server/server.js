const path=require('path');
const express=require('express');
const socketIO=require('socket.io');
const http=require('http');

const publicPath=path.join(__dirname,'../public');
const port=process.env.PORT || 5000;
var app=express();
var server=app.listen(port);
var io=require('socket.io').listen(server);

app.use(express.static(publicPath));

io.on('connection',(socket) => {
  console.log('New user connected');

  socket.emit('newMessage',{
    from:'Admin',
    text:'Welcome to chat app',
    createdAt:new Date().getTime()
  });

  socket.broadcast.emit('newMessage',{
    from:'Admin',
    text:'New user joined',
    createdAt:new Date().getTime()
  });


  socket.on('createMessage', (message)=> {
    console.log('createMessage',message);
    // io.emit('newMessage',{
    //   from:message.from,
    //   text:message.text,
    //   createdAt:new Date().getTime()
    // });
    socket.broadcast.emit('newMessage',{
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
