
var ShowController = function(){
	this.networking = new Networking();

	this.init.call(this);
}

ShowController.prototype.init = function(){

	var _this = this;

	$(document).on("click", ".showSelector", function(){
		_this.networking.emit("set-show", $(this).attr("show-name"));
	})

	$(document).on("click", ".groupSelector", function(){
		_this.networking.emit("set-group", $(this).attr("group-name"));
	})

	$(document).on("click", "#set-brightness", function(){
		_this.networking.emit("set-brightness", $("#brightness-value").val());
	})


	$(document).on("click", ".brightness-selector", function(){
		_this.networking.emit("set-brightness", $(this).attr("brightness"));
	})


}

CONTROLLER = new ShowController();