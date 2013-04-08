// CK - Client-main.js

//Declare Global Variables
var username = null;


$(document).ready(function() {

	$('#chatlog').hide();
	$('nav').hide();
	$('#usernameInput').focus(); 
    
});

//Declare variable and connect to /addMsgs via socket.
var socketChat = io.connect('/addMsgs');

//Authorize socket connection to namespace /addMsgs
socketChat.of('/addMsgs')
	on.('connect_failed', function(reason) {
		console.error('Unable to connect to namespace', reason);
	}).on('connect', function() {
		console.info('Successfully established a connection with /addMsgs');
	});

//Connect to New Message broadcast and
socketChat.on('updateChatLog', function(username, text) {
	addMsgs(username, text);
	console.log('updateChatLog - Data has arrived!!');
});

//Login - Start Chat.
function login() {
	
	//Store username globally 
	username = $(usernameInput).val();
	
	//Create socket to connect to path /listen
	var socketListen = io.connect('/listen');
	
	socketListen.of('/listen')
		on.('connect_failed', function(reason) {
			console.error('Unable to connect to namespace', reason);
		}).on('connect', function() {
			console.info('Successfully established a connection with /listen');
		});
	
	//Set username	
	socketListen.emit('set username', username)
		.on('Start chat', function() {
			
			/* Handle newMsg and send data to server via socket.
			 * Clear input when sent.
			 */
			 
			$("#send-msg-btn").click(function() {
				socketChat.emit('add Msgs', {'user':username, 'text':$('#chat-msg').val()});
				$("#chat-msg").val('');
				console.log('New Message sent to server');
			});
			
			/* Hide set username form */
			$('#setUsername').hide();
			console.log('Hide username form');
			
			/* Show chat room */
			$("#chat-log").show();
			$("nav").show();
			console.log('Client has entered chat');
			
			/* focus on text input field */
			$('#newUserText').show();
			console.log('focus chat input');	
		}); 
}
console.log('Client has entered chat!!');

/*  
 * this is the main body to the chat-server.
 * Here all data is sent to client browser with styling applied.
 */
 
function addMsgs(user, newText) {
	
	//Create chat-log-row elements
	var chatRow = $("<div></div>").addClass("chatHistoryItem gradient");
	var clientName = $("<div></div>").addClass("userStyle left");
		clientName.text(user + ': ');
	var msg = $("<div></div>").addClass("msgStyle right");
		msg.text(text);
	var clear = $("<div></div>").addClass("clear");
	
	//add chat variables to element
	chatRow.append(clientName);
	chatRow.append(msg);
	chatRow.append(clear);
	
	//Add chat-log to DOM
	$("#chat-log-data").append(chatRow);
	
	/* Display most recent chatRow inserted setting scroll */
	$("#chat-log-data")[0].scrollTop = $("#chat-log-data")[0].scrollHeight;	
}
 


