var http = require('http'),
	https = require('https'),
	exec = require('child_process').exec;

exports.getWeather = function (apiString, callback) {
        http.get('http://api.openweathermap.org/data/2.5/weather?q='+apiString+"&APPID=b04c500ac5e3a35e61b6e005ad286923",function(response) {
        response.setEncoding('utf8');
        var weather = {};
        response.on("data", function(data) {
            try {
				weather.type = JSON.parse(data).weather[0].main;
    	        weather.description = JSON.parse(data).weather[0].description;
        	    weather.temp = JSON.parse(data).main.temp;
			}
			catch(err) {
				weather.type = "";
				weather.description = "";
				weather.temp = "";
			}
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
					exec('mpc',function(err,stdout,stderr) {
						if(!err) {
							returnData.isPaused=/[\S\s]*\n\[paused\][\S\s]*\n[\S\s]*/.test(stdout);
							callback(returnData);
						}
					});
				}
				else {
					returnData.title = "error";
					returnData.isPaused=true
					callback(returnData);
				}
			});
		}
		else {
			returnData.artist= "Error";
			returnData.isPaused=true;
			switch (true) {
				case /\/bin\/(\w)+\: mpc\: command not found/.test(stderr) : returnData.title="mpc not found"; break;
				default: returnData.title=''; returnData.artist='No artist playing.'; break;
			}
			callback(returnData);
		}
	});
};

exports.getTubeStatus = function(callback) {
	var appId = "6910e8ea",
		appKey = "30a6be09a6da75c18e1a33d06c53fd22",
		apiUri = "https://api.tfl.gov.uk/Line/Mode/tube/Status?detail=false&app_id="+appId+"&app_key="+appKey;
	https.get(apiUri,function(response) {
		var returnData = [];
		var data = '';
		response.on("data",function(chunk) {
			data += chunk;
		});

		response.on("end",function(err) {
			JSON.parse(data).forEach(function(line) {
				var lineData = {};
				lineData.id = line.id;
				lineData.status = line.lineStatuses[0].statusSeverityDescription;
				returnData.push(lineData);
			});

			callback(returnData);
		});

		response.on("error",function(err) {
			callback([]);
		});
	});
}
