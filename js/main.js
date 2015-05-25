$('.section').click(function () {
	$(this).find("ul").toggleClass("hideLinks");
	$('.section').not(this).find("ul").addClass("hideLinks");
});
