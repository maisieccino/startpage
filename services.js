var http = require('http'),
	exec = require('child_process').exec;

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

exports.getSong = function(callback) {
	var returnData = { 'artist':'', 'title':''};
	exec('mpc -f %artist% current',function(err,stdout,stderr) {
		if (!err) {
			returnData.artist =  stdout.toString('utf8');
			exec('mpc -f %title% current',function(err,stdout,stderr) {
				if (!err) {
					returnData.title = stdout.toString('utf8');
					console.log(returnData);
					callback(returnData);
				}
				else {
					returnData.title = "error";
					callback(returnData);
				}
			});
		}
		else {
			returnData = { "artist":"error","title":"error" }
			callback(returnData);
		}
	});
};
