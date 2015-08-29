$('body').on("click","div.section",function () {
	$(this).find("ul").toggleClass("hideLinks");
	$('.section').not(this).find("ul").addClass("hideLinks");
	if($(this).find("ul").hasClass("hideLinks")) {
		currentPaneOpen = "";
	}
	else {
		currentPaneOpen = $(this).attr("data-letter");
	}
});

var currentPaneOpen = "";

$(document).keyup(function (event) {
	if (!$(event.target).is("input:focus")) {
		if (event.which >= 65 && event.which <= 90) {
			$('.section[data-letter="'+String.fromCharCode(event.which)+'"]').click();
		}
		else if (event.which == 220) {
			$('.searchbox').focus();
		}
		else if (event.which >= 49 && event.which <= 57) {
			window.location.href = $('.section[data-letter="'+currentPaneOpen+'"] ul li:nth-child('+(event.which-48)+') a').attr("href");
		}
		else if (event.which == 48) {
			window.location.href = $('.section[data-letter="'+currentPaneOpen+'"] ul li:nth-child(10) a').attr("href");
		}
	}
	else {
		if (event.which==27) {
			$('.searchbox').blur();
		}

		if (event.which==13) {
			window.location.href="https://duckduckgo.com/?q="+$('.searchbox').val();
		}
	}
});

$(document).ready(function() {
	$.getScript("/socket.io/socket.io.js");
	
	var d = new Date();
	var config = {}; 

	if (d.getHours()<12) {
		$('.dateTime').html('Good morning! ');
	}
	else $('.dateTime').html('Good afternoon! ');

	$.getJSON('http://localhost:3000/config',function(data) {
		//link blocks
		data.linkblocks.forEach(function(linkblock) {
			var foo = $("<div class='section' data-letter='"+linkblock.letter+"'><div class='block'><h1>"+linkblock.letter+"</h1><h2>"+linkblock.label+"</h2></div><ul class='hideLinks'></ul></div>").appendTo("body");

				linkblock.links.forEach(function(link) {
				$(foo).find("ul").append("<li><a href='"+link.href+"'>"+link.name+"</a></li>");
			});
		})
		//Weather
		$('#weather').toggleClass('hidden',!data.weather.show);
		if(data.weather.show) {
			$('#weatherLoc').html(data.weather.location);
			$('#weatherTemp').html("Loading...");
			config = data;
		}

		//Music
		if(data.music!=null)
			$('#music').toggleClass('hidden',!data.music.show);
		
		if(data.tube!=null)
			$('#tube').toggleClass('hidden',!data.tube.show);
	});

	var ws = io();

	ws.on("data", function(data) {
		console.log("data get!");
		if(config.weather!=null && config.weather.show && data.weather!=null) {
			switch (config.weather.unit) {
				case "kelvin": $('#weatherTemp').html(data.weather.temp + " &#176;K"); break;
				case "celcius": $('#weatherTemp').html(Math.round(data.weather.temp-273.15)+ " &#176;C"); break;
				case "fahrenheit": $('#weatherTemp').html(Math.round(((data.weather.temp-273.15)*(9/5))+32)+ " &#176;F"); break;
				default: $('#weatherTemp').html(data.weather.temp + " &#176;K"); break;
			}
			$('#weatherType').html(data.weather.type);
		}

		if(config.music != null && config.music.show && data.music!=null) {
			$('#musicArtist').html(data.music.artist);
			$('#musicTitle').html(data.music.title);
			if(data.music.isPaused) {
				$('#btnMusicToggle i').removeClass('fa-pause');
				$('#btnMusicToggle i').addClass('fa-play');
			} else {
				$('#btnMusicToggle i').removeClass('fa-play');
				$('#btnMusicToggle i').addClass('fa-pause');
			}

			//$('#btnMusicToggle i').toggleClass('fa-pause',data.music.isPaused);
			//$('#btnMusictoggle i').toggleClass('fa-play',!data.music.isPaused);
		}

		if(config.tube != null && config.tube.show && data.tube!=null) {
			$('#tube > .block > h3').html('Tube Status ('+data.tube.time+'): ');
			data.tube.lines.forEach(function(line) {
				$('#'+line.id+' h3').html(line.status);
			});
		}
	});

	$('#btnMusicToggle').click(function() {
		ws.emit('command','musicToggle');
	});

	$('#btnMusicNext').click(function() {
		ws.emit('command','musicNext');
	});

	$('#btnMusicPrev').click(function() {
		ws.emit('command','musicPrev');
	});
});

