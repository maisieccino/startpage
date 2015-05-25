$('.section').click(function () {
	$(this).find("ul").toggleClass("hideLinks");
	$('.section').not(this).find("ul").addClass("hideLinks");
});

$(document).keyup(function (event) {
	if (!$(event.target).is("input:focus")) {
		if (event.which >= 65 && event.which <= 90) {
			$('.section[data-letter="'+String.fromCharCode(event.which)+'"]').click();
		}
		else if (event.which == 49) {
			$('.searchbox').focus();
		}
	}
	else {
		if (event.which==27) {
			$('.searchbox').blur();
		}
	}
});

$(document).load(function() {
	if (getHours()<12) {
		$('.dateTime').html('Good morning! ');
	}
	else $('.dateTime').html('Good afternoon! ');
});
