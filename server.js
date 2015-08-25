var express = require('express'),
    app = express(),
    fs = require('fs'),
    services = require('./services.js');
	require('autoquit');
	require('systemd');

var config = JSON.parse(fs.readFileSync(__dirname + '/config.json','utf8'));

var currData = {};

app.use(express.static('public_html'));

app.get('/testfunc',function(req,res) {
    res.send("Oh, hai mark.");
});

app.get('/config',function(req,res) {
    res.send(config);
});

var server = app.listen(3000, function() {
	updateStuff();
	update = setInterval(updateStuff,5000);
});

var io = require('socket.io').listen(server);

//server.autoQuit({ timeOut: 20, exitFn: function() {
//	console.log("ciao");
//	io.close();
//	server.close();
//	process.exit(0);
//} });

var updateStuff = function() {
	services.getWeather(config.weather.location,function(weather) {
		currData.weather = weather;
	});
};

io.on('connection', function(client) {
	console.log("client connected!");
	client.emit("data",currData);

	var interval = setInterval(function() {
		client.emit("data",currData);
	},5000);
});
