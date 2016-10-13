/* global Notification */ // removes the warning "Notification not defined"

document.addEventListener("DOMContentLoaded", function() { // only initialize everything after site has loaded

    /* VARIABLE INITIALIZATION */

    var notificationsEnabled = true; // Notifications are enabled by default

    // enter your username and save it as variable
    var username;
    var usernameModalContainer = document.getElementById("modalContainer");
    var usernameModalInput = document.getElementById("usernameInput");

    var socket; // holds the connection to the server

    var sendMessageInputBox = document.getElementById("inputBox"); // the message input box
    var sendButton = document.getElementById("sendButton"); // message send button

    var bells = document.getElementsByClassName("bell"); // get both bell icons
    
    /* NOTIFICATION CHECK */
    
    // if notifications are not available (i.e. IE user)
    if (typeof (Notification) === "undefined") {
        alert('Sorry, Desktop notifications not available in your browser.');
        document.getElementById("bellActive").style.display = "none"; // no notifications ==> no notification toggle
        notificationsEnabled = false;
    } else if (Notification.permission !== "granted") { // if available,
        Notification.requestPermission(); // ask for permission
    }
    
    /* EVENT LISTENERS */

    // add an event listener to both icons to toggle notification modes
    for (var i = 0; i < bells.length; i++) {
        bells[i].addEventListener("click", function(event) {
            if (notificationsEnabled) { // if enabled, disable them
                document.getElementById("bellActive").style.display = "none"; // hide the "active" bell
                document.getElementById("bellInactive").style.display = "inline"; // and show the "inactive"
            } else { // if disabled, enable them
                document.getElementById("bellActive").style.display = "inline"; // show the "active" bell
                document.getElementById("bellInactive").style.display = "none"; // hide the "inactive" bell
            }
            notificationsEnabled = !notificationsEnabled; // after that, toggle the notification mode
        });
    }

    usernameModalInput.addEventListener("keypress", function(key) { // check for enter
        if (key.keyCode === 13) { // if enter was pressed
            if (!usernameModalInput.value.trim()) return; // if nothing entered, stop
            // assign the chosen username and remove the chooser box
            username = usernameModalInput.value;
            usernameModalContainer.style.display = "none";

            socket = io(); // now establish the connection and then send an "online" message
            socket.emit("chatMessage", {username: username, message: " is now online!", isMetaMessage: true, isOnline: true});
            sendMessageInputBox.focus(); // put focus on the message box

            // display the history of messages
            socket.addEventListener("loadMessages", function(messageList) {
                for (var i = 0; i < messageList.length; i++) {
                    displayText(messageList[i]);
                }
            });
            
            // for any message received:
            socket.addEventListener("receiveMessage", function(message) {
                displayText(message); // display the received message
                // if notifications are enabled  && window/tab is inactive && message is not from me
                if (notificationsEnabled && !document.hasFocus() && username !== message.username) {
                    notify(message.username + ": " + message.message); // send a notification
                }
            });
        }
    });
    // check for enter/shift+enter
    sendMessageInputBox.addEventListener("keypress", function(key) {
        if (key.keyCode === 13 && !key.shiftKey) {
            submitMessage(key); // send message only if enter and not shift is pressed
        }
    });
    
    // send message to server if send button was clicked
    sendButton.addEventListener("click", function(event) {
        submitMessage(event);
    });

    // before going offline, send an "offline" message to the server
    window.onbeforeunload = function() {
        socket.emit("chatMessage", {username: username, message: " is now offline.", isMetaMessage: true, isOnline: false});
    };

    /* HELPER METHODS */

    // submitting a message to the server
    function submitMessage(event) {
        var message = sendMessageInputBox.value; // get message from messagebox

        if (message.trim().length > 0) { // if there actually is a message
            sendMessageInputBox.value = ""; // empty the box
            socket.emit("chatMessage", {username: username, message: message}); // and send the message to the server
        }
        event.preventDefault(); // prevent default submit behaviour (refresh)
    };

    // sending a notification
    function notify(text) {
        var notification = new Notification("Webchat", {
            body: text
        });
        setTimeout(function() {
            notification.close();
        }, 2000); // after 2 seconds, close it
        notification.onclick = function() {
            window.focus(); // if notification was clicked, open the window
            notification.close(); // and close the notification
        };
    }

    // displaying a message
    function displayText(message) {
        var receiveContainer = document.getElementById("receiveMessageContainer"); // message container element
        var div = document.createElement("div"); // create new div for our message

        // spans with classes (using extra CSS styles)
        var spanUsername = document.createElement("span");
        var spanMessage = document.createElement("span");
        spanUsername.classList.add("usernameDisplay");
        spanMessage.classList.add("messageDisplay");

        var appendix; // if message is meta message (online/offline), then add nothing, else add a colon(:)
        if (message.isMetaMessage) {
            appendix = "";
            if (message.isOnline) { // if online message, add class online (+CSS styles)
                div.classList.add("online"); 
            } else { // if offline message, add class offline (+CSS styles)
                div.classList.add("offline");
            }
            div.classList.add("metaMessage"); // metamessage class
        } else {
            appendix = ":";
        }
        spanUsername.textContent = message.username + appendix; // username span: add username
        spanMessage.innerHTML = marked(message.message, { // message span: add text + enabled markdown
            sanitize: true,
            smartypants: true
        });
        // and now put everything together
        div.appendChild(spanUsername);
        div.appendChild(spanMessage);
        receiveContainer.appendChild(div);
        div.scrollIntoView(); // and scroll to the view
    }
}, false); // rest of "DOMContentLoaded" event listener