const path=require('path');
const express=require('express');
const socketIO=require('socket.io');
const http=require('http');


const {messageGenerator,linkGenerator}=require('./utils/message');
const {isRealString}=require('./utils/validation');
const {Users}=require('./utils/users');

const publicPath=path.join(__dirname,'../public');
const port=process.env.PORT || 5000;
var app=express();
var server=app.listen(port);
var io=require('socket.io').listen(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection',(socket) => {
  console.log('New user connected');


  socket.on('join',(params,callback) => {
    if(!isRealString(params.name) || !isRealString(params.room)){
      return callback('Name and room name are required');
    }
    callback();

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id,params.name,params.room);

    io.to(params.room).emit('updateUserList',users.getUserList(params.room));

    socket.emit('newMessage',messageGenerator('Admin','Welcome to the chat app'));
    socket.broadcast.to(params.room).emit('newMessage',messageGenerator('Admin',`${params.name} has joined.`));
    callback()
  });


  socket.on('createMessage', (message,callback)=> {
    // console.log('createMessage',message);
    var user = users.getUser(socket.id);
    if(user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage',messageGenerator(user.name,message.text));
    }
    //io.emit('newMessage',messageGenerator(message.from,message.text));
    callback();
  });


  socket.on('createLocationMessage',(coords) => {
    var user = users.getUser(socket.id);
    if(user){
      io.to(user.room).emit('newLocationMessage',linkGenerator(user.name,coords.latitude,coords.longitude));
    }
  });

  socket.on('disconnect',()=> {
    var user = users.removeUser(socket.id);
    if(user){
      io.to(user.room).emit('updateUserList',users.getUserList(user.room));
      io.to(user.room).emit('newMessage',messageGenerator('Admin',`${user.name} has left.`));
    }
  });
});

// app.listen(port,() => {
//   console.log(`Server is up on port ${port}`);
// });
//console.log(publicPath);
