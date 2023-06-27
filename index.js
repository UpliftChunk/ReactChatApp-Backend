const http = require('http');
const exp = require('express');
const cors = require('cors');
const socketIO = require('socket.io');

const app = exp();
const server = http.createServer(app);
const io = socketIO(server);

let users = [];
io.on('connection', (socket)=>{
   console.log("Connection established");

   socket.on('joined', ({user})=>{
      users[socket.id]= user;
      console.log(`${user} has joined`);
      socket.emit('welcome',{admin:"Admin", message:`Welcome to the chat ${user}`});
      socket.broadcast.emit('UserJoined', {user:"Admin", message:`${user} joined the chat`});
      console.log(users);
   })

   socket.on('message', (data)=>{
      io.emit('SendMessage', {user:users[data.id], message:data.message, id:data.id});
   })
   socket.on(`disconnect`, (data)=>{
      console.log(data);
      console.log(data.id);
      // console.log(`${users[socket.id]} disconnected`);
      socket.broadcast.emit('leave', {user:"Admin", message:`${users[data.id]} left the chat`});
   })

})

app.use(cors());
app.get('/', (req, res)=>{
   res.send(`Welcome`);
})

const port = process.env.PORT || 4500;
server.listen(port, () => {
   console.log(`server listening on port http://localhost:${port}`);
})