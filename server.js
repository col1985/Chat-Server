/*
 * CK-Chat-Server Version 0.1.1.
 * Author: Colum Bennett.
 * Email: col1985@gmail.com.
 * Module: Node Server for Chat Application.
 */

/* Set server to strict mode. */
"use strict";

/* Require modules for use within program  */
var express = require("./node_modules/express");
var app = module.exports = express();
var server = require("http").createServer(app);
var io = require("./node_modules/socket.io/").listen(server);
var mongoose = require("./node_modules/mongoose");


/* Store port that will run socket.io web-socket */
var port = process.env.PORT || 1337;


/* Declare arrays to store connected clients, server msgs and chat log data */
var i = 0;
var clients = new Array;
var chatHistory = new Array;  
var connectedCounter = 0;
var ipAddress = null;


/* Create Mongo_Db to store all chatroom data.
 * The code following is dealing with db connection errors and printing to console.
 */
var db = mongoose.connect('mongodb://localhost/chat_test_db', function(error) {
	if (error) {
		console.log(error);
	} else {
		console.log('***  Connected to **chat_test_db**: ' + (new Date()));
	}
});

 

/* Configure Express server. */
app.configure(function(error) {

	if (error) {
		console.log(error);
	} else {
		app.use(express.bodyParser());
		app.use('/js', express.static(__dirname + '/js'));
		app.use('/css', express.static(__dirname + '/css'));
		app.use('/img', express.static(__dirname + '/img'));
		app.use(express.static(__dirname + '/public'));	
		app.use(app.router);
		}
		
});

/* Configure Express server. */
app.configure('development', function(error) {

	if (error) {
		console.log(error);
	} else {
		/* Log static content and serve to client. */
		app.use(express.logger("dev"));
		}
		
});

/*  */
app.configure('production', function(error) {

	if (error) {
		console.log(error);
	} else {
   		app.use(express.errorHandler()); 
   		}
    
});

/* Connect chat server to port */
server.listen(port, function(error) {
	if (error) {
		console.log(error);
	} else {
		console.log("Express / Socket.io Server has started @ Port : " + port + ' ; ' + (new Date()));
		}
});


/******  Socket.io Configuration and setup of socket using namespace  ******/

var ioChat = io;

/* Set config for Production and Development */

ioChat.configure('production', function() {

	ioChat.enable('browser client minification'); // sends minified client file
	ioChat.enable('browser client etag'); // applies etag caching based on version number
	ioChat.enable('browser client gzip'); // gzip the file
	ioChat.set('log level', 1); // reduces logging level
	
	// This enables all transports
	ioChat.set('transports', [
		'websocket',
		'flashsocket',
		'htmlfile',
		'xhr-polling',
		'jsonp-polling',
	]);
});

/* the following allows for connection via web-socket in development */
ioChat.configure('development', function() {
	
	ioChat.set('transports', ['websocket']); // setting route of transport.
});

/* Retrive socket handshakedata from client, store client IP */
ioChat.of('/listen', '/addMsgs')
	.authorization(function (handshakeData, callback) {
	
		console.dir(handshakeData);
		handshakeData.foo = 'baz';
		callback(null, true);
		
	}).on('connection', function (socket) {	
	
		ipAddress = socket.handshake.address;
		console.log("*** New connection from IP: " + ipAddress.address + " Port: " + ipAddress.port);
	});


/* Set socket to listen for connection once authorized initiate chat-room */
ioChat.of('/listen')
		.on('connection', function(socket) { 
		
			//connectedCounter++; // add connection to counter
			//console.log('*** Connection: ' + connectedCounter);
	
			//using socket to set user name.
			socket.on('set username', function(username) {
	
				socket.set('username', username, function () {

					socket.emit('Start chat');
					socket.broadcast.emit('message', "*** SERVER: "+ username + " has entered CK Chat");
        		});
   			 });
		})


/* Add messages to chat - log */
ioChat.of('/addMsgs')
		.on('connection', function (socket) {

			socket.on('add Msgs', function(data) {
			
				socket.emit('chat history', chatHistory);
				// Store chat history in array and print to console
				chatHistory.push(data.user, data.text);
				
				/*while (i < chatHistory.length) {
					
					
					i++;
					
					}*/
				
				
				var total = chatHistory.length;
				socket.emit('total msgs', total);
				socket.broadcast.emit('total msgs', total);
				console.log("***  New chat msg added to chatHistory array: " + data.user + ': ' + data.text);
				
				// Broadcast to all clients connected
				socket.emit('msg received', data.user, data.text);
				socket.broadcast.emit('msg received', data.user, data.text);
				
				// Broadcast server msgs to all clients
				socket.emit('message', "**SERVER: "+ data.user + " said: " + data.text);
				socket.broadcast.emit('message', "**SERVER: "+ data.user + " said: " + data.text);
				
				//Print msg details and date to console.
				console.log('***  New Message from ' + data.user + ': ' + data.text + ', ' + (new Date()));
		
	});
});


ioChat.sockets.on('connection', function (socket) {
        connectedCounter++;
        console.log('*** New Client Connection: ' + connectedCounter);
        socket.emit('count', connectedCounter);
        
        socket.on('disconnect', function () {
			connectedCounter = connectedCounter - 1;
			console.log('***  Client Disconnected, new total connected clients: ' + connectedCounter);
			io.sockets.emit('count', connectedCounter);
   	 	});
   	 });


