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
};

var Mast = {
	init: function() {
        Mast.element = jQuery(".mast");	//this works
        requestAnimationFrame(Mast.track);
	},
	element: $(".mast"), //Make = assignment in init function this style is not working
	track: function() {
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
};

var MobileMast = {
	init: function() {
        MobileMast.element = $(".mobile-mast"); //this works
		requestAnimationFrame(MobileMast.track);
	},
	element: $(".mobile-mast"), //Make = assignment in init function this style is not working
	track: function() {
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
};

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
};

var PurchaseColumn = {
	init: function() {
        PurchaseColumn.element = $(".product-column-right");
		if ($(window).width() > 1300) {
			this.parent = this.element.parent();
			this.parentHeight = this.parent.height();
			this.initialOffsetTop = this.element.initialOffsetTop;
			this.elementHeight = this.element.height();

			requestAnimationFrame(PurchaseColumn.stick);			
		}
	},
	element: $(".product-column-right"),
	parent: null,
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
	init: function() {

        PoleScroll.element = $(".scroller");
		var _ = this;

		_.scrollPosition();

		setTimeout(function() {
			_.scrollPosition();
		}, 1000);
	},
	element: $(".scroller"),
	scrollPosition: function() {
		var scroller = $(".scroller");
		var windowWidth = $(window).width();

		if (layoutType === 'head' || slug === 'bands' || slug === 'cable-w-tip' || slug === 'cable' || layoutType === 'shafts') {
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

	scrollAcross : function(definedScrollSpeed) {
		var scroller = $(".scroller");
		var width = $(".scroller-image").width();
		var left = scroller.scrollLeft();
		var defaultScrollSpeed = 2500;
		var scrollSpeed = definedScrollSpeed || defaultScrollSpeed;

		if (left < width / 2) {
			scroller.stop().animate({ scrollLeft: width }, scrollSpeed);
		} else {
			scroller.stop().animate({ scrollLeft: 0 }, scrollSpeed);
		}
	},

	center : function() {
		var scroller = $(".scroller");		
		scroller.scrollLeft($(".scroller-image").width() - 5300);
	},

    displayScrollWaterMark : function() {
		var displayWaterMark = true;

        var windowWidth = $(window).width();
        var imageSize = $(".scroller-image").width();

        if (imageSize < windowWidth) {
            displayWaterMark = false;
		}

		return displayWaterMark;
	}
};

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

};

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

//We need this list for XPSipper
var isoCountries = {
		"AF": "Afghanistan",
		"AL": "Albania",
		"DZ": "Algeria",
		"AS": "American Samoa",
		"AD": "Andorra",
		"AO": "Angola",
		"AI": "Anguilla",
		"AQ": "Antarctica",
		"AG": "Antigua and Barbuda",
		"AR": "Argentina",
		"AM": "Armenia",
		"AW": "Aruba",
		"AU": "Australia",
		"AT": "Austria",
		"AZ": "Azerbaijan",
		"BS": "Bahamas",
		"BH": "Bahrain",
		"BD": "Bangladesh",
		"BB": "Barbados",
		"BY": "Belarus",
		"BE": "Belgium",
		"BZ": "Belize",
		"BJ": "Benin",
		"BM": "Bermuda",
		"BT": "Bhutan",
		"BO": "Bolivia",
		"BA": "Bosnia and Herzegovina",
		"BW": "Botswana",
		"BV": "Bouvet Island",
		"BR": "Brazil",
		"IO": "British Indian Ocean Territory",
		"BN": "Brunei Darussalam",
		"BG": "Bulgaria",
		"BF": "Burkina Faso",
		"BI": "Burundi",
		"KH": "Cambodia",
		"CM": "Cameroon",
		"CA": "Canada",
		"CV": "Cape Verde",
		"KY": "Cayman Islands",
		"CF": "Central African Republic",
		"TD": "Chad",
		"CL": "Chile",
		"CN": "China",
		"CX": "Christmas Island",
		"CC": "Cocos (Keeling) Islands",
		"CO": "Colombia",
		"KM": "Comoros",
		"CG": "Congo",
		"CD": "Congo, the Democratic Republic of the",
		"CK": "Cook Islands",
		"CR": "Costa Rica",
		"CI": "Cote D'Ivoire",
		"HR": "Croatia",
		"CU": "Cuba",
		"CY": "Cyprus",
		"CZ": "Czech Republic",
		"DK": "Denmark",
		"DJ": "Djibouti",
		"DM": "Dominica",
		"DO": "Dominican Republic",
		"EC": "Ecuador",
		"EG": "Egypt",
		"SV": "El Salvador",
		"GQ": "Equatorial Guinea",
		"ER": "Eritrea",
		"EE": "Estonia",
		"ET": "Ethiopia",
		"FK": "Falkland Islands (Malvinas)",
		"FO": "Faroe Islands",
		"FJ": "Fiji",
		"FI": "Finland",
		"FR": "France",
		"GF": "French Guiana",
		"PF": "French Polynesia",
		"TF": "French Southern Territories",
		"GA": "Gabon",
		"GM": "Gambia",
		"GE": "Georgia",
		"DE": "Germany",
		"GH": "Ghana",
		"GI": "Gibraltar",
		"GR": "Greece",
		"GL": "Greenland",
		"GD": "Grenada",
		"GP": "Guadeloupe",
		"GU": "Guam",
		"GT": "Guatemala",
		"GN": "Guinea",
		"GW": "Guinea-Bissau",
		"GY": "Guyana",
		"HT": "Haiti",
		"HM": "Heard Island and Mcdonald Islands",
		"VA": "Holy See (Vatican City State)",
		"HN": "Honduras",
		"HK": "Hong Kong",
		"HU": "Hungary",
		"IS": "Iceland",
		"IN": "India",
		"ID": "Indonesia",
		"IR": "Iran, Islamic Republic of",
		"IQ": "Iraq",
		"IE": "Ireland",
		"IL": "Israel",
		"IT": "Italy",
		"JM": "Jamaica",
		"JP": "Japan",
		"JO": "Jordan",
		"KZ": "Kazakhstan",
		"KE": "Kenya",
		"KI": "Kiribati",
		"KP": "North Korea",
		"KR": "South Korea",
		"KW": "Kuwait",
		"KG": "Kyrgyzstan",
		"LA": "Lao People's Democratic Republic",
		"LV": "Latvia",
		"LB": "Lebanon",
		"LS": "Lesotho",
		"LR": "Liberia",
		"LY": "Libya",
		"LI": "Liechtenstein",
		"LT": "Lithuania",
		"LU": "Luxembourg",
		"MO": "Macao",
		"MG": "Madagascar",
		"MW": "Malawi",
		"MY": "Malaysia",
		"MV": "Maldives",
		"ML": "Mali",
		"MT": "Malta",
		"MH": "Marshall Islands",
		"MQ": "Martinique",
		"MR": "Mauritania",
		"MU": "Mauritius",
		"YT": "Mayotte",
		"MX": "Mexico",
		"FM": "Micronesia, Federated States of",
		"MD": "Moldova, Republic of",
		"MC": "Monaco",
		"MN": "Mongolia",
		"MS": "Montserrat",
		"MA": "Morocco",
		"MZ": "Mozambique",
		"MM": "Myanmar",
		"NA": "Namibia",
		"NR": "Nauru",
		"NP": "Nepal",
		"NL": "Netherlands",
		"NC": "New Caledonia",
		"NZ": "New Zealand",
		"NI": "Nicaragua",
		"NE": "Niger",
		"NG": "Nigeria",
		"NU": "Niue",
		"NF": "Norfolk Island",
		"MK": "North Macedonia, Republic of",
		"MP": "Northern Mariana Islands",
		"NO": "Norway",
		"OM": "Oman",
		"PK": "Pakistan",
		"PW": "Palau",
		"PS": "Palestinian Territory, Occupied",
		"PA": "Panama",
		"PG": "Papua New Guinea",
		"PY": "Paraguay",
		"PE": "Peru",
		"PH": "Philippines",
		"PN": "Pitcairn",
		"PL": "Poland",
		"PT": "Portugal",
		"PR": "Puerto Rico",
		"QA": "Qatar",
		"RE": "Reunion",
		"RO": "Romania",
		"RU": "Russian Federation",
		"RW": "Rwanda",
		"SH": "Saint Helena",
		"KN": "Saint Kitts and Nevis",
		"LC": "Saint Lucia",
		"PM": "Saint Pierre and Miquelon",
		"VC": "Saint Vincent and the Grenadines",
		"WS": "Samoa",
		"SM": "San Marino",
		"ST": "Sao Tome and Principe",
		"SA": "Saudi Arabia",
		"SN": "Senegal",
		"SC": "Seychelles",
		"SL": "Sierra Leone",
		"SG": "Singapore",
		"SK": "Slovakia",
		"SI": "Slovenia",
		"SB": "Solomon Islands",
		"SO": "Somalia",
		"ZA": "South Africa",
		"GS": "South Georgia and the South Sandwich Islands",
		"ES": "Spain",
		"LK": "Sri Lanka",
		"SD": "Sudan",
		"SR": "Suriname",
		"SJ": "Svalbard and Jan Mayen",
		"SZ": "Swaziland",
		"SE": "Sweden",
		"CH": "Switzerland",
		"SY": "Syrian Arab Republic",
		"TW": "Taiwan",
		"TJ": "Tajikistan",
		"TZ": "Tanzania, United Republic of",
		"TH": "Thailand",
		"TL": "Timor-Leste",
		"TG": "Togo",
		"TK": "Tokelau",
		"TO": "Tonga",
		"TT": "Trinidad and Tobago",
		"TN": "Tunisia",
		"TR": "Turkey",
		"TM": "Turkmenistan",
		"TC": "Turks and Caicos Islands",
		"TV": "Tuvalu",
		"UG": "Uganda",
		"UA": "Ukraine",
		"AE": "United Arab Emirates",
		"GB": "United Kingdom",
		"US": "United States of America",
		"UM": "United States Minor Outlying Islands",
		"UY": "Uruguay",
		"UZ": "Uzbekistan",
		"VU": "Vanuatu",
		"VE": "Venezuela",
		"VN": "Viet Nam",
		"VG": "Virgin Islands, British",
		"VI": "Virgin Islands, U.S.",
		"WF": "Wallis and Futuna",
		"EH": "Western Sahara",
		"YE": "Yemen",
		"ZM": "Zambia",
		"ZW": "Zimbabwe",
		"AX": "Åland Islands",
		"BQ": "Bonaire, Sint Eustatius and Saba",
		"CW": "Curaçao",
		"GG": "Guernsey",
		"IM": "Isle of Man",
		"JE": "Jersey",
		"ME": "Montenegro",
		"BL": "Saint Barthélemy",
		"MF": "Saint Martin (French part)",
		"RS": "Serbia",
		"SX": "Sint Maarten (Dutch part)",
		"SS": "South Sudan",
		"XK": "Kosovo"
};

