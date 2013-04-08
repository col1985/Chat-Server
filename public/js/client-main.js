// CK - Client-main.js

// Globals
var userName = null;

// When the document is ready, hide the chat elements & give focus
// to the user name text field
$(document).ready(function() {
	$('.wrapper').hide()
	$('#usernameInput').focus();
});


// Display connected users
var counter = io.connect();

counter.on('count', function(connectedCounter) {
	connectedClients(connectedCounter);
	console.log('Connected users counter has been updated');
});


// Initialize socket.io connection to namespace addMsgs.
var chatRow = io.connect("/addMsgs");

chatRow.of('/addMsgs')
  .on('connect_failed', function (reason) {
	console.log('unable to connect to namespace */addMsgs*', reason);
  })
  .on('connect', function () {
	console.log('sucessfully established a connection with the namespace */addMsgs*');
  });

chatRow.on('chat history', function(chatHistory) {
	for (var i = 0; i < chatHistory.length; i++)
	addMsgs(chatHistory.user[i], chatHistory.text[i]);
	console.log('chatHistory array passed to addMsgs()');
});

chatRow.on('msg received', function(userName, text) {
	addMsgs(userName, text);
	console.log('Data has been passed to addMsgs()');
});

chatRow.on('message', function(message) {
	serverMsgs(message);
	console.log('Data has been passed to serverMsgs() via addMsgs()');
});

chatRow.on('total msgs', function(total) {
	totalMsgs(total);
	console.log('Data has been passed to serverMsgs() via addMsgs()');
});



// This is called when we have a username
function login() {

	// Store it globally
	userName = htmlEntities($(usernameInput).val());

	// Initialize Socket.IO connection to namespace listen.
	var listen = io.connect("/listen");
	
	listen.of('/listen')
	  .on('connect_failed', function (reason) {
		console.log('unable to connect to namespace */listen*', reason);
	  })
	  .on('connect', function () {
		console.log('sucessfully established a connection with the namespace */listen*');
	  });

	listen.emit('set username', userName)
		.on('Start chat', function() {
			
			// Handle the new text form
			$('#send-msg-btn').click(function() {
			
				// Check string size, if to high alert user
				if ($('#chat-msg').val().length > 256) {
					alert("You have entered to many characters");
				} else {
					// Pass chat msg to server and clear input box
					chatRow.emit('add Msgs', {
						'user':userName, 
						'text':htmlEntities($('#chat-msg').val())
					});
					
					$('#chat-msg').val('');
				}
			});

			// Hide the form to get the user name
			$('#login').hide();

			// Show the chat elements
			$('.wrapper').show()
			$('#toolbar').show();
			$('#msg-input').show();
			$('#chat-log').show();
			$('#server').show();
			
	
			// Set focus to the new text field
			$('#chat-msg').focus();
		});
		
	listen.on('message', function(message) {
		serverMsgs(message);
		console.log('Data has been passed to serverMsgs()');
	});
}


// Add chat row to chat-log
function addMsgs(user, newText) {

	// Create the history elements to insert
	var msgRow = $('<div></div>').addClass("chatHistoryItem grad-chat");
	var name = $('<p></p>').addClass("userStyle left");
	name.text(user + ': ');
	var text = $('<p></p>').addClass("msgStyle right");
	text.text(text);
	var clear = $('<div></div>').addClass("clear");
	
	// Add the text to the elements
	msgRow.append(name);
	msgRow.append(newText);
	msgRow.append(clear);

	// Add the history element to the DOM
	$('#chat-log-data').append(msgRow);

	// Scroll the history to the bottom (the latest one inserted)
	$('#chat-log-data')[0].scrollTop = $('#chat-log-data')[0].scrollHeight;

}


// function to pass server message to DOM
function serverMsgs(message) {

	var serverMsg = $('<p></p>').addClass('server-text');
	var msg = $('<i></i>');
	msg.text(message);
	
	serverMsg.append(msg);
	
	$('#server-log-data').append(serverMsg);
	
	// Scroll the history to the bottom (the latest one inserted)
	$('#server-log-data')[0].scrollTop = $('#server-log-data')[0].scrollHeight;
	
}


// function to update connected clients
function connectedClients(connectedCounter) {

	var numUsers = $('#connected-clients');
	numUsers.text('Connected Users: ' + connectedCounter);
}


/*
 * function to update connected clients
 * total / by 2 as data stored in array in 2 parts (name, text)
 */ 
function totalMsgs(total) {

	var numMsgs = $('#total-msgs');
	numMsgs.text('Total Messages Sent: ' + total);
}


/*
 * function to replace escaping input strings.
 */
function htmlEntities(str) {
    return String(str)
    	.replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/*****  Keyboard Functionality  *****/

$(document).ready(function() {
	
	$("#chat-msg").keyup(function(e) {
		if (e.keyCode == 13) {
			$("#send-msg-btn").click();
		}
	});
	
	$("#usernameInput").keyup(function(e) {
		if (e.keyCode == 13) {
			$("#login-btn").click();
		}
	});
	
});