var socket = io.connect('https://chattestnodejs.herocuapp.com/');
var users = document.getElementsByClassName('users')[0];
var message = document.getElementById('tasksList');
var user = "";
var canvas = document.getElementById('canvas');
var cx = canvas.getContext('2d');
socket.emit('load users');
socket.emit('load messages');

var user = "";

socket.on('users loaded',function(data){
	
	var display_users = data.users.map(function(username){
		return ("<span>" + username + "</span>");
	});
	users.innerHTML=display_users.join(" ");

});



socket.on('messages loaded',function(data){
	var display_messages = data.messages.map(function(message){
		                   return ('<li> <span class="autor">'
								   + message.autor 
								   + '</span> <span> ' 
								   +  message.message  
								   + ' </span> </li>');
	});
	message.innerHTML=display_messages.join(" ");
	if($('#tasksList').height() > 200){
		

		$('#tasks').scrollTop( document.getElementById('tasksList').offsetHeight - 200);
		
		
	}
});

socket.on('chat message',function(data){
	$tasksList.append('<li> <span class="autor">'+data.autor+'</span> <span>' + data.message + ' </span> </li>');
	if($('#tasksList').height() > 200){
		

		$('#tasks').scrollTop( document.getElementById('tasksList').offsetHeight - 200);
		
		
	}
});



var $taskInput = $('#taskInput');
var $tasksList = $('#tasksList');

$('#taskAdd').on('click',function(){
	if(!$taskInput.val()){
		alert('invalid data');
		return;
	}
	var mes = $taskInput.val();
	for(var i = 0 ;i<mes.length;i++){
		if(mes[i]=='<'){
			mes = mes.replace('<','&lt');
		}else if(mes[i]=='>'){
			mes = mes.replace('>','&gt');
		}
	}
	
	socket.emit('send message',{message:mes,autor:user});
	$taskInput.val("");
	
});
document.addEventListener('keydown',function(e){
	if(e.keyCode==13){
			if($('.regis_chat').css('display')=='none'){
				if(!$taskInput.val()){
			alert('invalid data');
			return;
		}
		var mes = $taskInput.val();
		for(var i = 0 ;i<mes.length;i++){
			if(mes[i]=='<'){
				mes = mes.replace('<','&lt');
			}else if(mes[i]=='>'){
				mes = mes.replace('>','&gt');
			}
		}
		socket.emit('send message',{message:mes,autor:user});
		$taskInput.val("");
	}else{
		if($('#name').val() == "") {
		alert('invalid data');
		return;
		}
		user=$('#name').val();
		$('.regis_chat').css('left','100%');
		setTimeout(function(){
			$('.regis_chat').css('display','none');
		},500);
		socket.emit('new_user',{name:user});
	}
		
	}
});



$('.button').on('click',function(){
	if($('#name').val() == "") {
		alert('invalid data');
		return;
	}
	user=$('#name').val();
	$('.regis_chat').css('left','100%');
	socket.emit('new_user',{name:user});
	
});


$('.clear').on('click',function(){
	socket.emit('clear_server');
});



socket.on('clear_client',function(){
	cx.clearRect(0,0,canvas.width,canvas.height);
});




	

	function relativePos(event,element){
		var rect = element.getBoundingClientRect();
		return {
			x:Math.floor(event.clientX - rect.left),
			y:Math.floor(event.clientY - rect.top)
		};
	}

	function trackDrag(onMove){
	function end(event){

		removeEventListener('mousemove',onMove);
		removeEventListener('mouseup',end);
		
	}
		
		addEventListener('mousemove',onMove);
		addEventListener('mouseup',end);
	

}


	function line(e,cx){
		
		cx.beginPath();
		var pos = relativePos(e,cx.canvas);
		trackDrag(function(event){
		var obj = {};
		obj.lastx=pos.x;
		obj.lasty=pos.y;
		pos=relativePos(event,cx.canvas);
		obj.x=pos.x;
		obj.y=pos.y;
		obj.color=document.getElementById('color').value;
		obj.lineWidth=$('.lineWidth').val();
		socket.emit('draw_server',obj);
		
		
	});
	
	
};
	canvas.addEventListener('mousedown',function(e){
			
			line(e,cx);
		});
	   socket.on('draw_client',function(pos){
	   	cx.beginPath();
		cx.lineWidth=pos.lineWidth;
		cx.lineCap='round';
		cx.fillStyle=pos.color;
		cx.strokeStyle=pos.color;
		cx.moveTo(pos.lastx,pos.lasty);
		cx.lineTo(pos.x,pos.y);
		cx.stroke();
	});