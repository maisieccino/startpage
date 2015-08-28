var express = require('express'),
    app = express(),
    fs = require('fs'),
	exec = require('child_process').exec;
    services = require('./services.js');
	require('autoquit');

var config = JSON.parse(fs.readFileSync(__dirname + '/config.json','utf8'));

var currData = {
	'music': {},
	'weather': {}
};

app.use(express.static('public_html'));

app.get('/testfunc',function(req,res) {
    res.send("Oh, hai mark.");
});

app.get('/config',function(req,res) {
    res.send(config);
});

var server = app.listen(3000, function() {
	updateStuff();
	#update = setInterval(updateStuff,config.updateInterval!=null ? config.updateInterval : 5000);
});

var io = require('socket.io').listen(server);

//server.autoQuit({ timeOut: 20, exitFn: function() {
//	console.log("ciao");
//	io.close();
//	server.close();
//	process.exit(0);
//} });

var updateStuff = function() {
	if(config.weather.show) {
		services.getWeather(config.weather.location,function(weather) {
			if (weather.type!="" && weather.temp!="" && weather.description!="") {
				currData.weather = weather;
			}
		});
	}

	if(config.music.show) {
		services.getSong(function(song) {
			currData.music = song;
		});
	}
};

io.on('connection', function(client) {
	console.log("client connected!");
	client.emit("data",currData);

	var interval = setInterval(function() {
		updateStuff();
		client.emit("data",currData);
	},config.updateInterval!=null ? config.updateInterval : 5000);

	client.on('command',function(msg) {
		switch(msg) {
			case 'musicToggle': exec('mpc toggle'); currData.music.isPaused=!currData.music.isPaused; break;
			case 'musicPrev': exec('mpc prev'); break;
			case 'musicNext': exec('mpc next'); break;
		}
		client.emit("data",currData);
	});
});

