document.addEventListener("DOMContentLoaded", function() {

    var username = "NoName";
    var modalContainer = document.getElementById("modalContainer");
    var modalInput = document.getElementById("usernameInput");

    modalInput.addEventListener("keypress", function(key) { // check for enter/shift+enter
        if (key.keyCode === 13) {
            console.log(modalInput);
            username = modalInput.value;
            modalContainer.style.display = "none";
        }
    });
    
    if (!Notification) {
        alert('Desktop notifications not available in your browser. Try Chromium.');
    } else if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }

    var socket = io();

    do {
        //username = prompt("What is your name?");
    } while (!username);
    socket.emit("chatMessage", {username: username, message: " is now online!", isMetaMessage: true, isOnline: true});

    var receiveMessageContainer = document.getElementById("receiveMessageContainer");
    var inputBox = document.getElementById("inputBox");
    var sendButton = document.getElementById("sendButton");

    inputBox.focus(); // put cursor directly into inputBox
    inputBox.addEventListener("keypress", function(key) { // check for enter/shift+enter
        if (key.keyCode === 13 && !key.shiftKey) {
            submitMessage(key); // send message only if enter and not shift is pressed
        }
    });

    sendButton.addEventListener("click", function(event) {
        submitMessage(event); // send message if send button was clicked
    });

    socket.addEventListener("loadMessages", function(messageList) {
        for (var i = 0; i < messageList.length; i++) {
            displayText(messageList[i]);
        }
    });

    window.onbeforeunload = function(event) {
        socket.emit("chatMessage", {username: username, message: " is now offline.", isMetaMessage: true, isOnline: false});
    };


    var submitMessage = function(event) {
        var message = inputBox.value;

        if (message.trim().length > 0) {
            inputBox.value = "";
            console.log(message);
            socket.emit("chatMessage", {username: username, message: message});
        }
        event.preventDefault();
    };


    function notify(text) {
        var notification = new Notification("Webchat", {
            body: text
        });
        setTimeout(function() {
            notification.close();
        }, 2000);
        notification.onclick = function() {
            window.focus();
            notification.close();
        };
    }

    socket.addEventListener("receiveMessage", function(message) {
        displayText(message);
        notify(message.username + ": " + message.message);
    });

    function displayText(message) {
        var receiveBox = document.getElementById("receiveMessageContainer");
        var div = document.createElement("div");

        var spanUsername = document.createElement("span");
        var spanMessage = document.createElement("span");
        spanUsername.classList.add("usernameDisplay");
        spanMessage.classList.add("messageDisplay");

        var appendix;
        if (message.isMetaMessage) {
            appendix = " ";
            if (message.isOnline) {
                div.classList.add("online");
            } else {
                div.classList.add("offline");
            }
            div.classList.add("metaMessage");
        } else {
            appendix = ":";
        }
        spanUsername.textContent = message.username + appendix;
        spanMessage.innerHTML = marked(message.message, {
            sanitize: true,
            smartypants: true
        });
        div.appendChild(spanUsername);
        div.appendChild(spanMessage);
        receiveBox.appendChild(div);
        div.scrollIntoView();
    }
}, false);