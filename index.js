/* global __dirname */

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var messageList;

var listOfOnlinePeople = [];

try {
    messageList = require('./save.json');
} catch (ex) {
    console.log("MessageList not found, creating empty variable");
    messageList = [];
}

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.use(express.static("public"));


io.on('connection', function(socket) {

    //listOfOnlinePeople.push()
    socket.emit('loadMessages', messageList.slice(Math.max(messageList.length - 1000, 0))); // give us only the last x messages
    socket.on('personIsOnline', function(username) {
        listOfOnlinePeople.push(username);
        console.log(listOfOnlinePeople);
        io.emit('receiveMessage', {username: username, message: " is now online!", isMetaMessage: true, isOnline: true})
    });
    socket.on('personIsOffline', function(username) {
        var index = listOfOnlinePeople.indexOf(username);
        if (index !== -1) {
            listOfOnlinePeople.splice(index, 1);
            console.log(listOfOnlinePeople);
            io.emit('receiveMessage', {username: username, message: " is now offline.", isMetaMessage: true, isOnline: false});
        }
    });
    socket.on('chatMessage', function(message) {
        console.log(message);
        messageList.push(message);
        io.emit('receiveMessage', message);
    });
});
process.on("SIGINT", function() {
    // only save the last x messages
    fs.writeFileSync("save.json", JSON.stringify(messageList.slice(Math.max(messageList.length - 1000, 0))), "utf8");
    process.exit();
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});