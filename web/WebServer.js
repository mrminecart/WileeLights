var debug = require("debug")("wl:web");
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var WebServer = function(wileeLights) {
    this.wileeLights = wileeLights;
    this.init.call(this);
}

WebServer.prototype.init = function() {
    var routes = require('./routes/index');
    var users = require('./routes/users');

    var app = express();

    app.set('hue', this.wileeLights.hue);

    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');

    // uncomment after placing your favicon in /public
    //app.use(favicon(__dirname + '/public/favicon.ico'));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    app.use('/', routes);
    app.use('/users', users);

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // error handlers

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });

    var server = require('http').Server(app);
    var io = require('socket.io')(server);

    this.bindSocketIoEvents.call(this, io);

    server.listen(8080);

}

WebServer.prototype.bindSocketIoEvents = function(io) {

    io.on('connection', function(socket) {

        debug("Socket Connection!");

        socket.on('ping', function(){
            debug("Got ping");
            socket.emit("pong");
        }.bind(this));

        socket.on('set-show', function(data){

            debug("Changing show to: " + data);

            this.wileeLights.hue.setShow(this.wileeLights.hue.lightShows[data]);

        }.bind(this))

        socket.on('set-group', function(data){

            debug("Changing group to: " + data);

            var groups = Object.keys(this.wileeLights.hue.fullState.groups).map(function (key) {return this.wileeLights.hue.fullState.groups[key]}.bind(this))

            for (var i = groups.length - 1; i >= 0; i--) {
                if(groups[i].name === data){
                    this.wileeLights.hue.setGroup(groups[i]);
                }
            };

        }.bind(this))

        socket.on('set-brightness', function(data){

            debug("Changing brightness to: " + data);

            this.wileeLights.hue.setBrightness(parseInt(data));

        }.bind(this))

    }.bind(this));

}

module.exports = WebServer;