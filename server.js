var express = require('express'),
    app = express(),
    fs = require('fs'),
    http = require('http').Server(app),
	io = require('socket.io')(http),
    services = require('./services.js');

var config = fs.readFileSync(__dirname + '/config.json','utf8');

var currData = {};

app.use(express.static('public_html'));

app.get('/testfunc',function(req,res) {
    res.send("Oh, hai mark.");
});

app.get('/config',function(req,res) {
    res.send(config);
});

http.listen(3000, function() {

    services.getWeather("london", function(weather) {
        console.log("weather: "+weather.type);
        console.log(weather.description);
        console.log("Temp: "+Math.round(weather.temp-273.15)+" celcius");
    });

	updateStuff = setInterval(function() {
		services.getWeather("london",function(weather) {
			currData.weather = weather;
		});
	},5000);
})

io.on('connection', function(client) {
	console.log("client connected!");
	var interval = setInterval(function() {
		client.emit("data",currData);
	},5000);
});
