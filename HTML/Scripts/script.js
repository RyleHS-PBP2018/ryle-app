var socket = io();

var rootElem = document.getElementById("root");

var messageContainer = document.getElementById("messagecontainer");
var messageBoxContainer = document.getElementById("messageboxcontainer");
var chatBox = document.getElementById("chatbox");
var chatBoxText = document.getElementById("chatbox_text");
var userContainer = document.getElementById("usercontainer");

var genBtn = document.getElementById("grade_00");
var freshmenBtn = document.getElementById("grade_09");
var sophomoreBtn = document.getElementById("grade_10");
var juniorBtn = document.getElementById("grade_11");
var seniorBtn = document.getElementById("grade_12");

var firstName = "First";
var lastName = "Last";
var activeChat = "grade_00";
var loggedIn = false;

chatBox.addEventListener('keypress', checkIfKeyIsEnter, false);  

// Validate user is stu.boone.kyschools every 1000 ms.
setInterval(function() {
    if(!gapi.auth2.getAuthInstance().isSignedIn.Ab) {
        rootElem.innerHTML = "Return to the previous page and login with google.";
        gapi.auth2.getAuthInstance().signOut();
        return;
    }

    var names = gapi.auth2.getAuthInstance().currentUser.Ab.getBasicProfile().getName();
    var email = gapi.auth2.getAuthInstance().currentUser.Ab.getBasicProfile().getEmail();
    names = names.split(" ");
    emails = email.split("@");
    firstName = names[0];
    lastName = names[1];
    
    if(emails[1] != "stu.boone.kyschools.us") {
        rootElem.innerHTML = "Return to the previous page and login with a Boone County google account.";
        gapi.auth2.getAuthInstance().signOut();
    }
    else {
        if(!loggedIn) {
            socket.emit("userJoined", {firstName: firstName, lastName: lastName});
            loggedIn = true;
        }
    }
}, 1000);

window.onload = function(event) {
    messageBoxContainer.scrollTo(0, messageBoxContainer.scrollHeight);
    genBtn.setAttribute("active", true);

    function changeChat() {
        activeChat = this.id;

        var buttons = document.getElementsByClassName("button1");
        for(i=0;i<buttons.length;i++) {
            buttons[i].setAttribute("active", false);
        }
        this.setAttribute("active", true);

        var msgs = document.getElementsByClassName("messagebox");
        for(i=0;i<msgs.length;i++) {
            var currChat = msgs[i];
            if(currChat.getAttribute("room") != activeChat) {
                currChat.style = "display: none;";
            }
            else {
                currChat.style = "display: block;";
            }
        }
    }

    genBtn.onclick = changeChat;
    freshmenBtn.onclick = changeChat;
    sophomoreBtn.onclick = changeChat;
    juniorBtn.onclick = changeChat;
    seniorBtn.onclick = changeChat;
}

function checkIfKeyIsEnter(event) {
    if(event.keyCode == 13) {
        event.preventDefault();

        var text = chatBoxText.value;
        chatBoxText.value = "";
        chatBoxText.placeholder = "Enter your message.. :D";
        window.focus();
        chatBoxText.focus();
        if(text == "" || text == null) {
            return false;
        }

        var messageObj = {
            firstName: firstName,
            lastName: lastName,
            message: text,
            room: activeChat
        };

        socket.emit("newMessage", messageObj);
    }
}

socket.on("clearChat", () => {
    messageBoxContainer.innerHTML = "";
})

socket.on("addMessage", messageObj => {
    addChatMessage(messageObj);
})

socket.on("cachedMessages", cachedMessages => {
    if(cachedMessages) {
        for(i=0;i<cachedMessages.length;i++) {
            addChatMessage(cachedMessages[i]);
        }
    }
});

function addChatMessage(messageObj) {
    var elem = document.createElement("div");
    elem.className = "messagebox";
    elem.innerHTML = messageObj.firstName + " " + messageObj.lastName + ": " + messageObj.message;
    elem.setAttribute("room", messageObj.room);
    messageBoxContainer.appendChild(elem);
    messageBoxContainer.scrollTo(0, messageBoxContainer.scrollHeight);   
    
    var timeElem = document.createElement("div");
    timeElem.className = "datetimebox";
    timeElem.innerHTML = messageObj.time;
    elem.appendChild(timeElem);

    if(messageObj.room != activeChat) {
        elem.style = "display: none;";
    }
    else {
        elem.style = "display: block;";
    }
}

function addUserBox(userName) {
    var elem = document.createElement("div");
    elem.className = "userbox";
    elem.innerHTML = userName;
    userContainer.appendChild(elem);
    userContainer.scrollTo(0, userContainer.scrollHeight);   
}