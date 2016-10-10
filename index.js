var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');

var messageList;
try {
    messageList = require('./save.json');
} catch (ex) {
    console.log("MessageList not found, creating empty variable");
    messageList = [];
}

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static("public"));

function exitHandler() {
	console.log(JSON.stringify(messageList));
	fs.writeFileSync("save.json", JSON.stringify(messageList), "utf8", function(message) {
            console.log("Save to Json: " + message);
	});
	process.exit();
}

// process.on("exit", exitHandler.bind());

process.on("SIGINT", exitHandler.bind());

io.on('connection', function(socket){
	socket.emit('loadMessages', messageList.slice(Math.max(messageList.length - 100, 0))); // give us only the last x messages
	
	socket.on('disconnect', function(){
		
	});
	socket.on('chatMessage', function(message){
		console.log(message);
		messageList.push(message);
		io.emit('receiveMessage', message);
	});
});



http.listen(3000, function(){
  console.log('listening on *:3000');
});