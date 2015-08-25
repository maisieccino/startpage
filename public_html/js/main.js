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
	var weatherUnit = "kelvin";

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
		$('#weatherLoc').html(data.weather.location);
		weatherUnit = data.weather.unit;
	});

	var ws = io();

	ws.on("data", function(data) {
		console.log("data get!");
		switch (weatherUnit) {
			case "kelvin": $('#weatherTemp').html(data.weather.temp + " &#176;K"); break;
			case "celcius": $('#weatherTemp').html(Math.round(data.weather.temp-273.15)+ " &#176;C"); break;
		}
		$('#weatherType').html(data.weather.type);
	});	
});


