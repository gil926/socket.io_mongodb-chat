const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const mongoose = require('mongoose')
const Msg = require('./models/massages')
const mongodb = 'mongodb+srv://gil123:5656tyui@cluster0.msvzs.mongodb.net/massage-database?retryWrites=true&w=majority'

mongoose.connect(mongodb,{ useNewUrlParser: true,useUnifiedTopology: true }).then(()=>{
 console.log('connected')
}).catch(err => console.log(err))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    
        Msg.find().then(result=>{
         socket.emit('output-messages',result)
        });
        
        //emiting the massage to mongodb database
         socket.on('chat message', (msg) => {
          const message = new Msg({msg});
            message.save().then(()=>{
              io.emit('chat message', msg);
              });
            });

            socket.on('chat message', (msg) => {
              console.log('message: ' + msg);
            });      
  });


  io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' }); // This will emit the event to all connected sockets



  

server.listen(3000, () => {
  console.log('listening on *:3000');
});