const https = require('https');
const fs = require('fs');
const express = require('express');
const app = express();
console.log('server started');

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
	res.render('index.ejs');
});


https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}, app).listen(3000, () => {
  console.log('Listening...')
})


// var express = require('express');
// var app = express();
// console.log('server started');

// app.use(express.static(__dirname + '/public'));

// app.get('/', function(req, res){
// 	res.render('index.ejs');
// });

// app.listen(3000);