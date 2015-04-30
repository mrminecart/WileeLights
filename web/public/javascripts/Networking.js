
var Networking = function(){
	this.init.call(this)
}

Networking.prototype.init = function(){
	this.socket = io.connect(window.location.origin);

	this.bindSocketEvents();

	this.socket.emit("ping");

}

Networking.prototype.bindSocketEvents = function(){

	this.socket.on("pong", this.events.onPing.bind(this))
	this.socket.on("set-show", this.events.onSetShow.bind(this))

}

Networking.prototype.emit = function(key, value){

	this.socket.emit(key, value);

}

Networking.prototype.events = {};

Networking.prototype.events.onPing = function(){
	console.log("Got Pong");
}

Networking.prototype.events.onSetShow = function(data){
	console.log(data);
}