
var express = require('express');
var app = express();
var server = app.listen(process.env.PORT || 8000});
var io = require('socket.io')(server);
var path = require('path');
var port = 8000;
var users = [];
var messages = [];

app.get('/',function(req,res){
	res.sendFile(path.join(__dirname,'index.html'));
});
app.use('/static',express.static(path.join(__dirname,'static')));
app.get('/:id',function(req,res){
	if(req.params.id=='client.js'){
		res.sendFile(path.join(__dirname,'client.js'));
	}else if(req.params.id=='favicon.ico'){
		res.sendStatus(404);
	}
});

io.on('connection',function(socket){
	


	socket.on('disconnect',function(){
		
		users.forEach(function(user,index){
			if(user.id==socket.id){
			users.splice(index,1);
			var names = users.map(function(user){
				return user.name;
			});
			io.sockets.emit('users loaded',{ users : names });
			return;
			}
		});
		if(!users.length){
			messages = [];

		}
	});


	socket.on('send message',function(data){
		messages.push(data);
		io.sockets.emit('chat message',data);
	});

	socket.on('load users',function(){
		var names = users.map(function(user){
			return user.name;
		});
		io.sockets.emit('users loaded',{ users : names });
	});
	socket.on('load messages',function(){
		socket.emit('messages loaded',{messages:messages});
	});

	socket.on('new_user',function(user){
		users.push({name:user.name,id:socket.id});
		var names = users.map(function(user){
			return user.name;
		});
		io.sockets.emit('users loaded',{ users : names });
		
	});
	socket.on('clear_server',function(){
		io.sockets.emit('clear_client');
	});
	socket.on('draw_server',function(obj){
		io.sockets.emit('draw_client',obj);
	});
	
});

     