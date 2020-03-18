const https = require('https');
// const http = require('http');
const fs = require('fs');
const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
	res.render('index.ejs');
});


const server = https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}, app).listen(process.env.PORT || 3000, () => {
  console.log('Listening...')
})

// const server = http.createServer(app).listen(process.env.PORT || 3000, () => {
//   console.log('Listening...')
// })

const io = require('socket.io')(server);


io.on('connection',socket=>{
  console.log('joined');
  socket.on('ready',(data)=>{
    socket.join(data.chat_room);
    socket.join(data.signal_room);
    socket.join(data.files_room);
    // io.to(data.chat_room).emit('announce',{
    //   message: 'New client in the ' + data.chat_room + ' room.'
    // });
  });

  socket.on('send',data=>{
    io.to(data.room).emit('message',{
      message: data.message,
      author: data.author
    })
  })

  socket.on('signal',data=>{
    console.log(data)
    //Note the use of data here for broadcasting so only the sender doesn't 
    //receive their own messages
    socket.to(data.room).emit('signaling_message',{
      type: data.type,
      message: data.message
    })
  })

  socket.on('files',data=>{
    socket.to(data.room).emit('files',{
      filename: data.filename,
      filesize: data.filesize
    })
  })
})


// var express = require('express');
// var app = express();
// console.log('server started');

// app.use(express.static(__dirname + '/public'));

// app.get('/', function(req, res){
// 	res.render('index.ejs');
// });

// app.listen(3000);