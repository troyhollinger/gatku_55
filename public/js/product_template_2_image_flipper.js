'use strict';

/**
 * This is code for Product Template 2 to flip images
 */
var currentImageId = 'template-2-big-image-1';
var intervalTime = 60000; // 60s
var myInterval;

$(document).ready(function() {
	var path = window.location.pathname;
	var regex = /\/product\//;

	//Only if path has /product/
	if (path.match(regex)) {
		if (images.length) {
			displayImages();
		}

		flipImages();
		intervalImageFlipping();
	}
});

var displayImages = function() {
	$.each(images, function(idx, val) {
		var imageElement = '<div class="template-2-big-image" id="' + val.id + '">\n' +
			'<img class="template-2-image-100-100" src="' + val.url + '">\n' +
			'</div>\n';
		var imageThumb = '<div class="template-2-small-image">\n' +
			'<img class="template-2-image-100-100"\n' +
			'   onmouseover="fadeInImageId(\'' + val.id + '\')"\n' +
			'   src="' + val.url + '">\n';

		$('.template-2-big-div').append(imageElement);
		$('.tamplate-2-small-images-wrapper').append(imageThumb);
	});
};

var removeMFadeOut = function(fadeOutId) {
	setTimeout(function(){
		$('#'+fadeOutId).removeClass("m-fadeOut");
	}, 1000); //this have to be the same like in style.css file and definition for .m-fadeOut
};

var fadeInImageId = function(id){
	//set interval flipping
	clearInterval(myInterval);
	intervalImageFlipping();

	//add and remove class to fadeIn and fadeOut
	$('#'+currentImageId).addClass("m-fadeOut");
	$('#'+currentImageId).removeClass("m-fadeIn");

	//fade in class for element with id
	$('#'+id).addClass("m-fadeIn");

	removeMFadeOut(currentImageId);
	//assign current image id to global variable
	currentImageId = id;
};

var flipImages = function() {
	fadeInImageId('template-2-big-image-1');
	setTimeout(function () {
			fadeInImageId('template-2-big-image-2');
		},
		5000);
	setTimeout(function () {
		fadeInImageId('template-2-big-image-3');
	}, 10000);
	setTimeout(function () {
		fadeInImageId('template-2-big-image-1');
	}, 15000);
};

var intervalImageFlipping = function() {
	myInterval = setInterval(function() {
		flipImages();
	}, intervalTime);
};

//  Product Template 2 to flip images - end

