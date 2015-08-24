var express = require('express'),
    app = express(),
    fs = require('fs'),
    http = require('http'),
    services = require('./services.js');

var config = fs.readFileSync(__dirname + '/config.json','utf8');

app.use(express.static('public_html'));

app.get('/testfunc',function(req,res) {
    res.send("Oh, hai mark.");
});

app.get('/config',function(req,res) {
    res.send(config);
});

var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Listening at http://%s:%s', host, port);
    services.GetWeather("london", function(weather) {
        console.log("weather: "+weather.type);
        console.log(weather.description);
        console.log("Temp: "+Math.round(weather.temp-273.15)+" celcius");
    });
})
