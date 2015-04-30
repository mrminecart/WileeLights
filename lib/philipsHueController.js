var debug = require("debug")("wl:hue");
var hue = require("node-hue-api");
var async = require("async");

var PhilipsHueController = function(bridgeId, lightShows, callback) {

    this.bridgeId = bridgeId;
    this.lightShows = lightShows;

    this.userName = "3efae9051ad35907b5c72d131919633";

    this.connectionStatus = "Not Connected";
    this.lightCount = 0;
    this.currentShow = "White";
    this.lightGroup = { name: "Not Selected" };
    this.brightness = 255;

    this.init.call(this, function(err) {
        if (err) {
            callback(err);
            return;
        }

        this.lightCount = Object.keys(this.fullState.lights).length;

        debug("Connected!");

        callback(null);
    }.bind(this));
}

PhilipsHueController.prototype.init = function(callback) {

    async.waterfall([

        this.findBridges.bind(this),
        this.getMasterBridgeAddress.bind(this),
        this.connectToBridge.bind(this),
        this.getLightsForBridge.bind(this),
        this.chooseDefaultGroup.bind(this),

    ], function(err, user) {
        callback(err, user);
    })

}

PhilipsHueController.prototype.setShow = function(show){
	this.currentShow = show.system_name;

	this.runLightShow(show);
}

PhilipsHueController.prototype.setBrightness = function(brightness){
	this.brightness =  brightness;
}

PhilipsHueController.prototype.runLightShow = function(show){

	var _this = this;

	if(!show.actions || show.actions.length == 0){
		debug("No Actions");
		return;
	}

	var tasks = [];

	for (var i = 0; i < show.actions.length; i++) {

		(function(actionId){

			tasks.push(function(callback){

				if(show.system_name != _this.currentShow){
					debug("Skipping as show has changed...");
					callback();
					return;
				}

				if(!!show.actions[actionId].all){

					lightGap = 0;

					var states = [];

					var amountOfStates = 1;

					if(show.actions[actionId].all.rgb && show.actions[actionId].all.rgb.length > amountOfStates) amountOfStates = show.actions[actionId].all.rgb.length;
					if(show.actions[actionId].all.xy && show.actions[actionId].all.xy.length > amountOfStates) amountOfStates = show.actions[actionId].all.xy.length;
					if(show.actions[actionId].all.brightness && show.actions[actionId].all.brightness.length > amountOfStates) amountOfStates = show.actions[actionId].all.brightness.length;

					for (var k = 0; k < amountOfStates; k++) {


						states.push(hue.lightState.create().on().transitionTime(show.actions[actionId].transition));
						
						/**
						 * Is the light turned on?
						 */
						if(!show.actions[actionId].all.on){
							states[k].off();
							continue;
						}

						if(show.actions[actionId].all.rgb){

								states[k].rgb(show.actions[actionId].all.rgb[parseInt(Math.random() * show.actions[actionId].all.rgb.length)]);

						}else if(show.actions[actionId].all.xy){
							
								var cxy = show.actions[actionId].all.xy[parseInt(Math.random() * show.actions[actionId].all.xy.length)]

								states[k].xy(cxy[0], cxy[1]);

						}
						

						/**
						 * Set brightness
						 */
						if(show.actions[actionId].all.brightness){

							if(show.actions[actionId].all.brightness === true){

								states[k].bri(this.brightness);

							}else if(show.actions[actionId].all.brightness instanceof Array){

								states[k].bri(show.actions[actionId].all.brightness[parseInt(Math.random() * show.actions[actionId].all.brightness.length)]);

							}else{

								states[k].bri(show.actions[actionId].all.brightness);

							}

						}

					};

					if(show.actions[actionId].all.lightGap){
						lightGap = show.actions[actionId].all.lightGap;
					}

					if(show.actions[actionId].all.randomOrder){
						randomOrder = show.actions[actionId].all.randomOrder;
					}

					this.setLightsState(this.lightGroup.lights, states, lightGap, randomOrder);

				}

				if(show.actions[actionId].delay){
					setTimeout(callback, show.actions[actionId].delay);
				}else if(show.actions[actionId].delayPerLight){
					setTimeout(callback, show.actions[actionId].delayPerLight * this.lightGroup.lights.length);
				}


			}.bind(this));

		}.bind(this))(i);

		
	};

	if(!!show.loops){
		async.forever(function(callback){
			async.series(tasks, function(err, data){
				
				if(err) {
					debug(err);
					return;
				}

				if(_this.currentShow == show.system_name){
					callback();
				}else{
					debug("Show has changed, not restarting loop");
				}

			}.bind(_this))
		}.bind(_this))
	}else{
		async.series(tasks, function(err, data){
			debug("Dones...", err)
		}.bind(_this))
	}

}

PhilipsHueController.prototype.setGroup = function(group){
	this.lightGroup = group;
}

PhilipsHueController.prototype.chooseDefaultGroup = function(callback){
	this.lightGroup = this.fullState.groups[Object.keys(this.fullState.groups)[0]];

	callback(null);
}

PhilipsHueController.prototype.setLightsState = function(lights, states, timeGap, randomOrder, callback){

	if(randomOrder){
		lights.sort(function() {
			return .5 - Math.random();
		});
	}

	for (var i = lights.length - 1; i >= 0; i--) {
 	  	
 	  	setTimeout(function(id){

 	  		this.setLightState(parseInt(id), states, function(err){
	 	  		if(err) throw err;
	 	  	});

 	  	}.bind(this), i * timeGap, lights[i])
 	};

 	if(callback){
	 	setTimeout(callback, (lights.length + 1) * timeGap)
 	}
}

PhilipsHueController.prototype.setLightState = function(light, states, callback) {

	var state = states[parseInt(Math.random() * states.length)];

    this.api.setLightState(light, state, function(err, result) {
        if (err) debug(err);
        callback(null);
    });
}

PhilipsHueController.prototype.getLightsForBridge = function(callback) {
    this.api.getFullState(function(err, config) {
    	this.fullState = config;
        callback(err);
    }.bind(this));
}

PhilipsHueController.prototype.connectToBridge = function(hostname, callback) {
    this.api = new hue.HueApi(hostname, this.userName);

    this.connectionStatus = "Connected"

    callback(null);

    // this.api.createUser(hostname, null, null, function(err, user) {
    //     callback(err, user);
    // });

}

PhilipsHueController.prototype.getMasterBridgeAddress = function(bridges, callback) {

	this.connectionStatus = "Finding master bridge"

    for (var i = bridges.length - 1; i >= 0; i--) {
        if (bridges[i].id == this.bridgeId) {
            callback(null, bridges[i].ipaddress);
            return
        }
    };

    callback("Could  not find bridge");
}

PhilipsHueController.prototype.findBridges = function(callback) {

	this.connectionStatus = "Finding bridges...";

    hue.nupnpSearch(function(err, result) {
        callback(err, result);
    });
}

module.exports = PhilipsHueController;