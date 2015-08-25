var http = require('http');

exports.getWeather = function (apiString, callback) {
        http.get('http://api.openweathermap.org/data/2.5/weather?q='+apiString+"&APPID=b04c500ac5e3a35e61b6e005ad286923",function(response) {
        response.setEncoding('utf8');
        var weather = {};
        response.on("data", function(data) {
            weather.type = JSON.parse(data).weather[0].main;
            weather.description = JSON.parse(data).weather[0].description;
            weather.temp = JSON.parse(data).main.temp;

            callback(weather);
        });
    })
};
