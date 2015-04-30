var debug = require("debug")("wl:main");

var App = function(){

	this.init.call(this);

}

App.prototype.init = function(){
	debug("Starting..");

	this.hue = new (require("./lib/philipsHueController.js"))("001788fffe13afbc", {

		"Stop" : {
			system_name: "stop",
			loops: false,
			actions: [
				
			]
		},

		"Bubbles" : {
			system_name: "bubbles",
			loops: true,
			actions: [
				{
					all: {brightness: [1,25, 50, 75, 100, 125, 150, 175], xy: [[0.15, 0.1]], on: true, lightGap: 300, randomOrder: true},
					delayPerLight: 300,
					transition: 5,
				}
			]
		},

		"Daytime" : {
			system_name: "daytime",
			loops: true,
			actions: [
				{
					all: {brightness: true, xy: [[0.52, 0.4], [0.5, 0.4], [0.55, 0.35]], on: true, lightGap: 100},
					delay: 10000,
					transition: 50,
				}
			]
		},

		"Candle" : {
			system_name: "candle",
			loops: true,
			actions: [
				{
					all: {brightness: [0, 25, 40], xy: [[0.52, 0.4], [0.6, 0.39]], on: true, lightGap: 500},
					delayPerLight: 1000,
					transition: 6,
				}
			]
		},

		"White" : {
			system_name: "white",
			loops: true,
			actions: [
				{
					all: {brightness: true, xy: [[0.36, 0.3]], on: true, lightGap: 100},
					delay: 10000,
					transition: 6,
				}
			]
		},

		"Deep Blue" : {
			system_name: "deep-blue",
			loops: true,
			actions: [
				{
					all: {brightness: true, xy: [[0.7, 0.25], [0.15, 0.1], [0.15, 0.1]], on: true, lightGap: 100},
					delay: 40 * 1000,
					transition: 4,
				}
			]
		},

		"Off" : {
			system_name: "off",
			loops: false,
			actions: [
				{delay: 200},
				{
					all: {on: false, lightGap: 400},
					transition: 5,
				}
			]
		},

		"Red" : {
			system_name: "red",
			loops: true,
			actions: [
				{
					all: {brightness: true, xy: [[0.7, 0.25]], on: true, lightGap: 100},
					delay: 10000,
					transition: 6,
				}
			]
		},

		"Green" : {
			system_name: "green",
			loops: true,
			actions: [
				{
					all: {brightness: true, xy: [[0.2, 0.7], [0.1, 0.8]], on: true, lightGap: 100},
					delay: 10000,
					transition: 6,
				}
			]
		},

		"Blue" : {
			system_name: "blue",
			loops: true,
			actions: [
				{
					all: {brightness: true, xy: [[0.15, 0.1]], on: true, lightGap: 100},
					delay: 10000,
					transition: 6,
				}
			]
		},

		"Disco" : {
			system_name: "disco",
			loops: true,
			actions: [
				{
					all: {brightness: true, xy: [[0.7, 0.25], [0.15, 0.1], [0.2, 0.7]], on: true, lightGap: 100},
					delayPerLight: 100,
					transition: 1,
				}
			]
		},

		"Strobe" : {
			system_name: "strobe",
			loops: true,
			actions: [
				{
					all: {brightness: true, xy: [[0.4, 0.4]], on: true, lightGap: 100},
					delay: 100,
					transition: 0,
				},
				{
					all: {on: false, lightGap: 100},
					transition: 0,
					delay: 100,
				},
				{
					delayPerLight: 100
				},
			]
		},

		"Slow-Strobe" : {
			system_name: "slow-strobe",
			loops: true,
			actions: [
				{
					all: {brightness: true, xy: [[0.4, 0.4]], on: true, lightGap: 500},
					delay: 250,
					transition: 0,
				},
				{
					all: {on: false, lightGap: 500},
					transition: 0,
					delay: 250,
				},
				{
					delayPerLight: 200
				},
			]
		},

		// "Demo" : {
		// 	system_name: "demo",
		// 	loops: false,
		// 	actions: [
		// 		{
		// 			all: {brightness: true, rgb: [255, 255, 255], on: true, lightGap: 200},
		// 			delay: 200,
		// 			transition: 0,
		// 		},
		// 		{
		// 			all: {brightness: true, rgb: [255, 0, 0], on: true, lightGap: 200},
		// 			delay: 200,
		// 			transition: 0,
		// 		},
		// 		{
		// 			all: {brightness: true, rgb: [0, 255, 0], on: true, lightGap: 200},
		// 			delay: 200,
		// 			transition: 0,
		// 		},
		// 		{
		// 			all: {brightness: true, rgb: [0, 80, 255], on: true, lightGap: 200},
		// 			delay: 200,
		// 			transition: 0,
		// 		},
		// 		{
		// 			all: {on: false, lightGap: 200},
		// 			delay: 200,
		// 			transition: 0,
		// 		},
		// 		{
		// 			delayPerLight: 200
		// 		},
		// 		{
		// 			all: {brightness: 255, rgb: [255, 255, 255], on: true},
		// 			delay: 2000,
		// 			transition: 0,
		// 		},
		// 		{
		// 			all: {brightness: 255, rgb: [255, 0, 0], on: true},
		// 			delay: 2000,
		// 			transition: 0,
		// 		},
		// 		{
		// 			all: {brightness: 255, rgb: [255, 0, 255], on: true},
		// 			delay: 2000,
		// 			transition: 0,
		// 		},
		// 		{
		// 			all: {brightness: 255, rgb: [0, 255, 0], on: true},
		// 			delay: 2000,
		// 			transition: 0,
		// 		},
		// 		{
		// 			all: {on: false, lightGap: 200},
		// 			delay: 200,
		// 			transition: 0,
		// 		},
		// 		{
		// 			all: {brightness: 200, rgb: [255, 255, 200], on: true},
		// 			delay: 10000,
		// 			transition: 10
		// 		},
		// 	]
		// }

	}, function(err){
		if(err) throw err;

		// this.hue.setBrightness(200);

		this.startWeb.call(this);

		// this.hue.setShow(this.hue.lightShows["Demo"]);
		

	}.bind(this));

}

App.prototype.startWeb = function(){
	this.webServer = new (require("./web/WebServer.js"))(this);
}

new App();