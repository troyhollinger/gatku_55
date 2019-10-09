'use strict';

/**
 * This is code for Product Template 2 to flip images
 */
var currentImageId = 'template-2-big-image-1';
var intervalTime = 60000; // 60s
var myInterval;
var index = 0;

$(document).ready(function() {
	var path = window.location.pathname;
	var regex = /\/product\//;

	//Only if path has /product/
	if (path.match(regex)) {
		if (images.length) {
			displayImages();

			flipImages();
			intervalImageFlipping();
		}
	}
});

var displayImages = function() {
	$.each(images, function(idx, val) {

		//Big images
		var imageElement = '<div class="template-2-big-image" id="' + val.id + '">\n' +
			'<img class="template-2-image-100-100" src="' + val.url + '">\n' +
			'</div>\n';
		$('.template-2-big-div').append(imageElement);

		//Thumb images
		var thumbImageId = getThumbImageId(val.key);
		var imageThumb = '<div id="' + thumbImageId + '" class="template-2-small-image">\n' +
			'<img class="template-2-image-100-100"\n' +
			'   onmouseover="fadeInImageId(\'' + val.id + '\')"\n' +
			'   src="' + val.url + '">\n';

		$('.tamplate-2-small-images-wrapper').append(imageThumb);
	});

	displayHideThumbImage();
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
	$.each(images, function(idx, value) {
		var timeInSec = value.key * 5000;
		setTimeout(function () {
				fadeInImageId(value.id);
			},
			timeInSec);
	});
};

var intervalImageFlipping = function() {
	myInterval = setInterval(function() {
		flipImages();
	}, intervalTime);
};

var displayHideThumbImage = function() {
	$.each(images, function(idx, val) {
		var thumbImageId =  getThumbImageId(val.key);
		if (val.key >= index && val.key <= (index + 2)) {
			$('#' + thumbImageId).show();
		} else {
			$('#' + thumbImageId).hide();
		}
	});
};

var moveLeft = function() {
	if (index > 0) {
		index--;
	}

	if (images[index]) {
		displayHideThumbImage()
	}
};

var moveRight = function() {
	if (index < (images.length - 3)) {
		index++;
	}

	if (images[index]) {
		displayHideThumbImage()
	}
};

var getThumbImageId = function(key) {
	return 'thumb-image-' + key;
};

//  Product Template 2 to flip images - end

