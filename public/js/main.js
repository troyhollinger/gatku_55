'use strict';


(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

var BlurbSlider = {
	init : function() {
		$(".slideshow").skippr({
			autoPlay : true,
			autoPlayDuration : 4000,
			navType : 'bubble'
		});
	}
}

var Mast = {
	init : function() {
		requestAnimationFrame(Mast.track);
	},
	element : $(".mast"),
	track : function() {
		var distance = $(document).scrollTop();
		var height = Mast.element.height();
		var windowHeight = $(window).height();

		if (distance > (windowHeight - height)) {
			Mast.element.addClass('below-fold');
		} else {
			Mast.element.removeClass('below-fold');
		}
		requestAnimationFrame(Mast.track);
	}
}

var MobileMast = {
	init : function() {
		requestAnimationFrame(MobileMast.track);
	},
	element : $(".mobile-mast"),
	track : function() {
		var distance = $(document).scrollTop();
		var height = MobileMast.element.height();
		var windowHeight = $(window).height();

		if (distance < (windowHeight - height)) {
			MobileMast.element.addClass('above-fold');
		} else {
			MobileMast.element.removeClass('above-fold');
		}
		requestAnimationFrame(MobileMast.track);
	}
}

var Squares = {
	init : function() {
		Squares.squarify();
		setTimeout(function(){ Squares.init() }, 100);
	},
	squarify : function(){
		var squares = $(".square");

		squares.each(function() {
			var width = $(this).width();
			$(this).height(width);
		});
		squares = null;
	}
}

var PurchaseColumn = {
	init : function() {
		if ($(window).width() > 1300) {
			this.parent = this.element.parent();
			this.parentHeight = this.parent.height();
			this.initialOffsetTop = this.element.offset().top;
			this.elementHeight = this.element.height();

			requestAnimationFrame(PurchaseColumn.stick);			
		}
	},
	element : $(".product-column-right"),
	parent : null,
	parentHeight : null,
	initialOffsetTop : 0,
	elementHeight : null,
	stick : function() {
		var distance = $(document).scrollTop();
		var offset = PurchaseColumn.initialOffsetTop;
		var height = PurchaseColumn.elementHeight;
		var parentHeight = PurchaseColumn.parentHeight;
		var amount = (distance - offset) + 70;

		if (distance > offset - 70 && distance < ((offset - 70) + (parentHeight - height)) ) {
			PurchaseColumn.element.css('top', amount + 'px');
		} else if (distance >= ((offset - 70) + (parentHeight - height)) ) {
			PurchaseColumn.element.css('top', (parentHeight - height) + 'px');
		} else {
			PurchaseColumn.element.css('top', '0px');
		}

		requestAnimationFrame(PurchaseColumn.stick);
	}
}

var PoleScroll = {
	init : function() {
		var _ = this;

		_.scrollPosition();

		setTimeout(function() {
			_.scrollPosition();
		}, 1000);
	},
	element : $(".scroller"),
	scrollPosition : function() {
		var scroller = $(".scroller");
		var windowWidth = $(window).width();

		if (layoutType === 'head' || slug === 'bands' || slug === 'cable-w-tip' || slug === 'cable') {
			if (windowWidth < 1000) {
				scroller.scrollLeft($(".scroller-image.visible").width() - 600);
			} else {
				scroller.scrollLeft($(".scroller-image.visible").width());
			}
		} else if(layoutType === 'shrinker') {	
			if (windowWidth > 1100) {
				scroller.scrollLeft($(".scroller-image").width() - 2900);			
			} else if (windowWidth < 1100 && windowWidth > 500) {
				scroller.scrollLeft($(".scroller-image").width() - 2450);			
			} else if(windowWidth <= 500) {
				scroller.scrollLeft($(".scroller-image").width() - 1780);			
			}
		} else if(typeof slug != 'undefined' && slug === 'offshore-striker') {	
			if (windowWidth > 1100) {
				scroller.scrollLeft($(".scroller-image").width() - 2500);			
			} else if (windowWidth < 1100 && windowWidth > 500) {
				scroller.scrollLeft($(".scroller-image").width() - 2250);			
			} else if(windowWidth <= 500) {
				scroller.scrollLeft($(".scroller-image").width() - 1580);			
			}
		} else if(typeof slug != 'undefined' && slug === 'g-string' || slug === 'black g-string') {
			scroller.scrollLeft($(".scroller-image").width() - 5300);
		}

		scroller = null;

	},

	scrollAcross : function() {
		var scroller = $(".scroller");
		var width = $(".scroller-image").width();
		var left = scroller.scrollLeft();

		if (left < width / 2) {

			scroller.stop().animate({ scrollLeft: width }, 2500);

		} else {

			scroller.stop().animate({ scrollLeft: 0 }, 2500);

		}


	},

	center : function() {

		var scroller = $(".scroller");		
		scroller.scrollLeft($(".scroller-image").width() - 5300);

	}

}

var ApparelRotator = {

	init : function(slug) {

		var images;

		if (slug === 'niner-tshirt') {

			images = this.photos.niner;

		} else if (slug === 'superhero-tshirt') {

			images = this.photos.superhero;

		} else if (slug === 'comfort-hoody') {

			images = this.photos.comfort;

		}

		$(".apparel-container").rollerblade({

			imageArray : images

		});

	},

	photos : {

		niner : [
			CONFIG.base + '/img/apparel/niner/niner-1.jpg',
			CONFIG.base + '/img/apparel/niner/niner-2.jpg',
			CONFIG.base + '/img/apparel/niner/niner-3.jpg',
			CONFIG.base + '/img/apparel/niner/niner-4.jpg',
			CONFIG.base + '/img/apparel/niner/niner-5.jpg',
			CONFIG.base + '/img/apparel/niner/niner-6.jpg',
			CONFIG.base + '/img/apparel/niner/niner-7.jpg',
			CONFIG.base + '/img/apparel/niner/niner-8.jpg'
			
		],
		superhero : [
			CONFIG.base + '/img/apparel/superhero/superhero-1.jpg',
			CONFIG.base + '/img/apparel/superhero/superhero-2.jpg',
			CONFIG.base + '/img/apparel/superhero/superhero-3.jpg',
			CONFIG.base + '/img/apparel/superhero/superhero-4.jpg',
			CONFIG.base + '/img/apparel/superhero/superhero-5.jpg',
			CONFIG.base + '/img/apparel/superhero/superhero-6.jpg',
			CONFIG.base + '/img/apparel/superhero/superhero-7.jpg',
			CONFIG.base + '/img/apparel/superhero/superhero-8.jpg'
		],
		comfort : [
			CONFIG.base + '/img/apparel/comfort/comfort-1.jpg',
			CONFIG.base + '/img/apparel/comfort/comfort-2.jpg',
			CONFIG.base + '/img/apparel/comfort/comfort-3.jpg',
			CONFIG.base + '/img/apparel/comfort/comfort-4.jpg',
			CONFIG.base + '/img/apparel/comfort/comfort-5.jpg',
			CONFIG.base + '/img/apparel/comfort/comfort-6.jpg',
			CONFIG.base + '/img/apparel/comfort/comfort-7.jpg',
			CONFIG.base + '/img/apparel/comfort/comfort-8.jpg'
		]
		
		

	}

}

var Grid = {

    init : function() {

        this.squarify();
        this.rectanglify();
        
    },

    squarify : function() {

        $(".media-square").each(function(){

            var width = $(this).width();

            $(this).height(width);

        }); 

    },

    rectanglify : function() {

        $(".media-rectangle").each(function() {

            var width = $(this).width();

            $(this).height(width * 1.5);

        });

    }

}


$(document).ready(function() {

	Squares.init();

	if (currentRoute === 'media') {

		Grid.init();

	}

	if (currentRoute === 'home' || currentRoute === 'australia') {

		Mast.init();
		MobileMast.init();
		// You.init();
		BlurbSlider.init();

	}

	if (currentRoute === 'product.show') {

		PurchaseColumn.init();

	}

	if (layoutType === 'apparel' && slug !== null) {

		ApparelRotator.init(slug);

	}

	// Smooth scrolling to anchor tag
	$('a[href*=#]:not([href=#])').on('click', function() {

	    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {

			var target = $(this.hash);

			target = target.length ? target : $('[name=' + this.hash.slice(1) +']');

			if (target.length) {

				$('html,body').animate({ scrollTop: target.offset().top }, 400);

	        	return false;

			}

	    }

	});

});


var Inputs = {

	blur : function() {

		$("input").each(function() {

			$(this).blur();

		});

	}

}
$(document).ready(function() {
	$homeUrl = window.location.href.split('/#/');
	if($homeUrl[1] === 'store'){
		$('a[href="#store"]').click();
	}
	if($homeUrl[1] === 'contact'){
		$('a[href="#contact"]').click();
	}
	setTimeout(function(){
   		$("a.grouped_elements").fancyboxPlus();
	}, 500);
   

 });

$(window).resize(function() {

	Squares.init();

	if (currentRoute === 'media') {

		Grid.init();

	}

});
