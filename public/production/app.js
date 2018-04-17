
(function () {    

    var Skippr = (function () {

        function Skippr(element, options) {

        	var _ = this,
                timer;
            
            _.settings = $.extend($.fn.skippr.defaults, options);
            _.$element = $(element);
            _.$parent = _.$element.parent();
            _.$photos = _.$element.children();
			_.count = _.$photos.length;
            _.countString = String(_.count);
            _.touchOnThis = false;
            _.previousTouchX = null;
            _.swipeDirection = null;
			_.init();
    
        }

        Skippr.prototype.init = function() {

        	var _ = this;

        	_.setup();
        	_.navClick();
            _.arrowClick();
            _.resize();
            _.keyPress();

            if(_.settings.autoPlay == true) {
                _.autoPlay();
                // _.autoPlayPause();
            }

            if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                _.touch();
            }


        }
        
        // Set event listeners for touch events.
        // 
        Skippr.prototype.touch = function() {

            var _ = this;

            _.$element.on('touchstart', function(ev) {

                var e = ev.originalEvent;
                var xcoord = e.pageX;

                // Record that this element is being touched.
                _.touchOnThis = true;
                // Record the current xcoord to be used as reference in
                // touchmove event listener.
                _.previousTouchX = xcoord;
            });

            _.$element.on('touchmove', function(ev) {

                var e = ev.originalEvent;
                var xcoord = e.pageX;

                if(_.touchOnThis) {
                    // e.preventDefault();

                    if(_.previousTouchX < xcoord) {
                        // swiping right to go backwards
                        _.swipeDirection = "backwards";

                    } else if(_.previousTouchX > xcoord) {
                        //swiping left to go forwards
                        _.swipeDirection = "forwards";

                    }

                }

            });

            _.$element.on('touchend', function() {

                _.touchOnThis = false;

                // Trigger arrow event listeners depending
                // on swipe direction.
                if(_.swipeDirection == "backwards") {

                    _.$element.find(".skippr-previous").trigger('click');
    
                } else if(_.swipeDirection == "forwards") {

                    _.$element.find(".skippr-next").trigger('click');
            
                }

                // Reset in order to prevent event listeners
                // from responding to taps.
                _.swipeDirection = null;

            }); 

        }

        Skippr.prototype.setup = function() {

        	var _ = this;
            
            // if img elements are being used,
            // create divs with background images to use
            // Skippr as normal.  
            if (_.settings.childrenElementType == 'img') {

                var makeDivs = [];

                for (i = 0; i < _.count; i++) {
                    var src = _.$photos.eq(i).attr('src'),
                        insert = '<div style="background-image: url(' + src + ')"></div>';

                    makeDivs.push(insert);
                }
                 makeDivs.join("");
                 _.$element.append(makeDivs);
                 _.$element.find('img').remove();
                 _.$photos = _.$element.children();

            }

            // if an array of image url's is being used
            // create divs with background images to use
            // Skippr as normal.
            if (_.settings.childrenElementType == 'array') {
                
                var imageArray = _.settings.imgArray;
                var makeDivs = [];

                for (i = 0; i < imageArray; i++) {
                    var src = imageArray[i];
                    var insert = '<div style="background-image: url(' + src + ')"></div>';

                    makeDivs.push(insert);
                }

                makeDivs.join("");
                _.$element.children().remove();
                _.$element.append(makeDivs);
                _.$photos = _.$element.children();

            }

            if (_.settings.transition == 'fade') {
                _.$photos.not(":first-child").hide();
            }

            if (_.settings.transition == 'slide') {
                _.setupSlider();

            }

        	_.$photos.eq(0).addClass('visible');
        	_.$element.addClass('skippr');

        	_.navBuild();

            if(_.settings.arrows == true) {
                _.arrowBuild();
            }

        };

        Skippr.prototype.resize = function() {

            var _ = this;

            if( _.settings.transition == 'slide') {
                
                $(window).resize(function() {
        
                    var currentItem = _.$element.find(".skippr-nav-element-active").attr('data-slider');

                    _.setupSlider();

                    _.$photos.each(function() {
                        var amountLeft = parseFloat($(this).css('left')),
                            parentWidth = _.$parent.width(),
                            moveAmount;

                        if( currentItem > 1 ) {
                            moveAmount = amountLeft - (parentWidth * (currentItem - 1));
                        }
                        $(this).css('left', moveAmount + 'px');
                    });

                    // Corrects autoPlay timer
                    if(_.settings.autoPlay === true ) {
                        clearInterval(timer);
                        _.autoPlay();
                    }    

                });
            }
        };

        Skippr.prototype.arrowBuild = function() {

            var _ = this,
                previous,
                next,
                startingPrevious = _.count, // what will be the first previous slide?
                previousStyles = '';

            var themeClass = '';

            if ( _.settings.hidePrevious === true ) {
                previousStyles = 'style="display:none;"'; 
            }

            if (_.settings.theme === 'dark') {

                themeClass = 'skippr-dark';

            }

            previous = '<nav class="skippr-nav-item skippr-arrow skippr-previous ' + themeClass + '" data-slider="' + startingPrevious + '" ' + previousStyles + '></nav>';
            next = '<nav class="skippr-nav-item skippr-arrow skippr-next  ' + themeClass + '" data-slider="2"></nav>';

            _.$element.append(previous + next);

        };

        Skippr.prototype.navBuild = function() {

        	var _ = this,
        		container,
        		navElements = [];

            if (_.settings.navType == "block") {
                var styleClass = "skippr-nav-element-block";
            } else if(_.settings.navType == "bubble") {
               var styleClass = "skippr-nav-element-bubble"; 
            }

        	for (var i = 0; i < _.count; i++) { 
        		//cycle through slideshow divs and display correct number of bubbles.
        		var insert;

        		if (i == 0) {
        			//check if first bubble, add respective active class.
        	 		insert = "<div class='skippr-nav-element skippr-nav-item " + styleClass + " skippr-nav-element-active' data-slider='" + (i + 1) + "'></div>";
        		} else {
        			insert = "<div class='skippr-nav-element skippr-nav-item " + styleClass + "' data-slider='" + (i + 1) + "'></div>";
        		}
        		//insert bubbles into an array.
        		navElements.push(insert); 
        	};
        	//join array elements into a single string.
        	navElements = navElements.join(""); 
        	// append html to bubbles container div.
        	container = '<nav class="skippr-nav-container">' + navElements + '</nav>';

        	_.$element.append(container);

        };

        Skippr.prototype.arrowClick = function() {
            
            var _ = this,
                $arrows = _.$element.find(".skippr-arrow");
            
            $arrows.click(function(){
               
                if ( !$(this).hasClass('disabled') ) {
                    _.change($(this));  
                }

                if(_.settings.autoPlay) {

                    _.resetTimer();

                }
                
            });



        };

        Skippr.prototype.navClick = function() {

        	var _ = this,
                $navs = _.$element.find('.skippr-nav-element');

        	$navs.click(function(){

                if ( !$(this).hasClass('disabled') ) {
                    _.change($(this));
                }

                if(_.settings.autoPlay) {

                    _.resetTimer();

                }
        	});

        };

        Skippr.prototype.change = function(element) {

            var _ = this,
                item = element.attr('data-slider'),
                allNavItems = _.$element.find(".skippr-nav-item"),
                currentItem = _.$element.find(".skippr-nav-element-active").attr('data-slider'),
                nextData = _.$element.find(".skippr-next").attr('data-slider'),
                previousData = _.$element.find(".skippr-previous").attr('data-slider');

            if(item != currentItem) { //prevents animation for repeat click.

                if (_.settings.transition == 'fade') {

                    _.$photos.eq(item - 1).css('z-index', '10').siblings('div').css('z-index', '9');
                    
                    _.$photos.eq(item - 1).fadeIn(_.settings.speed, function() {
                        _.$element.find(".visible").fadeOut('fast',function(){
                            $(this).removeClass('visible');
                            _.$photos.eq(item - 1).addClass('visible');
                        });
                    }); 
                }

                if (_.settings.transition == 'slide') {
                  
                    _.$photos.each(function(){

                        var amountLeft = parseFloat($(this).css('left')),
                            parentWidth = _.$parent.width(),
                            moveAmount;

                        if (item > currentItem) {
                            moveAmount = amountLeft - (parentWidth * (item - currentItem)); 
                        }

                        if (item < currentItem) {
                            moveAmount = amountLeft + (parentWidth * (currentItem - item));                           
                        }

                        allNavItems.addClass('disabled');
                        
                        $(this).velocity({'left': moveAmount + 'px'}, _.settings.speed, _.settings.easing, function(){

                            allNavItems.removeClass('disabled');

                        });

                        _.logs("slides sliding");

                    });
                }


                _.$element.find(".skippr-nav-element")
                          .eq(item - 1)
                          .addClass('skippr-nav-element-active')
                          .siblings()
                          .removeClass('skippr-nav-element-active');
                
                var nextDataAddString = Number(item) + 1,
                    previousDataAddString = Number(item) - 1;

                if ( item == _.count ){ 
                    _.$element.find(".skippr-next").attr('data-slider', '1' );
                } else {
                     _.$element.find(".skippr-next").attr('data-slider', nextDataAddString );
                }
                
                if (item == 1) {
                     _.$element.find(".skippr-previous").attr('data-slider', _.countString );
                }  else {
                    _.$element.find(".skippr-previous").attr('data-slider', previousDataAddString ); 
                }

                if( _.settings.arrows && _.settings.hidePrevious ) {
                    _.hidePrevious();
                }    
            }

        };

        Skippr.prototype.autoPlay = function() {

            var _ = this;

            timer = setInterval(function(){
                var activeElement =  _.$element.find(".skippr-nav-element-active"),
                    activeSlide = activeElement.attr('data-slider');

                if( activeSlide == _.count ) {
                  var elementToInsert =  _.$element.find(".skippr-nav-element").eq(0); 
                } else {
                    var elementToInsert = activeElement.next();
                }

                _.change(elementToInsert);
                    
            },_.settings.autoPlayDuration);

        };

        Skippr.prototype.resetTimer = function() {

            var _ = this;

            clearInterval(timer);
            _.autoPlay();

        }

        Skippr.prototype.autoPlayPause = function() {

            var _ = this;

            // Set up a few listeners to clear and reset the autoPlay timer.

            _.$parent.hover(function(){
                clearInterval(timer);

                _.logs("clearing timer on hover");

            }, function() {
                _.autoPlay();

                _.logs("resetting timer on un-hover");

            });

            // Checks if this tab is not being viewed, and pauses autoPlay timer if not. 
            $(window).on("blur focus", function(e) {

                var prevType = $(this).data("prevType");

                if (prevType != e.type) {   //  reduce double fire issues
                    switch (e.type) {
                        case "blur":
                            clearInterval(timer);
                            _.logs('clearing timer on window blur'); 
                            break;
                        case "focus":
                            _.autoPlay();
                            _.logs('resetting timer on window focus');
                            break;
                    }
                }

                $(this).data("prevType", e.type);
            });

        };

        Skippr.prototype.setupSlider = function() {

            var _ = this,
                parentWidth = _.$parent.width(),
                amountLeft;

            _.$photos.css('position', 'absolute');

            for (i = 0; i < _.count; i++) {

                amountLeft = parentWidth * i;
                _.$photos.eq(i).css('left', amountLeft);
            }


        }

        Skippr.prototype.keyPress = function() {

            var _ = this;

            if(_.settings.keyboardOnAlways == true) {

                $(document).on('keydown', function(e) {
                    if(e.which == 39) {
                         _.$element.find(".skippr-next").trigger('click');
                    }
                    if(e.which == 37) {
                         _.$element.find(".skippr-previous").trigger('click');
                    }

                });
            }

            if (_.settings.keyboardOnAlways == false) {

                _.$parent.hover(function(){

                    $(document).on('keydown', function(e) {
                        if(e.which == 39) {
                             _.$element.find(".skippr-next").trigger('click');
                        }
                        if(e.which == 37) {
                             _.$element.find(".skippr-previous").trigger('click');
                        }

                    });
                    
                }, function(){
                    $(document).off('keydown');
                });
            }
            
        }

        Skippr.prototype.hidePrevious = function() {

            var _ = this;

            if ( _.$element.find(".skippr-nav-element").eq(0).hasClass('skippr-nav-element-active')) {
                 _.$element.find(".skippr-previous").fadeOut();
            } else {
                 _.$element.find(".skippr-previous").fadeIn();
            }
        }

        Skippr.prototype.logs = function(message) {

            var _ = this;

            _.settings.logs === true && console.log(message);

        }



        return Skippr;

    })();

    $.fn.skippr = function (options) {

        var instance;

        instance = this.data('skippr');
        if (!instance) {
            return this.each(function () {
                return $(this).data('skippr', new Skippr(this,options));
            });
        }
        if (options === true) return instance;
        if ($.type(options) === 'string') instance[options]();
        return this;
    };

    $.fn.skippr.defaults = {
        transition: 'slide',
        speed: 1000,
        easing: 'easeOutQuart',
        navType: 'block',
        childrenElementType : 'div',
        arrows: true,
        autoPlay: false,
        autoPlayDuration: 5000,
        keyboardOnAlways: true,
        hidePrevious: false,
        imgArray : null,
        logs: false,
        theme : 'light'
       
    };

}).call(this);

/*!
* Velocity.js: Accelerated JavaScript animation.
* @version 0.11.2
* @docs http://VelocityJS.org
* @license Copyright 2014 Julian Shapiro. MIT License: http://en.wikipedia.org/wiki/MIT_License
*/
!function(e){"function"==typeof define&&define.amd?window.Velocity?define(e):define(["jquery"],e):e("object"==typeof exports?window.Velocity?void 0:require("jquery"):window.jQuery)}(function(e){return function(t,r,a,o){function i(e){for(var t=-1,r=e?e.length:0,a=[];++t<r;){var o=e[t];o&&a.push(o)}return a}function n(e){var t=$.data(e,p);return null===t?o:t}function s(e){return function(t){return Math.round(t*e)*(1/e)}}function l(e,t){var r=e;return y.isString(e)?v.Easings[e]||(r=!1):r=y.isArray(e)&&1===e.length?s.apply(null,e):y.isArray(e)&&2===e.length?x.apply(null,e.concat([t])):y.isArray(e)&&4===e.length?S.apply(null,e):!1,r===!1&&(r=v.Easings[v.defaults.easing]?v.defaults.easing:f),r}function u(e){if(e)for(var t=(new Date).getTime(),r=0,a=v.State.calls.length;a>r;r++)if(v.State.calls[r]){var i=v.State.calls[r],s=i[0],l=i[2],p=i[3];p||(p=v.State.calls[r][3]=t-16);for(var d=Math.min((t-p)/l.duration,1),f=0,g=s.length;g>f;f++){var m=s[f],S=m.element;if(n(S)){var x=!1;l.display&&"none"!==l.display&&b.setPropertyValue(S,"display",l.display),l.visibility&&"hidden"!==l.visibility&&b.setPropertyValue(S,"visibility",l.visibility);for(var V in m)if("element"!==V){var P=m[V],w,C=y.isString(P.easing)?v.Easings[P.easing]:P.easing;if(w=1===d?P.endValue:P.startValue+(P.endValue-P.startValue)*C(d),P.currentValue=w,b.Hooks.registered[V]){var T=b.Hooks.getRoot(V),k=n(S).rootPropertyValueCache[T];k&&(P.rootPropertyValue=k)}var E=b.setPropertyValue(S,V,P.currentValue+(0===parseFloat(w)?"":P.unitType),P.rootPropertyValue,P.scrollData);b.Hooks.registered[V]&&(n(S).rootPropertyValueCache[T]=b.Normalizations.registered[T]?b.Normalizations.registered[T]("extract",null,E[1]):E[1]),"transform"===E[0]&&(x=!0)}l.mobileHA&&n(S).transformCache.translate3d===o&&(n(S).transformCache.translate3d="(0px, 0px, 0px)",x=!0),x&&b.flushTransformCache(S)}}l.display&&"none"!==l.display&&(v.State.calls[r][2].display=!1),l.visibility&&"hidden"!==l.visibility&&(v.State.calls[r][2].visibility=!1),l.progress&&l.progress.call(i[1],i[1],d,Math.max(0,p+l.duration-t),p),1===d&&c(r)}v.State.isTicking&&(v.mock?u(!0):h(u))}function c(e,t){if(!v.State.calls[e])return!1;for(var r=v.State.calls[e][0],a=v.State.calls[e][1],i=v.State.calls[e][2],s=v.State.calls[e][4],l=!1,u=0,c=r.length;c>u;u++){var p=r[u].element;if(t||i.loop||("none"===i.display&&b.setPropertyValue(p,"display",i.display),"hidden"===i.visibility&&b.setPropertyValue(p,"visibility",i.visibility)),($.queue(p)[1]===o||!/\.velocityQueueEntryFlag/i.test($.queue(p)[1]))&&n(p)){n(p).isAnimating=!1,n(p).rootPropertyValueCache={};var d=!1;$.each(n(p).transformCache,function(e,t){var r=/^scale/.test(e)?1:0;new RegExp("^\\("+r+"[^.]").test(t)&&(d=!0,delete n(p).transformCache[e])}),i.mobileHA&&(d=!0,delete n(p).transformCache.translate3d),d&&b.flushTransformCache(p),b.Values.removeClass(p,"velocity-animating")}if(!t&&i.complete&&!i.loop&&u===c-1)try{i.complete.call(a,a)}catch(f){setTimeout(function(){throw f},1)}s&&i.loop!==!0&&s(a),i.loop!==!0||t||v.animate(p,"reverse",{loop:!0,delay:i.delay}),i.queue!==!1&&$.dequeue(p,i.queue)}v.State.calls[e]=!1;for(var g=0,m=v.State.calls.length;m>g;g++)if(v.State.calls[g]!==!1){l=!0;break}l===!1&&(v.State.isTicking=!1,delete v.State.calls,v.State.calls=[])}var p="velocity",d=400,f="swing",g=function(){if(a.documentMode)return a.documentMode;for(var e=7;e>4;e--){var t=a.createElement("div");if(t.innerHTML="<!--[if IE "+e+"]><span></span><![endif]-->",t.getElementsByTagName("span").length)return t=null,e}return o}(),m=function(){var e=0;return r.webkitRequestAnimationFrame||r.mozRequestAnimationFrame||function(t){var r=(new Date).getTime(),a;return a=Math.max(0,16-(r-e)),e=r+a,setTimeout(function(){t(r+a)},a)}}(),h=r.requestAnimationFrame||m,y={isString:function(e){return"string"==typeof e},isArray:Array.isArray||function(e){return"[object Array]"===Object.prototype.toString.call(e)},isFunction:function(e){return"[object Function]"===Object.prototype.toString.call(e)},isNode:function(e){return e&&e.nodeType},isNodeList:function(e){return"object"==typeof e&&/^\[object (HTMLCollection|NodeList|Object)\]$/.test(Object.prototype.toString.call(e))&&e.length!==o&&(0===e.length||"object"==typeof e[0]&&e[0].nodeType>0)},isWrapped:function(e){return e&&(e.jquery||r.Zepto&&r.Zepto.zepto.isZ(e))},isSVG:function(e){return r.SVGElement&&e instanceof SVGElement},isEmptyObject:function(e){var t;for(t in e)return!1;return!0}},$;if(e&&e.fn!==o?$=e:r.Velocity&&r.Velocity.Utilities&&($=r.Velocity.Utilities),!$)throw new Error("Velocity: Either jQuery or Velocity's jQuery shim must first be loaded.");if(t.Velocity!==o&&t.Velocity.Utilities==o)throw new Error("Velocity: Namespace is occupied.");if(7>=g){if(e)return void(e.fn.velocity=e.fn.animate);throw new Error("Velocity: For IE<=7, Velocity falls back to jQuery, which must first be loaded.")}if(8===g&&!e)throw new Error("Velocity: For IE8, Velocity requires jQuery proper to be loaded; Velocity's jQuery shim does not work with IE8.");var v={State:{isMobile:/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),isAndroid:/Android/i.test(navigator.userAgent),isGingerbread:/Android 2\.3\.[3-7]/i.test(navigator.userAgent),isChrome:r.chrome,isFirefox:/Firefox/i.test(navigator.userAgent),prefixElement:a.createElement("div"),prefixMatches:{},scrollAnchor:null,scrollPropertyLeft:null,scrollPropertyTop:null,isTicking:!1,calls:[]},CSS:{},Utilities:$,Sequences:{},Easings:{},Promise:r.Promise,defaults:{queue:"",duration:d,easing:f,begin:null,complete:null,progress:null,display:null,loop:!1,delay:!1,mobileHA:!0,_cacheValues:!0},init:function(e){$.data(e,p,{isSVG:y.isSVG(e),isAnimating:!1,computedStyle:null,tweensContainer:null,rootPropertyValueCache:{},transformCache:{}})},animate:function(){},hook:function(e,t,r){var a=o;return y.isWrapped(e)&&(e=[].slice.call(e)),$.each(y.isNode(e)?[e]:e,function(e,i){if(n(i)===o&&v.init(i),r===o)a===o&&(a=v.CSS.getPropertyValue(i,t));else{var s=v.CSS.setPropertyValue(i,t,r);"transform"===s[0]&&v.CSS.flushTransformCache(i),a=s}}),a},mock:!1,version:{major:0,minor:11,patch:2},debug:!1};r.pageYOffset!==o?(v.State.scrollAnchor=r,v.State.scrollPropertyLeft="pageXOffset",v.State.scrollPropertyTop="pageYOffset"):(v.State.scrollAnchor=a.documentElement||a.body.parentNode||a.body,v.State.scrollPropertyLeft="scrollLeft",v.State.scrollPropertyTop="scrollTop");var S=function(){function e(e,t){return 1-3*t+3*e}function t(e,t){return 3*t-6*e}function r(e){return 3*e}function a(a,o,i){return((e(o,i)*a+t(o,i))*a+r(o))*a}function o(a,o,i){return 3*e(o,i)*a*a+2*t(o,i)*a+r(o)}return function(e,t,r,i){function n(t){for(var i=t,n=0;8>n;++n){var s=o(i,e,r);if(0===s)return i;var l=a(i,e,r)-t;i-=l/s}return i}if(4!==arguments.length)return!1;for(var s=0;4>s;++s)if("number"!=typeof arguments[s]||isNaN(arguments[s])||!isFinite(arguments[s]))return!1;return e=Math.min(e,1),r=Math.min(r,1),e=Math.max(e,0),r=Math.max(r,0),function(o){return e===t&&r===i?o:a(n(o),t,i)}}}(),x=function(){function e(e){return-e.tension*e.x-e.friction*e.v}function t(t,r,a){var o={x:t.x+a.dx*r,v:t.v+a.dv*r,tension:t.tension,friction:t.friction};return{dx:o.v,dv:e(o)}}function r(r,a){var o={dx:r.v,dv:e(r)},i=t(r,.5*a,o),n=t(r,.5*a,i),s=t(r,a,n),l=1/6*(o.dx+2*(i.dx+n.dx)+s.dx),u=1/6*(o.dv+2*(i.dv+n.dv)+s.dv);return r.x=r.x+l*a,r.v=r.v+u*a,r}return function a(e,t,o){var i={x:-1,v:0,tension:null,friction:null},n=[0],s=0,l=1e-4,u=.016,c,p,d;for(e=parseFloat(e)||500,t=parseFloat(t)||20,o=o||null,i.tension=e,i.friction=t,c=null!==o,c?(s=a(e,t),p=s/o*u):p=u;;)if(d=r(d||i,p),n.push(1+d.x),s+=16,!(Math.abs(d.x)>l&&Math.abs(d.v)>l))break;return c?function(e){return n[e*(n.length-1)|0]}:s}}();!function(){v.Easings.linear=function(e){return e},v.Easings.swing=function(e){return.5-Math.cos(e*Math.PI)/2},v.Easings.spring=function(e){return 1-Math.cos(4.5*e*Math.PI)*Math.exp(6*-e)},v.Easings.ease=S(.25,.1,.25,1),v.Easings["ease-in"]=S(.42,0,1,1),v.Easings["ease-out"]=S(0,0,.58,1),v.Easings["ease-in-out"]=S(.42,0,.58,1);var e={};$.each(["Quad","Cubic","Quart","Quint","Expo"],function(t,r){e[r]=function(e){return Math.pow(e,t+2)}}),$.extend(e,{Sine:function(e){return 1-Math.cos(e*Math.PI/2)},Circ:function(e){return 1-Math.sqrt(1-e*e)},Elastic:function(e){return 0===e||1===e?e:-Math.pow(2,8*(e-1))*Math.sin((80*(e-1)-7.5)*Math.PI/15)},Back:function(e){return e*e*(3*e-2)},Bounce:function(e){for(var t,r=4;e<((t=Math.pow(2,--r))-1)/11;);return 1/Math.pow(4,3-r)-7.5625*Math.pow((3*t-2)/22-e,2)}}),$.each(e,function(e,t){v.Easings["easeIn"+e]=t,v.Easings["easeOut"+e]=function(e){return 1-t(1-e)},v.Easings["easeInOut"+e]=function(e){return.5>e?t(2*e)/2:1-t(-2*e+2)/2}})}();var b=v.CSS={RegEx:{isHex:/^#([A-f\d]{3}){1,2}$/i,valueUnwrap:/^[A-z]+\((.*)\)$/i,wrappedValueAlreadyExtracted:/[0-9.]+ [0-9.]+ [0-9.]+( [0-9.]+)?/,valueSplit:/([A-z]+\(.+\))|(([A-z0-9#-.]+?)(?=\s|$))/gi},Lists:{colors:["fill","stroke","stopColor","color","backgroundColor","borderColor","borderTopColor","borderRightColor","borderBottomColor","borderLeftColor","outlineColor"],transformsBase:["translateX","translateY","scale","scaleX","scaleY","skewX","skewY","rotateZ"],transforms3D:["transformPerspective","translateZ","scaleZ","rotateX","rotateY"]},Hooks:{templates:{textShadow:["Color X Y Blur","black 0px 0px 0px"],boxShadow:["Color X Y Blur Spread","black 0px 0px 0px 0px"],clip:["Top Right Bottom Left","0px 0px 0px 0px"],backgroundPosition:["X Y","0% 0%"],transformOrigin:["X Y Z","50% 50% 0px"],perspectiveOrigin:["X Y","50% 50%"]},registered:{},register:function(){for(var e=0;e<b.Lists.colors.length;e++)b.Hooks.templates[b.Lists.colors[e]]=["Red Green Blue Alpha","255 255 255 1"];var t,r,a;if(g)for(t in b.Hooks.templates){r=b.Hooks.templates[t],a=r[0].split(" ");var o=r[1].match(b.RegEx.valueSplit);"Color"===a[0]&&(a.push(a.shift()),o.push(o.shift()),b.Hooks.templates[t]=[a.join(" "),o.join(" ")])}for(t in b.Hooks.templates){r=b.Hooks.templates[t],a=r[0].split(" ");for(var e in a){var i=t+a[e],n=e;b.Hooks.registered[i]=[t,n]}}},getRoot:function(e){var t=b.Hooks.registered[e];return t?t[0]:e},cleanRootPropertyValue:function(e,t){return b.RegEx.valueUnwrap.test(t)&&(t=t.match(b.Hooks.RegEx.valueUnwrap)[1]),b.Values.isCSSNullValue(t)&&(t=b.Hooks.templates[e][1]),t},extractValue:function(e,t){var r=b.Hooks.registered[e];if(r){var a=r[0],o=r[1];return t=b.Hooks.cleanRootPropertyValue(a,t),t.toString().match(b.RegEx.valueSplit)[o]}return t},injectValue:function(e,t,r){var a=b.Hooks.registered[e];if(a){var o=a[0],i=a[1],n,s;return r=b.Hooks.cleanRootPropertyValue(o,r),n=r.toString().match(b.RegEx.valueSplit),n[i]=t,s=n.join(" ")}return r}},Normalizations:{registered:{clip:function(e,t,r){switch(e){case"name":return"clip";case"extract":var a;return b.RegEx.wrappedValueAlreadyExtracted.test(r)?a=r:(a=r.toString().match(b.RegEx.valueUnwrap),a=a?a[1].replace(/,(\s+)?/g," "):r),a;case"inject":return"rect("+r+")"}},opacity:function(e,t,r){if(8>=g)switch(e){case"name":return"filter";case"extract":var a=r.toString().match(/alpha\(opacity=(.*)\)/i);return r=a?a[1]/100:1;case"inject":return t.style.zoom=1,parseFloat(r)>=1?"":"alpha(opacity="+parseInt(100*parseFloat(r),10)+")"}else switch(e){case"name":return"opacity";case"extract":return r;case"inject":return r}}},register:function(){9>=g||v.State.isGingerbread||(b.Lists.transformsBase=b.Lists.transformsBase.concat(b.Lists.transforms3D));for(var e=0;e<b.Lists.transformsBase.length;e++)!function(){var t=b.Lists.transformsBase[e];b.Normalizations.registered[t]=function(e,r,a){switch(e){case"name":return"transform";case"extract":return n(r)===o||n(r).transformCache[t]===o?/^scale/i.test(t)?1:0:n(r).transformCache[t].replace(/[()]/g,"");case"inject":var i=!1;switch(t.substr(0,t.length-1)){case"translate":i=!/(%|px|em|rem|vw|vh|\d)$/i.test(a);break;case"scal":case"scale":v.State.isAndroid&&n(r).transformCache[t]===o&&1>a&&(a=1),i=!/(\d)$/i.test(a);break;case"skew":i=!/(deg|\d)$/i.test(a);break;case"rotate":i=!/(deg|\d)$/i.test(a)}return i||(n(r).transformCache[t]="("+a+")"),n(r).transformCache[t]}}}();for(var e=0;e<b.Lists.colors.length;e++)!function(){var t=b.Lists.colors[e];b.Normalizations.registered[t]=function(e,r,a){switch(e){case"name":return t;case"extract":var i;if(b.RegEx.wrappedValueAlreadyExtracted.test(a))i=a;else{var n,s={black:"rgb(0, 0, 0)",blue:"rgb(0, 0, 255)",gray:"rgb(128, 128, 128)",green:"rgb(0, 128, 0)",red:"rgb(255, 0, 0)",white:"rgb(255, 255, 255)"};/^[A-z]+$/i.test(a)?n=s[a]!==o?s[a]:s.black:b.RegEx.isHex.test(a)?n="rgb("+b.Values.hexToRgb(a).join(" ")+")":/^rgba?\(/i.test(a)||(n=s.black),i=(n||a).toString().match(b.RegEx.valueUnwrap)[1].replace(/,(\s+)?/g," ")}return 8>=g||3!==i.split(" ").length||(i+=" 1"),i;case"inject":return 8>=g?4===a.split(" ").length&&(a=a.split(/\s+/).slice(0,3).join(" ")):3===a.split(" ").length&&(a+=" 1"),(8>=g?"rgb":"rgba")+"("+a.replace(/\s+/g,",").replace(/\.(\d)+(?=,)/g,"")+")"}}}()}},Names:{camelCase:function(e){return e.replace(/-(\w)/g,function(e,t){return t.toUpperCase()})},SVGAttribute:function(e){var t="width|height|x|y|cx|cy|r|rx|ry|x1|x2|y1|y2";return(g||v.State.isAndroid&&!v.State.isChrome)&&(t+="|transform"),new RegExp("^("+t+")$","i").test(e)},prefixCheck:function(e){if(v.State.prefixMatches[e])return[v.State.prefixMatches[e],!0];for(var t=["","Webkit","Moz","ms","O"],r=0,a=t.length;a>r;r++){var o;if(o=0===r?e:t[r]+e.replace(/^\w/,function(e){return e.toUpperCase()}),y.isString(v.State.prefixElement.style[o]))return v.State.prefixMatches[e]=o,[o,!0]}return[e,!1]}},Values:{hexToRgb:function(e){var t=/^#?([a-f\d])([a-f\d])([a-f\d])$/i,r=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i,a;return e=e.replace(t,function(e,t,r,a){return t+t+r+r+a+a}),a=r.exec(e),a?[parseInt(a[1],16),parseInt(a[2],16),parseInt(a[3],16)]:[0,0,0]},isCSSNullValue:function(e){return 0==e||/^(none|auto|transparent|(rgba\(0, ?0, ?0, ?0\)))$/i.test(e)},getUnitType:function(e){return/^(rotate|skew)/i.test(e)?"deg":/(^(scale|scaleX|scaleY|scaleZ|alpha|flexGrow|flexHeight|zIndex|fontWeight)$)|((opacity|red|green|blue|alpha)$)/i.test(e)?"":"px"},getDisplayType:function(e){var t=e.tagName.toString().toLowerCase();return/^(b|big|i|small|tt|abbr|acronym|cite|code|dfn|em|kbd|strong|samp|var|a|bdo|br|img|map|object|q|script|span|sub|sup|button|input|label|select|textarea)$/i.test(t)?"inline":/^(li)$/i.test(t)?"list-item":/^(tr)$/i.test(t)?"table-row":"block"},addClass:function(e,t){e.classList?e.classList.add(t):e.className+=(e.className.length?" ":"")+t},removeClass:function(e,t){e.classList?e.classList.remove(t):e.className=e.className.toString().replace(new RegExp("(^|\\s)"+t.split(" ").join("|")+"(\\s|$)","gi")," ")}},getPropertyValue:function(e,t,a,i){function s(e,t){function a(){u&&b.setPropertyValue(e,"display","none")}var l=0;if(8>=g)l=$.css(e,t);else{var u=!1;if(/^(width|height)$/.test(t)&&0===b.getPropertyValue(e,"display")&&(u=!0,b.setPropertyValue(e,"display",b.Values.getDisplayType(e))),!i){if("height"===t&&"border-box"!==b.getPropertyValue(e,"boxSizing").toString().toLowerCase()){var c=e.offsetHeight-(parseFloat(b.getPropertyValue(e,"borderTopWidth"))||0)-(parseFloat(b.getPropertyValue(e,"borderBottomWidth"))||0)-(parseFloat(b.getPropertyValue(e,"paddingTop"))||0)-(parseFloat(b.getPropertyValue(e,"paddingBottom"))||0);return a(),c}if("width"===t&&"border-box"!==b.getPropertyValue(e,"boxSizing").toString().toLowerCase()){var p=e.offsetWidth-(parseFloat(b.getPropertyValue(e,"borderLeftWidth"))||0)-(parseFloat(b.getPropertyValue(e,"borderRightWidth"))||0)-(parseFloat(b.getPropertyValue(e,"paddingLeft"))||0)-(parseFloat(b.getPropertyValue(e,"paddingRight"))||0);return a(),p}}var d;d=n(e)===o?r.getComputedStyle(e,null):n(e).computedStyle?n(e).computedStyle:n(e).computedStyle=r.getComputedStyle(e,null),(g||v.State.isFirefox)&&"borderColor"===t&&(t="borderTopColor"),l=9===g&&"filter"===t?d.getPropertyValue(t):d[t],(""===l||null===l)&&(l=e.style[t]),a()}if("auto"===l&&/^(top|right|bottom|left)$/i.test(t)){var f=s(e,"position");("fixed"===f||"absolute"===f&&/top|left/i.test(t))&&(l=$(e).position()[t]+"px")}return l}var l;if(b.Hooks.registered[t]){var u=t,c=b.Hooks.getRoot(u);a===o&&(a=b.getPropertyValue(e,b.Names.prefixCheck(c)[0])),b.Normalizations.registered[c]&&(a=b.Normalizations.registered[c]("extract",e,a)),l=b.Hooks.extractValue(u,a)}else if(b.Normalizations.registered[t]){var p,d;p=b.Normalizations.registered[t]("name",e),"transform"!==p&&(d=s(e,b.Names.prefixCheck(p)[0]),b.Values.isCSSNullValue(d)&&b.Hooks.templates[t]&&(d=b.Hooks.templates[t][1])),l=b.Normalizations.registered[t]("extract",e,d)}return/^[\d-]/.test(l)||(l=n(e)&&n(e).isSVG&&b.Names.SVGAttribute(t)?/^(height|width)$/i.test(t)?e.getBBox()[t]:e.getAttribute(t):s(e,b.Names.prefixCheck(t)[0])),b.Values.isCSSNullValue(l)&&(l=0),v.debug>=2&&console.log("Get "+t+": "+l),l},setPropertyValue:function(e,t,a,o,i){var s=t;if("scroll"===t)i.container?i.container["scroll"+i.direction]=a:"Left"===i.direction?r.scrollTo(a,i.alternateValue):r.scrollTo(i.alternateValue,a);else if(b.Normalizations.registered[t]&&"transform"===b.Normalizations.registered[t]("name",e))b.Normalizations.registered[t]("inject",e,a),s="transform",a=n(e).transformCache[t];else{if(b.Hooks.registered[t]){var l=t,u=b.Hooks.getRoot(t);o=o||b.getPropertyValue(e,u),a=b.Hooks.injectValue(l,a,o),t=u}if(b.Normalizations.registered[t]&&(a=b.Normalizations.registered[t]("inject",e,a),t=b.Normalizations.registered[t]("name",e)),s=b.Names.prefixCheck(t)[0],8>=g)try{e.style[s]=a}catch(c){v.debug&&console.log("Browser does not support ["+a+"] for ["+s+"]")}else n(e)&&n(e).isSVG&&b.Names.SVGAttribute(t)?e.setAttribute(t,a):e.style[s]=a;v.debug>=2&&console.log("Set "+t+" ("+s+"): "+a)}return[s,a]},flushTransformCache:function(e){function t(t){return parseFloat(b.getPropertyValue(e,t))}var r="";if((g||v.State.isAndroid&&!v.State.isChrome)&&n(e).isSVG){var a={translate:[t("translateX"),t("translateY")],skewX:[t("skewX")],skewY:[t("skewY")],scale:1!==t("scale")?[t("scale"),t("scale")]:[t("scaleX"),t("scaleY")],rotate:[t("rotateZ"),0,0]};$.each(n(e).transformCache,function(e){/^translate/i.test(e)?e="translate":/^scale/i.test(e)?e="scale":/^rotate/i.test(e)&&(e="rotate"),a[e]&&(r+=e+"("+a[e].join(" ")+") ",delete a[e])})}else{var o,i;$.each(n(e).transformCache,function(t){return o=n(e).transformCache[t],"transformPerspective"===t?(i=o,!0):(9===g&&"rotateZ"===t&&(t="rotate"),void(r+=t+o+" "))}),i&&(r="perspective"+i+" "+r)}b.setPropertyValue(e,"transform",r)}};b.Hooks.register(),b.Normalizations.register(),v.animate=function(){function e(){return p?C.promise||null:f}function t(){function e(e){function d(e,r){var a=o,i=o,n=o;return y.isArray(e)?(a=e[0],!y.isArray(e[1])&&/^[\d-]/.test(e[1])||y.isFunction(e[1])||b.RegEx.isHex.test(e[1])?n=e[1]:(y.isString(e[1])&&!b.RegEx.isHex.test(e[1])||y.isArray(e[1]))&&(i=r?e[1]:l(e[1],s.duration),e[2]!==o&&(n=e[2]))):a=e,r||(i=i||s.easing),y.isFunction(a)&&(a=a.call(t,V,x)),y.isFunction(n)&&(n=n.call(t,V,x)),[a||0,i,n]}function f(e,t){var r,a;return a=(t||0).toString().toLowerCase().replace(/[%A-z]+$/,function(e){return r=e,""}),r||(r=b.Values.getUnitType(e)),[a,r]}function g(){var e={myParent:t.parentNode||a.body,position:b.getPropertyValue(t,"position"),fontSize:b.getPropertyValue(t,"fontSize")},o=e.position===N.lastPosition&&e.myParent===N.lastParent,i=e.fontSize===N.lastFontSize;N.lastParent=e.myParent,N.lastPosition=e.position,N.lastFontSize=e.fontSize;var s=100,l={};if(i&&o)l.emToPx=N.lastEmToPx,l.percentToPxWidth=N.lastPercentToPxWidth,l.percentToPxHeight=N.lastPercentToPxHeight;else{var u=n(t).isSVG?a.createElementNS("http://www.w3.org/2000/svg","rect"):a.createElement("div");v.init(u),e.myParent.appendChild(u),v.CSS.setPropertyValue(u,"position",e.position),v.CSS.setPropertyValue(u,"fontSize",e.fontSize),v.CSS.setPropertyValue(u,"overflow","hidden"),v.CSS.setPropertyValue(u,"overflowX","hidden"),v.CSS.setPropertyValue(u,"overflowY","hidden"),v.CSS.setPropertyValue(u,"boxSizing","content-box"),v.CSS.setPropertyValue(u,"paddingLeft",s+"em"),v.CSS.setPropertyValue(u,"minWidth",s+"%"),v.CSS.setPropertyValue(u,"maxWidth",s+"%"),v.CSS.setPropertyValue(u,"width",s+"%"),v.CSS.setPropertyValue(u,"minHeight",s+"%"),v.CSS.setPropertyValue(u,"maxHeight",s+"%"),v.CSS.setPropertyValue(u,"height",s+"%"),l.percentToPxWidth=N.lastPercentToPxWidth=(parseFloat(b.getPropertyValue(u,"width",null,!0))||1)/s,l.percentToPxHeight=N.lastPercentToPxHeight=(parseFloat(b.getPropertyValue(u,"height",null,!0))||1)/s,l.emToPx=N.lastEmToPx=(parseFloat(b.getPropertyValue(u,"paddingLeft"))||1)/s,e.myParent.removeChild(u)}return null===N.remToPx&&(N.remToPx=parseFloat(b.getPropertyValue(a.body,"fontSize"))||16),null===N.vwToPx&&(N.vwToPx=parseFloat(r.innerWidth)/100,N.vhToPx=parseFloat(r.innerHeight)/100),l.remToPx=N.remToPx,l.vwToPx=N.vwToPx,l.vhToPx=N.vhToPx,v.debug>=1&&console.log("Unit ratios: "+JSON.stringify(l),t),l}if(s.begin&&0===V)try{s.begin.call(m,m)}catch(P){setTimeout(function(){throw P},1)}if("scroll"===T){var w=/^x$/i.test(s.axis)?"Left":"Top",k=parseFloat(s.offset)||0,E,F,A;s.container?y.isWrapped(s.container)||y.isNode(s.container)?(s.container=s.container[0]||s.container,E=s.container["scroll"+w],A=E+$(t).position()[w.toLowerCase()]+k):s.container=null:(E=v.State.scrollAnchor[v.State["scrollProperty"+w]],F=v.State.scrollAnchor[v.State["scrollProperty"+("Left"===w?"Top":"Left")]],A=$(t).offset()[w.toLowerCase()]+k),c={scroll:{rootPropertyValue:!1,startValue:E,currentValue:E,endValue:A,unitType:"",easing:s.easing,scrollData:{container:s.container,direction:w,alternateValue:F}},element:t},v.debug&&console.log("tweensContainer (scroll): ",c.scroll,t)}else if("reverse"===T){if(!n(t).tweensContainer)return void $.dequeue(t,s.queue);"none"===n(t).opts.display&&(n(t).opts.display="block"),"hidden"===n(t).opts.visibility&&(n(t).opts.visibility="visible"),n(t).opts.loop=!1,n(t).opts.begin=null,n(t).opts.complete=null,S.easing||delete s.easing,S.duration||delete s.duration,s=$.extend({},n(t).opts,s);var j=$.extend(!0,{},n(t).tweensContainer);for(var L in j)if("element"!==L){var z=j[L].startValue;j[L].startValue=j[L].currentValue=j[L].endValue,j[L].endValue=z,y.isEmptyObject(S)||(j[L].easing=s.easing),v.debug&&console.log("reverse tweensContainer ("+L+"): "+JSON.stringify(j[L]),t)}c=j}else if("start"===T){var j;n(t).tweensContainer&&n(t).isAnimating===!0&&(j=n(t).tweensContainer),$.each(h,function(e,t){if(RegExp("^"+b.Lists.colors.join("$|^")+"$").test(e)){var r=d(t,!0),a=r[0],i=r[1],n=r[2];if(b.RegEx.isHex.test(a)){for(var s=["Red","Green","Blue"],l=b.Values.hexToRgb(a),u=n?b.Values.hexToRgb(n):o,c=0;c<s.length;c++)h[e+s[c]]=[l[c],i,u?u[c]:u];delete h[e]}}});for(var M in h){var R=d(h[M]),q=R[0],B=R[1],O=R[2];M=b.Names.camelCase(M);var W=b.Hooks.getRoot(M),X=!1;if(n(t).isSVG||b.Names.prefixCheck(W)[1]!==!1||b.Normalizations.registered[W]!==o){(s.display&&"none"!==s.display||s.visibility&&"hidden"!==s.visibility)&&/opacity|filter/.test(M)&&!O&&0!==q&&(O=0),s._cacheValues&&j&&j[M]?(O===o&&(O=j[M].endValue+j[M].unitType),X=n(t).rootPropertyValueCache[W]):b.Hooks.registered[M]?O===o?(X=b.getPropertyValue(t,W),O=b.getPropertyValue(t,M,X)):X=b.Hooks.templates[W][1]:O===o&&(O=b.getPropertyValue(t,M));var Y,G,I,U=!1;if(Y=f(M,O),O=Y[0],I=Y[1],Y=f(M,q),q=Y[0].replace(/^([+-\/*])=/,function(e,t){return U=t,""}),G=Y[1],O=parseFloat(O)||0,q=parseFloat(q)||0,"%"===G&&(/^(fontSize|lineHeight)$/.test(M)?(q/=100,G="em"):/^scale/.test(M)?(q/=100,G=""):/(Red|Green|Blue)$/i.test(M)&&(q=q/100*255,G="")),/[\/*]/.test(U))G=I;else if(I!==G&&0!==O)if(0===q)G=I;else{p=p||g();var D=/margin|padding|left|right|width|text|word|letter/i.test(M)||/X$/.test(M)?"x":"y";switch(I){case"%":O*="x"===D?p.percentToPxWidth:p.percentToPxHeight;break;case"px":break;default:O*=p[I+"ToPx"]}switch(G){case"%":O*=1/("x"===D?p.percentToPxWidth:p.percentToPxHeight);break;case"px":break;default:O*=1/p[G+"ToPx"]}}switch(U){case"+":q=O+q;break;case"-":q=O-q;break;case"*":q=O*q;break;case"/":q=O/q}c[M]={rootPropertyValue:X,startValue:O,currentValue:O,endValue:q,unitType:G,easing:B},v.debug&&console.log("tweensContainer ("+M+"): "+JSON.stringify(c[M]),t)}else v.debug&&console.log("Skipping ["+W+"] due to a lack of browser support.")}c.element=t}c.element&&(b.Values.addClass(t,"velocity-animating"),H.push(c),n(t).tweensContainer=c,n(t).opts=s,n(t).isAnimating=!0,V===x-1?(v.State.calls.length>1e4&&(v.State.calls=i(v.State.calls)),v.State.calls.push([H,m,s,null,C.resolver]),v.State.isTicking===!1&&(v.State.isTicking=!0,u())):V++)}var t=this,s=$.extend({},v.defaults,S),c={},p;if(n(t)===o&&v.init(t),parseFloat(s.delay)&&s.queue!==!1&&$.queue(t,s.queue,function(e){v.velocityQueueEntryFlag=!0,n(t).delayTimer={setTimeout:setTimeout(e,parseFloat(s.delay)),next:e}}),v.mock===!0)s.duration=1;else switch(s.duration.toString().toLowerCase()){case"fast":s.duration=200;break;case"normal":s.duration=d;break;case"slow":s.duration=600;break;default:s.duration=parseFloat(s.duration)||1}s.easing=l(s.easing,s.duration),s.begin&&!y.isFunction(s.begin)&&(s.begin=null),s.progress&&!y.isFunction(s.progress)&&(s.progress=null),s.complete&&!y.isFunction(s.complete)&&(s.complete=null),s.display&&(s.display=s.display.toString().toLowerCase(),"auto"===s.display&&(s.display=v.CSS.Values.getDisplayType(t))),s.visibility&&(s.visibility=s.visibility.toString().toLowerCase()),s.mobileHA=s.mobileHA&&v.State.isMobile&&!v.State.isGingerbread,s.queue===!1?s.delay?setTimeout(e,s.delay):e():$.queue(t,s.queue,function(t,r){return r===!0?(C.promise&&C.resolver(m),!0):(v.velocityQueueEntryFlag=!0,void e(t))}),""!==s.queue&&"fx"!==s.queue||"inprogress"===$.queue(t)[0]||$.dequeue(t)}var s=arguments[0]&&($.isPlainObject(arguments[0].properties)&&!arguments[0].properties.names||y.isString(arguments[0].properties)),p,f,g,m,h,S;if(y.isWrapped(this)?(p=!1,g=0,m=this,f=this):(p=!0,g=1,m=s?arguments[0].elements:arguments[0]),m=y.isWrapped(m)?[].slice.call(m):m){s?(h=arguments[0].properties,S=arguments[0].options):(h=arguments[g],S=arguments[g+1]);var x=y.isArray(m)||y.isNodeList(m)?m.length:1,V=0;if("stop"!==h&&!$.isPlainObject(S)){var P=g+1;S={};for(var w=P;w<arguments.length;w++)!y.isArray(arguments[w])&&/^\d/.test(arguments[w])?S.duration=parseFloat(arguments[w]):y.isString(arguments[w])||y.isArray(arguments[w])?S.easing=arguments[w]:y.isFunction(arguments[w])&&(S.complete=arguments[w])}var C={promise:null,resolver:null,rejecter:null};p&&v.Promise&&(C.promise=new v.Promise(function(e,t){C.resolver=e,C.rejecter=t}));var T;switch(h){case"scroll":T="scroll";break;case"reverse":T="reverse";break;case"stop":$.each(y.isNode(m)?[m]:m,function(e,t){n(t)&&n(t).delayTimer&&(clearTimeout(n(t).delayTimer.setTimeout),n(t).delayTimer.next&&n(t).delayTimer.next(),delete n(t).delayTimer)});var k=[];return $.each(v.State.calls,function(e,t){t&&$.each(y.isNode(t[1])?[t[1]]:t[1],function(t,r){$.each(y.isNode(m)?[m]:m,function(t,a){if(a===r){if(n(a)&&$.each(n(a).tweensContainer,function(e,t){t.endValue=t.currentValue}),S===!0||y.isString(S)){var o=y.isString(S)?S:"";$.each($.queue(a,o),function(e,t){y.isFunction(t)&&t(null,!0)}),$.queue(a,o,[])}k.push(e)}})})}),$.each(k,function(e,t){c(t,!0)}),C.promise&&C.resolver(m),e();default:if(!$.isPlainObject(h)||y.isEmptyObject(h)){if(y.isString(h)&&v.Sequences[h]){var E=S.duration,F=S.delay||0;return S.backwards===!0&&(m=(y.isWrapped(m)?[].slice.call(m):m).reverse()),$.each(m,function(e,t){parseFloat(S.stagger)?S.delay=F+parseFloat(S.stagger)*e:y.isFunction(S.stagger)&&(S.delay=F+S.stagger.call(t,e,x)),S.drag&&(S.duration=parseFloat(E)||(/^(callout|transition)/.test(h)?1e3:d),S.duration=Math.max(S.duration*(S.backwards?1-e/x:(e+1)/x),.75*S.duration,200)),v.Sequences[h].call(t,t,S||{},e,x,m,C.promise?C:o)}),e()}var A="Velocity: First argument ("+h+") was not a property map, a known action, or a registered sequence. Aborting.";return C.promise?C.rejecter(new Error(A)):console.log(A),e()}T="start"}var N={lastParent:null,lastPosition:null,lastFontSize:null,lastPercentToPxWidth:null,lastPercentToPxHeight:null,lastEmToPx:null,remToPx:null,vwToPx:null,vhToPx:null},H=[];$.each(y.isNode(m)?[m]:m,function(e,r){y.isNode(r)&&t.call(r)});var j=$.extend({},v.defaults,S),L;if(j.loop=parseInt(j.loop),L=2*j.loop-1,j.loop)for(var z=0;L>z;z++){var M={delay:j.delay};z===L-1&&(M.display=j.display,M.visibility=j.visibility,M.complete=j.complete),v.animate(m,"reverse",M)}return e()}},v.State.isMobile||a.hidden===o||a.addEventListener("visibilitychange",function(){a.hidden?(h=function(e){return setTimeout(function(){e(!0)},16)},u()):h=r.requestAnimationFrame||m});var V;return e&&e.fn?V=e:r.Zepto&&(V=r.Zepto),(V||r).Velocity=v,V&&(V.fn.velocity=v.animate,V.fn.velocity.defaults=v.defaults),$.each(["Down","Up"],function(e,t){v.Sequences["slide"+t]=function(e,r,a,o,i,n){var s=$.extend({},r),l={height:null,marginTop:null,marginBottom:null,paddingTop:null,paddingBottom:null,overflow:null,overflowX:null,overflowY:null},u=s.begin,c=s.complete,p=!1;null!==s.display&&(s.display="Down"===t?s.display||"auto":s.display||"none"),s.begin=function(){function r(){l.height=parseFloat(v.CSS.getPropertyValue(e,"height")),e.style.height="auto",parseFloat(v.CSS.getPropertyValue(e,"height"))===l.height&&(p=!0),v.CSS.setPropertyValue(e,"height",l.height+"px")}if("Down"===t){l.overflow=[v.CSS.getPropertyValue(e,"overflow"),0],l.overflowX=[v.CSS.getPropertyValue(e,"overflowX"),0],l.overflowY=[v.CSS.getPropertyValue(e,"overflowY"),0],e.style.overflow="hidden",e.style.overflowX="visible",e.style.overflowY="hidden",r();for(var a in l)if(!/^overflow/.test(a)){var o=v.CSS.getPropertyValue(e,a);"height"===a&&(o=parseFloat(o)),l[a]=[o,0]}}else{r();for(var a in l){var o=v.CSS.getPropertyValue(e,a);"height"===a&&(o=parseFloat(o)),l[a]=[0,o]}e.style.overflow="hidden",e.style.overflowX="visible",e.style.overflowY="hidden"}u&&u.call(e,e)},s.complete=function(e){var r="Down"===t?0:1;p===!0?l.height[r]="auto":l.height[r]+="px";for(var a in l)e.style[a]=l[a][r];c&&c.call(e,e),n&&n.resolver(i||e)},v.animate(e,l,s)}}),$.each(["In","Out"],function(e,t){v.Sequences["fade"+t]=function(e,r,a,o,i,n){var s=$.extend({},r),l={opacity:"In"===t?1:0};if(a!==o-1)s.complete=s.begin=null;else{var u=s.complete;s.complete=function(){u&&u.call(e,e),n&&n.resolver(i||e)}}null!==s.display&&(s.display=s.display||("In"===t?"auto":"none")),v.animate(this,l,s)}}),v}(e||window,window,document)});
/* http://nanobar.micronube.com/  ||  https://github.com/jacoborus/nanobar/    MIT LICENSE */
var Nanobar = (function () {

	'use strict';
	var addCss, Bar, Nanobar, move, place, init,
		// container styles
		cssCont = {
			width: '100%',
			height: '4px',
			zIndex: 9999,
			top : '0'
		},
		// bar styles
		cssBar = {
			width:0,
			height: '100%',
			clear: 'both',
			transition: 'height .3s'
		};


	// add `css` to `el` element
	addCss = function (el, css ) {
		var i;
		for (i in css) {
			el.style[i] = css[i];
		}
		el.style.float = 'left';
	};

	// animation loop
	move = function () {
		var self = this,
			dist = this.width - this.here;

		if (dist < 0.1 && dist > -0.1) {
			place.call( this, this.here );
			this.moving = false;
			if (this.width == 100) {
				this.el.style.height = 0;
				setTimeout( function () {
					self.cont.el.removeChild( self.el );
				}, 300);
			}
		} else {
			place.call( this, this.width - (dist/4) );
			setTimeout( function () {
				self.go();
			}, 16);
		}
	};

	// set bar width
	place = function (num) {
		this.width = num;
		this.el.style.width = this.width + '%';
	};

	// create and insert bar in DOM and this.bars array
	init = function () {
		var bar = new Bar( this );
		this.bars.unshift( bar );
	};

	Bar = function ( cont ) {
		// create progress element
		this.el = document.createElement( 'div' );
		this.el.style.backgroundColor = cont.opts.bg;
		this.width = 0;
		this.here = 0;
		this.moving = false;
		this.cont = cont;
		addCss( this.el, cssBar);
		cont.el.appendChild( this.el );
	};

	Bar.prototype.go = function (num) {
		if (num) {
			this.here = num;
			if (!this.moving) {
				this.moving = true;
				move.call( this );
			}
		} else if (this.moving) {
			move.call( this );
		}
	};


	Nanobar = function (opt) {

		var opts = this.opts = opt || {},
			el;

		// set options
		opts.bg = opts.bg || '#000';
		this.bars = [];


		// create bar container
		el = this.el = document.createElement( 'div' );
		// append style
		addCss( this.el, cssCont);
		if (opts.id) {
			el.id = opts.id;
		}
		// set CSS position
		el.style.position = !opts.target ? 'fixed' : 'relative';

		// insert container
		if (!opts.target) {
			document.getElementsByTagName( 'body' )[0].appendChild( el );
		} else {
			opts.target.insertBefore( el, opts.target.firstChild);
		}

		init.call( this );
	};


	Nanobar.prototype.go = function (p) {
		// expand bar
		this.bars[0].go( p );

		// create new bar at progress end
		if (p == 100) {
			init.call( this );
		}
	};

	return Nanobar;
})();
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

/*
 * Copyright 2013 Ivan Pusic
 * Contributors:
 *   Matjaz Lipus
 */
angular.module('ivpusic.cookie', ['ipCookie']);
angular.module('ipCookie', ['ng']).
factory('ipCookie', ['$document',
  function ($document) {
    'use strict';
      
    function tryDecodeURIComponent(value) {
        try {
            return decodeURIComponent(value);
        } catch(e) {
              // Ignore any invalid uri component
        }
    }

    return (function () {
      function cookieFun(key, value, options) {

        var cookies,
          list,
          i,
          cookie,
          pos,
          name,
          hasCookies,
          all,
          expiresFor;

        options = options || {};

        if (value !== undefined) {
          // we are setting value
          value = typeof value === 'object' ? JSON.stringify(value) : String(value);

          if (typeof options.expires === 'number') {
            expiresFor = options.expires;
            options.expires = new Date();
            // Trying to delete a cookie; set a date far in the past
            if (expiresFor === -1) {
              options.expires = new Date('Thu, 01 Jan 1970 00:00:00 GMT');
              // A new 
            } else if (options.expirationUnit !== undefined) {
              if (options.expirationUnit === 'hours') {
                options.expires.setHours(options.expires.getHours() + expiresFor);
              } else if (options.expirationUnit === 'minutes') {
                options.expires.setMinutes(options.expires.getMinutes() + expiresFor);
              } else if (options.expirationUnit === 'seconds') {
                options.expires.setSeconds(options.expires.getSeconds() + expiresFor);
              } else {
                options.expires.setDate(options.expires.getDate() + expiresFor);
              }
            } else {
              options.expires.setDate(options.expires.getDate() + expiresFor);
            }
          }
          return ($document[0].cookie = [
            encodeURIComponent(key),
            '=',
            encodeURIComponent(value),
            options.expires ? '; expires=' + options.expires.toUTCString() : '',
            options.path ? '; path=' + options.path : '',
            options.domain ? '; domain=' + options.domain : '',
            options.secure ? '; secure' : ''
          ].join(''));
        }

        list = [];
        all = $document[0].cookie;
        if (all) {
          list = all.split('; ');
        }

        cookies = {};
        hasCookies = false;

        for (i = 0; i < list.length; ++i) {
          if (list[i]) {
            cookie = list[i];
            pos = cookie.indexOf('=');
            name = cookie.substring(0, pos);
            value = tryDecodeURIComponent(cookie.substring(pos + 1));
            if(angular.isUndefined(value))
              continue;

            if (key === undefined || key === name) {
              try {
                cookies[name] = JSON.parse(value);
              } catch (e) {
                cookies[name] = value;
              }
              if (key === name) {
                return cookies[name];
              }
              hasCookies = true;
            }
          }
        }
        if (hasCookies && key === undefined) {
          return cookies;
        }
      }
      cookieFun.remove = function (key, options) {
        var hasCookie = cookieFun(key) !== undefined;

        if (hasCookie) {
          if (!options) {
            options = {};
          }
          options.expires = -1;
          cookieFun(key, '', options);
        }
        return hasCookie;
      };
      return cookieFun;
    }());
  }
]);

/**
 * @license AngularJS v1.3.15
 * (c) 2010-2014 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, angular, undefined) {'use strict';

/* jshint maxlen: false */

/**
 * @ngdoc module
 * @name ngAnimate
 * @description
 *
 * The `ngAnimate` module provides support for JavaScript, CSS3 transition and CSS3 keyframe animation hooks within existing core and custom directives.
 *
 * <div doc-module-components="ngAnimate"></div>
 *
 * # Usage
 *
 * To see animations in action, all that is required is to define the appropriate CSS classes
 * or to register a JavaScript animation via the `myModule.animation()` function. The directives that support animation automatically are:
 * `ngRepeat`, `ngInclude`, `ngIf`, `ngSwitch`, `ngShow`, `ngHide`, `ngView` and `ngClass`. Custom directives can take advantage of animation
 * by using the `$animate` service.
 *
 * Below is a more detailed breakdown of the supported animation events provided by pre-existing ng directives:
 *
 * | Directive                                                                                                | Supported Animations                                                     |
 * |----------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------|
 * | {@link ng.directive:ngRepeat#animations ngRepeat}                                                        | enter, leave and move                                                    |
 * | {@link ngRoute.directive:ngView#animations ngView}                                                       | enter and leave                                                          |
 * | {@link ng.directive:ngInclude#animations ngInclude}                                                      | enter and leave                                                          |
 * | {@link ng.directive:ngSwitch#animations ngSwitch}                                                        | enter and leave                                                          |
 * | {@link ng.directive:ngIf#animations ngIf}                                                                | enter and leave                                                          |
 * | {@link ng.directive:ngClass#animations ngClass}                                                          | add and remove (the CSS class(es) present)                               |
 * | {@link ng.directive:ngShow#animations ngShow} & {@link ng.directive:ngHide#animations ngHide}            | add and remove (the ng-hide class value)                                 |
 * | {@link ng.directive:form#animation-hooks form} & {@link ng.directive:ngModel#animation-hooks ngModel}    | add and remove (dirty, pristine, valid, invalid & all other validations) |
 * | {@link module:ngMessages#animations ngMessages}                                                          | add and remove (ng-active & ng-inactive)                                 |
 * | {@link module:ngMessages#animations ngMessage}                                                           | enter and leave                                                          |
 *
 * You can find out more information about animations upon visiting each directive page.
 *
 * Below is an example of how to apply animations to a directive that supports animation hooks:
 *
 * ```html
 * <style type="text/css">
 * .slide.ng-enter, .slide.ng-leave {
 *   -webkit-transition:0.5s linear all;
 *   transition:0.5s linear all;
 * }
 *
 * .slide.ng-enter { }        /&#42; starting animations for enter &#42;/
 * .slide.ng-enter.ng-enter-active { } /&#42; terminal animations for enter &#42;/
 * .slide.ng-leave { }        /&#42; starting animations for leave &#42;/
 * .slide.ng-leave.ng-leave-active { } /&#42; terminal animations for leave &#42;/
 * </style>
 *
 * <!--
 * the animate service will automatically add .ng-enter and .ng-leave to the element
 * to trigger the CSS transition/animations
 * -->
 * <ANY class="slide" ng-include="..."></ANY>
 * ```
 *
 * Keep in mind that, by default, if an animation is running, any child elements cannot be animated
 * until the parent element's animation has completed. This blocking feature can be overridden by
 * placing the `ng-animate-children` attribute on a parent container tag.
 *
 * ```html
 * <div class="slide-animation" ng-if="on" ng-animate-children>
 *   <div class="fade-animation" ng-if="on">
 *     <div class="explode-animation" ng-if="on">
 *        ...
 *     </div>
 *   </div>
 * </div>
 * ```
 *
 * When the `on` expression value changes and an animation is triggered then each of the elements within
 * will all animate without the block being applied to child elements.
 *
 * ## Are animations run when the application starts?
 * No they are not. When an application is bootstrapped Angular will disable animations from running to avoid
 * a frenzy of animations from being triggered as soon as the browser has rendered the screen. For this to work,
 * Angular will wait for two digest cycles until enabling animations. From there on, any animation-triggering
 * layout changes in the application will trigger animations as normal.
 *
 * In addition, upon bootstrap, if the routing system or any directives or load remote data (via $http) then Angular
 * will automatically extend the wait time to enable animations once **all** of the outbound HTTP requests
 * are complete.
 *
 * ## CSS-defined Animations
 * The animate service will automatically apply two CSS classes to the animated element and these two CSS classes
 * are designed to contain the start and end CSS styling. Both CSS transitions and keyframe animations are supported
 * and can be used to play along with this naming structure.
 *
 * The following code below demonstrates how to perform animations using **CSS transitions** with Angular:
 *
 * ```html
 * <style type="text/css">
 * /&#42;
 *  The animate class is apart of the element and the ng-enter class
 *  is attached to the element once the enter animation event is triggered
 * &#42;/
 * .reveal-animation.ng-enter {
 *  -webkit-transition: 1s linear all; /&#42; Safari/Chrome &#42;/
 *  transition: 1s linear all; /&#42; All other modern browsers and IE10+ &#42;/
 *
 *  /&#42; The animation preparation code &#42;/
 *  opacity: 0;
 * }
 *
 * /&#42;
 *  Keep in mind that you want to combine both CSS
 *  classes together to avoid any CSS-specificity
 *  conflicts
 * &#42;/
 * .reveal-animation.ng-enter.ng-enter-active {
 *  /&#42; The animation code itself &#42;/
 *  opacity: 1;
 * }
 * </style>
 *
 * <div class="view-container">
 *   <div ng-view class="reveal-animation"></div>
 * </div>
 * ```
 *
 * The following code below demonstrates how to perform animations using **CSS animations** with Angular:
 *
 * ```html
 * <style type="text/css">
 * .reveal-animation.ng-enter {
 *   -webkit-animation: enter_sequence 1s linear; /&#42; Safari/Chrome &#42;/
 *   animation: enter_sequence 1s linear; /&#42; IE10+ and Future Browsers &#42;/
 * }
 * @-webkit-keyframes enter_sequence {
 *   from { opacity:0; }
 *   to { opacity:1; }
 * }
 * @keyframes enter_sequence {
 *   from { opacity:0; }
 *   to { opacity:1; }
 * }
 * </style>
 *
 * <div class="view-container">
 *   <div ng-view class="reveal-animation"></div>
 * </div>
 * ```
 *
 * Both CSS3 animations and transitions can be used together and the animate service will figure out the correct duration and delay timing.
 *
 * Upon DOM mutation, the event class is added first (something like `ng-enter`), then the browser prepares itself to add
 * the active class (in this case `ng-enter-active`) which then triggers the animation. The animation module will automatically
 * detect the CSS code to determine when the animation ends. Once the animation is over then both CSS classes will be
 * removed from the DOM. If a browser does not support CSS transitions or CSS animations then the animation will start and end
 * immediately resulting in a DOM element that is at its final state. This final state is when the DOM element
 * has no CSS transition/animation classes applied to it.
 *
 * ### Structural transition animations
 *
 * Structural transitions (such as enter, leave and move) will always apply a `0s none` transition
 * value to force the browser into rendering the styles defined in the setup (`.ng-enter`, `.ng-leave`
 * or `.ng-move`) class. This means that any active transition animations operating on the element
 * will be cut off to make way for the enter, leave or move animation.
 *
 * ### Class-based transition animations
 *
 * Class-based transitions refer to transition animations that are triggered when a CSS class is
 * added to or removed from the element (via `$animate.addClass`, `$animate.removeClass`,
 * `$animate.setClass`, or by directives such as `ngClass`, `ngModel` and `form`).
 * They are different when compared to structural animations since they **do not cancel existing
 * animations** nor do they **block successive transitions** from rendering on the same element.
 * This distinction allows for **multiple class-based transitions** to be performed on the same element.
 *
 * In addition to ngAnimate supporting the default (natural) functionality of class-based transition
 * animations, ngAnimate also decorates the element with starting and ending CSS classes to aid the
 * developer in further styling the element throughout the transition animation. Earlier versions
 * of ngAnimate may have caused natural CSS transitions to break and not render properly due to
 * $animate temporarily blocking transitions using `0s none` in order to allow the setup CSS class
 * (the `-add` or `-remove` class) to be applied without triggering an animation. However, as of
 * **version 1.3**, this workaround has been removed with ngAnimate and all non-ngAnimate CSS
 * class transitions are compatible with ngAnimate.
 *
 * There is, however, one special case when dealing with class-based transitions in ngAnimate.
 * When rendering class-based transitions that make use of the setup and active CSS classes
 * (e.g. `.fade-add` and `.fade-add-active` for when `.fade` is added) be sure to define
 * the transition value **on the active CSS class** and not the setup class.
 *
 * ```css
 * .fade-add {
 *   /&#42; remember to place a 0s transition here
 *      to ensure that the styles are applied instantly
 *      even if the element already has a transition style &#42;/
 *   transition:0s linear all;
 *
 *   /&#42; starting CSS styles &#42;/
 *   opacity:1;
 * }
 * .fade-add.fade-add-active {
 *   /&#42; this will be the length of the animation &#42;/
 *   transition:1s linear all;
 *   opacity:0;
 * }
 * ```
 *
 * The setup CSS class (in this case `.fade-add`) also has a transition style property, however, it
 * has a duration of zero. This may not be required, however, incase the browser is unable to render
 * the styling present in this CSS class instantly then it could be that the browser is attempting
 * to perform an unnecessary transition.
 *
 * This workaround, however, does not apply to  standard class-based transitions that are rendered
 * when a CSS class containing a transition is applied to an element:
 *
 * ```css
 * /&#42; this works as expected &#42;/
 * .fade {
 *   transition:1s linear all;
 *   opacity:0;
 * }
 * ```
 *
 * Please keep this in mind when coding the CSS markup that will be used within class-based transitions.
 * Also, try not to mix the two class-based animation flavors together since the CSS code may become
 * overly complex.
 *
 *
 * ### Preventing Collisions With Third Party Libraries
 *
 * Some third-party frameworks place animation duration defaults across many element or className
 * selectors in order to make their code small and reuseable. This can lead to issues with ngAnimate, which
 * is expecting actual animations on these elements and has to wait for their completion.
 *
 * You can prevent this unwanted behavior by using a prefix on all your animation classes:
 *
 * ```css
 * /&#42; prefixed with animate- &#42;/
 * .animate-fade-add.animate-fade-add-active {
 *   transition:1s linear all;
 *   opacity:0;
 * }
 * ```
 *
 * You then configure `$animate` to enforce this prefix:
 *
 * ```js
 * $animateProvider.classNameFilter(/animate-/);
 * ```
 * </div>
 *
 * ### CSS Staggering Animations
 * A Staggering animation is a collection of animations that are issued with a slight delay in between each successive operation resulting in a
 * curtain-like effect. The ngAnimate module (versions >=1.2) supports staggering animations and the stagger effect can be
 * performed by creating a **ng-EVENT-stagger** CSS class and attaching that class to the base CSS class used for
 * the animation. The style property expected within the stagger class can either be a **transition-delay** or an
 * **animation-delay** property (or both if your animation contains both transitions and keyframe animations).
 *
 * ```css
 * .my-animation.ng-enter {
 *   /&#42; standard transition code &#42;/
 *   -webkit-transition: 1s linear all;
 *   transition: 1s linear all;
 *   opacity:0;
 * }
 * .my-animation.ng-enter-stagger {
 *   /&#42; this will have a 100ms delay between each successive leave animation &#42;/
 *   -webkit-transition-delay: 0.1s;
 *   transition-delay: 0.1s;
 *
 *   /&#42; in case the stagger doesn't work then these two values
 *    must be set to 0 to avoid an accidental CSS inheritance &#42;/
 *   -webkit-transition-duration: 0s;
 *   transition-duration: 0s;
 * }
 * .my-animation.ng-enter.ng-enter-active {
 *   /&#42; standard transition styles &#42;/
 *   opacity:1;
 * }
 * ```
 *
 * Staggering animations work by default in ngRepeat (so long as the CSS class is defined). Outside of ngRepeat, to use staggering animations
 * on your own, they can be triggered by firing multiple calls to the same event on $animate. However, the restrictions surrounding this
 * are that each of the elements must have the same CSS className value as well as the same parent element. A stagger operation
 * will also be reset if more than 10ms has passed after the last animation has been fired.
 *
 * The following code will issue the **ng-leave-stagger** event on the element provided:
 *
 * ```js
 * var kids = parent.children();
 *
 * $animate.leave(kids[0]); //stagger index=0
 * $animate.leave(kids[1]); //stagger index=1
 * $animate.leave(kids[2]); //stagger index=2
 * $animate.leave(kids[3]); //stagger index=3
 * $animate.leave(kids[4]); //stagger index=4
 *
 * $timeout(function() {
 *   //stagger has reset itself
 *   $animate.leave(kids[5]); //stagger index=0
 *   $animate.leave(kids[6]); //stagger index=1
 * }, 100, false);
 * ```
 *
 * Stagger animations are currently only supported within CSS-defined animations.
 *
 * ## JavaScript-defined Animations
 * In the event that you do not want to use CSS3 transitions or CSS3 animations or if you wish to offer animations on browsers that do not
 * yet support CSS transitions/animations, then you can make use of JavaScript animations defined inside of your AngularJS module.
 *
 * ```js
 * //!annotate="YourApp" Your AngularJS Module|Replace this or ngModule with the module that you used to define your application.
 * var ngModule = angular.module('YourApp', ['ngAnimate']);
 * ngModule.animation('.my-crazy-animation', function() {
 *   return {
 *     enter: function(element, done) {
 *       //run the animation here and call done when the animation is complete
 *       return function(cancelled) {
 *         //this (optional) function will be called when the animation
 *         //completes or when the animation is cancelled (the cancelled
 *         //flag will be set to true if cancelled).
 *       };
 *     },
 *     leave: function(element, done) { },
 *     move: function(element, done) { },
 *
 *     //animation that can be triggered before the class is added
 *     beforeAddClass: function(element, className, done) { },
 *
 *     //animation that can be triggered after the class is added
 *     addClass: function(element, className, done) { },
 *
 *     //animation that can be triggered before the class is removed
 *     beforeRemoveClass: function(element, className, done) { },
 *
 *     //animation that can be triggered after the class is removed
 *     removeClass: function(element, className, done) { }
 *   };
 * });
 * ```
 *
 * JavaScript-defined animations are created with a CSS-like class selector and a collection of events which are set to run
 * a javascript callback function. When an animation is triggered, $animate will look for a matching animation which fits
 * the element's CSS class attribute value and then run the matching animation event function (if found).
 * In other words, if the CSS classes present on the animated element match any of the JavaScript animations then the callback function will
 * be executed. It should be also noted that only simple, single class selectors are allowed (compound class selectors are not supported).
 *
 * Within a JavaScript animation, an object containing various event callback animation functions is expected to be returned.
 * As explained above, these callbacks are triggered based on the animation event. Therefore if an enter animation is run,
 * and the JavaScript animation is found, then the enter callback will handle that animation (in addition to the CSS keyframe animation
 * or transition code that is defined via a stylesheet).
 *
 *
 * ### Applying Directive-specific Styles to an Animation
 * In some cases a directive or service may want to provide `$animate` with extra details that the animation will
 * include into its animation. Let's say for example we wanted to render an animation that animates an element
 * towards the mouse coordinates as to where the user clicked last. By collecting the X/Y coordinates of the click
 * (via the event parameter) we can set the `top` and `left` styles into an object and pass that into our function
 * call to `$animate.addClass`.
 *
 * ```js
 * canvas.on('click', function(e) {
 *   $animate.addClass(element, 'on', {
 *     to: {
 *       left : e.client.x + 'px',
 *       top : e.client.y + 'px'
 *     }
 *   }):
 * });
 * ```
 *
 * Now when the animation runs, and a transition or keyframe animation is picked up, then the animation itself will
 * also include and transition the styling of the `left` and `top` properties into its running animation. If we want
 * to provide some starting animation values then we can do so by placing the starting animations styles into an object
 * called `from` in the same object as the `to` animations.
 *
 * ```js
 * canvas.on('click', function(e) {
 *   $animate.addClass(element, 'on', {
 *     from: {
 *        position: 'absolute',
 *        left: '0px',
 *        top: '0px'
 *     },
 *     to: {
 *       left : e.client.x + 'px',
 *       top : e.client.y + 'px'
 *     }
 *   }):
 * });
 * ```
 *
 * Once the animation is complete or cancelled then the union of both the before and after styles are applied to the
 * element. If `ngAnimate` is not present then the styles will be applied immediately.
 *
 */

angular.module('ngAnimate', ['ng'])

  /**
   * @ngdoc provider
   * @name $animateProvider
   * @description
   *
   * The `$animateProvider` allows developers to register JavaScript animation event handlers directly inside of a module.
   * When an animation is triggered, the $animate service will query the $animate service to find any animations that match
   * the provided name value.
   *
   * Requires the {@link ngAnimate `ngAnimate`} module to be installed.
   *
   * Please visit the {@link ngAnimate `ngAnimate`} module overview page learn more about how to use animations in your application.
   *
   */
  .directive('ngAnimateChildren', function() {
    var NG_ANIMATE_CHILDREN = '$$ngAnimateChildren';
    return function(scope, element, attrs) {
      var val = attrs.ngAnimateChildren;
      if (angular.isString(val) && val.length === 0) { //empty attribute
        element.data(NG_ANIMATE_CHILDREN, true);
      } else {
        scope.$watch(val, function(value) {
          element.data(NG_ANIMATE_CHILDREN, !!value);
        });
      }
    };
  })

  //this private service is only used within CSS-enabled animations
  //IE8 + IE9 do not support rAF natively, but that is fine since they
  //also don't support transitions and keyframes which means that the code
  //below will never be used by the two browsers.
  .factory('$$animateReflow', ['$$rAF', '$document', function($$rAF, $document) {
    var bod = $document[0].body;
    return function(fn) {
      //the returned function acts as the cancellation function
      return $$rAF(function() {
        //the line below will force the browser to perform a repaint
        //so that all the animated elements within the animation frame
        //will be properly updated and drawn on screen. This is
        //required to perform multi-class CSS based animations with
        //Firefox. DO NOT REMOVE THIS LINE.
        var a = bod.offsetWidth + 1;
        fn();
      });
    };
  }])

  .config(['$provide', '$animateProvider', function($provide, $animateProvider) {
    var noop = angular.noop;
    var forEach = angular.forEach;
    var selectors = $animateProvider.$$selectors;
    var isArray = angular.isArray;
    var isString = angular.isString;
    var isObject = angular.isObject;

    var ELEMENT_NODE = 1;
    var NG_ANIMATE_STATE = '$$ngAnimateState';
    var NG_ANIMATE_CHILDREN = '$$ngAnimateChildren';
    var NG_ANIMATE_CLASS_NAME = 'ng-animate';
    var rootAnimateState = {running: true};

    function extractElementNode(element) {
      for (var i = 0; i < element.length; i++) {
        var elm = element[i];
        if (elm.nodeType == ELEMENT_NODE) {
          return elm;
        }
      }
    }

    function prepareElement(element) {
      return element && angular.element(element);
    }

    function stripCommentsFromElement(element) {
      return angular.element(extractElementNode(element));
    }

    function isMatchingElement(elm1, elm2) {
      return extractElementNode(elm1) == extractElementNode(elm2);
    }
    var $$jqLite;
    $provide.decorator('$animate',
        ['$delegate', '$$q', '$injector', '$sniffer', '$rootElement', '$$asyncCallback', '$rootScope', '$document', '$templateRequest', '$$jqLite',
 function($delegate,   $$q,   $injector,   $sniffer,   $rootElement,   $$asyncCallback,   $rootScope,   $document,   $templateRequest,   $$$jqLite) {

      $$jqLite = $$$jqLite;
      $rootElement.data(NG_ANIMATE_STATE, rootAnimateState);

      // Wait until all directive and route-related templates are downloaded and
      // compiled. The $templateRequest.totalPendingRequests variable keeps track of
      // all of the remote templates being currently downloaded. If there are no
      // templates currently downloading then the watcher will still fire anyway.
      var deregisterWatch = $rootScope.$watch(
        function() { return $templateRequest.totalPendingRequests; },
        function(val, oldVal) {
          if (val !== 0) return;
          deregisterWatch();

          // Now that all templates have been downloaded, $animate will wait until
          // the post digest queue is empty before enabling animations. By having two
          // calls to $postDigest calls we can ensure that the flag is enabled at the
          // very end of the post digest queue. Since all of the animations in $animate
          // use $postDigest, it's important that the code below executes at the end.
          // This basically means that the page is fully downloaded and compiled before
          // any animations are triggered.
          $rootScope.$$postDigest(function() {
            $rootScope.$$postDigest(function() {
              rootAnimateState.running = false;
            });
          });
        }
      );

      var globalAnimationCounter = 0;
      var classNameFilter = $animateProvider.classNameFilter();
      var isAnimatableClassName = !classNameFilter
              ? function() { return true; }
              : function(className) {
                return classNameFilter.test(className);
              };

      function classBasedAnimationsBlocked(element, setter) {
        var data = element.data(NG_ANIMATE_STATE) || {};
        if (setter) {
          data.running = true;
          data.structural = true;
          element.data(NG_ANIMATE_STATE, data);
        }
        return data.disabled || (data.running && data.structural);
      }

      function runAnimationPostDigest(fn) {
        var cancelFn, defer = $$q.defer();
        defer.promise.$$cancelFn = function() {
          cancelFn && cancelFn();
        };
        $rootScope.$$postDigest(function() {
          cancelFn = fn(function() {
            defer.resolve();
          });
        });
        return defer.promise;
      }

      function parseAnimateOptions(options) {
        // some plugin code may still be passing in the callback
        // function as the last param for the $animate methods so
        // it's best to only allow string or array values for now
        if (isObject(options)) {
          if (options.tempClasses && isString(options.tempClasses)) {
            options.tempClasses = options.tempClasses.split(/\s+/);
          }
          return options;
        }
      }

      function resolveElementClasses(element, cache, runningAnimations) {
        runningAnimations = runningAnimations || {};

        var lookup = {};
        forEach(runningAnimations, function(data, selector) {
          forEach(selector.split(' '), function(s) {
            lookup[s]=data;
          });
        });

        var hasClasses = Object.create(null);
        forEach((element.attr('class') || '').split(/\s+/), function(className) {
          hasClasses[className] = true;
        });

        var toAdd = [], toRemove = [];
        forEach((cache && cache.classes) || [], function(status, className) {
          var hasClass = hasClasses[className];
          var matchingAnimation = lookup[className] || {};

          // When addClass and removeClass is called then $animate will check to
          // see if addClass and removeClass cancel each other out. When there are
          // more calls to removeClass than addClass then the count falls below 0
          // and then the removeClass animation will be allowed. Otherwise if the
          // count is above 0 then that means an addClass animation will commence.
          // Once an animation is allowed then the code will also check to see if
          // there exists any on-going animation that is already adding or remvoing
          // the matching CSS class.
          if (status === false) {
            //does it have the class or will it have the class
            if (hasClass || matchingAnimation.event == 'addClass') {
              toRemove.push(className);
            }
          } else if (status === true) {
            //is the class missing or will it be removed?
            if (!hasClass || matchingAnimation.event == 'removeClass') {
              toAdd.push(className);
            }
          }
        });

        return (toAdd.length + toRemove.length) > 0 && [toAdd.join(' '), toRemove.join(' ')];
      }

      function lookup(name) {
        if (name) {
          var matches = [],
              flagMap = {},
              classes = name.substr(1).split('.');

          //the empty string value is the default animation
          //operation which performs CSS transition and keyframe
          //animations sniffing. This is always included for each
          //element animation procedure if the browser supports
          //transitions and/or keyframe animations. The default
          //animation is added to the top of the list to prevent
          //any previous animations from affecting the element styling
          //prior to the element being animated.
          if ($sniffer.transitions || $sniffer.animations) {
            matches.push($injector.get(selectors['']));
          }

          for (var i=0; i < classes.length; i++) {
            var klass = classes[i],
                selectorFactoryName = selectors[klass];
            if (selectorFactoryName && !flagMap[klass]) {
              matches.push($injector.get(selectorFactoryName));
              flagMap[klass] = true;
            }
          }
          return matches;
        }
      }

      function animationRunner(element, animationEvent, className, options) {
        //transcluded directives may sometimes fire an animation using only comment nodes
        //best to catch this early on to prevent any animation operations from occurring
        var node = element[0];
        if (!node) {
          return;
        }

        if (options) {
          options.to = options.to || {};
          options.from = options.from || {};
        }

        var classNameAdd;
        var classNameRemove;
        if (isArray(className)) {
          classNameAdd = className[0];
          classNameRemove = className[1];
          if (!classNameAdd) {
            className = classNameRemove;
            animationEvent = 'removeClass';
          } else if (!classNameRemove) {
            className = classNameAdd;
            animationEvent = 'addClass';
          } else {
            className = classNameAdd + ' ' + classNameRemove;
          }
        }

        var isSetClassOperation = animationEvent == 'setClass';
        var isClassBased = isSetClassOperation
                           || animationEvent == 'addClass'
                           || animationEvent == 'removeClass'
                           || animationEvent == 'animate';

        var currentClassName = element.attr('class');
        var classes = currentClassName + ' ' + className;
        if (!isAnimatableClassName(classes)) {
          return;
        }

        var beforeComplete = noop,
            beforeCancel = [],
            before = [],
            afterComplete = noop,
            afterCancel = [],
            after = [];

        var animationLookup = (' ' + classes).replace(/\s+/g,'.');
        forEach(lookup(animationLookup), function(animationFactory) {
          var created = registerAnimation(animationFactory, animationEvent);
          if (!created && isSetClassOperation) {
            registerAnimation(animationFactory, 'addClass');
            registerAnimation(animationFactory, 'removeClass');
          }
        });

        function registerAnimation(animationFactory, event) {
          var afterFn = animationFactory[event];
          var beforeFn = animationFactory['before' + event.charAt(0).toUpperCase() + event.substr(1)];
          if (afterFn || beforeFn) {
            if (event == 'leave') {
              beforeFn = afterFn;
              //when set as null then animation knows to skip this phase
              afterFn = null;
            }
            after.push({
              event: event, fn: afterFn
            });
            before.push({
              event: event, fn: beforeFn
            });
            return true;
          }
        }

        function run(fns, cancellations, allCompleteFn) {
          var animations = [];
          forEach(fns, function(animation) {
            animation.fn && animations.push(animation);
          });

          var count = 0;
          function afterAnimationComplete(index) {
            if (cancellations) {
              (cancellations[index] || noop)();
              if (++count < animations.length) return;
              cancellations = null;
            }
            allCompleteFn();
          }

          //The code below adds directly to the array in order to work with
          //both sync and async animations. Sync animations are when the done()
          //operation is called right away. DO NOT REFACTOR!
          forEach(animations, function(animation, index) {
            var progress = function() {
              afterAnimationComplete(index);
            };
            switch (animation.event) {
              case 'setClass':
                cancellations.push(animation.fn(element, classNameAdd, classNameRemove, progress, options));
                break;
              case 'animate':
                cancellations.push(animation.fn(element, className, options.from, options.to, progress));
                break;
              case 'addClass':
                cancellations.push(animation.fn(element, classNameAdd || className,     progress, options));
                break;
              case 'removeClass':
                cancellations.push(animation.fn(element, classNameRemove || className,  progress, options));
                break;
              default:
                cancellations.push(animation.fn(element, progress, options));
                break;
            }
          });

          if (cancellations && cancellations.length === 0) {
            allCompleteFn();
          }
        }

        return {
          node: node,
          event: animationEvent,
          className: className,
          isClassBased: isClassBased,
          isSetClassOperation: isSetClassOperation,
          applyStyles: function() {
            if (options) {
              element.css(angular.extend(options.from || {}, options.to || {}));
            }
          },
          before: function(allCompleteFn) {
            beforeComplete = allCompleteFn;
            run(before, beforeCancel, function() {
              beforeComplete = noop;
              allCompleteFn();
            });
          },
          after: function(allCompleteFn) {
            afterComplete = allCompleteFn;
            run(after, afterCancel, function() {
              afterComplete = noop;
              allCompleteFn();
            });
          },
          cancel: function() {
            if (beforeCancel) {
              forEach(beforeCancel, function(cancelFn) {
                (cancelFn || noop)(true);
              });
              beforeComplete(true);
            }
            if (afterCancel) {
              forEach(afterCancel, function(cancelFn) {
                (cancelFn || noop)(true);
              });
              afterComplete(true);
            }
          }
        };
      }

      /**
       * @ngdoc service
       * @name $animate
       * @kind object
       *
       * @description
       * The `$animate` service provides animation detection support while performing DOM operations (enter, leave and move) as well as during addClass and removeClass operations.
       * When any of these operations are run, the $animate service
       * will examine any JavaScript-defined animations (which are defined by using the $animateProvider provider object)
       * as well as any CSS-defined animations against the CSS classes present on the element once the DOM operation is run.
       *
       * The `$animate` service is used behind the scenes with pre-existing directives and animation with these directives
       * will work out of the box without any extra configuration.
       *
       * Requires the {@link ngAnimate `ngAnimate`} module to be installed.
       *
       * Please visit the {@link ngAnimate `ngAnimate`} module overview page learn more about how to use animations in your application.
       * ## Callback Promises
       * With AngularJS 1.3, each of the animation methods, on the `$animate` service, return a promise when called. The
       * promise itself is then resolved once the animation has completed itself, has been cancelled or has been
       * skipped due to animations being disabled. (Note that even if the animation is cancelled it will still
       * call the resolve function of the animation.)
       *
       * ```js
       * $animate.enter(element, container).then(function() {
       *   //...this is called once the animation is complete...
       * });
       * ```
       *
       * Also note that, due to the nature of the callback promise, if any Angular-specific code (like changing the scope,
       * location of the page, etc...) is executed within the callback promise then be sure to wrap the code using
       * `$scope.$apply(...)`;
       *
       * ```js
       * $animate.leave(element).then(function() {
       *   $scope.$apply(function() {
       *     $location.path('/new-page');
       *   });
       * });
       * ```
       *
       * An animation can also be cancelled by calling the `$animate.cancel(promise)` method with the provided
       * promise that was returned when the animation was started.
       *
       * ```js
       * var promise = $animate.addClass(element, 'super-long-animation');
       * promise.then(function() {
       *   //this will still be called even if cancelled
       * });
       *
       * element.on('click', function() {
       *   //tooo lazy to wait for the animation to end
       *   $animate.cancel(promise);
       * });
       * ```
       *
       * (Keep in mind that the promise cancellation is unique to `$animate` since promises in
       * general cannot be cancelled.)
       *
       */
      return {
        /**
         * @ngdoc method
         * @name $animate#animate
         * @kind function
         *
         * @description
         * Performs an inline animation on the element which applies the provided `to` and `from` CSS styles to the element.
         * If any detected CSS transition, keyframe or JavaScript matches the provided `className` value then the animation
         * will take on the provided styles. For example, if a transition animation is set for the given className then the
         * provided `from` and `to` styles will be applied alongside the given transition. If a JavaScript animation is
         * detected then the provided styles will be given in as function paramters.
         *
         * ```js
         * ngModule.animation('.my-inline-animation', function() {
         *   return {
         *     animate : function(element, className, from, to, done) {
         *       //styles
         *     }
         *   }
         * });
         * ```
         *
         * Below is a breakdown of each step that occurs during the `animate` animation:
         *
         * | Animation Step                                                                                                        | What the element class attribute looks like                  |
         * |-----------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------|
         * | 1. `$animate.animate(...)` is called                                                                                  | `class="my-animation"`                                       |
         * | 2. `$animate` waits for the next digest to start the animation                                                        | `class="my-animation ng-animate"`                            |
         * | 3. `$animate` runs the JavaScript-defined animations detected on the element                                          | `class="my-animation ng-animate"`                            |
         * | 4. the `className` class value is added to the element                                                                | `class="my-animation ng-animate className"`                  |
         * | 5. `$animate` scans the element styles to get the CSS transition/animation duration and delay                         | `class="my-animation ng-animate className"`                  |
         * | 6. `$animate` blocks all CSS transitions on the element to ensure the `.className` class styling is applied right away| `class="my-animation ng-animate className"`                  |
         * | 7. `$animate` applies the provided collection of `from` CSS styles to the element                                     | `class="my-animation ng-animate className"`                  |
         * | 8. `$animate` waits for a single animation frame (this performs a reflow)                                             | `class="my-animation ng-animate className"`                  |
         * | 9. `$animate` removes the CSS transition block placed on the element                                                  | `class="my-animation ng-animate className"`                  |
         * | 10. the `className-active` class is added (this triggers the CSS transition/animation)                                | `class="my-animation ng-animate className className-active"` |
         * | 11. `$animate` applies the collection of `to` CSS styles to the element which are then handled by the transition      | `class="my-animation ng-animate className className-active"` |
         * | 12. `$animate` waits for the animation to complete (via events and timeout)                                           | `class="my-animation ng-animate className className-active"` |
         * | 13. The animation ends and all generated CSS classes are removed from the element                                     | `class="my-animation"`                                       |
         * | 14. The returned promise is resolved.                                                                                 | `class="my-animation"`                                       |
         *
         * @param {DOMElement} element the element that will be the focus of the enter animation
         * @param {object} from a collection of CSS styles that will be applied to the element at the start of the animation
         * @param {object} to a collection of CSS styles that the element will animate towards
         * @param {string=} className an optional CSS class that will be added to the element for the duration of the animation (the default class is `ng-inline-animate`)
         * @param {object=} options an optional collection of options that will be picked up by the CSS transition/animation
         * @return {Promise} the animation callback promise
        */
        animate: function(element, from, to, className, options) {
          className = className || 'ng-inline-animate';
          options = parseAnimateOptions(options) || {};
          options.from = to ? from : null;
          options.to   = to ? to : from;

          return runAnimationPostDigest(function(done) {
            return performAnimation('animate', className, stripCommentsFromElement(element), null, null, noop, options, done);
          });
        },

        /**
         * @ngdoc method
         * @name $animate#enter
         * @kind function
         *
         * @description
         * Appends the element to the parentElement element that resides in the document and then runs the enter animation. Once
         * the animation is started, the following CSS classes will be present on the element for the duration of the animation:
         *
         * Below is a breakdown of each step that occurs during enter animation:
         *
         * | Animation Step                                                                                                        | What the element class attribute looks like                |
         * |-----------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------|
         * | 1. `$animate.enter(...)` is called                                                                                    | `class="my-animation"`                                     |
         * | 2. element is inserted into the `parentElement` element or beside the `afterElement` element                          | `class="my-animation"`                                     |
         * | 3. `$animate` waits for the next digest to start the animation                                                        | `class="my-animation ng-animate"`                          |
         * | 4. `$animate` runs the JavaScript-defined animations detected on the element                                          | `class="my-animation ng-animate"`                          |
         * | 5. the `.ng-enter` class is added to the element                                                                      | `class="my-animation ng-animate ng-enter"`                 |
         * | 6. `$animate` scans the element styles to get the CSS transition/animation duration and delay                         | `class="my-animation ng-animate ng-enter"`                 |
         * | 7. `$animate` blocks all CSS transitions on the element to ensure the `.ng-enter` class styling is applied right away | `class="my-animation ng-animate ng-enter"`                 |
         * | 8. `$animate` waits for a single animation frame (this performs a reflow)                                             | `class="my-animation ng-animate ng-enter"`                 |
         * | 9. `$animate` removes the CSS transition block placed on the element                                                  | `class="my-animation ng-animate ng-enter"`                 |
         * | 10. the `.ng-enter-active` class is added (this triggers the CSS transition/animation)                                | `class="my-animation ng-animate ng-enter ng-enter-active"` |
         * | 11. `$animate` waits for the animation to complete (via events and timeout)                                           | `class="my-animation ng-animate ng-enter ng-enter-active"` |
         * | 12. The animation ends and all generated CSS classes are removed from the element                                     | `class="my-animation"`                                     |
         * | 13. The returned promise is resolved.                                                                                 | `class="my-animation"`                                     |
         *
         * @param {DOMElement} element the element that will be the focus of the enter animation
         * @param {DOMElement} parentElement the parent element of the element that will be the focus of the enter animation
         * @param {DOMElement} afterElement the sibling element (which is the previous element) of the element that will be the focus of the enter animation
         * @param {object=} options an optional collection of options that will be picked up by the CSS transition/animation
         * @return {Promise} the animation callback promise
        */
        enter: function(element, parentElement, afterElement, options) {
          options = parseAnimateOptions(options);
          element = angular.element(element);
          parentElement = prepareElement(parentElement);
          afterElement = prepareElement(afterElement);

          classBasedAnimationsBlocked(element, true);
          $delegate.enter(element, parentElement, afterElement);
          return runAnimationPostDigest(function(done) {
            return performAnimation('enter', 'ng-enter', stripCommentsFromElement(element), parentElement, afterElement, noop, options, done);
          });
        },

        /**
         * @ngdoc method
         * @name $animate#leave
         * @kind function
         *
         * @description
         * Runs the leave animation operation and, upon completion, removes the element from the DOM. Once
         * the animation is started, the following CSS classes will be added for the duration of the animation:
         *
         * Below is a breakdown of each step that occurs during leave animation:
         *
         * | Animation Step                                                                                                        | What the element class attribute looks like                |
         * |-----------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------|
         * | 1. `$animate.leave(...)` is called                                                                                    | `class="my-animation"`                                     |
         * | 2. `$animate` runs the JavaScript-defined animations detected on the element                                          | `class="my-animation ng-animate"`                          |
         * | 3. `$animate` waits for the next digest to start the animation                                                        | `class="my-animation ng-animate"`                          |
         * | 4. the `.ng-leave` class is added to the element                                                                      | `class="my-animation ng-animate ng-leave"`                 |
         * | 5. `$animate` scans the element styles to get the CSS transition/animation duration and delay                         | `class="my-animation ng-animate ng-leave"`                 |
         * | 6. `$animate` blocks all CSS transitions on the element to ensure the `.ng-leave` class styling is applied right away | `class="my-animation ng-animate ng-leave"`                 |
         * | 7. `$animate` waits for a single animation frame (this performs a reflow)                                             | `class="my-animation ng-animate ng-leave"`                 |
         * | 8. `$animate` removes the CSS transition block placed on the element                                                  | `class="my-animation ng-animate ng-leave"`                 |
         * | 9. the `.ng-leave-active` class is added (this triggers the CSS transition/animation)                                 | `class="my-animation ng-animate ng-leave ng-leave-active"` |
         * | 10. `$animate` waits for the animation to complete (via events and timeout)                                           | `class="my-animation ng-animate ng-leave ng-leave-active"` |
         * | 11. The animation ends and all generated CSS classes are removed from the element                                     | `class="my-animation"`                                     |
         * | 12. The element is removed from the DOM                                                                               | ...                                                        |
         * | 13. The returned promise is resolved.                                                                                 | ...                                                        |
         *
         * @param {DOMElement} element the element that will be the focus of the leave animation
         * @param {object=} options an optional collection of styles that will be picked up by the CSS transition/animation
         * @return {Promise} the animation callback promise
        */
        leave: function(element, options) {
          options = parseAnimateOptions(options);
          element = angular.element(element);

          cancelChildAnimations(element);
          classBasedAnimationsBlocked(element, true);
          return runAnimationPostDigest(function(done) {
            return performAnimation('leave', 'ng-leave', stripCommentsFromElement(element), null, null, function() {
              $delegate.leave(element);
            }, options, done);
          });
        },

        /**
         * @ngdoc method
         * @name $animate#move
         * @kind function
         *
         * @description
         * Fires the move DOM operation. Just before the animation starts, the animate service will either append it into the parentElement container or
         * add the element directly after the afterElement element if present. Then the move animation will be run. Once
         * the animation is started, the following CSS classes will be added for the duration of the animation:
         *
         * Below is a breakdown of each step that occurs during move animation:
         *
         * | Animation Step                                                                                                       | What the element class attribute looks like              |
         * |----------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------|
         * | 1. `$animate.move(...)` is called                                                                                    | `class="my-animation"`                                   |
         * | 2. element is moved into the parentElement element or beside the afterElement element                                | `class="my-animation"`                                   |
         * | 3. `$animate` waits for the next digest to start the animation                                                       | `class="my-animation ng-animate"`                        |
         * | 4. `$animate` runs the JavaScript-defined animations detected on the element                                         | `class="my-animation ng-animate"`                        |
         * | 5. the `.ng-move` class is added to the element                                                                      | `class="my-animation ng-animate ng-move"`                |
         * | 6. `$animate` scans the element styles to get the CSS transition/animation duration and delay                        | `class="my-animation ng-animate ng-move"`                |
         * | 7. `$animate` blocks all CSS transitions on the element to ensure the `.ng-move` class styling is applied right away | `class="my-animation ng-animate ng-move"`                |
         * | 8. `$animate` waits for a single animation frame (this performs a reflow)                                            | `class="my-animation ng-animate ng-move"`                |
         * | 9. `$animate` removes the CSS transition block placed on the element                                                 | `class="my-animation ng-animate ng-move"`                |
         * | 10. the `.ng-move-active` class is added (this triggers the CSS transition/animation)                                | `class="my-animation ng-animate ng-move ng-move-active"` |
         * | 11. `$animate` waits for the animation to complete (via events and timeout)                                          | `class="my-animation ng-animate ng-move ng-move-active"` |
         * | 12. The animation ends and all generated CSS classes are removed from the element                                    | `class="my-animation"`                                   |
         * | 13. The returned promise is resolved.                                                                                | `class="my-animation"`                                   |
         *
         * @param {DOMElement} element the element that will be the focus of the move animation
         * @param {DOMElement} parentElement the parentElement element of the element that will be the focus of the move animation
         * @param {DOMElement} afterElement the sibling element (which is the previous element) of the element that will be the focus of the move animation
         * @param {object=} options an optional collection of styles that will be picked up by the CSS transition/animation
         * @return {Promise} the animation callback promise
        */
        move: function(element, parentElement, afterElement, options) {
          options = parseAnimateOptions(options);
          element = angular.element(element);
          parentElement = prepareElement(parentElement);
          afterElement = prepareElement(afterElement);

          cancelChildAnimations(element);
          classBasedAnimationsBlocked(element, true);
          $delegate.move(element, parentElement, afterElement);
          return runAnimationPostDigest(function(done) {
            return performAnimation('move', 'ng-move', stripCommentsFromElement(element), parentElement, afterElement, noop, options, done);
          });
        },

        /**
         * @ngdoc method
         * @name $animate#addClass
         *
         * @description
         * Triggers a custom animation event based off the className variable and then attaches the className value to the element as a CSS class.
         * Unlike the other animation methods, the animate service will suffix the className value with {@type -add} in order to provide
         * the animate service the setup and active CSS classes in order to trigger the animation (this will be skipped if no CSS transitions
         * or keyframes are defined on the -add-active or base CSS class).
         *
         * Below is a breakdown of each step that occurs during addClass animation:
         *
         * | Animation Step                                                                                         | What the element class attribute looks like                        |
         * |--------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------|
         * | 1. `$animate.addClass(element, 'super')` is called                                                     | `class="my-animation"`                                             |
         * | 2. `$animate` runs the JavaScript-defined animations detected on the element                           | `class="my-animation ng-animate"`                                  |
         * | 3. the `.super-add` class is added to the element                                                      | `class="my-animation ng-animate super-add"`                        |
         * | 4. `$animate` waits for a single animation frame (this performs a reflow)                              | `class="my-animation ng-animate super-add"`                        |
         * | 5. the `.super` and `.super-add-active` classes are added (this triggers the CSS transition/animation) | `class="my-animation ng-animate super super-add super-add-active"` |
         * | 6. `$animate` scans the element styles to get the CSS transition/animation duration and delay          | `class="my-animation ng-animate super super-add super-add-active"` |
         * | 7. `$animate` waits for the animation to complete (via events and timeout)                             | `class="my-animation ng-animate super super-add super-add-active"` |
         * | 8. The animation ends and all generated CSS classes are removed from the element                       | `class="my-animation super"`                                       |
         * | 9. The super class is kept on the element                                                              | `class="my-animation super"`                                       |
         * | 10. The returned promise is resolved.                                                                  | `class="my-animation super"`                                       |
         *
         * @param {DOMElement} element the element that will be animated
         * @param {string} className the CSS class that will be added to the element and then animated
         * @param {object=} options an optional collection of styles that will be picked up by the CSS transition/animation
         * @return {Promise} the animation callback promise
        */
        addClass: function(element, className, options) {
          return this.setClass(element, className, [], options);
        },

        /**
         * @ngdoc method
         * @name $animate#removeClass
         *
         * @description
         * Triggers a custom animation event based off the className variable and then removes the CSS class provided by the className value
         * from the element. Unlike the other animation methods, the animate service will suffix the className value with {@type -remove} in
         * order to provide the animate service the setup and active CSS classes in order to trigger the animation (this will be skipped if
         * no CSS transitions or keyframes are defined on the -remove or base CSS classes).
         *
         * Below is a breakdown of each step that occurs during removeClass animation:
         *
         * | Animation Step                                                                                                       | What the element class attribute looks like                        |
         * |----------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------|
         * | 1. `$animate.removeClass(element, 'super')` is called                                                                | `class="my-animation super"`                                       |
         * | 2. `$animate` runs the JavaScript-defined animations detected on the element                                         | `class="my-animation super ng-animate"`                            |
         * | 3. the `.super-remove` class is added to the element                                                                 | `class="my-animation super ng-animate super-remove"`               |
         * | 4. `$animate` waits for a single animation frame (this performs a reflow)                                            | `class="my-animation super ng-animate super-remove"`               |
         * | 5. the `.super-remove-active` classes are added and `.super` is removed (this triggers the CSS transition/animation) | `class="my-animation ng-animate super-remove super-remove-active"` |
         * | 6. `$animate` scans the element styles to get the CSS transition/animation duration and delay                        | `class="my-animation ng-animate super-remove super-remove-active"` |
         * | 7. `$animate` waits for the animation to complete (via events and timeout)                                           | `class="my-animation ng-animate super-remove super-remove-active"` |
         * | 8. The animation ends and all generated CSS classes are removed from the element                                     | `class="my-animation"`                                             |
         * | 9. The returned promise is resolved.                                                                                 | `class="my-animation"`                                             |
         *
         *
         * @param {DOMElement} element the element that will be animated
         * @param {string} className the CSS class that will be animated and then removed from the element
         * @param {object=} options an optional collection of styles that will be picked up by the CSS transition/animation
         * @return {Promise} the animation callback promise
        */
        removeClass: function(element, className, options) {
          return this.setClass(element, [], className, options);
        },

        /**
         *
         * @ngdoc method
         * @name $animate#setClass
         *
         * @description Adds and/or removes the given CSS classes to and from the element.
         * Once complete, the `done()` callback will be fired (if provided).
         *
         * | Animation Step                                                                                                                               | What the element class attribute looks like                                            |
         * |----------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------|
         * | 1. `$animate.setClass(element, 'on', 'off')` is called                                                                                       | `class="my-animation off"`                                                             |
         * | 2. `$animate` runs the JavaScript-defined animations detected on the element                                                                 | `class="my-animation ng-animate off"`                                                  |
         * | 3. the `.on-add` and `.off-remove` classes are added to the element                                                                          | `class="my-animation ng-animate on-add off-remove off"`                                |
         * | 4. `$animate` waits for a single animation frame (this performs a reflow)                                                                    | `class="my-animation ng-animate on-add off-remove off"`                                |
         * | 5. the `.on`, `.on-add-active` and `.off-remove-active` classes are added and `.off` is removed (this triggers the CSS transition/animation) | `class="my-animation ng-animate on on-add on-add-active off-remove off-remove-active"` |
         * | 6. `$animate` scans the element styles to get the CSS transition/animation duration and delay                                                | `class="my-animation ng-animate on on-add on-add-active off-remove off-remove-active"` |
         * | 7. `$animate` waits for the animation to complete (via events and timeout)                                                                   | `class="my-animation ng-animate on on-add on-add-active off-remove off-remove-active"` |
         * | 8. The animation ends and all generated CSS classes are removed from the element                                                             | `class="my-animation on"`                                                              |
         * | 9. The returned promise is resolved.                                                                                                         | `class="my-animation on"`                                                              |
         *
         * @param {DOMElement} element the element which will have its CSS classes changed
         *   removed from it
         * @param {string} add the CSS classes which will be added to the element
         * @param {string} remove the CSS class which will be removed from the element
         *   CSS classes have been set on the element
         * @param {object=} options an optional collection of styles that will be picked up by the CSS transition/animation
         * @return {Promise} the animation callback promise
         */
        setClass: function(element, add, remove, options) {
          options = parseAnimateOptions(options);

          var STORAGE_KEY = '$$animateClasses';
          element = angular.element(element);
          element = stripCommentsFromElement(element);

          if (classBasedAnimationsBlocked(element)) {
            return $delegate.$$setClassImmediately(element, add, remove, options);
          }

          // we're using a combined array for both the add and remove
          // operations since the ORDER OF addClass and removeClass matters
          var classes, cache = element.data(STORAGE_KEY);
          var hasCache = !!cache;
          if (!cache) {
            cache = {};
            cache.classes = {};
          }
          classes = cache.classes;

          add = isArray(add) ? add : add.split(' ');
          forEach(add, function(c) {
            if (c && c.length) {
              classes[c] = true;
            }
          });

          remove = isArray(remove) ? remove : remove.split(' ');
          forEach(remove, function(c) {
            if (c && c.length) {
              classes[c] = false;
            }
          });

          if (hasCache) {
            if (options && cache.options) {
              cache.options = angular.extend(cache.options || {}, options);
            }

            //the digest cycle will combine all the animations into one function
            return cache.promise;
          } else {
            element.data(STORAGE_KEY, cache = {
              classes: classes,
              options: options
            });
          }

          return cache.promise = runAnimationPostDigest(function(done) {
            var parentElement = element.parent();
            var elementNode = extractElementNode(element);
            var parentNode = elementNode.parentNode;
            // TODO(matsko): move this code into the animationsDisabled() function once #8092 is fixed
            if (!parentNode || parentNode['$$NG_REMOVED'] || elementNode['$$NG_REMOVED']) {
              done();
              return;
            }

            var cache = element.data(STORAGE_KEY);
            element.removeData(STORAGE_KEY);

            var state = element.data(NG_ANIMATE_STATE) || {};
            var classes = resolveElementClasses(element, cache, state.active);
            return !classes
              ? done()
              : performAnimation('setClass', classes, element, parentElement, null, function() {
                  if (classes[0]) $delegate.$$addClassImmediately(element, classes[0]);
                  if (classes[1]) $delegate.$$removeClassImmediately(element, classes[1]);
                }, cache.options, done);
          });
        },

        /**
         * @ngdoc method
         * @name $animate#cancel
         * @kind function
         *
         * @param {Promise} animationPromise The animation promise that is returned when an animation is started.
         *
         * @description
         * Cancels the provided animation.
        */
        cancel: function(promise) {
          promise.$$cancelFn();
        },

        /**
         * @ngdoc method
         * @name $animate#enabled
         * @kind function
         *
         * @param {boolean=} value If provided then set the animation on or off.
         * @param {DOMElement=} element If provided then the element will be used to represent the enable/disable operation
         * @return {boolean} Current animation state.
         *
         * @description
         * Globally enables/disables animations.
         *
        */
        enabled: function(value, element) {
          switch (arguments.length) {
            case 2:
              if (value) {
                cleanup(element);
              } else {
                var data = element.data(NG_ANIMATE_STATE) || {};
                data.disabled = true;
                element.data(NG_ANIMATE_STATE, data);
              }
            break;

            case 1:
              rootAnimateState.disabled = !value;
            break;

            default:
              value = !rootAnimateState.disabled;
            break;
          }
          return !!value;
         }
      };

      /*
        all animations call this shared animation triggering function internally.
        The animationEvent variable refers to the JavaScript animation event that will be triggered
        and the className value is the name of the animation that will be applied within the
        CSS code. Element, `parentElement` and `afterElement` are provided DOM elements for the animation
        and the onComplete callback will be fired once the animation is fully complete.
      */
      function performAnimation(animationEvent, className, element, parentElement, afterElement, domOperation, options, doneCallback) {
        var noopCancel = noop;
        var runner = animationRunner(element, animationEvent, className, options);
        if (!runner) {
          fireDOMOperation();
          fireBeforeCallbackAsync();
          fireAfterCallbackAsync();
          closeAnimation();
          return noopCancel;
        }

        animationEvent = runner.event;
        className = runner.className;
        var elementEvents = angular.element._data(runner.node);
        elementEvents = elementEvents && elementEvents.events;

        if (!parentElement) {
          parentElement = afterElement ? afterElement.parent() : element.parent();
        }

        //skip the animation if animations are disabled, a parent is already being animated,
        //the element is not currently attached to the document body or then completely close
        //the animation if any matching animations are not found at all.
        //NOTE: IE8 + IE9 should close properly (run closeAnimation()) in case an animation was found.
        if (animationsDisabled(element, parentElement)) {
          fireDOMOperation();
          fireBeforeCallbackAsync();
          fireAfterCallbackAsync();
          closeAnimation();
          return noopCancel;
        }

        var ngAnimateState  = element.data(NG_ANIMATE_STATE) || {};
        var runningAnimations     = ngAnimateState.active || {};
        var totalActiveAnimations = ngAnimateState.totalActive || 0;
        var lastAnimation         = ngAnimateState.last;
        var skipAnimation = false;

        if (totalActiveAnimations > 0) {
          var animationsToCancel = [];
          if (!runner.isClassBased) {
            if (animationEvent == 'leave' && runningAnimations['ng-leave']) {
              skipAnimation = true;
            } else {
              //cancel all animations when a structural animation takes place
              for (var klass in runningAnimations) {
                animationsToCancel.push(runningAnimations[klass]);
              }
              ngAnimateState = {};
              cleanup(element, true);
            }
          } else if (lastAnimation.event == 'setClass') {
            animationsToCancel.push(lastAnimation);
            cleanup(element, className);
          } else if (runningAnimations[className]) {
            var current = runningAnimations[className];
            if (current.event == animationEvent) {
              skipAnimation = true;
            } else {
              animationsToCancel.push(current);
              cleanup(element, className);
            }
          }

          if (animationsToCancel.length > 0) {
            forEach(animationsToCancel, function(operation) {
              operation.cancel();
            });
          }
        }

        if (runner.isClassBased
            && !runner.isSetClassOperation
            && animationEvent != 'animate'
            && !skipAnimation) {
          skipAnimation = (animationEvent == 'addClass') == element.hasClass(className); //opposite of XOR
        }

        if (skipAnimation) {
          fireDOMOperation();
          fireBeforeCallbackAsync();
          fireAfterCallbackAsync();
          fireDoneCallbackAsync();
          return noopCancel;
        }

        runningAnimations     = ngAnimateState.active || {};
        totalActiveAnimations = ngAnimateState.totalActive || 0;

        if (animationEvent == 'leave') {
          //there's no need to ever remove the listener since the element
          //will be removed (destroyed) after the leave animation ends or
          //is cancelled midway
          element.one('$destroy', function(e) {
            var element = angular.element(this);
            var state = element.data(NG_ANIMATE_STATE);
            if (state) {
              var activeLeaveAnimation = state.active['ng-leave'];
              if (activeLeaveAnimation) {
                activeLeaveAnimation.cancel();
                cleanup(element, 'ng-leave');
              }
            }
          });
        }

        //the ng-animate class does nothing, but it's here to allow for
        //parent animations to find and cancel child animations when needed
        $$jqLite.addClass(element, NG_ANIMATE_CLASS_NAME);
        if (options && options.tempClasses) {
          forEach(options.tempClasses, function(className) {
            $$jqLite.addClass(element, className);
          });
        }

        var localAnimationCount = globalAnimationCounter++;
        totalActiveAnimations++;
        runningAnimations[className] = runner;

        element.data(NG_ANIMATE_STATE, {
          last: runner,
          active: runningAnimations,
          index: localAnimationCount,
          totalActive: totalActiveAnimations
        });

        //first we run the before animations and when all of those are complete
        //then we perform the DOM operation and run the next set of animations
        fireBeforeCallbackAsync();
        runner.before(function(cancelled) {
          var data = element.data(NG_ANIMATE_STATE);
          cancelled = cancelled ||
                        !data || !data.active[className] ||
                        (runner.isClassBased && data.active[className].event != animationEvent);

          fireDOMOperation();
          if (cancelled === true) {
            closeAnimation();
          } else {
            fireAfterCallbackAsync();
            runner.after(closeAnimation);
          }
        });

        return runner.cancel;

        function fireDOMCallback(animationPhase) {
          var eventName = '$animate:' + animationPhase;
          if (elementEvents && elementEvents[eventName] && elementEvents[eventName].length > 0) {
            $$asyncCallback(function() {
              element.triggerHandler(eventName, {
                event: animationEvent,
                className: className
              });
            });
          }
        }

        function fireBeforeCallbackAsync() {
          fireDOMCallback('before');
        }

        function fireAfterCallbackAsync() {
          fireDOMCallback('after');
        }

        function fireDoneCallbackAsync() {
          fireDOMCallback('close');
          doneCallback();
        }

        //it is less complicated to use a flag than managing and canceling
        //timeouts containing multiple callbacks.
        function fireDOMOperation() {
          if (!fireDOMOperation.hasBeenRun) {
            fireDOMOperation.hasBeenRun = true;
            domOperation();
          }
        }

        function closeAnimation() {
          if (!closeAnimation.hasBeenRun) {
            if (runner) { //the runner doesn't exist if it fails to instantiate
              runner.applyStyles();
            }

            closeAnimation.hasBeenRun = true;
            if (options && options.tempClasses) {
              forEach(options.tempClasses, function(className) {
                $$jqLite.removeClass(element, className);
              });
            }

            var data = element.data(NG_ANIMATE_STATE);
            if (data) {

              /* only structural animations wait for reflow before removing an
                 animation, but class-based animations don't. An example of this
                 failing would be when a parent HTML tag has a ng-class attribute
                 causing ALL directives below to skip animations during the digest */
              if (runner && runner.isClassBased) {
                cleanup(element, className);
              } else {
                $$asyncCallback(function() {
                  var data = element.data(NG_ANIMATE_STATE) || {};
                  if (localAnimationCount == data.index) {
                    cleanup(element, className, animationEvent);
                  }
                });
                element.data(NG_ANIMATE_STATE, data);
              }
            }
            fireDoneCallbackAsync();
          }
        }
      }

      function cancelChildAnimations(element) {
        var node = extractElementNode(element);
        if (node) {
          var nodes = angular.isFunction(node.getElementsByClassName) ?
            node.getElementsByClassName(NG_ANIMATE_CLASS_NAME) :
            node.querySelectorAll('.' + NG_ANIMATE_CLASS_NAME);
          forEach(nodes, function(element) {
            element = angular.element(element);
            var data = element.data(NG_ANIMATE_STATE);
            if (data && data.active) {
              forEach(data.active, function(runner) {
                runner.cancel();
              });
            }
          });
        }
      }

      function cleanup(element, className) {
        if (isMatchingElement(element, $rootElement)) {
          if (!rootAnimateState.disabled) {
            rootAnimateState.running = false;
            rootAnimateState.structural = false;
          }
        } else if (className) {
          var data = element.data(NG_ANIMATE_STATE) || {};

          var removeAnimations = className === true;
          if (!removeAnimations && data.active && data.active[className]) {
            data.totalActive--;
            delete data.active[className];
          }

          if (removeAnimations || !data.totalActive) {
            $$jqLite.removeClass(element, NG_ANIMATE_CLASS_NAME);
            element.removeData(NG_ANIMATE_STATE);
          }
        }
      }

      function animationsDisabled(element, parentElement) {
        if (rootAnimateState.disabled) {
          return true;
        }

        if (isMatchingElement(element, $rootElement)) {
          return rootAnimateState.running;
        }

        var allowChildAnimations, parentRunningAnimation, hasParent;
        do {
          //the element did not reach the root element which means that it
          //is not apart of the DOM. Therefore there is no reason to do
          //any animations on it
          if (parentElement.length === 0) break;

          var isRoot = isMatchingElement(parentElement, $rootElement);
          var state = isRoot ? rootAnimateState : (parentElement.data(NG_ANIMATE_STATE) || {});
          if (state.disabled) {
            return true;
          }

          //no matter what, for an animation to work it must reach the root element
          //this implies that the element is attached to the DOM when the animation is run
          if (isRoot) {
            hasParent = true;
          }

          //once a flag is found that is strictly false then everything before
          //it will be discarded and all child animations will be restricted
          if (allowChildAnimations !== false) {
            var animateChildrenFlag = parentElement.data(NG_ANIMATE_CHILDREN);
            if (angular.isDefined(animateChildrenFlag)) {
              allowChildAnimations = animateChildrenFlag;
            }
          }

          parentRunningAnimation = parentRunningAnimation ||
                                   state.running ||
                                   (state.last && !state.last.isClassBased);
        }
        while (parentElement = parentElement.parent());

        return !hasParent || (!allowChildAnimations && parentRunningAnimation);
      }
    }]);

    $animateProvider.register('', ['$window', '$sniffer', '$timeout', '$$animateReflow',
                           function($window,   $sniffer,   $timeout,   $$animateReflow) {
      // Detect proper transitionend/animationend event names.
      var CSS_PREFIX = '', TRANSITION_PROP, TRANSITIONEND_EVENT, ANIMATION_PROP, ANIMATIONEND_EVENT;

      // If unprefixed events are not supported but webkit-prefixed are, use the latter.
      // Otherwise, just use W3C names, browsers not supporting them at all will just ignore them.
      // Note: Chrome implements `window.onwebkitanimationend` and doesn't implement `window.onanimationend`
      // but at the same time dispatches the `animationend` event and not `webkitAnimationEnd`.
      // Register both events in case `window.onanimationend` is not supported because of that,
      // do the same for `transitionend` as Safari is likely to exhibit similar behavior.
      // Also, the only modern browser that uses vendor prefixes for transitions/keyframes is webkit
      // therefore there is no reason to test anymore for other vendor prefixes: http://caniuse.com/#search=transition
      if (window.ontransitionend === undefined && window.onwebkittransitionend !== undefined) {
        CSS_PREFIX = '-webkit-';
        TRANSITION_PROP = 'WebkitTransition';
        TRANSITIONEND_EVENT = 'webkitTransitionEnd transitionend';
      } else {
        TRANSITION_PROP = 'transition';
        TRANSITIONEND_EVENT = 'transitionend';
      }

      if (window.onanimationend === undefined && window.onwebkitanimationend !== undefined) {
        CSS_PREFIX = '-webkit-';
        ANIMATION_PROP = 'WebkitAnimation';
        ANIMATIONEND_EVENT = 'webkitAnimationEnd animationend';
      } else {
        ANIMATION_PROP = 'animation';
        ANIMATIONEND_EVENT = 'animationend';
      }

      var DURATION_KEY = 'Duration';
      var PROPERTY_KEY = 'Property';
      var DELAY_KEY = 'Delay';
      var ANIMATION_ITERATION_COUNT_KEY = 'IterationCount';
      var ANIMATION_PLAYSTATE_KEY = 'PlayState';
      var NG_ANIMATE_PARENT_KEY = '$$ngAnimateKey';
      var NG_ANIMATE_CSS_DATA_KEY = '$$ngAnimateCSS3Data';
      var ELAPSED_TIME_MAX_DECIMAL_PLACES = 3;
      var CLOSING_TIME_BUFFER = 1.5;
      var ONE_SECOND = 1000;

      var lookupCache = {};
      var parentCounter = 0;
      var animationReflowQueue = [];
      var cancelAnimationReflow;
      function clearCacheAfterReflow() {
        if (!cancelAnimationReflow) {
          cancelAnimationReflow = $$animateReflow(function() {
            animationReflowQueue = [];
            cancelAnimationReflow = null;
            lookupCache = {};
          });
        }
      }

      function afterReflow(element, callback) {
        if (cancelAnimationReflow) {
          cancelAnimationReflow();
        }
        animationReflowQueue.push(callback);
        cancelAnimationReflow = $$animateReflow(function() {
          forEach(animationReflowQueue, function(fn) {
            fn();
          });

          animationReflowQueue = [];
          cancelAnimationReflow = null;
          lookupCache = {};
        });
      }

      var closingTimer = null;
      var closingTimestamp = 0;
      var animationElementQueue = [];
      function animationCloseHandler(element, totalTime) {
        var node = extractElementNode(element);
        element = angular.element(node);

        //this item will be garbage collected by the closing
        //animation timeout
        animationElementQueue.push(element);

        //but it may not need to cancel out the existing timeout
        //if the timestamp is less than the previous one
        var futureTimestamp = Date.now() + totalTime;
        if (futureTimestamp <= closingTimestamp) {
          return;
        }

        $timeout.cancel(closingTimer);

        closingTimestamp = futureTimestamp;
        closingTimer = $timeout(function() {
          closeAllAnimations(animationElementQueue);
          animationElementQueue = [];
        }, totalTime, false);
      }

      function closeAllAnimations(elements) {
        forEach(elements, function(element) {
          var elementData = element.data(NG_ANIMATE_CSS_DATA_KEY);
          if (elementData) {
            forEach(elementData.closeAnimationFns, function(fn) {
              fn();
            });
          }
        });
      }

      function getElementAnimationDetails(element, cacheKey) {
        var data = cacheKey ? lookupCache[cacheKey] : null;
        if (!data) {
          var transitionDuration = 0;
          var transitionDelay = 0;
          var animationDuration = 0;
          var animationDelay = 0;

          //we want all the styles defined before and after
          forEach(element, function(element) {
            if (element.nodeType == ELEMENT_NODE) {
              var elementStyles = $window.getComputedStyle(element) || {};

              var transitionDurationStyle = elementStyles[TRANSITION_PROP + DURATION_KEY];
              transitionDuration = Math.max(parseMaxTime(transitionDurationStyle), transitionDuration);

              var transitionDelayStyle = elementStyles[TRANSITION_PROP + DELAY_KEY];
              transitionDelay  = Math.max(parseMaxTime(transitionDelayStyle), transitionDelay);

              var animationDelayStyle = elementStyles[ANIMATION_PROP + DELAY_KEY];
              animationDelay   = Math.max(parseMaxTime(elementStyles[ANIMATION_PROP + DELAY_KEY]), animationDelay);

              var aDuration  = parseMaxTime(elementStyles[ANIMATION_PROP + DURATION_KEY]);

              if (aDuration > 0) {
                aDuration *= parseInt(elementStyles[ANIMATION_PROP + ANIMATION_ITERATION_COUNT_KEY], 10) || 1;
              }
              animationDuration = Math.max(aDuration, animationDuration);
            }
          });
          data = {
            total: 0,
            transitionDelay: transitionDelay,
            transitionDuration: transitionDuration,
            animationDelay: animationDelay,
            animationDuration: animationDuration
          };
          if (cacheKey) {
            lookupCache[cacheKey] = data;
          }
        }
        return data;
      }

      function parseMaxTime(str) {
        var maxValue = 0;
        var values = isString(str) ?
          str.split(/\s*,\s*/) :
          [];
        forEach(values, function(value) {
          maxValue = Math.max(parseFloat(value) || 0, maxValue);
        });
        return maxValue;
      }

      function getCacheKey(element) {
        var parentElement = element.parent();
        var parentID = parentElement.data(NG_ANIMATE_PARENT_KEY);
        if (!parentID) {
          parentElement.data(NG_ANIMATE_PARENT_KEY, ++parentCounter);
          parentID = parentCounter;
        }
        return parentID + '-' + extractElementNode(element).getAttribute('class');
      }

      function animateSetup(animationEvent, element, className, styles) {
        var structural = ['ng-enter','ng-leave','ng-move'].indexOf(className) >= 0;

        var cacheKey = getCacheKey(element);
        var eventCacheKey = cacheKey + ' ' + className;
        var itemIndex = lookupCache[eventCacheKey] ? ++lookupCache[eventCacheKey].total : 0;

        var stagger = {};
        if (itemIndex > 0) {
          var staggerClassName = className + '-stagger';
          var staggerCacheKey = cacheKey + ' ' + staggerClassName;
          var applyClasses = !lookupCache[staggerCacheKey];

          applyClasses && $$jqLite.addClass(element, staggerClassName);

          stagger = getElementAnimationDetails(element, staggerCacheKey);

          applyClasses && $$jqLite.removeClass(element, staggerClassName);
        }

        $$jqLite.addClass(element, className);

        var formerData = element.data(NG_ANIMATE_CSS_DATA_KEY) || {};
        var timings = getElementAnimationDetails(element, eventCacheKey);
        var transitionDuration = timings.transitionDuration;
        var animationDuration = timings.animationDuration;

        if (structural && transitionDuration === 0 && animationDuration === 0) {
          $$jqLite.removeClass(element, className);
          return false;
        }

        var blockTransition = styles || (structural && transitionDuration > 0);
        var blockAnimation = animationDuration > 0 &&
                             stagger.animationDelay > 0 &&
                             stagger.animationDuration === 0;

        var closeAnimationFns = formerData.closeAnimationFns || [];
        element.data(NG_ANIMATE_CSS_DATA_KEY, {
          stagger: stagger,
          cacheKey: eventCacheKey,
          running: formerData.running || 0,
          itemIndex: itemIndex,
          blockTransition: blockTransition,
          closeAnimationFns: closeAnimationFns
        });

        var node = extractElementNode(element);

        if (blockTransition) {
          blockTransitions(node, true);
          if (styles) {
            element.css(styles);
          }
        }

        if (blockAnimation) {
          blockAnimations(node, true);
        }

        return true;
      }

      function animateRun(animationEvent, element, className, activeAnimationComplete, styles) {
        var node = extractElementNode(element);
        var elementData = element.data(NG_ANIMATE_CSS_DATA_KEY);
        if (node.getAttribute('class').indexOf(className) == -1 || !elementData) {
          activeAnimationComplete();
          return;
        }

        var activeClassName = '';
        var pendingClassName = '';
        forEach(className.split(' '), function(klass, i) {
          var prefix = (i > 0 ? ' ' : '') + klass;
          activeClassName += prefix + '-active';
          pendingClassName += prefix + '-pending';
        });

        var style = '';
        var appliedStyles = [];
        var itemIndex = elementData.itemIndex;
        var stagger = elementData.stagger;
        var staggerTime = 0;
        if (itemIndex > 0) {
          var transitionStaggerDelay = 0;
          if (stagger.transitionDelay > 0 && stagger.transitionDuration === 0) {
            transitionStaggerDelay = stagger.transitionDelay * itemIndex;
          }

          var animationStaggerDelay = 0;
          if (stagger.animationDelay > 0 && stagger.animationDuration === 0) {
            animationStaggerDelay = stagger.animationDelay * itemIndex;
            appliedStyles.push(CSS_PREFIX + 'animation-play-state');
          }

          staggerTime = Math.round(Math.max(transitionStaggerDelay, animationStaggerDelay) * 100) / 100;
        }

        if (!staggerTime) {
          $$jqLite.addClass(element, activeClassName);
          if (elementData.blockTransition) {
            blockTransitions(node, false);
          }
        }

        var eventCacheKey = elementData.cacheKey + ' ' + activeClassName;
        var timings = getElementAnimationDetails(element, eventCacheKey);
        var maxDuration = Math.max(timings.transitionDuration, timings.animationDuration);
        if (maxDuration === 0) {
          $$jqLite.removeClass(element, activeClassName);
          animateClose(element, className);
          activeAnimationComplete();
          return;
        }

        if (!staggerTime && styles && Object.keys(styles).length > 0) {
          if (!timings.transitionDuration) {
            element.css('transition', timings.animationDuration + 's linear all');
            appliedStyles.push('transition');
          }
          element.css(styles);
        }

        var maxDelay = Math.max(timings.transitionDelay, timings.animationDelay);
        var maxDelayTime = maxDelay * ONE_SECOND;

        if (appliedStyles.length > 0) {
          //the element being animated may sometimes contain comment nodes in
          //the jqLite object, so we're safe to use a single variable to house
          //the styles since there is always only one element being animated
          var oldStyle = node.getAttribute('style') || '';
          if (oldStyle.charAt(oldStyle.length - 1) !== ';') {
            oldStyle += ';';
          }
          node.setAttribute('style', oldStyle + ' ' + style);
        }

        var startTime = Date.now();
        var css3AnimationEvents = ANIMATIONEND_EVENT + ' ' + TRANSITIONEND_EVENT;
        var animationTime     = (maxDelay + maxDuration) * CLOSING_TIME_BUFFER;
        var totalTime         = (staggerTime + animationTime) * ONE_SECOND;

        var staggerTimeout;
        if (staggerTime > 0) {
          $$jqLite.addClass(element, pendingClassName);
          staggerTimeout = $timeout(function() {
            staggerTimeout = null;

            if (timings.transitionDuration > 0) {
              blockTransitions(node, false);
            }
            if (timings.animationDuration > 0) {
              blockAnimations(node, false);
            }

            $$jqLite.addClass(element, activeClassName);
            $$jqLite.removeClass(element, pendingClassName);

            if (styles) {
              if (timings.transitionDuration === 0) {
                element.css('transition', timings.animationDuration + 's linear all');
              }
              element.css(styles);
              appliedStyles.push('transition');
            }
          }, staggerTime * ONE_SECOND, false);
        }

        element.on(css3AnimationEvents, onAnimationProgress);
        elementData.closeAnimationFns.push(function() {
          onEnd();
          activeAnimationComplete();
        });

        elementData.running++;
        animationCloseHandler(element, totalTime);
        return onEnd;

        // This will automatically be called by $animate so
        // there is no need to attach this internally to the
        // timeout done method.
        function onEnd() {
          element.off(css3AnimationEvents, onAnimationProgress);
          $$jqLite.removeClass(element, activeClassName);
          $$jqLite.removeClass(element, pendingClassName);
          if (staggerTimeout) {
            $timeout.cancel(staggerTimeout);
          }
          animateClose(element, className);
          var node = extractElementNode(element);
          for (var i in appliedStyles) {
            node.style.removeProperty(appliedStyles[i]);
          }
        }

        function onAnimationProgress(event) {
          event.stopPropagation();
          var ev = event.originalEvent || event;
          var timeStamp = ev.$manualTimeStamp || ev.timeStamp || Date.now();

          /* Firefox (or possibly just Gecko) likes to not round values up
           * when a ms measurement is used for the animation */
          var elapsedTime = parseFloat(ev.elapsedTime.toFixed(ELAPSED_TIME_MAX_DECIMAL_PLACES));

          /* $manualTimeStamp is a mocked timeStamp value which is set
           * within browserTrigger(). This is only here so that tests can
           * mock animations properly. Real events fallback to event.timeStamp,
           * or, if they don't, then a timeStamp is automatically created for them.
           * We're checking to see if the timeStamp surpasses the expected delay,
           * but we're using elapsedTime instead of the timeStamp on the 2nd
           * pre-condition since animations sometimes close off early */
          if (Math.max(timeStamp - startTime, 0) >= maxDelayTime && elapsedTime >= maxDuration) {
            activeAnimationComplete();
          }
        }
      }

      function blockTransitions(node, bool) {
        node.style[TRANSITION_PROP + PROPERTY_KEY] = bool ? 'none' : '';
      }

      function blockAnimations(node, bool) {
        node.style[ANIMATION_PROP + ANIMATION_PLAYSTATE_KEY] = bool ? 'paused' : '';
      }

      function animateBefore(animationEvent, element, className, styles) {
        if (animateSetup(animationEvent, element, className, styles)) {
          return function(cancelled) {
            cancelled && animateClose(element, className);
          };
        }
      }

      function animateAfter(animationEvent, element, className, afterAnimationComplete, styles) {
        if (element.data(NG_ANIMATE_CSS_DATA_KEY)) {
          return animateRun(animationEvent, element, className, afterAnimationComplete, styles);
        } else {
          animateClose(element, className);
          afterAnimationComplete();
        }
      }

      function animate(animationEvent, element, className, animationComplete, options) {
        //If the animateSetup function doesn't bother returning a
        //cancellation function then it means that there is no animation
        //to perform at all
        var preReflowCancellation = animateBefore(animationEvent, element, className, options.from);
        if (!preReflowCancellation) {
          clearCacheAfterReflow();
          animationComplete();
          return;
        }

        //There are two cancellation functions: one is before the first
        //reflow animation and the second is during the active state
        //animation. The first function will take care of removing the
        //data from the element which will not make the 2nd animation
        //happen in the first place
        var cancel = preReflowCancellation;
        afterReflow(element, function() {
          //once the reflow is complete then we point cancel to
          //the new cancellation function which will remove all of the
          //animation properties from the active animation
          cancel = animateAfter(animationEvent, element, className, animationComplete, options.to);
        });

        return function(cancelled) {
          (cancel || noop)(cancelled);
        };
      }

      function animateClose(element, className) {
        $$jqLite.removeClass(element, className);
        var data = element.data(NG_ANIMATE_CSS_DATA_KEY);
        if (data) {
          if (data.running) {
            data.running--;
          }
          if (!data.running || data.running === 0) {
            element.removeData(NG_ANIMATE_CSS_DATA_KEY);
          }
        }
      }

      return {
        animate: function(element, className, from, to, animationCompleted, options) {
          options = options || {};
          options.from = from;
          options.to = to;
          return animate('animate', element, className, animationCompleted, options);
        },

        enter: function(element, animationCompleted, options) {
          options = options || {};
          return animate('enter', element, 'ng-enter', animationCompleted, options);
        },

        leave: function(element, animationCompleted, options) {
          options = options || {};
          return animate('leave', element, 'ng-leave', animationCompleted, options);
        },

        move: function(element, animationCompleted, options) {
          options = options || {};
          return animate('move', element, 'ng-move', animationCompleted, options);
        },

        beforeSetClass: function(element, add, remove, animationCompleted, options) {
          options = options || {};
          var className = suffixClasses(remove, '-remove') + ' ' +
                          suffixClasses(add, '-add');
          var cancellationMethod = animateBefore('setClass', element, className, options.from);
          if (cancellationMethod) {
            afterReflow(element, animationCompleted);
            return cancellationMethod;
          }
          clearCacheAfterReflow();
          animationCompleted();
        },

        beforeAddClass: function(element, className, animationCompleted, options) {
          options = options || {};
          var cancellationMethod = animateBefore('addClass', element, suffixClasses(className, '-add'), options.from);
          if (cancellationMethod) {
            afterReflow(element, animationCompleted);
            return cancellationMethod;
          }
          clearCacheAfterReflow();
          animationCompleted();
        },

        beforeRemoveClass: function(element, className, animationCompleted, options) {
          options = options || {};
          var cancellationMethod = animateBefore('removeClass', element, suffixClasses(className, '-remove'), options.from);
          if (cancellationMethod) {
            afterReflow(element, animationCompleted);
            return cancellationMethod;
          }
          clearCacheAfterReflow();
          animationCompleted();
        },

        setClass: function(element, add, remove, animationCompleted, options) {
          options = options || {};
          remove = suffixClasses(remove, '-remove');
          add = suffixClasses(add, '-add');
          var className = remove + ' ' + add;
          return animateAfter('setClass', element, className, animationCompleted, options.to);
        },

        addClass: function(element, className, animationCompleted, options) {
          options = options || {};
          return animateAfter('addClass', element, suffixClasses(className, '-add'), animationCompleted, options.to);
        },

        removeClass: function(element, className, animationCompleted, options) {
          options = options || {};
          return animateAfter('removeClass', element, suffixClasses(className, '-remove'), animationCompleted, options.to);
        }
      };

      function suffixClasses(classes, suffix) {
        var className = '';
        classes = isArray(classes) ? classes : classes.split(/\s+/);
        forEach(classes, function(klass, i) {
          if (klass && klass.length > 0) {
            className += (i > 0 ? ' ' : '') + klass + suffix;
          }
        });
        return className;
      }
    }]);
  }]);


})(window, window.angular);

!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.angularStripe=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

module.exports = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null)
  .module('angular-stripe', [])
  .provider('stripe', require('./provider'))
  .name;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./provider":2}],2:[function(require,module,exports){
(function (global){
'use strict';

var Stripe = (typeof window !== "undefined" ? window.Stripe : typeof global !== "undefined" ? global.Stripe : null);

module.exports = function () {
  this.setPublishableKey = Stripe.setPublishableKey;
  this.$get = require('./service');
};
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./service":3}],3:[function(require,module,exports){
(function (global){
'use strict';

var angular = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);
var Stripe  = (typeof window !== "undefined" ? window.Stripe : typeof global !== "undefined" ? global.Stripe : null);

module.exports = function ($q) {

  function promisify (receiver, method) {
    return function (data, params) {
      if (typeof params === 'function') {
        throw new Error('"params" cannot be a function');
      }
      return $q(function (resolve, reject) {
        receiver[method](data, params, function (status, response) {
          if (response.error) {
            return reject(angular.extend(new Error(), response.error));
          }
          else {
            return resolve(response);
          }
        });
      });
    };
  }

  function wrap (source, options) {
    var angularStripe = {
      setPublishableKey: Stripe.setPublishableKey
    };
    angular.forEach(options, function (methods, receiver) {
      var destination = angularStripe[receiver] = {};
      receiver = Stripe[receiver];
      angular.forEach(methods.promisify, function (method) {
        destination[method] = promisify(receiver, method);
      });
      angular.forEach(methods.reference, function (method) {
        destination[method] = receiver[method];
      });
    });
    return angularStripe;
  }

  return wrap(Stripe, {
    card: {
      reference: ['validateCardNumber', 'validateExpiry', 'validateCVC', 'cardType'],
      promisify: ['createToken']
    },
    bankAccount: {
      reference: ['validateRoutingNumber', 'validateAccountNumber'],
      promisify: ['createToken']
    }
  });
};

module.exports.$inject = ['$q'];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});
/**
 * @license AngularJS v1.3.15
 * (c) 2010-2014 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, angular, undefined) {'use strict';

/**
 * @ngdoc module
 * @name ngTouch
 * @description
 *
 * # ngTouch
 *
 * The `ngTouch` module provides touch events and other helpers for touch-enabled devices.
 * The implementation is based on jQuery Mobile touch event handling
 * ([jquerymobile.com](http://jquerymobile.com/)).
 *
 *
 * See {@link ngTouch.$swipe `$swipe`} for usage.
 *
 * <div doc-module-components="ngTouch"></div>
 *
 */

// define ngTouch module
/* global -ngTouch */
var ngTouch = angular.module('ngTouch', []);

/* global ngTouch: false */

    /**
     * @ngdoc service
     * @name $swipe
     *
     * @description
     * The `$swipe` service is a service that abstracts the messier details of hold-and-drag swipe
     * behavior, to make implementing swipe-related directives more convenient.
     *
     * Requires the {@link ngTouch `ngTouch`} module to be installed.
     *
     * `$swipe` is used by the `ngSwipeLeft` and `ngSwipeRight` directives in `ngTouch`, and by
     * `ngCarousel` in a separate component.
     *
     * # Usage
     * The `$swipe` service is an object with a single method: `bind`. `bind` takes an element
     * which is to be watched for swipes, and an object with four handler functions. See the
     * documentation for `bind` below.
     */

ngTouch.factory('$swipe', [function() {
  // The total distance in any direction before we make the call on swipe vs. scroll.
  var MOVE_BUFFER_RADIUS = 10;

  var POINTER_EVENTS = {
    'mouse': {
      start: 'mousedown',
      move: 'mousemove',
      end: 'mouseup'
    },
    'touch': {
      start: 'touchstart',
      move: 'touchmove',
      end: 'touchend',
      cancel: 'touchcancel'
    }
  };

  function getCoordinates(event) {
    var touches = event.touches && event.touches.length ? event.touches : [event];
    var e = (event.changedTouches && event.changedTouches[0]) ||
        (event.originalEvent && event.originalEvent.changedTouches &&
            event.originalEvent.changedTouches[0]) ||
        touches[0].originalEvent || touches[0];

    return {
      x: e.clientX,
      y: e.clientY
    };
  }

  function getEvents(pointerTypes, eventType) {
    var res = [];
    angular.forEach(pointerTypes, function(pointerType) {
      var eventName = POINTER_EVENTS[pointerType][eventType];
      if (eventName) {
        res.push(eventName);
      }
    });
    return res.join(' ');
  }

  return {
    /**
     * @ngdoc method
     * @name $swipe#bind
     *
     * @description
     * The main method of `$swipe`. It takes an element to be watched for swipe motions, and an
     * object containing event handlers.
     * The pointer types that should be used can be specified via the optional
     * third argument, which is an array of strings `'mouse'` and `'touch'`. By default,
     * `$swipe` will listen for `mouse` and `touch` events.
     *
     * The four events are `start`, `move`, `end`, and `cancel`. `start`, `move`, and `end`
     * receive as a parameter a coordinates object of the form `{ x: 150, y: 310 }`.
     *
     * `start` is called on either `mousedown` or `touchstart`. After this event, `$swipe` is
     * watching for `touchmove` or `mousemove` events. These events are ignored until the total
     * distance moved in either dimension exceeds a small threshold.
     *
     * Once this threshold is exceeded, either the horizontal or vertical delta is greater.
     * - If the horizontal distance is greater, this is a swipe and `move` and `end` events follow.
     * - If the vertical distance is greater, this is a scroll, and we let the browser take over.
     *   A `cancel` event is sent.
     *
     * `move` is called on `mousemove` and `touchmove` after the above logic has determined that
     * a swipe is in progress.
     *
     * `end` is called when a swipe is successfully completed with a `touchend` or `mouseup`.
     *
     * `cancel` is called either on a `touchcancel` from the browser, or when we begin scrolling
     * as described above.
     *
     */
    bind: function(element, eventHandlers, pointerTypes) {
      // Absolute total movement, used to control swipe vs. scroll.
      var totalX, totalY;
      // Coordinates of the start position.
      var startCoords;
      // Last event's position.
      var lastPos;
      // Whether a swipe is active.
      var active = false;

      pointerTypes = pointerTypes || ['mouse', 'touch'];
      element.on(getEvents(pointerTypes, 'start'), function(event) {
        startCoords = getCoordinates(event);
        active = true;
        totalX = 0;
        totalY = 0;
        lastPos = startCoords;
        eventHandlers['start'] && eventHandlers['start'](startCoords, event);
      });
      var events = getEvents(pointerTypes, 'cancel');
      if (events) {
        element.on(events, function(event) {
          active = false;
          eventHandlers['cancel'] && eventHandlers['cancel'](event);
        });
      }

      element.on(getEvents(pointerTypes, 'move'), function(event) {
        if (!active) return;

        // Android will send a touchcancel if it thinks we're starting to scroll.
        // So when the total distance (+ or - or both) exceeds 10px in either direction,
        // we either:
        // - On totalX > totalY, we send preventDefault() and treat this as a swipe.
        // - On totalY > totalX, we let the browser handle it as a scroll.

        if (!startCoords) return;
        var coords = getCoordinates(event);

        totalX += Math.abs(coords.x - lastPos.x);
        totalY += Math.abs(coords.y - lastPos.y);

        lastPos = coords;

        if (totalX < MOVE_BUFFER_RADIUS && totalY < MOVE_BUFFER_RADIUS) {
          return;
        }

        // One of totalX or totalY has exceeded the buffer, so decide on swipe vs. scroll.
        if (totalY > totalX) {
          // Allow native scrolling to take over.
          active = false;
          eventHandlers['cancel'] && eventHandlers['cancel'](event);
          return;
        } else {
          // Prevent the browser from scrolling.
          event.preventDefault();
          eventHandlers['move'] && eventHandlers['move'](coords, event);
        }
      });

      element.on(getEvents(pointerTypes, 'end'), function(event) {
        if (!active) return;
        active = false;
        eventHandlers['end'] && eventHandlers['end'](getCoordinates(event), event);
      });
    }
  };
}]);

/* global ngTouch: false */

/**
 * @ngdoc directive
 * @name ngClick
 *
 * @description
 * A more powerful replacement for the default ngClick designed to be used on touchscreen
 * devices. Most mobile browsers wait about 300ms after a tap-and-release before sending
 * the click event. This version handles them immediately, and then prevents the
 * following click event from propagating.
 *
 * Requires the {@link ngTouch `ngTouch`} module to be installed.
 *
 * This directive can fall back to using an ordinary click event, and so works on desktop
 * browsers as well as mobile.
 *
 * This directive also sets the CSS class `ng-click-active` while the element is being held
 * down (by a mouse click or touch) so you can restyle the depressed element if you wish.
 *
 * @element ANY
 * @param {expression} ngClick {@link guide/expression Expression} to evaluate
 * upon tap. (Event object is available as `$event`)
 *
 * @example
    <example module="ngClickExample" deps="angular-touch.js">
      <file name="index.html">
        <button ng-click="count = count + 1" ng-init="count=0">
          Increment
        </button>
        count: {{ count }}
      </file>
      <file name="script.js">
        angular.module('ngClickExample', ['ngTouch']);
      </file>
    </example>
 */

ngTouch.config(['$provide', function($provide) {
  $provide.decorator('ngClickDirective', ['$delegate', function($delegate) {
    // drop the default ngClick directive
    $delegate.shift();
    return $delegate;
  }]);
}]);

ngTouch.directive('ngClick', ['$parse', '$timeout', '$rootElement',
    function($parse, $timeout, $rootElement) {
  var TAP_DURATION = 750; // Shorter than 750ms is a tap, longer is a taphold or drag.
  var MOVE_TOLERANCE = 12; // 12px seems to work in most mobile browsers.
  var PREVENT_DURATION = 2500; // 2.5 seconds maximum from preventGhostClick call to click
  var CLICKBUSTER_THRESHOLD = 25; // 25 pixels in any dimension is the limit for busting clicks.

  var ACTIVE_CLASS_NAME = 'ng-click-active';
  var lastPreventedTime;
  var touchCoordinates;
  var lastLabelClickCoordinates;


  // TAP EVENTS AND GHOST CLICKS
  //
  // Why tap events?
  // Mobile browsers detect a tap, then wait a moment (usually ~300ms) to see if you're
  // double-tapping, and then fire a click event.
  //
  // This delay sucks and makes mobile apps feel unresponsive.
  // So we detect touchstart, touchmove, touchcancel and touchend ourselves and determine when
  // the user has tapped on something.
  //
  // What happens when the browser then generates a click event?
  // The browser, of course, also detects the tap and fires a click after a delay. This results in
  // tapping/clicking twice. We do "clickbusting" to prevent it.
  //
  // How does it work?
  // We attach global touchstart and click handlers, that run during the capture (early) phase.
  // So the sequence for a tap is:
  // - global touchstart: Sets an "allowable region" at the point touched.
  // - element's touchstart: Starts a touch
  // (- touchmove or touchcancel ends the touch, no click follows)
  // - element's touchend: Determines if the tap is valid (didn't move too far away, didn't hold
  //   too long) and fires the user's tap handler. The touchend also calls preventGhostClick().
  // - preventGhostClick() removes the allowable region the global touchstart created.
  // - The browser generates a click event.
  // - The global click handler catches the click, and checks whether it was in an allowable region.
  //     - If preventGhostClick was called, the region will have been removed, the click is busted.
  //     - If the region is still there, the click proceeds normally. Therefore clicks on links and
  //       other elements without ngTap on them work normally.
  //
  // This is an ugly, terrible hack!
  // Yeah, tell me about it. The alternatives are using the slow click events, or making our users
  // deal with the ghost clicks, so I consider this the least of evils. Fortunately Angular
  // encapsulates this ugly logic away from the user.
  //
  // Why not just put click handlers on the element?
  // We do that too, just to be sure. If the tap event caused the DOM to change,
  // it is possible another element is now in that position. To take account for these possibly
  // distinct elements, the handlers are global and care only about coordinates.

  // Checks if the coordinates are close enough to be within the region.
  function hit(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) < CLICKBUSTER_THRESHOLD && Math.abs(y1 - y2) < CLICKBUSTER_THRESHOLD;
  }

  // Checks a list of allowable regions against a click location.
  // Returns true if the click should be allowed.
  // Splices out the allowable region from the list after it has been used.
  function checkAllowableRegions(touchCoordinates, x, y) {
    for (var i = 0; i < touchCoordinates.length; i += 2) {
      if (hit(touchCoordinates[i], touchCoordinates[i + 1], x, y)) {
        touchCoordinates.splice(i, i + 2);
        return true; // allowable region
      }
    }
    return false; // No allowable region; bust it.
  }

  // Global click handler that prevents the click if it's in a bustable zone and preventGhostClick
  // was called recently.
  function onClick(event) {
    if (Date.now() - lastPreventedTime > PREVENT_DURATION) {
      return; // Too old.
    }

    var touches = event.touches && event.touches.length ? event.touches : [event];
    var x = touches[0].clientX;
    var y = touches[0].clientY;
    // Work around desktop Webkit quirk where clicking a label will fire two clicks (on the label
    // and on the input element). Depending on the exact browser, this second click we don't want
    // to bust has either (0,0), negative coordinates, or coordinates equal to triggering label
    // click event
    if (x < 1 && y < 1) {
      return; // offscreen
    }
    if (lastLabelClickCoordinates &&
        lastLabelClickCoordinates[0] === x && lastLabelClickCoordinates[1] === y) {
      return; // input click triggered by label click
    }
    // reset label click coordinates on first subsequent click
    if (lastLabelClickCoordinates) {
      lastLabelClickCoordinates = null;
    }
    // remember label click coordinates to prevent click busting of trigger click event on input
    if (event.target.tagName.toLowerCase() === 'label') {
      lastLabelClickCoordinates = [x, y];
    }

    // Look for an allowable region containing this click.
    // If we find one, that means it was created by touchstart and not removed by
    // preventGhostClick, so we don't bust it.
    if (checkAllowableRegions(touchCoordinates, x, y)) {
      return;
    }

    // If we didn't find an allowable region, bust the click.
    event.stopPropagation();
    event.preventDefault();

    // Blur focused form elements
    event.target && event.target.blur();
  }


  // Global touchstart handler that creates an allowable region for a click event.
  // This allowable region can be removed by preventGhostClick if we want to bust it.
  function onTouchStart(event) {
    var touches = event.touches && event.touches.length ? event.touches : [event];
    var x = touches[0].clientX;
    var y = touches[0].clientY;
    touchCoordinates.push(x, y);

    $timeout(function() {
      // Remove the allowable region.
      for (var i = 0; i < touchCoordinates.length; i += 2) {
        if (touchCoordinates[i] == x && touchCoordinates[i + 1] == y) {
          touchCoordinates.splice(i, i + 2);
          return;
        }
      }
    }, PREVENT_DURATION, false);
  }

  // On the first call, attaches some event handlers. Then whenever it gets called, it creates a
  // zone around the touchstart where clicks will get busted.
  function preventGhostClick(x, y) {
    if (!touchCoordinates) {
      $rootElement[0].addEventListener('click', onClick, true);
      $rootElement[0].addEventListener('touchstart', onTouchStart, true);
      touchCoordinates = [];
    }

    lastPreventedTime = Date.now();

    checkAllowableRegions(touchCoordinates, x, y);
  }

  // Actual linking function.
  return function(scope, element, attr) {
    var clickHandler = $parse(attr.ngClick),
        tapping = false,
        tapElement,  // Used to blur the element after a tap.
        startTime,   // Used to check if the tap was held too long.
        touchStartX,
        touchStartY;

    function resetState() {
      tapping = false;
      element.removeClass(ACTIVE_CLASS_NAME);
    }

    element.on('touchstart', function(event) {
      tapping = true;
      tapElement = event.target ? event.target : event.srcElement; // IE uses srcElement.
      // Hack for Safari, which can target text nodes instead of containers.
      if (tapElement.nodeType == 3) {
        tapElement = tapElement.parentNode;
      }

      element.addClass(ACTIVE_CLASS_NAME);

      startTime = Date.now();

      var touches = event.touches && event.touches.length ? event.touches : [event];
      var e = touches[0].originalEvent || touches[0];
      touchStartX = e.clientX;
      touchStartY = e.clientY;
    });

    element.on('touchmove', function(event) {
      resetState();
    });

    element.on('touchcancel', function(event) {
      resetState();
    });

    element.on('touchend', function(event) {
      var diff = Date.now() - startTime;

      var touches = (event.changedTouches && event.changedTouches.length) ? event.changedTouches :
          ((event.touches && event.touches.length) ? event.touches : [event]);
      var e = touches[0].originalEvent || touches[0];
      var x = e.clientX;
      var y = e.clientY;
      var dist = Math.sqrt(Math.pow(x - touchStartX, 2) + Math.pow(y - touchStartY, 2));

      if (tapping && diff < TAP_DURATION && dist < MOVE_TOLERANCE) {
        // Call preventGhostClick so the clickbuster will catch the corresponding click.
        preventGhostClick(x, y);

        // Blur the focused element (the button, probably) before firing the callback.
        // This doesn't work perfectly on Android Chrome, but seems to work elsewhere.
        // I couldn't get anything to work reliably on Android Chrome.
        if (tapElement) {
          tapElement.blur();
        }

        if (!angular.isDefined(attr.disabled) || attr.disabled === false) {
          element.triggerHandler('click', [event]);
        }
      }

      resetState();
    });

    // Hack for iOS Safari's benefit. It goes searching for onclick handlers and is liable to click
    // something else nearby.
    element.onclick = function(event) { };

    // Actual click handler.
    // There are three different kinds of clicks, only two of which reach this point.
    // - On desktop browsers without touch events, their clicks will always come here.
    // - On mobile browsers, the simulated "fast" click will call this.
    // - But the browser's follow-up slow click will be "busted" before it reaches this handler.
    // Therefore it's safe to use this directive on both mobile and desktop.
    element.on('click', function(event, touchend) {
      scope.$apply(function() {
        clickHandler(scope, {$event: (touchend || event)});
      });
    });

    element.on('mousedown', function(event) {
      element.addClass(ACTIVE_CLASS_NAME);
    });

    element.on('mousemove mouseup', function(event) {
      element.removeClass(ACTIVE_CLASS_NAME);
    });

  };
}]);

/* global ngTouch: false */

/**
 * @ngdoc directive
 * @name ngSwipeLeft
 *
 * @description
 * Specify custom behavior when an element is swiped to the left on a touchscreen device.
 * A leftward swipe is a quick, right-to-left slide of the finger.
 * Though ngSwipeLeft is designed for touch-based devices, it will work with a mouse click and drag
 * too.
 *
 * To disable the mouse click and drag functionality, add `ng-swipe-disable-mouse` to
 * the `ng-swipe-left` or `ng-swipe-right` DOM Element.
 *
 * Requires the {@link ngTouch `ngTouch`} module to be installed.
 *
 * @element ANY
 * @param {expression} ngSwipeLeft {@link guide/expression Expression} to evaluate
 * upon left swipe. (Event object is available as `$event`)
 *
 * @example
    <example module="ngSwipeLeftExample" deps="angular-touch.js">
      <file name="index.html">
        <div ng-show="!showActions" ng-swipe-left="showActions = true">
          Some list content, like an email in the inbox
        </div>
        <div ng-show="showActions" ng-swipe-right="showActions = false">
          <button ng-click="reply()">Reply</button>
          <button ng-click="delete()">Delete</button>
        </div>
      </file>
      <file name="script.js">
        angular.module('ngSwipeLeftExample', ['ngTouch']);
      </file>
    </example>
 */

/**
 * @ngdoc directive
 * @name ngSwipeRight
 *
 * @description
 * Specify custom behavior when an element is swiped to the right on a touchscreen device.
 * A rightward swipe is a quick, left-to-right slide of the finger.
 * Though ngSwipeRight is designed for touch-based devices, it will work with a mouse click and drag
 * too.
 *
 * Requires the {@link ngTouch `ngTouch`} module to be installed.
 *
 * @element ANY
 * @param {expression} ngSwipeRight {@link guide/expression Expression} to evaluate
 * upon right swipe. (Event object is available as `$event`)
 *
 * @example
    <example module="ngSwipeRightExample" deps="angular-touch.js">
      <file name="index.html">
        <div ng-show="!showActions" ng-swipe-left="showActions = true">
          Some list content, like an email in the inbox
        </div>
        <div ng-show="showActions" ng-swipe-right="showActions = false">
          <button ng-click="reply()">Reply</button>
          <button ng-click="delete()">Delete</button>
        </div>
      </file>
      <file name="script.js">
        angular.module('ngSwipeRightExample', ['ngTouch']);
      </file>
    </example>
 */

function makeSwipeDirective(directiveName, direction, eventName) {
  ngTouch.directive(directiveName, ['$parse', '$swipe', function($parse, $swipe) {
    // The maximum vertical delta for a swipe should be less than 75px.
    var MAX_VERTICAL_DISTANCE = 75;
    // Vertical distance should not be more than a fraction of the horizontal distance.
    var MAX_VERTICAL_RATIO = 0.3;
    // At least a 30px lateral motion is necessary for a swipe.
    var MIN_HORIZONTAL_DISTANCE = 30;

    return function(scope, element, attr) {
      var swipeHandler = $parse(attr[directiveName]);

      var startCoords, valid;

      function validSwipe(coords) {
        // Check that it's within the coordinates.
        // Absolute vertical distance must be within tolerances.
        // Horizontal distance, we take the current X - the starting X.
        // This is negative for leftward swipes and positive for rightward swipes.
        // After multiplying by the direction (-1 for left, +1 for right), legal swipes
        // (ie. same direction as the directive wants) will have a positive delta and
        // illegal ones a negative delta.
        // Therefore this delta must be positive, and larger than the minimum.
        if (!startCoords) return false;
        var deltaY = Math.abs(coords.y - startCoords.y);
        var deltaX = (coords.x - startCoords.x) * direction;
        return valid && // Short circuit for already-invalidated swipes.
            deltaY < MAX_VERTICAL_DISTANCE &&
            deltaX > 0 &&
            deltaX > MIN_HORIZONTAL_DISTANCE &&
            deltaY / deltaX < MAX_VERTICAL_RATIO;
      }

      var pointerTypes = ['touch'];
      if (!angular.isDefined(attr['ngSwipeDisableMouse'])) {
        pointerTypes.push('mouse');
      }
      $swipe.bind(element, {
        'start': function(coords, event) {
          startCoords = coords;
          valid = true;
        },
        'cancel': function(event) {
          valid = false;
        },
        'end': function(coords, event) {
          if (validSwipe(coords)) {
            scope.$apply(function() {
              element.triggerHandler(eventName);
              swipeHandler(scope, {$event: event});
            });
          }
        }
      }, pointerTypes);
    };
  }]);
}

// Left is negative X-coordinate, right is positive.
makeSwipeDirective('ngSwipeLeft', -1, 'swipeleft');
makeSwipeDirective('ngSwipeRight', 1, 'swiperight');



})(window, window.angular);

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.angularCreditCards = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _angular = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);

var _angular2 = _interopRequireDefault(_angular);

var _creditcards = require('creditcards');

var _creditcards2 = _interopRequireDefault(_creditcards);

var _number = require('./number');

var _number2 = _interopRequireDefault(_number);

var _expiration = require('./expiration');

var _expiration2 = _interopRequireDefault(_expiration);

var _cvc = require('./cvc');

var _cvc2 = _interopRequireDefault(_cvc);

'use strict';

exports['default'] = _angular2['default'].module('credit-cards', []).value('creditcards', _creditcards2['default']).directive('ccNumber', _number2['default']).directive('ccExp', _expiration2['default']).directive('ccExpMonth', _expiration.ccExpMonth).directive('ccExpYear', _expiration.ccExpYear).directive('ccCvc', _cvc2['default']).name;
module.exports = exports['default'];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./cvc":14,"./expiration":15,"./number":16,"creditcards":13}],2:[function(require,module,exports){
exports = module.exports = ap;
function ap (args, fn) {
    return function () {
        var rest = [].slice.call(arguments)
            , first = args.slice()
        first.push.apply(first, rest)
        return fn.apply(this, first);
    };
}

exports.pa = pa;
function pa (args, fn) {
    return function () {
        var rest = [].slice.call(arguments)
        rest.push.apply(rest, args)
        return fn.apply(this, rest);
    };
}

exports.apa = apa;
function apa (left, right, fn) {
    return function () {
        return fn.apply(this,
            left.concat.apply(left, arguments).concat(right)
        );
    };
}

exports.partial = partial;
function partial (fn) {
    var args = [].slice.call(arguments, 1);
    return ap(args, fn);
}

exports.partialRight = partialRight;
function partialRight (fn) {
    var args = [].slice.call(arguments, 1);
    return pa(args, fn);
}

exports.curry = curry;
function curry (fn) {
    return partial(partial, fn);
}

exports.curryRight = function curryRight (fn) {
    return partial(partialRight, fn);
}

},{}],3:[function(require,module,exports){
var sentence = require('sentence-case');

/**
 * Camel case a string.
 *
 * @param  {String} string
 * @return {String}
 */
module.exports = function (string) {
  return sentence(string)
    // Replace periods between numeric entities with an underscore.
    .replace(/\./g, '_')
    // Replace spaces between words with a string upper cased character.
    .replace(/ (\w)/g, function (_, $1) {
      return $1.toUpperCase();
    });
};

},{"sentence-case":4}],4:[function(require,module,exports){
/**
 * Sentence case a string.
 *
 * @param  {String} string
 * @return {String}
 */
module.exports = function (string) {
  return String(string)
    // Add camel case support.
    .replace(/([a-z])([A-Z0-9])/g, '$1 $2')
    // Remove every non-word character and replace with a period.
    .replace(/[^a-zA-Z0-9]+/g, '.')
    // Replace every period not between two numbers with a space.
    .replace(/(?!\d\.\d)(^|.)\./g, '$1 ')
    // Trim whitespace from the string.
    .replace(/^ | $/g, '')
    // Finally lower case the entire string.
    .toLowerCase();
};

},{}],5:[function(require,module,exports){
module.exports = extend

function extend(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}],6:[function(require,module,exports){
'use strict';

exports.types = require('./types');

},{"./types":8}],7:[function(require,module,exports){
'use strict';

var extend = require('xtend/mutable');

function CardType (name, config) {
  extend(this, {name: name}, config);
}

CardType.prototype.cvcLength = 3;

CardType.prototype.luhn = true;

CardType.prototype.groupPattern = /(\d{1,4})(\d{1,4})?(\d{1,4})?(\d{1,4})?/;

CardType.prototype.group = function (number) {
  return (number.match(this.groupPattern) || [])
    .slice(1)
    .filter(identity);
};

CardType.prototype.test = function (number, eager) {
  return this[eager ? 'eagerPattern' : 'pattern'].test(number);
};

module.exports = CardType;

function identity (value) {
  return value;
}

},{"xtend/mutable":5}],8:[function(require,module,exports){
'use strict';

var Type = require('./type');

var group19 = /(\d{1,4})(\d{1,4})?(\d{1,4})?(\d{1,4})?(\d{1,3})?/;

exports.visa = new Type('Visa', {
  pattern: /^4\d{12}(\d{3})?$/,
  eagerPattern: /^4/
});

exports.maestro = new Type('Maestro', {
  pattern: /^(?:5[0678]\d\d|6304|6390|67\d\d)\d{8,15}$/,
  eagerPattern: /^(5(018|0[23]|[68])|6[37])/,
  groupPattern: group19
});

exports.forbrugsforeningen = new Type('Forbrugsforeningen', {
  pattern: /^600722\d{10}$/,
  eagerPattern: /^600/
});

exports.dankort = new Type('Dankort', {
  pattern: /^5019\d{12}$/,
  eagerPattern: /^5019/
});

exports.masterCard = new Type('MasterCard', {
  pattern: /^5[1-5]\d{14}$/,
  eagerPattern: /^5[1-5]/
});

exports.americanExpress = new Type('American Express', {
  pattern: /^3[47]\d{13}$/,
  eagerPattern: /^3[47]/,
  groupPattern: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
  cvcLength: 4
});

exports.dinersClub = new Type('Diners Club', {
  pattern: /^3(0[0-5]|[68]\d)\d{11}$/,
  eagerPattern: /^3(0|[68])/,
  groupPattern: /(\d{1,4})?(\d{1,6})?(\d{1,4})?/
});

exports.discover = new Type('Discover', {
  pattern: /^6(011|[45]\d{2})\d{12}$/,
  eagerPattern: /^6([45]|01)/
});

exports.jcb = new Type('JCB', {
  pattern: /^35\d{14}$/,
  eagerPattern: /^35/
});

exports.unionPay = new Type('UnionPay', {
  pattern: /^62[0-5]\d{13,16}$/,
  eagerPattern: /^62/,
  groupPattern: group19,
  luhn: false
});

},{"./type":7}],9:[function(require,module,exports){
'use strict';

module.exports = (function (array) {
  return function luhn (number) {
    if (!number) return false;
    var length = number.length;
    var bit = 1;
    var sum = 0;
    var value;

    while (length) {
      value = parseInt(number.charAt(--length), 10);
      sum += (bit ^= 1) ? array[value] : value;
    }

    return sum && sum % 10 === 0;
  };
}([0, 2, 4, 6, 8, 1, 3, 5, 7, 9]));

},{}],10:[function(require,module,exports){
'use strict'

var camel = require('camel-case')
var luhn = require('fast-luhn')

exports.types = require('creditcards-types').types

exports.parse = function (number) {
  if (typeof number !== 'string') return ''
  return number.replace(/[^\d]/g, '')
}

exports.format = function (number, separator) {
  var type = getType(number, true)
  if (!type) return number
  return type.group(number).join(separator || ' ')
}

exports.type = function (number, eager) {
  var type = getType(number, eager)
  return type ? type.name : undefined
}

exports.luhn = luhn

exports.isValid = function (number, type) {
  if (!type) type = exports.type(number)
  type = exports.types[camel(type)]
  if (!type) return false
  return (!type.luhn || luhn(number)) && type.test(number)
}

function getType (number, eager) {
  for (var typeName in exports.types) {
    var type = exports.types[typeName]
    if (type.test(number, eager)) return exports.types[typeName]
  }
}

},{"camel-case":3,"creditcards-types":6,"fast-luhn":9}],11:[function(require,module,exports){
'use strict'

var camel = require('camel-case')
var card = require('./card')

var cvcRegex = /^\d{3,4}$/

exports.isValid = function (cvc, type) {
  if (typeof cvc !== 'string') return false
  if (!cvcRegex.test(cvc)) return false
  if (!type) return true
  return card.types[camel(type)].cvcLength === cvc.length
}

},{"./card":10,"camel-case":3}],12:[function(require,module,exports){
'use strict'

exports.isPast = function (month, year) {
  return Date.now() >= new Date(year, month)
}

exports.month = {
  parse: function (month) {
    return ~~month || void 0
  },
  isValid: function (month) {
    if (typeof month !== 'number') return false
    return month >= 1 && month <= 12
  }
}

var base = new Date().getFullYear().toString().substr(0, 2)

function twoDigit (number) {
  return number >= 10 ? number : '0' + number
}

exports.year = {
  parse: function (year, pad) {
    year = ~~year
    if (!pad) return year || void 0
    return ~~(base + twoDigit(year))
  },
  format: function (year, strip) {
    year = year.toString()
    return strip ? year.substr(2, 4) : year
  },
  isValid: function (year) {
    if (typeof year !== 'number') return false
    return year > 0
  },
  isPast: function (year) {
    return new Date().getFullYear() > year
  }
}

},{}],13:[function(require,module,exports){
'use strict'

var card = exports.card = require('./card')
var cvc = exports.cvc = require('./cvc')
var expiration = exports.expiration = require('./expiration')

exports.validate = function (cardObj) {
  return {
    card: {
      type: card.type(cardObj.number),
      number: cardObj.number,
      expirationMonth: cardObj.expirationMonth,
      expirationYear: cardObj.expirationYear,
      cvc: cardObj.cvc
    },
    validCardNumber: card.luhn(cardObj.number),
    validExpirationMonth: expiration.month.isValid(cardObj.expirationMonth),
    validExpirationYear: expiration.year.isValid(cardObj.expirationYear),
    validCvc: cvc.isValid(cardObj.cvc),
    expired: expiration.isPast(cardObj.expirationMonth, cardObj.expirationYear)
  }
}

},{"./card":10,"./cvc":11,"./expiration":12}],14:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _angular = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);

var _angular2 = _interopRequireDefault(_angular);

var _creditcards = require('creditcards');

'use strict';

exports['default'] = factory;

factory.$inject = ['$parse'];
function factory($parse) {
  return {
    restrict: 'A',
    require: 'ngModel',
    compile: function compile(element, attributes) {
      attributes.$set('maxlength', 4);
      attributes.$set('pattern', '[0-9]*');
      attributes.$set('xAutocompletetype', 'cc-csc');

      return function (scope, element, attributes, ngModel) {
        ngModel.$validators.ccCvc = function (value) {
          return _creditcards.cvc.isValid(value, $parse(attributes.ccType)(scope));
        };
        if (attributes.ccType) {
          scope.$watch(attributes.ccType, _angular2['default'].bind(ngModel, ngModel.$validate));
        }
      };
    }
  };
}
module.exports = exports['default'];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"creditcards":13}],15:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = ccExp;
exports.ccExpMonth = ccExpMonth;
exports.ccExpYear = ccExpYear;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }

var _angular = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);

var _angular2 = _interopRequireDefault(_angular);

var _creditcards = require('creditcards');

var _ap = require('ap');

'use strict';

var month = _creditcards.expiration.month;
var year = _creditcards.expiration.year;
var isPast = _creditcards.expiration.isPast;

function ccExp() {
  return {
    restrict: 'AE',
    require: 'ccExp',
    controller: CcExpController,
    link: function link(scope, element, attributes, ccExp) {
      ccExp.$watch();
    }
  };
}

CcExpController.$inject = ['$scope', '$element'];
function CcExpController($scope, $element) {
  var nullFormCtrl = {
    $setValidity: _angular2['default'].noop
  };
  var parentForm = $element.inheritedData('$formController') || nullFormCtrl;
  var ngModel = {
    year: {},
    month: {}
  };
  this.setMonth = function (monthCtrl) {
    ngModel.month = monthCtrl;
  };
  this.setYear = function (yearCtrl) {
    ngModel.year = yearCtrl;
  };
  function setValidity(_ref) {
    var month = _ref.month;
    var year = _ref.year;

    var valid = !!month && !!year && !isPast(month, year);
    parentForm.$setValidity('ccExp', valid, $element);
  }
  this.$watch = function $watchExp() {
    $scope.$watch(function () {
      return {
        month: ngModel.month.$modelValue,
        year: ngModel.year.$modelValue
      };
    }, setValidity, true);
  };
}

var nullCcExp = {
  setMonth: _angular2['default'].noop,
  setYear: _angular2['default'].noop
};

function ccExpMonth() {
  return {
    restrict: 'A',
    require: ['ngModel', '^?ccExp'],
    compile: function compile(element, attributes) {
      attributes.$set('maxlength', 2);
      attributes.$set('pattern', '[0-9]*');
      attributes.$set('xAutocompletetype', 'cc-exp-month');

      return function (scope, element, attributes, _ref2) {
        var _ref22 = _slicedToArray(_ref2, 2);

        var ngModel = _ref22[0];
        var ccExp = _ref22[1];

        ccExp = ccExp || nullCcExp;
        ccExp.setMonth(ngModel);
        ngModel.$parsers.unshift(month.parse);
        ngModel.$validators.ccExpMonth = month.isValid;
      };
    }
  };
}

function ccExpYear() {
  return {
    restrict: 'A',
    require: ['ngModel', '^?ccExp'],
    compile: function compile(element, attributes) {
      var fullYear = attributes.fullYear !== undefined;
      attributes.$set('maxlength', fullYear ? 4 : 2);
      attributes.$set('pattern', '[0-9]*');
      attributes.$set('xAutocompletetype', 'cc-exp-year');

      return function (scope, element, attributes, _ref3) {
        var _ref32 = _slicedToArray(_ref3, 2);

        var ngModel = _ref32[0];
        var ccExp = _ref32[1];

        ccExp = ccExp || nullCcExp;
        ccExp.setYear(ngModel);
        ngModel.$parsers.unshift(_ap.partialRight(year.parse, !fullYear));
        ngModel.$formatters.unshift(function (value) {
          return value ? year.format(value, !fullYear) : '';
        });
        ngModel.$validators.ccExpYear = function (value) {
          return year.isValid(value) && !year.isPast(value);
        };
      };
    }
  };
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"ap":2,"creditcards":13}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }

var _creditcards = require('creditcards');

'use strict';

exports['default'] = factory;

factory.$inject = ['$parse'];
function factory($parse) {
  return {
    restrict: 'A',
    require: ['ngModel', 'ccNumber'],
    controller: function controller() {
      this.type = null;
      this.eagerType = null;
    },
    compile: function compile($element, $attributes) {
      $attributes.$set('pattern', '[0-9]*');
      $attributes.$set('xAutocompletetype', 'cc-number');

      return function ($scope, $element, $attributes, _ref) {
        var _ref2 = _slicedToArray(_ref, 2);

        var ngModel = _ref2[0];
        var ccNumber = _ref2[1];

        $scope.$watch($attributes.ngModel, function (number) {
          ngModel.$ccType = ccNumber.type = _creditcards.card.type(number);
        });
        function $viewValue() {
          return ngModel.$viewValue;
        }
        if (typeof $attributes.ccEagerType !== 'undefined') {
          $scope.$watch($viewValue, function eagerTypeCheck(number) {
            if (!number) return;
            number = _creditcards.card.parse(number);
            ngModel.$ccEagerType = ccNumber.eagerType = _creditcards.card.type(number, true);
          });
        }
        if ($attributes.ccType) {
          $scope.$watch($attributes.ccType, function () {
            ngModel.$validate();
          });
        }
        if (typeof $attributes.ccFormat !== 'undefined') {
          $scope.$watch($viewValue, function formatInput(input, previous) {
            if (!input) return;
            var element = $element[0];
            var formatted = _creditcards.card.format(_creditcards.card.parse(input));
            ngModel.$setViewValue(formatted);
            var selectionEnd = element.selectionEnd;

            ngModel.$render();
            if (formatted && !formatted.charAt(selectionEnd - 1).trim()) {
              selectionEnd++;
            }
            element.setSelectionRange(selectionEnd, selectionEnd);
          });
        }
        ngModel.$parsers.unshift(_creditcards.card.parse);
        ngModel.$validators.ccNumber = function (number) {
          return _creditcards.card.isValid(number);
        };
        ngModel.$validators.ccNumberType = function (number) {
          return _creditcards.card.isValid(number, $parse($attributes.ccType)($scope));
        };
      };
    }
  };
}
module.exports = exports['default'];

},{"creditcards":13}]},{},[1])(1)
});
/*
 *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>
 *  <%= pkg.description %>
 *  <%= pkg.homepage %>
 *
 *  Made by <%= pkg.author.name %>
 *  Under <%= pkg.license %> License
 */
/*
 * FancyBox Plus - jQuery Plugin
 * Simple and fancy lightbox alternative
 *
 * Examples and documentation at: http://igorlino.github.io/fancybox-plus/
 *
 * Version: 1.3.5 (20.06.2015)
 * Requires: jQuery v1.3+
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 */

;
(function ($) {
    var tmp, loading, overlay, wrap, outer, content, close, title, nav_left, nav_right,

        selectedIndex = 0, selectedOpts = {}, selectedArray = [], currentIndex = 0, currentOpts = {}, currentArray = [],

        ajaxLoader = null, imgPreloader = new Image(), imgRegExp = /\.(jpg|gif|png|bmp|jpeg)(.*)?$/i, swfRegExp = /[^\.]\.(swf)\s*$/i,

        loadingTimer, loadingFrame = 1,

        titleHeight = 0, titleStr = '', start_pos, final_pos, busy = false, fx = $.extend($('<div/>')[0], {prop: 0}),

        isIE6 = navigator.userAgent.match(/msie [6]/i) && !window.XMLHttpRequest,

    /*
     * Private methods
     */

        _abort = function () {
            loading.hide();

            imgPreloader.onerror = imgPreloader.onload = null;

            if (ajaxLoader) {
                ajaxLoader.abort();
            }

            tmp.empty();
        },

        _error = function () {
            if (false === selectedOpts.onError(selectedArray, selectedIndex, selectedOpts)) {
                loading.hide();
                busy = false;
                return;
            }

            selectedOpts.titleShow = false;

            selectedOpts.width = 'auto';
            selectedOpts.height = 'auto';

            tmp.html('<p id="fbplus-error">The requested content cannot be loaded.<br />Please try again later.</p>');

            _process_inline();
        },

        _start = function () {
            var obj = selectedArray[selectedIndex],
                href,
                type,
                title,
                str,
                emb,
                ret;

            _abort();

            selectedOpts = $.extend({}, $.fn.fancyboxPlus.defaults, (typeof $(obj).data('fancyboxPlus') == 'undefined' ? selectedOpts : $(obj).data('fancyboxPlus')));

            ret = selectedOpts.onStart(selectedArray, selectedIndex, selectedOpts);

            if (ret === false) {
                busy = false;
                return;
            } else if (typeof ret == 'object') {
                selectedOpts = $.extend(selectedOpts, ret);
            }

            title = selectedOpts.title || (obj.nodeName ? $(obj).attr('title') : obj.title) || '';

            if (obj.nodeName && !selectedOpts.orig) {
                selectedOpts.orig = $(obj).children("img:first").length ? $(obj).children("img:first") : $(obj);
            }

            if (title === '' && selectedOpts.orig && selectedOpts.titleFromAlt) {
                title = selectedOpts.orig.attr('alt');
            }

            href = selectedOpts.href || (obj.nodeName ? $(obj).attr('href') : obj.href) || null;

            if ((/^(?:javascript)/i).test(href) || href == '#') {
                href = null;
            }

            if (selectedOpts.type) {
                type = selectedOpts.type;

                if (!href) {
                    href = selectedOpts.content;
                }

            } else if (selectedOpts.content) {
                type = 'html';

            } else if (href) {
                if (href.match(imgRegExp)) {
                    type = 'image';

                } else if (href.match(swfRegExp)) {
                    type = 'swf';

                } else if ($(obj).hasClass("iframe")) {
                    type = 'iframe';

                } else if (href.indexOf("#") === 0) {
                    type = 'inline';

                } else {
                    type = 'ajax';
                }
            }

            if (!type) {
                _error();
                return;
            }

            if (type == 'inline') {
                obj = href.substr(href.indexOf("#"));
                type = $(obj).length > 0 ? 'inline' : 'ajax';
            }

            selectedOpts.type = type;
            selectedOpts.href = href;
            selectedOpts.title = title;

            if (selectedOpts.autoDimensions) {
                if (selectedOpts.type == 'html' || selectedOpts.type == 'inline' || selectedOpts.type == 'ajax') {
                    selectedOpts.width = 'auto';
                    selectedOpts.height = 'auto';
                } else {
                    selectedOpts.autoDimensions = false;
                }
            }

            if (selectedOpts.modal) {
                selectedOpts.overlayShow = true;
                selectedOpts.hideOnOverlayClick = false;
                selectedOpts.hideOnContentClick = false;
                selectedOpts.enableEscapeButton = false;
                selectedOpts.showCloseButton = false;
            }

            selectedOpts.padding = parseInt(selectedOpts.padding, 10);
            selectedOpts.margin = parseInt(selectedOpts.margin, 10);

            tmp.css('padding', (selectedOpts.padding + selectedOpts.margin));

            $('.fbplus-inline-tmp').unbind('fbplus-cancel').bind('fbplus-change', function () {
                $(this).replaceWith(content.children());
            });

            switch (type) {
                case 'html' :
                    tmp.html(selectedOpts.content);
                    _process_inline();
                    break;

                case 'inline' :
                    if ($(obj).parent().is('#fbplus-content') === true) {
                        busy = false;
                        return;
                    }

                    $('<div class="fbplus-inline-tmp" />')
                        .hide()
                        .insertBefore($(obj))
                        .bind('fbplus-cleanup', function () {
                            $(this).replaceWith(content.children());
                        }).bind('fbplus-cancel', function () {
                        $(this).replaceWith(tmp.children());
                    });

                    $(obj).appendTo(tmp);

                    _process_inline();
                    break;

                case 'image':
                    busy = false;

                    $.fancyboxPlus.showActivity();

                    imgPreloader = new Image();

                    imgPreloader.onerror = function () {
                        _error();
                    };

                    imgPreloader.onload = function () {
                        busy = true;

                        imgPreloader.onerror = imgPreloader.onload = null;

                        _process_image();
                    };

                    imgPreloader.src = href;
                    break;

                case 'swf':
                    selectedOpts.scrolling = 'no';

                    str = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="' + selectedOpts.width + '" height="' + selectedOpts.height + '"><param name="movie" value="' + href + '"></param>';
                    emb = '';

                    $.each(selectedOpts.swf, function (name, val) {
                        str += '<param name="' + name + '" value="' + val + '"></param>';
                        emb += ' ' + name + '="' + val + '"';
                    });

                    str += '<embed src="' + href + '" type="application/x-shockwave-flash" width="' + selectedOpts.width + '" height="' + selectedOpts.height + '"' + emb + '></embed></object>';

                    tmp.html(str);

                    _process_inline();
                    break;

                case 'ajax':
                    busy = false;

                    $.fancyboxPlus.showActivity();

                    selectedOpts.ajax.win = selectedOpts.ajax.success;

                    ajaxLoader = $.ajax($.extend({}, selectedOpts.ajax, {
                        url: href,
                        data: selectedOpts.ajax.data || {},
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            if (XMLHttpRequest.status > 0) {
                                _error();
                            }
                        },
                        success: function (data, textStatus, XMLHttpRequest) {
                            var o = typeof XMLHttpRequest == 'object' ? XMLHttpRequest : ajaxLoader;
                            if (o.status == 200) {
                                if (typeof selectedOpts.ajax.win == 'function') {
                                    ret = selectedOpts.ajax.win(href, data, textStatus, XMLHttpRequest);

                                    if (ret === false) {
                                        loading.hide();
                                        return;
                                    } else if (typeof ret == 'string' || typeof ret == 'object') {
                                        data = ret;
                                    }
                                }

                                tmp.html(data);
                                _process_inline();
                            }
                        }
                    }));

                    break;

                case 'iframe':
                    _show();
                    break;
            }
        },

        _process_inline = function () {
            var
                w = selectedOpts.width,
                h = selectedOpts.height;

            if (w.toString().indexOf('%') > -1) {
                w = parseInt(($(window).width() - (selectedOpts.margin * 2)) * parseFloat(w) / 100, 10) + 'px';

            } else {
                w = w == 'auto' ? 'auto' : w + 'px';
            }

            if (h.toString().indexOf('%') > -1) {
                h = parseInt(($(window).height() - (selectedOpts.margin * 2)) * parseFloat(h) / 100, 10) + 'px';

            } else {
                h = h == 'auto' ? 'auto' : h + 'px';
            }

            tmp.wrapInner('<div style="width:' + w + ';height:' + h + ';overflow: ' + (selectedOpts.scrolling == 'auto' ? 'auto' : (selectedOpts.scrolling == 'yes' ? 'scroll' : 'hidden')) + ';position:relative;"></div>');

            selectedOpts.width = tmp.width();
            selectedOpts.height = tmp.height();

            _show();
        },

        _process_image = function () {
            selectedOpts.width = imgPreloader.width;
            selectedOpts.height = imgPreloader.height;

            $("<img />").attr({
                'id': 'fbplus-img',
                'src': imgPreloader.src,
                'alt': selectedOpts.title
            }).appendTo(tmp);

            _show();
        },

        _show = function () {
            var pos, equal;

            loading.hide();

            if (wrap.is(":visible") && false === currentOpts.onCleanup(currentArray, currentIndex, currentOpts)) {
                $.event.trigger('fbplus-cancel');

                busy = false;
                return;
            }

            busy = true;

            $(content.add(overlay)).unbind();

            $(window).unbind("resize.fb scroll.fb");
            $(document).unbind('keydown.fb');

            if (wrap.is(":visible") && currentOpts.titlePosition !== 'outside') {
                wrap.css('height', wrap.height());
            }

            currentArray = selectedArray;
            currentIndex = selectedIndex;
            currentOpts = selectedOpts;

            if (currentOpts.overlayShow) {
                overlay.css({
                    'background-color': currentOpts.overlayColor,
                    'opacity': currentOpts.overlayOpacity,
                    'cursor': currentOpts.hideOnOverlayClick ? 'pointer' : 'auto',
                    'height': $(document).height()
                });

                if (!overlay.is(':visible')) {
                    if (isIE6) {
                        $('select:not(#fbplus-tmp select)').filter(function () {
                            return this.style.visibility !== 'hidden';
                        }).css({'visibility': 'hidden'}).one('fbplus-cleanup', function () {
                            this.style.visibility = 'inherit';
                        });
                    }

                    overlay.show();
                }
            } else {
                overlay.hide();
            }

            final_pos = _get_zoom_to();

            _process_title();

            if (wrap.is(":visible")) {
                $(close.add(nav_left).add(nav_right)).hide();

                pos = wrap.position(),

                    start_pos = {
                        top: pos.top,
                        left: pos.left,
                        width: wrap.width(),
                        height: wrap.height()
                    };

                equal = (start_pos.width == final_pos.width && start_pos.height == final_pos.height);

                content.fadeTo(currentOpts.changeFade, 0.3, function () {
                    var finish_resizing = function () {
                        content.html(tmp.contents()).fadeTo(currentOpts.changeFade, 1, _finish);
                    };

                    $.event.trigger('fbplus-change');

                    content
                        .empty()
                        .removeAttr('filter')
                        .css({
                            'border-width': currentOpts.padding,
                            'width': final_pos.width - currentOpts.padding * 2,
                            'height': selectedOpts.autoDimensions ? 'auto' : final_pos.height - titleHeight - currentOpts.padding * 2
                        });

                    if (equal) {
                        finish_resizing();

                    } else {
                        fx.prop = 0;

                        $(fx).animate({prop: 1}, {
                            duration: currentOpts.changeSpeed,
                            easing: currentOpts.easingChange,
                            step: _draw,
                            complete: finish_resizing
                        });
                    }
                });

                return;
            }

            wrap.removeAttr("style");

            content.css('border-width', currentOpts.padding);

            if (currentOpts.transitionIn == 'elastic') {
                start_pos = _get_zoom_from();

                content.html(tmp.contents());

                wrap.show();

                if (currentOpts.opacity) {
                    final_pos.opacity = 0;
                }

                fx.prop = 0;

                $(fx).animate({prop: 1}, {
                    duration: currentOpts.speedIn,
                    easing: currentOpts.easingIn,
                    step: _draw,
                    complete: _finish
                });

                return;
            }

            if (currentOpts.titlePosition == 'inside' && titleHeight > 0) {
                title.show();
            }

            content
                .css({
                    'width': final_pos.width - currentOpts.padding * 2,
                    'height': selectedOpts.autoDimensions ? 'auto' : final_pos.height - titleHeight - currentOpts.padding * 2
                })
                .html(tmp.contents());

            wrap
                .css(final_pos)
                .fadeIn(currentOpts.transitionIn == 'none' ? 0 : currentOpts.speedIn, _finish);
        },

        _format_title = function (title) {
            if (title && title.length) {
                if (currentOpts.titlePosition == 'float') {
                    return '<table id="fbplus-title-float-wrap" cellpadding="0" cellspacing="0"><tr><td id="fbplus-title-float-left"></td><td id="fbplus-title-float-main">' + title + '</td><td id="fbplus-title-float-right"></td></tr></table>';
                }

                return '<div id="fbplus-title-' + currentOpts.titlePosition + '">' + title + '</div>';
            }

            return false;
        },

        _process_title = function () {
            titleStr = currentOpts.title || '';
            titleHeight = 0;

            title
                .empty()
                .removeAttr('style')
                .removeClass();

            if (currentOpts.titleShow === false) {
                title.hide();
                return;
            }

            titleStr = $.isFunction(currentOpts.titleFormat) ? currentOpts.titleFormat(titleStr, currentArray, currentIndex, currentOpts) : _format_title(titleStr);

            if (!titleStr || titleStr === '') {
                title.hide();
                return;
            }

            title
                .addClass('fbplus-title-' + currentOpts.titlePosition)
                .html(titleStr)
                .appendTo('body')
                .show();

            switch (currentOpts.titlePosition) {
                case 'inside':
                    title
                        .css({
                            'width': final_pos.width - (currentOpts.padding * 2),
                            'marginLeft': currentOpts.padding,
                            'marginRight': currentOpts.padding
                        });

                    titleHeight = title.outerHeight(true);

                    title.appendTo(outer);

                    final_pos.height += titleHeight;
                    break;

                case 'over':
                    title
                        .css({
                            'marginLeft': currentOpts.padding,
                            'width': final_pos.width - (currentOpts.padding * 2),
                            'bottom': currentOpts.padding
                        })
                        .appendTo(outer);
                    break;

                case 'float':
                    title
                        .css('left', parseInt((title.width() - final_pos.width - 40) / 2, 10) * -1)
                        .appendTo(wrap);
                    break;

                default:
                    title
                        .css({
                            'width': final_pos.width - (currentOpts.padding * 2),
                            'paddingLeft': currentOpts.padding,
                            'paddingRight': currentOpts.padding
                        })
                        .appendTo(wrap);
                    break;
            }

            title.hide();
        },

        _set_navigation = function () {
            if (currentOpts.enableEscapeButton || currentOpts.enableKeyboardNav) {
                $(document).bind('keydown.fb', function (e) {
                    if (e.keyCode == 27 && currentOpts.enableEscapeButton) {
                        e.preventDefault();
                        $.fancyboxPlus.close();

                    } else if ((e.keyCode == 37 || e.keyCode == 39) && currentOpts.enableKeyboardNav && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'SELECT') {
                        e.preventDefault();
                        $.fancyboxPlus[e.keyCode == 37 ? 'prev' : 'next']();
                    }
                });
            }

            if (!currentOpts.showNavArrows) {
                nav_left.hide();
                nav_right.hide();
                return;
            }

            if ((currentOpts.cyclic && currentArray.length > 1) || currentIndex !== 0) {
                nav_left.show();
            }

            if ((currentOpts.cyclic && currentArray.length > 1) || currentIndex != (currentArray.length - 1)) {
                nav_right.show();
            }
        },

        _finish = function () {
            if (!$.support.opacity) {
                $('#fancybox-content').css('filter', 0);
                $('#fancybox-wrap').css('filter', 0);
            }

            if (selectedOpts.autoDimensions) {
                content.css('height', 'auto');
            }

            wrap.css('height', 'auto');

            if (titleStr && titleStr.length) {
                title.show();
            }

            if (currentOpts.showCloseButton) {
                close.show();
            }

            _set_navigation();

            if (currentOpts.hideOnContentClick) {
                content.bind('click', $.fancyboxPlus.close);
            }

            if (currentOpts.hideOnOverlayClick) {
                overlay.bind('click', $.fancyboxPlus.close);
            }

            $(window).bind("resize.fb", $.fancyboxPlus.resize);

            if (currentOpts.centerOnScroll) {
                $(window).bind("scroll.fb", $.fancyboxPlus.center);
            }

            if (currentOpts.type == 'iframe') {
                $('<iframe id="fbplus-frame" name="fbplus-frame' + new Date().getTime() + '" frameborder="0" hspace="0" ' +
                    (navigator.userAgent.match(/msie [6]/i) ? 'allowtransparency="true""' : '') + ' scrolling="' + selectedOpts.scrolling + '" src="' + currentOpts.href + '"></iframe>').appendTo(content);
            }

            wrap.show();

            busy = false;

            $.fancyboxPlus.center();

            currentOpts.onComplete(currentArray, currentIndex, currentOpts);

            _preload_images();
        },

        _preload_images = function () {
            var href,
                objNext;

            if ((currentArray.length - 1) > currentIndex) {
                href = currentArray[currentIndex + 1].href;

                if (typeof href !== 'undefined' && href.match(imgRegExp)) {
                    objNext = new Image();
                    objNext.src = href;
                }
            }

            if (currentIndex > 0) {
                href = currentArray[currentIndex - 1].href;

                if (typeof href !== 'undefined' && href.match(imgRegExp)) {
                    objNext = new Image();
                    objNext.src = href;
                }
            }
        },

        _draw = function (pos) {
            var dim = {
                width: parseInt(start_pos.width + (final_pos.width - start_pos.width) * pos, 10),
                height: parseInt(start_pos.height + (final_pos.height - start_pos.height) * pos, 10),

                top: parseInt(start_pos.top + (final_pos.top - start_pos.top) * pos, 10),
                left: parseInt(start_pos.left + (final_pos.left - start_pos.left) * pos, 10)
            };

            if (typeof final_pos.opacity !== 'undefined') {
                dim.opacity = pos < 0.5 ? 0.5 : pos;
            }

            wrap.css(dim);

            content.css({
                'width': dim.width - currentOpts.padding * 2,
                'height': dim.height - (titleHeight * pos) - currentOpts.padding * 2
            });
        },

        _get_viewport = function () {
            return [
                $(window).width() - (currentOpts.margin * 2),
                $(window).height() - (currentOpts.margin * 2),
                $(document).scrollLeft() + currentOpts.margin,
                $(document).scrollTop() + currentOpts.margin
            ];
        },

        _get_zoom_to = function () {
            var view = _get_viewport(),
                to = {},
                resize = currentOpts.autoScale,
                double_padding = currentOpts.padding * 2,
                ratio;

            if (currentOpts.width.toString().indexOf('%') > -1) {
                to.width = parseInt((view[0] * parseFloat(currentOpts.width)) / 100, 10);
            } else {
                to.width = currentOpts.width + double_padding;
            }

            if (currentOpts.height.toString().indexOf('%') > -1) {
                to.height = parseInt((view[1] * parseFloat(currentOpts.height)) / 100, 10);
            } else {
                to.height = currentOpts.height + double_padding;
            }

            if (resize && (to.width > view[0] || to.height > view[1])) {
                if (selectedOpts.type == 'image' || selectedOpts.type == 'swf') {
                    ratio = (currentOpts.width ) / (currentOpts.height );

                    if ((to.width ) > view[0]) {
                        to.width = view[0];
                        to.height = parseInt(((to.width - double_padding) / ratio) + double_padding, 10);
                    }

                    if ((to.height) > view[1]) {
                        to.height = view[1];
                        to.width = parseInt(((to.height - double_padding) * ratio) + double_padding, 10);
                    }

                } else {
                    to.width = Math.min(to.width, view[0]);
                    to.height = Math.min(to.height, view[1]);
                }
            }

            to.top = parseInt(Math.max(view[3] - 20, view[3] + ((view[1] - to.height - 40) * 0.5)), 10);
            to.left = parseInt(Math.max(view[2] - 20, view[2] + ((view[0] - to.width - 40) * 0.5)), 10);

            return to;
        },

        _get_obj_pos = function (obj) {
            var pos = obj.offset();

            pos.top += parseInt(obj.css('paddingTop'), 10) || 0;
            pos.left += parseInt(obj.css('paddingLeft'), 10) || 0;

            pos.top += parseInt(obj.css('border-top-width'), 10) || 0;
            pos.left += parseInt(obj.css('border-left-width'), 10) || 0;

            pos.width = obj.width();
            pos.height = obj.height();

            return pos;
        },

        _get_zoom_from = function () {
            var orig = selectedOpts.orig ? $(selectedOpts.orig) : false,
                from = {},
                pos,
                view;

            if (orig && orig.length) {
                pos = _get_obj_pos(orig);

                from = {
                    width: pos.width + (currentOpts.padding * 2),
                    height: pos.height + (currentOpts.padding * 2),
                    top: pos.top - currentOpts.padding - 20,
                    left: pos.left - currentOpts.padding - 20
                };

            } else {
                view = _get_viewport();

                from = {
                    width: currentOpts.padding * 2,
                    height: currentOpts.padding * 2,
                    top: parseInt(view[3] + view[1] * 0.5, 10),
                    left: parseInt(view[2] + view[0] * 0.5, 10)
                };
            }

            return from;
        },

        _animate_loading = function () {
            if (!loading.is(':visible')) {
                clearInterval(loadingTimer);
                return;
            }

            $('div', loading).css('top', (loadingFrame * -40) + 'px');

            loadingFrame = (loadingFrame + 1) % 12;
        };

    /*
     * Public methods
     */

    $.fn.fancyboxPlus = function (options) {
        if (!$(this).length) {
            return this;
        }

        $(this)
            .data('fancyboxPlus', $.extend({}, options, ($.metadata ? $(this).metadata() : {})))
            .unbind('click.fb')
            .bind('click.fb', function (e) {
                e.preventDefault();

                if (busy) {
                    return;
                }

                busy = true;

                $(this).blur();

                selectedArray = [];
                selectedIndex = 0;

                var rel = $(this).attr('rel') || '';

                if (!rel || rel == '' || rel === 'nofollow') {
                    selectedArray.push(this);

                } else {
                    selectedArray = $("a[rel=" + rel + "], area[rel=" + rel + "]");
                    selectedIndex = selectedArray.index(this);
                }

                _start();

                return;
            });

        return this;
    };

    $.fancyboxPlus = function (obj) {
        var opts;

        if (busy) {
            return;
        }

        busy = true;
        opts = typeof arguments[1] !== 'undefined' ? arguments[1] : {};

        selectedArray = [];
        selectedIndex = parseInt(opts.index, 10) || 0;

        if ($.isArray(obj)) {
            for (var i = 0, j = obj.length; i < j; i++) {
                if (typeof obj[i] == 'object') {
                    $(obj[i]).data('fancyboxPlus', $.extend({}, opts, obj[i]));
                } else {
                    obj[i] = $({}).data('fancyboxPlus', $.extend({content: obj[i]}, opts));
                }
            }

            selectedArray = jQuery.merge(selectedArray, obj);

        } else {
            if (typeof obj == 'object') {
                $(obj).data('fancyboxPlus', $.extend({}, opts, obj));
            } else {
                obj = $({}).data('fancyboxPlus', $.extend({content: obj}, opts));
            }

            selectedArray.push(obj);
        }

        if (selectedIndex > selectedArray.length || selectedIndex < 0) {
            selectedIndex = 0;
        }

        _start();
    };

    $.fancyboxPlus.showActivity = function () {
        clearInterval(loadingTimer);

        loading.show();
        loadingTimer = setInterval(_animate_loading, 66);
    };

    $.fancyboxPlus.hideActivity = function () {
        loading.hide();
    };

    $.fancyboxPlus.next = function () {
        return $.fancyboxPlus.pos(currentIndex + 1);
    };

    $.fancyboxPlus.prev = function () {
        return $.fancyboxPlus.pos(currentIndex - 1);
    };

    $.fancyboxPlus.pos = function (pos) {
        if (busy) {
            return;
        }

        pos = parseInt(pos);

        selectedArray = currentArray;

        if (pos > -1 && pos < currentArray.length) {
            selectedIndex = pos;
            _start();

        } else if (currentOpts.cyclic && currentArray.length > 1) {
            selectedIndex = pos >= currentArray.length ? 0 : currentArray.length - 1;
            _start();
        }

        return;
    };

    $.fancyboxPlus.cancel = function () {
        if (busy) {
            return;
        }

        busy = true;

        $.event.trigger('fbplus-cancel');

        _abort();

        selectedOpts.onCancel(selectedArray, selectedIndex, selectedOpts);

        busy = false;
    };

    // Note: within an iframe use - parent.$.fancyboxPlus.close();
    $.fancyboxPlus.close = function () {
        if (busy || wrap.is(':hidden')) {
            return;
        }

        busy = true;

        if (currentOpts && false === currentOpts.onCleanup(currentArray, currentIndex, currentOpts)) {
            busy = false;
            return;
        }

        _abort();

        $(close.add(nav_left).add(nav_right)).hide();

        $(content.add(overlay)).unbind();

        $(window).unbind("resize.fb scroll.fb");
        $(document).unbind('keydown.fb');

        content.find('iframe').attr('src', isIE6 && /^https/i.test(window.location.href || '') ? 'javascript:void(false)' : 'about:blank');

        if (currentOpts.titlePosition !== 'inside') {
            title.empty();
        }

        wrap.stop();

        function _cleanup() {
            overlay.fadeOut('fast');

            title.empty().hide();
            wrap.hide();

            $.event.trigger('fbplus-cleanup');

            content.empty();

            currentOpts.onClosed(currentArray, currentIndex, currentOpts);

            currentArray = selectedOpts = [];
            currentIndex = selectedIndex = 0;
            currentOpts = selectedOpts = {};

            busy = false;
        }

        if (currentOpts.transitionOut == 'elastic') {
            start_pos = _get_zoom_from();

            var pos = wrap.position();

            final_pos = {
                top: pos.top,
                left: pos.left,
                width: wrap.width(),
                height: wrap.height()
            };

            if (currentOpts.opacity) {
                final_pos.opacity = 1;
            }

            title.empty().hide();

            fx.prop = 1;

            $(fx).animate({prop: 0}, {
                duration: currentOpts.speedOut,
                easing: currentOpts.easingOut,
                step: _draw,
                complete: _cleanup
            });

        } else {
            wrap.fadeOut(currentOpts.transitionOut == 'none' ? 0 : currentOpts.speedOut, _cleanup);
        }
    };

    $.fancyboxPlus.resize = function () {
        if (overlay.is(':visible')) {
            overlay.css('height', $(document).height());
        }

        $.fancyboxPlus.center(true);
    };

    $.fancyboxPlus.center = function () {
        var view, align;

        if (busy) {
            return;
        }

        align = arguments[0] === true ? 1 : 0;
        view = _get_viewport();

        if (!align && (wrap.width() > view[0] || wrap.height() > view[1])) {
            return;
        }

        wrap
            .stop()
            .animate({
                'top': parseInt(Math.max(view[3] - 20, view[3] + ((view[1] - content.height() - 40) * 0.5) - currentOpts.padding)),
                'left': parseInt(Math.max(view[2] - 20, view[2] + ((view[0] - content.width() - 40) * 0.5) - currentOpts.padding))
            }, typeof arguments[0] == 'number' ? arguments[0] : 200);
    };

    $.fancyboxPlus.init = function () {
        if ($("#fbplus-wrap").length) {
            return;
        }

        $('body').append(
            tmp = $('<div id="fbplus-tmp"></div>'),
            loading = $('<div id="fbplus-loading"><div></div></div>'),
            overlay = $('<div id="fbplus-overlay"></div>'),
            wrap = $('<div id="fbplus-wrap"></div>')
        );

        outer = $('<div id="fbplus-outer"></div>')
            .append('<div class="fbplus-bg" id="fbplus-bg-n"></div><div class="fbplus-bg" id="fbplus-bg-ne"></div><div class="fbplus-bg" id="fbplus-bg-e"></div><div class="fbplus-bg" id="fbplus-bg-se"></div><div class="fbplus-bg" id="fbplus-bg-s"></div><div class="fbplus-bg" id="fbplus-bg-sw"></div><div class="fbplus-bg" id="fbplus-bg-w"></div><div class="fbplus-bg" id="fbplus-bg-nw"></div>')
            .appendTo(wrap);

        outer.append(
            content = $('<div id="fbplus-content"></div>'),
            close = $('<a id="fbplus-close"></a>'),
            title = $('<div id="fbplus-title"></div>'),

            nav_left = $('<a href="javascript:;" id="fbplus-left"><span class="fancy-ico" id="fbplus-left-ico"></span></a>'),
            nav_right = $('<a href="javascript:;" id="fbplus-right"><span class="fancy-ico" id="fbplus-right-ico"></span></a>')
        );

        close.click($.fancyboxPlus.close);
        loading.click($.fancyboxPlus.cancel);

        nav_left.click(function (e) {
            e.preventDefault();
            $.fancyboxPlus.prev();
        });

        nav_right.click(function (e) {
            e.preventDefault();
            $.fancyboxPlus.next();
        });

        if ($.fn.mousewheel) {
            wrap.bind('mousewheel.fb', function (e, delta) {
                if (busy) {
                    e.preventDefault();

                } else if ($(e.target).get(0).clientHeight == 0 || $(e.target).get(0).scrollHeight === $(e.target).get(0).clientHeight) {
                    e.preventDefault();
                    $.fancyboxPlus[delta > 0 ? 'prev' : 'next']();
                }
            });
        }

        if (!$.support.opacity) {
            wrap.addClass('fbplus-ie');
        }

        if (isIE6) {
            loading.addClass('fbplus-ie6');
            wrap.addClass('fbplus-ie6');

            $('<iframe id="fbplus-hide-sel-frame" src="' + (/^https/i.test(window.location.href || '') ? 'javascript:void(false)' : 'about:blank' ) + '" scrolling="no" border="0" frameborder="0" tabindex="-1"></iframe>').prependTo(outer);
        }
    };

    $.fn.fancyboxPlus.defaults = {
        padding: 10,
        margin: 40,
        opacity: false,
        modal: false,
        cyclic: false,
        scrolling: 'auto',	// 'auto', 'yes' or 'no'

        width: 560,
        height: 340,

        autoScale: true,
        autoDimensions: true,
        centerOnScroll: false,

        ajax: {},
        swf: {wmode: 'transparent'},

        hideOnOverlayClick: true,
        hideOnContentClick: false,

        overlayShow: true,
        overlayOpacity: 0.7,
        overlayColor: '#777',

        titleShow: true,
        titlePosition: 'float', // 'float', 'outside', 'inside' or 'over'
        titleFormat: null,
        titleFromAlt: false,

        transitionIn: 'fade', // 'elastic', 'fade' or 'none'
        transitionOut: 'fade', // 'elastic', 'fade' or 'none'

        speedIn: 300,
        speedOut: 300,

        changeSpeed: 300,
        changeFade: 'fast',

        easingIn: 'swing',
        easingOut: 'swing',

        showCloseButton: true,
        showNavArrows: true,
        enableEscapeButton: true,
        enableKeyboardNav: true,

        onStart: function () {
        },
        onCancel: function () {
        },
        onComplete: function () {
        },
        onCleanup: function () {
        },
        onClosed: function () {
        },
        onError: function () {
        }
    };

    $(document).ready(function () {
        $.fancyboxPlus.init();
    });

})(jQuery);

(function () {
    'use strict';

    angular.module('fancyboxplus', [])
        .service('fancyboxService', fancyboxService)
        .directive('fancyboxable', fancyboxableDirective)
        .directive('fancybox', fancyboxDirective);

    function fancyboxService() {

        //Fancybox-Plus JavaScript API reference:
        // http://igorlino.github.io/fancybox-plus/api.htm

        var service = {
            fancyboxPlus: fancyboxPlus, //returns the fancyboxplus jquery plugin

            showActivity: showActivity,//Shows loading animation
            hideActivity: hideActivity,//Hides loading animation
            next: next,//Displays the next gallery item
            prev: prev,//Displays the previous gallery item
            pos: pos,//Displays item by index from gallery
            cancel: cancel,//Cancels loading content
            close: close,//Hides FancyBox. Within an iframe use - parent.close();
            resize: resize,//Auto-resizes FancyBox height to match height of content
            center: center//Centers FancyBox in viewport
        };
        return service;

        ////////////


        function fancyboxPlus() {
            return $.fancyboxPlus;
        }

        function showActivity() {
            fancyboxPlus().showActivity();
        }

        function hideActivity() {
            fancyboxPlus().hideActivity();
        }

        function pos() {
            fancyboxPlus().pos();
        }

        function cancel() {
            fancyboxPlus().cancel();
        }

        function center() {
            fancyboxPlus().center();
        }

        function next() {
            fancyboxPlus().next();
        }

        function prev() {
            fancyboxPlus().prev();
        }

        function close() {
            fancyboxPlus().close();
        }

        function resize() {
            fancyboxPlus().resize();
        }
    }

    fancyboxableDirective.$inject = ['$compile', '$rootScope', '$http', '$parse', '$timeout', 'fancyboxService'];
    function fancyboxableDirective($compile, $rootScope, $http, $parse, $timeout, fancyboxService) {
        var service = {
            restrict: 'A',
            link: fancyboxableLink,
            priority: 100 // must lower priority than ngSrc (99)
        };
        return service;

        ////////////////////////////


        fancyboxableLink.$inject = ['$scope', '$element', '$attributes'];
        function fancyboxableLink($scope, $element, $attributes, controller) {
            var fbp = null;

            $scope.$on('$destroy', function () {
                $element.remove();
            });

            init();

            function init(open) {
                var options = {
                    href: $attributes.src ? $attributes.src : $attributes.href,
                    onComplete: function () {
                        onComplete();
                    }
                };

                //generic way that sets all (non-function) parameters of fancybox-plus.
                if ($attributes.fancyboxable && $attributes.fancyboxable.length > 0) {
                    var fbpOptionsFunc = $parse($attributes.fancyboxable);
                    var fbpOptions = fbpOptionsFunc($scope);
                    angular.extend(options, fbpOptions);
                }

                //clean undefined
                for (var key in options) {
                    if (options.hasOwnProperty(key)) {
                        if (typeof(options[key]) === 'undefined') {
                            delete options[key];
                        }
                    }
                }

                if (typeof(open) !== 'undefined') {
                    options.open = open;
                }

                //wait for the DOM view to be ready
                $timeout(function () {

                    if (!$attributes.ngSrc) {
                        //opens the fancybox using an href.
                        fbp = $($element).fancyboxPlus(options);
                    } else {
                        //$element.bind('load', function() {
                        /*$scope.$apply(function () {
                         options.href = $attributes.src ? $attributes.src : $attributes.href;
                         cb = $.colorbox(options);
                         });*/
                        //wait for the DOM view to be ready
                        $timeout(function () {
                            options.href = $attributes.src ? $attributes.src : $attributes.href;
                            fbp = $($element).fancyboxPlus(options);
                        }, 300);
                        //});
                    }


                }, 0);
            }

            function onComplete() {
                $rootScope.$apply(function () {
                    var content = $('#fbplus-content');
                    $compile(content)($rootScope);
                });
            }
        }


    }

    fancyboxDirective.$inject = ['$compile', '$rootScope', '$http', '$parse', '$timeout', 'fancyboxService'];
    function fancyboxDirective($compile, $rootScope, $http, $parse, $timeout, fancyboxService) {
        var service = {
            restrict: 'E',
            scope: {
                open: '=',
                options: '=',
                templateUrl: '&',

                onStart: '&', //Will be called right before attempting to load the content
                onCancel: '&', //Will be called after loading is canceled
                onComplete: '&', //Will be called once the content is displayed
                onCleanup: '&', //Will be called just before closing
                onClosed: '&' //Will be called once FancyBox is closed

            },
            require: 'fancybox',
            link: link,
            controller: controller,
            controllerAs: 'vm'
        };
        return service;

        ////////////////////////////

        controller.$inject = ['$scope'];
        function controller($scope) {

        }

        link.$inject = ['$scope', '$element', '$attributes'];
        function link($scope, $element, $attributes, controller) {
            var fbp = null;

            $scope.$watch('open', function (newValue, oldValue) {
                //console.log("watch $scope.open(" + $scope.open + ") " + oldValue + "->" + newValue);
                if (oldValue !== newValue) {
                    updateOpen(newValue);
                }
            });

            $scope.$on('$destroy', function () {
                $element.remove();
            });

            init();

            function updateOpen(newValue) {
                if (newValue) {
                    init(newValue);
                } else {
                    fancyboxService.close();
                }
            }

            function init(open) {
                var options = {
                    href: $attributes.src,
                    boxFor: $attributes.boxFor,
                    onOpen: function () {
                        if ($scope.onOpen && $scope.onOpen()) {
                            $scope.onOpen()();
                        }
                    },
                    onCancel: function () {
                        if ($scope.onCancel && $scope.onCancel()) {
                            $scope.onCancel()();
                        }
                    },
                    onComplete: function () {
                        onComplete();
                        if ($scope.onComplete && $scope.onComplete()) {
                            $scope.onComplete()();
                        }
                    },
                    onCleanup: function () {
                        if ($scope.onCleanup && $scope.onCleanup()) {
                            $scope.onCleanup()();
                        }
                    },
                    onClosed: function () {
                        $scope.$apply(function () {
                            $scope.open = false;
                        });
                        if ($scope.onClosed && $scope.onClosed()) {
                            $scope.onClosed()();
                        }
                    }
                };

                //generic way that sets all (non-function) parameters of fancybox-plus.
                if ($scope.options) {
                    angular.extend(options, $scope.options);
                }

                //clean undefined
                for (var key in options) {
                    if (options.hasOwnProperty(key)) {
                        if (typeof(options[key]) === 'undefined') {
                            delete options[key];
                        }
                    }
                }

                if (typeof(open) !== 'undefined') {
                    options.open = open;
                }

                //wait for the DOM view to be ready
                $timeout(function () {
                    if (options.boxFor) {
                        //opens the element by id boxFor
                        fbp = $(options.boxFor).fancyboxPlus(options);
                    } else if (options.href) {
                        //opens the fancybox-plus using an href.
                        fbp = $.fancyboxPlus(options);
                    }
                }, 0);
            }

            function onComplete() {
                $rootScope.$apply(function () {
                    var content = $('#fbplus-content');
                    $compile(content)($rootScope);
                });
            }
        }
    }

})
();

//
//(function (angular, $) {
//    'use strict';
//
//    var module = angular.module('ngx.ui.lightbox', ['ngx.config', 'ngx.loader']);
//
//    /**
//     * Lightbox directive
//     */
//    module.directive('ngxLightbox', ['ngxConfig', 'ngxLoader', function (ngxConfig, ngxLoader) {
//        var deps = [
//            ngxConfig.libsPath + 'jquery.fancybox/jquery.fancybox.js',
//            ngxConfig.libsPath + 'jquery.fancybox/css/fancybox.css'
//        ];
//
//        return {
//            link: function (scope, element, attrs) {
//                // group tag
//                if (attrs.ngxLightbox) {
//                    element.attr('rel', attrs.ngxLightbox);
//                }
//
//                ngxLoader(deps, function () {
//                    $(element).fancybox({
//                        onStart: function (items, index, options) {
//                            var arrowStyle = {
//                                height: '100%',
//                                bottom: 0
//                            };
//
//                            angular.extend(options, {
//                                href: (attrs.href || attrs.src),
//                                title: attrs.title,
//                                titlePosition: 'inside',
//                                speedIn: 150,
//                                speedOut: 150
//                            });
//
//                            // autoset options by attributes
//                            if (options.href.match(/youtube\.com/)) {
//                                // youtube video
//                                angular.extend(options, {
//                                    type: 'swf',
//                                    href: attrs.href + '?autoplay=1&fs=1',        // AS3 + autoplay + fullscreen
//                                    width: 661,
//                                    height: 481,
//                                    swf: {
//                                        wmode: 'transparent',
//                                        allowfullscreen: true
//                                    }
//                                });
//                                angular.extend(arrowStyle, {
//                                    height: '40%',
//                                    bottom: '30%'
//                                });
//
//                            } else if (options.href.match(/(jpg|png|gif|bmp)$/) || options.href.match(/^data:image\//)) {
//                                // image
//                                options.type = 'image';
//
//                            } else {
//                                // iframe
//                                angular.extend(options, {
//                                    type: 'iframe',
//                                    width: '90%',
//                                    height: '95%'
//                                });
//                            }
//
//                            // override default options from attributes
//                            angular.forEach(['width', 'height', 'title', 'type'], function (attr) {
//                                if (attrs[attr]) {
//                                    options[attr] = attrs[attr];
//                                }
//                            });
//
//                            $('#fancybox-left').css(arrowStyle);
//                            $('#fancybox-right').css(arrowStyle);
//
//                            return options;
//                        }
//                    });
//                });
//            }
//        };
//    }]);
//
//})(window.angular, window.jQuery);

/**
 * dirPagination - AngularJS module for paginating (almost) anything.
 *
 *
 * Credits
 * =======
 *
 * Daniel Tabuenca: https://groups.google.com/d/msg/angular/an9QpzqIYiM/r8v-3W1X5vcJ
 * for the idea on how to dynamically invoke the ng-repeat directive.
 *
 * I borrowed a couple of lines and a few attribute names from the AngularUI Bootstrap project:
 * https://github.com/angular-ui/bootstrap/blob/master/src/pagination/pagination.js
 *
 * Copyright 2014 Michael Bromley <michael@michaelbromley.co.uk>
 */

(function() {

    /**
     * Config
     */
    var moduleName = 'angularUtils.directives.dirPagination';
    var DEFAULT_ID = '__default';

    /**
     * Module
     */
    angular.module(moduleName, [])
        .directive('dirPaginate', ['$compile', '$parse', 'paginationService', dirPaginateDirective])
        .directive('dirPaginateNoCompile', noCompileDirective)
        .directive('dirPaginationControls', ['paginationService', 'paginationTemplate', dirPaginationControlsDirective])
        .filter('itemsPerPage', ['paginationService', itemsPerPageFilter])
        .service('paginationService', paginationService)
        .provider('paginationTemplate', paginationTemplateProvider)
        .run(['$templateCache',dirPaginationControlsTemplateInstaller]);

    function dirPaginateDirective($compile, $parse, paginationService) {

        return  {
            terminal: true,
            multiElement: true,
            priority: 100,
            compile: dirPaginationCompileFn
        };

        function dirPaginationCompileFn(tElement, tAttrs){

            var expression = tAttrs.dirPaginate;
            // regex taken directly from https://github.com/angular/angular.js/blob/v1.4.x/src/ng/directive/ngRepeat.js#L339
            var match = expression.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);

            var filterPattern = /\|\s*itemsPerPage\s*:\s*(.*\(\s*\w*\)|([^\)]*?(?=\s+as\s+))|[^\)]*)/;
            if (match[2].match(filterPattern) === null) {
                throw 'pagination directive: the \'itemsPerPage\' filter must be set.';
            }
            var itemsPerPageFilterRemoved = match[2].replace(filterPattern, '');
            var collectionGetter = $parse(itemsPerPageFilterRemoved);

            addNoCompileAttributes(tElement);

            // If any value is specified for paginationId, we register the un-evaluated expression at this stage for the benefit of any
            // dir-pagination-controls directives that may be looking for this ID.
            var rawId = tAttrs.paginationId || DEFAULT_ID;
            paginationService.registerInstance(rawId);

            return function dirPaginationLinkFn(scope, element, attrs){

                // Now that we have access to the `scope` we can interpolate any expression given in the paginationId attribute and
                // potentially register a new ID if it evaluates to a different value than the rawId.
                var paginationId = $parse(attrs.paginationId)(scope) || attrs.paginationId || DEFAULT_ID;
                
                // (TODO: this seems sound, but I'm reverting as many bug reports followed it's introduction in 0.11.0.
                // Needs more investigation.)
                // In case rawId != paginationId we deregister using rawId for the sake of general cleanliness
                // before registering using paginationId
                // paginationService.deregisterInstance(rawId);
                paginationService.registerInstance(paginationId);

                var repeatExpression = getRepeatExpression(expression, paginationId);
                addNgRepeatToElement(element, attrs, repeatExpression);

                removeTemporaryAttributes(element);
                var compiled =  $compile(element);

                var currentPageGetter = makeCurrentPageGetterFn(scope, attrs, paginationId);
                paginationService.setCurrentPageParser(paginationId, currentPageGetter, scope);

                if (typeof attrs.totalItems !== 'undefined') {
                    paginationService.setAsyncModeTrue(paginationId);
                    scope.$watch(function() {
                        return $parse(attrs.totalItems)(scope);
                    }, function (result) {
                        if (0 <= result) {
                            paginationService.setCollectionLength(paginationId, result);
                        }
                    });
                } else {
                    paginationService.setAsyncModeFalse(paginationId);
                    scope.$watchCollection(function() {
                        return collectionGetter(scope);
                    }, function(collection) {
                        if (collection) {
                            var collectionLength = (collection instanceof Array) ? collection.length : Object.keys(collection).length;
                            paginationService.setCollectionLength(paginationId, collectionLength);
                        }
                    });
                }

                // Delegate to the link function returned by the new compilation of the ng-repeat
                compiled(scope);
                 
                // (TODO: Reverting this due to many bug reports in v 0.11.0. Needs investigation as the
                // principle is sound)
                // When the scope is destroyed, we make sure to remove the reference to it in paginationService
                // so that it can be properly garbage collected
                // scope.$on('$destroy', function destroyDirPagination() {
                //     paginationService.deregisterInstance(paginationId);
                // });
            };
        }

        /**
         * If a pagination id has been specified, we need to check that it is present as the second argument passed to
         * the itemsPerPage filter. If it is not there, we add it and return the modified expression.
         *
         * @param expression
         * @param paginationId
         * @returns {*}
         */
        function getRepeatExpression(expression, paginationId) {
            var repeatExpression,
                idDefinedInFilter = !!expression.match(/(\|\s*itemsPerPage\s*:[^|]*:[^|]*)/);

            if (paginationId !== DEFAULT_ID && !idDefinedInFilter) {
                repeatExpression = expression.replace(/(\|\s*itemsPerPage\s*:\s*[^|\s]*)/, "$1 : '" + paginationId + "'");
            } else {
                repeatExpression = expression;
            }

            return repeatExpression;
        }

        /**
         * Adds the ng-repeat directive to the element. In the case of multi-element (-start, -end) it adds the
         * appropriate multi-element ng-repeat to the first and last element in the range.
         * @param element
         * @param attrs
         * @param repeatExpression
         */
        function addNgRepeatToElement(element, attrs, repeatExpression) {
            if (element[0].hasAttribute('dir-paginate-start') || element[0].hasAttribute('data-dir-paginate-start')) {
                // using multiElement mode (dir-paginate-start, dir-paginate-end)
                attrs.$set('ngRepeatStart', repeatExpression);
                element.eq(element.length - 1).attr('ng-repeat-end', true);
            } else {
                attrs.$set('ngRepeat', repeatExpression);
            }
        }

        /**
         * Adds the dir-paginate-no-compile directive to each element in the tElement range.
         * @param tElement
         */
        function addNoCompileAttributes(tElement) {
            angular.forEach(tElement, function(el) {
                if (el.nodeType === 1) {
                    angular.element(el).attr('dir-paginate-no-compile', true);
                }
            });
        }

        /**
         * Removes the variations on dir-paginate (data-, -start, -end) and the dir-paginate-no-compile directives.
         * @param element
         */
        function removeTemporaryAttributes(element) {
            angular.forEach(element, function(el) {
                if (el.nodeType === 1) {
                    angular.element(el).removeAttr('dir-paginate-no-compile');
                }
            });
            element.eq(0).removeAttr('dir-paginate-start').removeAttr('dir-paginate').removeAttr('data-dir-paginate-start').removeAttr('data-dir-paginate');
            element.eq(element.length - 1).removeAttr('dir-paginate-end').removeAttr('data-dir-paginate-end');
        }

        /**
         * Creates a getter function for the current-page attribute, using the expression provided or a default value if
         * no current-page expression was specified.
         *
         * @param scope
         * @param attrs
         * @param paginationId
         * @returns {*}
         */
        function makeCurrentPageGetterFn(scope, attrs, paginationId) {
            var currentPageGetter;
            if (attrs.currentPage) {
                currentPageGetter = $parse(attrs.currentPage);
            } else {
                // If the current-page attribute was not set, we'll make our own.
                // Replace any non-alphanumeric characters which might confuse
                // the $parse service and give unexpected results.
                // See https://github.com/michaelbromley/angularUtils/issues/233
                var defaultCurrentPage = (paginationId + '__currentPage').replace(/\W/g, '_');
                scope[defaultCurrentPage] = 1;
                currentPageGetter = $parse(defaultCurrentPage);
            }
            return currentPageGetter;
        }
    }

    /**
     * This is a helper directive that allows correct compilation when in multi-element mode (ie dir-paginate-start, dir-paginate-end).
     * It is dynamically added to all elements in the dir-paginate compile function, and it prevents further compilation of
     * any inner directives. It is then removed in the link function, and all inner directives are then manually compiled.
     */
    function noCompileDirective() {
        return {
            priority: 5000,
            terminal: true
        };
    }

    function dirPaginationControlsTemplateInstaller($templateCache) {
        $templateCache.put('angularUtils.directives.dirPagination.template', '<ul class="pagination" ng-if="1 < pages.length || !autoHide"><li ng-if="boundaryLinks" ng-class="{ disabled : pagination.current == 1 }"><a href="" ng-click="setCurrent(1)">&laquo;</a></li><li ng-if="directionLinks" ng-class="{ disabled : pagination.current == 1 }"><a href="" ng-click="setCurrent(pagination.current - 1)">&lsaquo;</a></li><li ng-repeat="pageNumber in pages track by tracker(pageNumber, $index)" ng-class="{ active : pagination.current == pageNumber, disabled : pageNumber == \'...\' || ( ! autoHide && pages.length === 1 ) }"><a href="" ng-click="setCurrent(pageNumber)">{{ pageNumber }}</a></li><li ng-if="directionLinks" ng-class="{ disabled : pagination.current == pagination.last }"><a href="" ng-click="setCurrent(pagination.current + 1)">&rsaquo;</a></li><li ng-if="boundaryLinks"  ng-class="{ disabled : pagination.current == pagination.last }"><a href="" ng-click="setCurrent(pagination.last)">&raquo;</a></li></ul>');
    }

    function dirPaginationControlsDirective(paginationService, paginationTemplate) {

        var numberRegex = /^\d+$/;

        var DDO = {
            restrict: 'AE',
            scope: {
                maxSize: '=?',
                onPageChange: '&?',
                paginationId: '=?',
                autoHide: '=?'
            },
            link: dirPaginationControlsLinkFn
        };

        // We need to check the paginationTemplate service to see whether a template path or
        // string has been specified, and add the `template` or `templateUrl` property to
        // the DDO as appropriate. The order of priority to decide which template to use is
        // (highest priority first):
        // 1. paginationTemplate.getString()
        // 2. attrs.templateUrl
        // 3. paginationTemplate.getPath()
        var templateString = paginationTemplate.getString();
        if (templateString !== undefined) {
            DDO.template = templateString;
        } else {
            DDO.templateUrl = function(elem, attrs) {
                return attrs.templateUrl || paginationTemplate.getPath();
            };
        }
        return DDO;

        function dirPaginationControlsLinkFn(scope, element, attrs) {

            // rawId is the un-interpolated value of the pagination-id attribute. This is only important when the corresponding dir-paginate directive has
            // not yet been linked (e.g. if it is inside an ng-if block), and in that case it prevents this controls directive from assuming that there is
            // no corresponding dir-paginate directive and wrongly throwing an exception.
            var rawId = attrs.paginationId ||  DEFAULT_ID;
            var paginationId = scope.paginationId || attrs.paginationId ||  DEFAULT_ID;

            if (!paginationService.isRegistered(paginationId) && !paginationService.isRegistered(rawId)) {
                var idMessage = (paginationId !== DEFAULT_ID) ? ' (id: ' + paginationId + ') ' : ' ';
                if (window.console) {
                    console.warn('Pagination directive: the pagination controls' + idMessage + 'cannot be used without the corresponding pagination directive, which was not found at link time.');
                }
            }

            if (!scope.maxSize) { scope.maxSize = 9; }
            scope.autoHide = scope.autoHide === undefined ? true : scope.autoHide;
            scope.directionLinks = angular.isDefined(attrs.directionLinks) ? scope.$parent.$eval(attrs.directionLinks) : true;
            scope.boundaryLinks = angular.isDefined(attrs.boundaryLinks) ? scope.$parent.$eval(attrs.boundaryLinks) : false;

            var paginationRange = Math.max(scope.maxSize, 5);
            scope.pages = [];
            scope.pagination = {
                last: 1,
                current: 1
            };
            scope.range = {
                lower: 1,
                upper: 1,
                total: 1
            };

            scope.$watch('maxSize', function(val) {
                if (val) {
                    paginationRange = Math.max(scope.maxSize, 5);
                    generatePagination();
                }
            });

            scope.$watch(function() {
                if (paginationService.isRegistered(paginationId)) {
                    return (paginationService.getCollectionLength(paginationId) + 1) * paginationService.getItemsPerPage(paginationId);
                }
            }, function(length) {
                if (0 < length) {
                    generatePagination();
                }
            });

            scope.$watch(function() {
                if (paginationService.isRegistered(paginationId)) {
                    return (paginationService.getItemsPerPage(paginationId));
                }
            }, function(current, previous) {
                if (current != previous && typeof previous !== 'undefined') {
                    goToPage(scope.pagination.current);
                }
            });

            scope.$watch(function() {
                if (paginationService.isRegistered(paginationId)) {
                    return paginationService.getCurrentPage(paginationId);
                }
            }, function(currentPage, previousPage) {
                if (currentPage != previousPage) {
                    goToPage(currentPage);
                }
            });

            scope.setCurrent = function(num) {
                if (paginationService.isRegistered(paginationId) && isValidPageNumber(num)) {
                    num = parseInt(num, 10);
                    paginationService.setCurrentPage(paginationId, num);
                }
            };

            /**
             * Custom "track by" function which allows for duplicate "..." entries on long lists,
             * yet fixes the problem of wrongly-highlighted links which happens when using
             * "track by $index" - see https://github.com/michaelbromley/angularUtils/issues/153
             * @param id
             * @param index
             * @returns {string}
             */
            scope.tracker = function(id, index) {
                return id + '_' + index;
            };

            function goToPage(num) {
                if (paginationService.isRegistered(paginationId) && isValidPageNumber(num)) {
                    var oldPageNumber = scope.pagination.current;

                    scope.pages = generatePagesArray(num, paginationService.getCollectionLength(paginationId), paginationService.getItemsPerPage(paginationId), paginationRange);
                    scope.pagination.current = num;
                    updateRangeValues();

                    // if a callback has been set, then call it with the page number as the first argument
                    // and the previous page number as a second argument
                    if (scope.onPageChange) {
                        scope.onPageChange({
                            newPageNumber : num,
                            oldPageNumber : oldPageNumber
                        });
                    }
                }
            }

            function generatePagination() {
                if (paginationService.isRegistered(paginationId)) {
                    var page = parseInt(paginationService.getCurrentPage(paginationId)) || 1;
                    scope.pages = generatePagesArray(page, paginationService.getCollectionLength(paginationId), paginationService.getItemsPerPage(paginationId), paginationRange);
                    scope.pagination.current = page;
                    scope.pagination.last = scope.pages[scope.pages.length - 1];
                    if (scope.pagination.last < scope.pagination.current) {
                        scope.setCurrent(scope.pagination.last);
                    } else {
                        updateRangeValues();
                    }
                }
            }

            /**
             * This function updates the values (lower, upper, total) of the `scope.range` object, which can be used in the pagination
             * template to display the current page range, e.g. "showing 21 - 40 of 144 results";
             */
            function updateRangeValues() {
                if (paginationService.isRegistered(paginationId)) {
                    var currentPage = paginationService.getCurrentPage(paginationId),
                        itemsPerPage = paginationService.getItemsPerPage(paginationId),
                        totalItems = paginationService.getCollectionLength(paginationId);

                    scope.range.lower = (currentPage - 1) * itemsPerPage + 1;
                    scope.range.upper = Math.min(currentPage * itemsPerPage, totalItems);
                    scope.range.total = totalItems;
                }
            }
            function isValidPageNumber(num) {
                return (numberRegex.test(num) && (0 < num && num <= scope.pagination.last));
            }
        }

        /**
         * Generate an array of page numbers (or the '...' string) which is used in an ng-repeat to generate the
         * links used in pagination
         *
         * @param currentPage
         * @param rowsPerPage
         * @param paginationRange
         * @param collectionLength
         * @returns {Array}
         */
        function generatePagesArray(currentPage, collectionLength, rowsPerPage, paginationRange) {
            var pages = [];
            var totalPages = Math.ceil(collectionLength / rowsPerPage);
            var halfWay = Math.ceil(paginationRange / 2);
            var position;

            if (currentPage <= halfWay) {
                position = 'start';
            } else if (totalPages - halfWay < currentPage) {
                position = 'end';
            } else {
                position = 'middle';
            }

            var ellipsesNeeded = paginationRange < totalPages;
            var i = 1;
            while (i <= totalPages && i <= paginationRange) {
                var pageNumber = calculatePageNumber(i, currentPage, paginationRange, totalPages);

                var openingEllipsesNeeded = (i === 2 && (position === 'middle' || position === 'end'));
                var closingEllipsesNeeded = (i === paginationRange - 1 && (position === 'middle' || position === 'start'));
                if (ellipsesNeeded && (openingEllipsesNeeded || closingEllipsesNeeded)) {
                    pages.push('...');
                } else {
                    pages.push(pageNumber);
                }
                i ++;
            }
            return pages;
        }

        /**
         * Given the position in the sequence of pagination links [i], figure out what page number corresponds to that position.
         *
         * @param i
         * @param currentPage
         * @param paginationRange
         * @param totalPages
         * @returns {*}
         */
        function calculatePageNumber(i, currentPage, paginationRange, totalPages) {
            var halfWay = Math.ceil(paginationRange/2);
            if (i === paginationRange) {
                return totalPages;
            } else if (i === 1) {
                return i;
            } else if (paginationRange < totalPages) {
                if (totalPages - halfWay < currentPage) {
                    return totalPages - paginationRange + i;
                } else if (halfWay < currentPage) {
                    return currentPage - halfWay + i;
                } else {
                    return i;
                }
            } else {
                return i;
            }
        }
    }

    /**
     * This filter slices the collection into pages based on the current page number and number of items per page.
     * @param paginationService
     * @returns {Function}
     */
    function itemsPerPageFilter(paginationService) {

        return function(collection, itemsPerPage, paginationId) {
            if (typeof (paginationId) === 'undefined') {
                paginationId = DEFAULT_ID;
            }
            if (!paginationService.isRegistered(paginationId)) {
                throw 'pagination directive: the itemsPerPage id argument (id: ' + paginationId + ') does not match a registered pagination-id.';
            }
            var end;
            var start;
            if (angular.isObject(collection)) {
                itemsPerPage = parseInt(itemsPerPage) || 9999999999;
                if (paginationService.isAsyncMode(paginationId)) {
                    start = 0;
                } else {
                    start = (paginationService.getCurrentPage(paginationId) - 1) * itemsPerPage;
                }
                end = start + itemsPerPage;
                paginationService.setItemsPerPage(paginationId, itemsPerPage);

                if (collection instanceof Array) {
                    // the array just needs to be sliced
                    return collection.slice(start, end);
                } else {
                    // in the case of an object, we need to get an array of keys, slice that, then map back to
                    // the original object.
                    var slicedObject = {};
                    angular.forEach(keys(collection).slice(start, end), function(key) {
                        slicedObject[key] = collection[key];
                    });
                    return slicedObject;
                }
            } else {
                return collection;
            }
        };
    }

    /**
     * Shim for the Object.keys() method which does not exist in IE < 9
     * @param obj
     * @returns {Array}
     */
    function keys(obj) {
        if (!Object.keys) {
            var objKeys = [];
            for (var i in obj) {
                if (obj.hasOwnProperty(i)) {
                    objKeys.push(i);
                }
            }
            return objKeys;
        } else {
            return Object.keys(obj);
        }
    }

    /**
     * This service allows the various parts of the module to communicate and stay in sync.
     */
    function paginationService() {

        var instances = {};
        var lastRegisteredInstance;

        this.registerInstance = function(instanceId) {
            if (typeof instances[instanceId] === 'undefined') {
                instances[instanceId] = {
                    asyncMode: false
                };
                lastRegisteredInstance = instanceId;
            }
        };

        this.deregisterInstance = function(instanceId) {
            delete instances[instanceId];
        };
        
        this.isRegistered = function(instanceId) {
            return (typeof instances[instanceId] !== 'undefined');
        };

        this.getLastInstanceId = function() {
            return lastRegisteredInstance;
        };

        this.setCurrentPageParser = function(instanceId, val, scope) {
            instances[instanceId].currentPageParser = val;
            instances[instanceId].context = scope;
        };
        this.setCurrentPage = function(instanceId, val) {
            instances[instanceId].currentPageParser.assign(instances[instanceId].context, val);
        };
        this.getCurrentPage = function(instanceId) {
            var parser = instances[instanceId].currentPageParser;
            return parser ? parser(instances[instanceId].context) : 1;
        };

        this.setItemsPerPage = function(instanceId, val) {
            instances[instanceId].itemsPerPage = val;
        };
        this.getItemsPerPage = function(instanceId) {
            return instances[instanceId].itemsPerPage;
        };

        this.setCollectionLength = function(instanceId, val) {
            instances[instanceId].collectionLength = val;
        };
        this.getCollectionLength = function(instanceId) {
            return instances[instanceId].collectionLength;
        };

        this.setAsyncModeTrue = function(instanceId) {
            instances[instanceId].asyncMode = true;
        };

        this.setAsyncModeFalse = function(instanceId) {
            instances[instanceId].asyncMode = false;
        };

        this.isAsyncMode = function(instanceId) {
            return instances[instanceId].asyncMode;
        };
    }

    /**
     * This provider allows global configuration of the template path used by the dir-pagination-controls directive.
     */
    function paginationTemplateProvider() {

        var templatePath = 'angularUtils.directives.dirPagination.template';
        var templateString;

        /**
         * Set a templateUrl to be used by all instances of <dir-pagination-controls>
         * @param {String} path
         */
        this.setPath = function(path) {
            templatePath = path;
        };

        /**
         * Set a string of HTML to be used as a template by all instances
         * of <dir-pagination-controls>. If both a path *and* a string have been set,
         * the string takes precedence.
         * @param {String} str
         */
        this.setString = function(str) {
            templateString = str;
        };

        this.$get = function() {
            return {
                getPath: function() {
                    return templatePath;
                },
                getString: function() {
                    return templateString;
                }
            };
        };
    }
})();

var app = angular.module('gatku', ['angularFileUpload', 'ipCookie', 'ngAnimate', 'angular-stripe', 'ngTouch', 'credit-cards', 'checklist-model','angularUtils.directives.dirPagination']);

app.config(function(stripeProvider) {

	if (CONFIG.environment === 'production') {
	
		stripeProvider.setPublishableKey('pk_live_5MrQVqT1OSrL1lyeYe54NWgs');

	} else {

		stripeProvider.setPublishableKey('pk_test_iTOIZYCF15Qmpq7CYOqltHCJ');		

	}

});
app.filter('money', function () { 

    return function (amount) { 

        return (amount / 100); 
    }

});

app.filter('customNumber', function(){
      return function(input, size) {
        var zero = (size ? size : 4) - input.toString().length + 1;
        return Array(+(zero > 0 && zero)).join("0") + input;
      }
  });


app.directive('backImg',['$window', function($window) {
    return function(scope, element, attrs) {
        attrs.$observe('backImg', function(value) {
            element.css({
                'background-image': 'url(' + value +')',
                'background-size' : 'cover'
            });
        });
    };
}]);
app.directive('datepickerstartdate', function () {
return {
    restrict: 'A',
    require: 'ngModel',
     link: function (scope, element, attrs, ngModelCtrl) {
        element.datepicker({
            dateFormat: 'yy-mm-dd',
            onSelect: function (order_start_date) {
                scope.order_start_date = order_start_date;
                scope.$apply();
            }
        });
    }
  };
});
app.directive('datepickerenddate', function () {
return {
    restrict: 'A',
    require: 'ngModel',
     link: function (scope, element, attrs, ngModelCtrl) {
        element.datepicker({
            dateFormat: 'yy-mm-dd',
            onSelect: function (order_end_date) {
                scope.order_end_date = order_end_date;
                scope.$apply();
            }
        });
    }
  };
});




app.directive('hoverCard', ['$compile', '$window', 'Product', '$filter', function($compile, $window, Product, $filter) {

    return {

        restrict : 'E',

        scope : true,

        link : function($scope, element, attrs) {

            $scope.product = {};

            var moneyFilter = $filter('money');
            var thisElement = angular.element(element[0]);
            var template = '<div class="hover-card">' + 
            '<h2>{{ product.name }}</h2>' + 
            '<div class="hover-card-image-container" ng-class="{ \'pole\' : product.type.slug === \'pole\' }"><img ng-src="{{ product.thumb }}"></div>' +
            '<div class="hover-card-actions"><a ng-href="/product/'+ attrs.slug +'" target="_blank"><div class="button success-bg">See This Product</div></a></div>' +
            '<div class="hover-card-price">${{ product.price | money }}</div>' + 
            '<div class="clear"></div>' +
            '<div class="hover-card-carot shadowed"></div>'+
            '<div class="hover-card-carot"></div>'+
            '</div>';
            var body = angular.element($window.document.getElementsByTagName('body')[0]);
            var hoverCard = $compile(template)($scope);

            $scope.productFetched = false;

            $scope.init = function() {

                if ($window.innerWidth > 750) {

                    body.append(hoverCard);

                    $scope.positionCard();

                    $scope.fetchProduct();

                }

            }

            $scope.fetchProduct = function() {

                Product.getBySlug(attrs.slug).success(function(response) {

                    $scope.product = response.data;

                    $scope.productFetched = true;

                    $scope.positionCard();

                }).error(function(response) {

                    console.log(response.message);

                });

            }

            $scope.positionCard = function() {

                var offsetTop = $scope.getRootOffsetTop(thisElement[0], 0);
                var offsetLeft = $scope.getRootOffsetLeft(thisElement[0], 0);
                var width = thisElement[0].offsetWidth;
                var cardHeight = hoverCard[0].offsetHeight;
                var top = offsetTop - (cardHeight / 2);
                var left = offsetLeft + width;

                hoverCard.css({ top : top + 'px', left : left + 'px'});

            }

            $scope.getRootOffsetTop = function(elem, val){

                if (elem.offsetParent === null){

                    return val + elem.offsetTop;

                }

                return $scope.getRootOffsetTop(elem.offsetParent, val + elem.offsetTop);

            };

            $scope.getRootOffsetLeft = function(elem, val){

            if (elem.offsetParent === null) {

                return val + elem.offsetLeft;

            }

            return $scope.getRootOffsetLeft(elem.offsetParent, val + elem.offsetLeft);

            };

            thisElement.bind('mouseover', function show() {

                if (!$scope.productFetched) {

                    $scope.fetchProduct();

                } 

                hoverCard.addClass('visible');

            });

            thisElement.bind('mouseleave', function hide() {

                hoverCard.removeClass('visible');

            });

            hoverCard.bind('mouseover', function show() {

                hoverCard.addClass('visible');

            });

            hoverCard.bind('mouseleave', function hide() {

                hoverCard.removeClass('visible');
                
            });

            angular.element($window).bind('resize', function onResize() {

                $scope.positionCard();

            });

            $scope.init();
            

        }

    }

}]);


app.directive('productBuyers', ['Product', function(Product) {

    return {

        restrict : 'E',

        scope : false,

        template : '<div>' +
            '<p class="product-buyers-header bold" ng-show="photos.length">Others who have bought this product:</p>' +
            '<div class="product-buyers-container">' +
            '<div class="product-buyer placeholder square" ng-hide="photos.length"></div>' + 
            '<div class="product-buyer square" ng-repeat="photo in photos | limitTo:3" ng-style="{\'background-image\':\'url(\' + photo.image + \')\'}"><a class="grouped_elements" rel="group1" href="{{photo.image}}"><img src="{{photo.image}}" alt="" style="width: 100%;height: 100%;vertical-align: top; opacity:0;"/></a></div>' + 
            '<div class="clear"></div>' +
            '</div>' +
            '</div>',

        link : function($scope, element, attrs) {

            $scope.photos = [];

            function getImages() {

                Product.customerPhotos(attrs.productId).success(function(response) {

                    $scope.photos = response.data;

                    Squares.init();

                }).error(function(response) {

                    console.log("There was a problem getting the product images");

                });

            }

            getImages();

        }

    }

}]);

app.directive('loaded', ['$parse', function($parse) {

    return {

        restrict: 'A',

        link: function (scope, elem, attrs) {

            var fn = $parse(attrs.loaded);

            elem.on('load', function (event) {

                scope.$apply(function() {

                    fn(scope, { $event: event });

                });

            });

        }

    };

}]);



app.directive('alerter', ['$window', '$timeout', 'AlertService', function($window, $timeout, AlertService) {

    return {

        restrict : 'E',

        template : '<div class="alert-container slide-up" ng-show="show">' +
        '<div ng-class="{\'success-alert\' : alertType === \'success\', \'info-alert\' : alertType === \'info\', \'error-alert\' : alertType === \'error\'}">' +
            '{{ message }}' +
        '</div>' +
        '<i class="fa fa-close" ng-click="show = false"></i>' +
        '</div>',

        scope : false,

        link : function($scope, element, attrs) {

            $scope.message = '';
            $scope.show = false;
            $scope.alertType = 'success';

            $scope.$on('successAlert', function() {

                $scope.alertType = 'success';   
                display();

            });

            $scope.$on('infoAlert', function() {

                $scope.alertType = 'info';
                display();

            });

            $scope.$on('errorAlert', function() {

                $scope.alertType = 'error';
                display();

            });

            function display() {

                $scope.message = AlertService.message;
                $scope.show = true;

                $timeout(function() {

                    $scope.show = false;

                }, 4000)

            }

        }


    }

}]);

app.directive('hamburger', ['NavigationService', function(NavigationService) {

    return {

        restrict : 'E',

        template : '<div class="hamburger" ng-click="action()" ng-class="{ \'open\' : open }">' +
        '<div class="patty"></div>' +
        '<div class="patty"></div>' +
        '<div class="patty"></div>' +
        // '<span class="status">{{ status }}</span>' +
        '</div>',

        link : function($scope, element, attrs) {

            $scope.open = false;

            $scope.status = 'Menu';

            $scope.action = function() {

                if ($scope.open) {

                    NavigationService.close();

                } else {

                    NavigationService.open();

                }

            }

            $scope.$on('open', function() {

                $scope.open = true;

                $scope.status = 'Back';

            });

            $scope.$on('close', function() {

                $scope.open = false;

                $scope.status = 'Menu';

            });

        }

    }

}]);

app.directive('cartIcon', ['CartService', function(CartService) {

    return {

        restrict : 'E',

        template : '<div class="cart-icon" ng-click="showCart()">' + 
        'Cart' +
        '<span class="mobile-cart-indicator">{{ count }}</span>' +
        '</div>',

        link : function($scope, element, attrs) {

            $scope.count = CartService.count(); 

            $scope.$on('update', function() {

                $scope.count = CartService.count(); 

            });

            $scope.showCart = function() {

                CartService.show();

            }

        }

    }

}]);



app.directive('bodyFreeze', ['CartService', function(CartService) {

    return {

        restrict : 'A',

        link : function($scope, element, attrs) {

            $scope.$on('show', function() {

                element.addClass('frozen');

            });

            $scope.$on('hide', function() {

                element.removeClass('frozen');

            });

        }

    }

}]);


app.directive('smoothLink', ['$window', '$location', 'NavigationService', function($window, $location, NavigationService) {

    return {

        restrict : 'E',

        scope : {},

        template : '<a href="#" ng-click="click()">{{ text }}</a>',

        link : function($scope, element, attrs) {

            $scope.text = attrs.text;

            $scope.click = function() {

                var target = angular.element($window.document.getElementById(attrs.destination));
                var body = $window.document.getElementsByTagName('body')[0];

                NavigationService.close();
                // console.log(target[0].ofsetTop);
                // body.scrollTop = target[0].offsetTop;
                $('html,body').animate({ scrollTop: target[0].offsetTop }, 400);

                return false;

            }

        }

    }

}]);


app.directive('shippingRequest', ['$window', '$compile','ShippingRequest', 'AlertService', function($window, $compile, ShippingRequest, AlertService) {

    return {

        restrict : 'E',

        template : '<div class="button info-bg" shipping-request ng-click="open = !open">{{shipping.id ? "Request Sent" : "Request Shipping"}}</div>',

        scope : {
            order : '=',
            shipping: '='
        },

        link : function($scope, element, attrs) {

            var template = '<div class="shipping-request-panel" ng-show="open">' +
                '<h2>Sending shipping request to {{ order.customer.fullName }} for order : <span class="brand">{{ order.number }}</span></h2>' +
                '<form>' +
                    '<label>Amount <span class="faded bold">(in dollars)</span></label>' +
                    '<input type="number" ng-model="price">' +
                    '<div class="button success-bg" ng-click="send()">Send</div>' +
                '</form>' +
                '<i class="fa fa-close" ng-click="open = false;"></i>' +
            '</div>';
            var body = angular.element($window.document.getElementsByTagName('body')[0]);
            var shippingRequestPanel = $compile(template)($scope);  

            $scope.price = 0;

            $scope.open = false;    

            function init() {

                body.append(shippingRequestPanel);

            }

            $scope.send = function() {

                var nanobar = new Nanobar({ bg : '#fff' });
                var data = { 

                    price : $scope.price * 100, 
                    orderId : $scope.order.id
                }

                nanobar.go(60);

                ShippingRequest.send(data).success(function(response) {
                    $scope.order.shipping = response.data;
                    $scope.open = false;
                    nanobar.go(100);
                    AlertService.broadcast('Shipping Request Sent!', 'success');

                }).error(function(response) {

                    nanobar.go(100);
                    AlertService.broadcast('Sorry, there was a problem.', 'error');

                });

            }

            init();

        }

    }

}]);

app.directive('shippingTrack', ['$window', '$compile','ShippingTrack', 'AlertService', function($window, $compile, ShippingTrack, AlertService) {
    return {
        restrict : 'E',
        template : '<div class="button info-bg" shipping-track ng-click="open = !open">{{ tracking.track_id ? "Edit" : "Set Tracking"}}</div>',
        scope : {
            order : '=',
            tracking: '='
        },

        link : function($scope, element, attrs) {
            var template = '<div class="shipping-request-panel" ng-show="open">' +
               '<h2>Applying Tracking Number to {{ order.customer.fullName }} for order : <span class="brand">{{ order.number }}</span></h2>' +
                '<form>' +
                     '<label>Tracking Number {{tracking.track_id ? "(Previous Tracking:" + tracking.track_id + ")": "" }}</label>' +
                     '<input type="text" ng-model="track_id">' +
                     '<div class="shipping-request-model">'+
                     '<select ng-model="carrier">'+
                       '<option value="" ng-selected="true" ng-selected="true">Please Select a Carrier</option>'+
                        '<option value="usps" label="USPS">usps.com</option>'+
                        '<option value="auspost" label="Auspost">auspost.com.au</option>'+
                        '<option value="packsend" label="Packsend">packsend.com.au</option>' +
                        '<option value="ups" label="UPS">ups.com</option>' +
                    '</select>'+ 
                     '<div style="float:right" class="button success-bg" ng-click="send()">Apply</div></div> ' +
                 '</form>' +
                 '<i class="fa fa-close" ng-click="open = false;"></i>' +
             '</div>';
            var body = angular.element($window.document.getElementsByTagName('body')[0]);
            var shippingTrackPanel = $compile(template)($scope);    

            $scope.price = 0;
            $scope.open = false;    

            function init() {
                body.append(shippingTrackPanel);
            }

            $scope.send = function() {
                var nanobar = new Nanobar({ bg : '#fff' });
                var data = { 
                    track_id : $scope.track_id, 
                    orderId : $scope.order.id,
                    carrier : $scope.carrier,
                }
                if (angular.isDefined($scope.tracking)) {
                    data.trackId = $scope.tracking.id
                  }
               /* if (angular.isDefined($scope.carrier)) {
                    data.carrier = $scope.tracking.carrier
                  }*/
                  if(!data.carrier){
                    AlertService.broadcast('Please select carrier.', 'error');
                    return false;           
                  }
                  if(!data.track_id){
                    AlertService.broadcast('Please input the truck id.', 'error');
                    return false;           
                  }
         
 
                nanobar.go(60);

                ShippingTrack.send(data).success(function(response) {
                    $scope.order.tracking = response.data;
                    $scope.open = false;
                    shippingTrackPanel.remove();
                    nanobar.go(100);
                    AlertService.broadcast('Tracking Number set!', 'success');
                }).error(function(response) {
                    nanobar.go(100);
                    AlertService.broadcast('Sorry, there was a problem.', 'error');
                });
            }

            init();
        }

    }

}]);










app.factory('AlertService', ['$rootScope', function($rootScope) {

	var AlertService = {};

	AlertService.message = '';

	AlertService.broadcast = function(message, type) {

		this.message = message;

		if (type == 'success') {

			this.broadcastSuccessAlert();

		} else if (type == 'error') {

			this.broadcastErrorAlert();

		} else if (type == 'info') {

			this.broadcastInfoAlert();

		} else {

			this.broadcastInfoAlert();

		}

	}

	AlertService.broadcastSuccessAlert = function() {

		$rootScope.$broadcast('successAlert');

	}

	AlertService.broadcastErrorAlert = function() {

		$rootScope.$broadcast('errorAlert');

	}

	AlertService.broadcastInfoAlert = function() {

		$rootScope.$broadcast('infoAlert');

	}

	return AlertService;

}]);
app.factory('CartService', ['$rootScope', '$http', 'ipCookie', 'AlertService', function($rootScope, $http, ipCookie, AlertService) {

	var CartService = {};
	var Cookie = ipCookie;

	CartService.getItems = function() {
		var cookies = Cookie('items') || [];

		return cookies;
	}

	/**
	 * This method defines what pieces of data 
	 * you want to use in all of the CartController logic.
	 *
	 */
	CartService.addItem = function(data) {
		var cart = CartService.getItems();
		var item = {};

		item.id = data.id;
		item.name = data.name;
		item.shortName = data.shortName;
		item.length = data.length;
		item.price = data.price;
		item.thumb = data.thumb;
		item.slug = data.slug;
		item.type = {};
		item.type.shippingPrice = data.type.shippingPrice;
		item.type.slug = data.type.slug;
		item.sizeable = data.sizeable;
		item.sizeId = data.sizeId;
		item.addons = [];
		item.quantity = 1;

		// Grab selected addons from the user action,
		// dump them in the item.addons array
		for(var i = 0; i < data.addons.length; i++) {
			var addon = data.addons[i];
			var addonToCart = {};

			if (addon.checked) {
				addonToCart.id = addon.product.id;
				addonToCart.price = addon.product.price;
				addonToCart.name = addon.product.name;
				addonToCart.sizeable = addon.product.sizeable;
                addonToCart.include_in_package = addon.include_in_package;
                addonToCart.price_zero = addon.price_zero;
				addonToCart.type = {};
				addonToCart.type.slug = addon.product.type.slug;
				if (addon.product.sizeId) {
					addonToCart.sizeId = addon.product.sizeId;
				}
				addonToCart.quantity = 1;
				
				item.addons.push(addonToCart);
			}
		}

		cart.push(item);
		console.log("Items added before cookie");
		Cookie('items', cart, { path : '/' });
		$rootScope.$broadcast('update');
		$rootScope.$broadcast('itemAdded');
		console.log("Items added after cookie");
	}

	CartService.removeItem = function(index) {

		var cart = CartService.getItems();

		if (!cart.length) return false;

		cart.splice(index,1);

		Cookie('items', cart, { path : '/' });

		$rootScope.$broadcast('update');

	}


    CartService.getDiscount = function() {
        return Cookie('discount') || '';
    };

    CartService.setDiscount = function(discount) {
        Cookie('discount', discount, { path : '/' });
    };

    CartService.removeDiscount = function() {
        Cookie('discount', '', { path : '/' });
	};

    CartService.count = function() {

		var items = CartService.getItems();
		var count = 0;

		for(var i = 0; i < items.length; i++) {

			//If statement here is to avoid count packages as a number of elements in Cart
			if (items[i].type.slug != 'package') {
                count+= (1 * items[i].quantity);
			}

			for(var ii = 0; ii < items[i].addons.length; ii++) {

				count+= (1 * items[i].addons[ii].quantity);

			}

		}

		return count;

	}

	CartService.increaseItemQuantity = function(itemIndex) {

		var cart = Cookie('items') || [];

		cart[itemIndex].quantity++;

		//update included in package addons
		angular.forEach(cart[itemIndex].addons, function(addon, idx) {
			if (addon.include_in_package) {
                cart[itemIndex].addons[idx].quantity = cart[itemIndex].quantity;
			}
		});

		Cookie('items', cart, { path : '/' });

		$rootScope.$broadcast('update');

	}

	CartService.decreaseItemQuantity = function(itemIndex) {

		var cart = Cookie('items') || [];

		cart[itemIndex].quantity--;

        //update included in package addons
        angular.forEach(cart[itemIndex].addons, function(addon, idx) {
            if (addon.include_in_package) {
                cart[itemIndex].addons[idx].quantity = cart[itemIndex].quantity;
            }
        });

		if (cart[itemIndex].quantity == 0) {

			cart.splice(itemIndex, 1);

		} 

		Cookie('items', cart, { path : '/' });

		$rootScope.$broadcast('update');

	}

	CartService.increaseAddonQuantity = function(itemIndex, addonIndex) {

		var cart = Cookie('items') || [];

		cart[itemIndex].addons[addonIndex].quantity++;

		Cookie('items', cart, { path : '/' });

		$rootScope.$broadcast('update');

	}

	CartService.decreaseAddonQuantity = function(itemIndex, addonIndex) {

		var cart = Cookie('items') || [];

		cart[itemIndex].addons[addonIndex].quantity--;

		if (cart[itemIndex].addons[addonIndex].quantity == 0) {

			cart[itemIndex].addons.splice(addonIndex, 1);

		}

		Cookie('items', cart, { path : '/' });

		$rootScope.$broadcast('update');

	}

	CartService.update = function() {

		$rootScope.$broadcast('update');

	}

	CartService.empty = function() {

	    Cookie.remove('items', { path : '/' });
		
		$rootScope.$broadcast('update');

	}

	CartService.show = function() {

		$rootScope.$broadcast('show');

	}

	CartService.hide = function() {

		$rootScope.$broadcast('hide');

	}

	CartService.productInCart = function(productId) {

		var cookies = Cookie('items') || [];

		if (cookies.length) {

			for(var i = 0; i < cookies.length; i++) {

				if (cookies[i].id === productId) return true;

			}

		}

		return false;		

	}
	
	return CartService;

}]);
app.factory('NavigationService', ['$rootScope', function($rootScope) {

	var NavigationService = {};

	NavigationService.open = function() {

		$rootScope.$broadcast('open');

	}

	NavigationService.close = function() {

		$rootScope.$broadcast('close');

	}

	return NavigationService;

}]);
app.factory('StripeService', ['stripe', function(stripe) {

	var StripeService = {};

	StripeService.validate = function(data) {

		if (!stripe.card.validateCardNumber(data.number)) {

			return { response : false, message : 'Invalid card number'};

		} else if (!stripe.card.validateExpiry(data.exp_month, data.exp_year)) {

			return { response : false, message : 'Invalid expiration date' };

		} else if (!stripe.card.validateCVC(data.cvc)) {

			return { response : false, message : 'Invalic CVC code' };

		} else {

			return { response : true, message : 'Valid card' };

		}

	}

	StripeService.createToken = function(data) {

		return stripe.card.createToken(data);

	}

	StripeService.displayErrors = function(error) {

		if (error.code === 'incorrect_number') {
	

		} else if (error.code === 'invalid_number') {
			

		} else if (error.code === 'invalid_expiry_month') {


		} else if (error.code === 'invalid-expiry-year') {


		} else if (error.code === 'invalid_cvc') {


		} else if (error.code === 'card_declined') {


		} else {


		}

	}

	return StripeService;

}]);
app.factory('Image', ['$http', '$upload', function($http, $upload) {

    return {

        upload : function(data) {

            return $upload.upload(data);

        }

    }

}]);

app.factory('AvailabilityType', ['$http', function($http) {

    return {

        all : function() {

            return $http.get('/availability-type');

        }

    }

}]);    

app.factory('Product', ['$http', function($http) {

    return {

        all : function() {
            return $http.get('/product');
        },

        forPeriod : function(startDate, endDate) {  //consider to merge this function with all !!!
            return $http.get('/product', {
                params: {
                    start_date: startDate,
                    end_date: endDate
                }
            });
        },

        get : function(productId) {

            return $http.get('/product/get/' + productId)

        },
    
        getBySlug : function(slug) {

            return $http.get('/product/by/slug/' + slug);

        },

        store : function(data) {

            return $http.post('/product', data);

        },

        update : function(id, data) {

            return $http.put('/product/' + id, data);

        },

        getTypes : function() {

            return $http.get('/product/types');

        },

        getByType : function() {

            return $http.get('/product/by/type');

        },

        customerPhotos : function(productId) {

            return $http.get('/product/photos/' + productId);

        }

    }

}]);

app.factory('Discount', ['$http', function($http) {
    return {
        //Fetch all records from discounts table
        all : function() {
            return $http.get('/discount');
        },

        //Get one discount record with id
        get : function(code) {
            return $http.get('/discount/' + code);
        },

        //Delete one discount record with id
        remove: function(code) {
            return $http.delete('/discount/' + code);
        },

        //Add record to discounts table
        store : function(data) {
            return $http.post('/discount', data);
        },

        //Update record in discounts table
        update : function(code, data) {
            return $http.put('/discount/' + code, data);
        }
    }
}]);


app.factory('HearGoodStuff', ['$http', function($http) {
    return {
        store : function(data) {
            return $http.post('/hear-good-stuff', data);
        }
    }
}]);


app.factory('Order', ['$http', function($http) {


    return {

        all : function() {

            return $http.get('/order');

        },

        store : function(data) {

            return $http.post('/order', data);

        }

    }

}]);
app.factory('HomeSetting', ['$http', function($http) {
    return {
        all : function() {
            return $http.get('/home-setting');
        },
        save : function(data) {
            return $http.post('/home-setting', data);
        }
    }
}]);

app.factory('YouImage', ['$http', function($http) {

    return {

        all : function() {

            return $http.get('/you-image');

        },

        save : function(data) {

            return $http.post('/you-image', data);

        }

    }

}]);





app.factory('Size', ['$http', function($http) {
    return {
        getBySlug : function(slug) {
            return $http.get('/size/by/slug/' + slug);
        }
    }
}]);


app.factory('ShippingRequest', ['$http', function($http) {

    return {

        send : function(data) {

            return $http.post('/shipping-request', data);

        },

        pay : function(data) {

            return $http.post('/shipping-request/pay', data);

        }

    }

}]);


app.factory('ShippingTrack', ['$http', function($http) {


    return {

        send : function(data) {

            return $http.post('/shipping-track', data);

        }

    }

}]);


/**
 * Checklist-model
 * AngularJS directive for list of checkboxes
 * https://github.com/vitalets/checklist-model
 * License: MIT http://opensource.org/licenses/MIT
 */

angular.module('checklist-model', [])
.directive('checklistModel', ['$parse', '$compile', function($parse, $compile) {
  // contains
  function contains(arr, item, comparator) {
    if (angular.isArray(arr)) {
      for (var i = arr.length; i--;) {
        if (comparator(arr[i], item)) {
          return true;
        }
      }
    }
    return false;
  }

  // add
  function add(arr, item, comparator) {
    arr = angular.isArray(arr) ? arr : [];
      if(!contains(arr, item, comparator)) {
          arr.push(item);
      }
    return arr;
  }  

  // remove
  function remove(arr, item, comparator) {
    if (angular.isArray(arr)) {
      for (var i = arr.length; i--;) {
        if (comparator(arr[i], item)) {
          arr.splice(i, 1);
          break;
        }
      }
    }
    return arr;
  }

  // http://stackoverflow.com/a/19228302/1458162
  function postLinkFn(scope, elem, attrs) {
     // exclude recursion, but still keep the model
    var checklistModel = attrs.checklistModel;
    attrs.$set("checklistModel", null);
    // compile with `ng-model` pointing to `checked`
    $compile(elem)(scope);
    attrs.$set("checklistModel", checklistModel);

    // getter / setter for original model
    var getter = $parse(checklistModel);
    var setter = getter.assign;
    var checklistChange = $parse(attrs.checklistChange);
    var checklistBeforeChange = $parse(attrs.checklistBeforeChange);

    // value added to list
    var value = attrs.checklistValue ? $parse(attrs.checklistValue)(scope.$parent) : attrs.value;


    var comparator = angular.equals;

    if (attrs.hasOwnProperty('checklistComparator')){
      if (attrs.checklistComparator[0] == '.') {
        var comparatorExpression = attrs.checklistComparator.substring(1);
        comparator = function (a, b) {
          return a[comparatorExpression] === b[comparatorExpression];
        };
        
      } else {
        comparator = $parse(attrs.checklistComparator)(scope.$parent);
      }
    }

    // watch UI checked change
    scope.$watch(attrs.ngModel, function(newValue, oldValue) {
      if (newValue === oldValue) { 
        return;
      } 

      if (checklistBeforeChange && (checklistBeforeChange(scope) === false)) {
        scope[attrs.ngModel] = contains(getter(scope.$parent), value, comparator);
        return;
      }

      setValueInChecklistModel(value, newValue);

      if (checklistChange) {
        checklistChange(scope);
      }
    });

    function setValueInChecklistModel(value, checked) {
      var current = getter(scope.$parent);
      if (angular.isFunction(setter)) {
        if (checked === true) {
          setter(scope.$parent, add(current, value, comparator));
        } else {
          setter(scope.$parent, remove(current, value, comparator));
        }
      }
      
    }

    // declare one function to be used for both $watch functions
    function setChecked(newArr, oldArr) {
      if (checklistBeforeChange && (checklistBeforeChange(scope) === false)) {
        setValueInChecklistModel(value, scope[attrs.ngModel]);
        return;
      }
      scope[attrs.ngModel] = contains(newArr, value, comparator);
    }

    // watch original model change
    // use the faster $watchCollection method if it's available
    if (angular.isFunction(scope.$parent.$watchCollection)) {
        scope.$parent.$watchCollection(checklistModel, setChecked);
    } else {
        scope.$parent.$watch(checklistModel, setChecked, true);
    }
  }

  return {
    restrict: 'A',
    priority: 1000,
    terminal: true,
    scope: true,
    compile: function(tElement, tAttrs) {
      if ((tElement[0].tagName !== 'INPUT' || tAttrs.type !== 'checkbox') && (tElement[0].tagName !== 'MD-CHECKBOX') && (!tAttrs.btnCheckbox)) {
        throw 'checklist-model should be applied to `input[type="checkbox"]` or `md-checkbox`.';
      }

      if (!tAttrs.checklistValue && !tAttrs.value) {
        throw 'You should provide `value` or `checklist-value`.';
      }

      // by default ngModel is 'checked', so we set it if not specified
      if (!tAttrs.ngModel) {
        // local scope var storing individual checkbox model
        tAttrs.$set("ngModel", "checked");
      }

      return postLinkFn;
    }
  };
}]);

app.controller('AdminController',
    ['$scope', 'Image', 'Product', 'Discount', 'Order', 'YouImage', 'AvailabilityType', 'AlertService', 'HomeSetting',
        function($scope, Image, Product, Discount, Order, YouImage, AvailabilityType, AlertService,HomeSetting) {

    $scope.init = function() {
        $scope.show('orders');
        $scope.getProducts();
        getTypes();
        getYouImages();
        getHomeSettings();
        getAvailabilityTypes();
    }

    $scope.orders = [];
    $scope.types = [];
    $scope.availabilityTypes = [];
    $scope.products = [];
    $scope.newProduct = {};
    $scope.youImages = [];
    $scope.newYouImage = {};
    $scope.homeSetting = {};
    $scope.editState = false;
    $scope.editingNew = true;

    $scope.submitButton = 'Submit';

    $scope.show = function(section) {
        $scope.showOrders = false;
        $scope.showProducts = false;
        $scope.showYou = false;
        $scope.showVideos = false;
        $scope.showHomeSetting = false;
        $scope.showDiscountManager = false;
        $scope.reset();

        switch(section) {

            case 'orders' :
                $scope.showOrders = true;
                break;
            case 'products' : 
                $scope.showProducts = true;
                break;
            case 'you' :
                $scope.showYou = true;
                break;
            case 'videos' : 
                $scope.showVideos = true;
                break;
            case 'home-setting' : 
                $scope.showHomeSetting = true;
                break;
            case 'discount-manager' :
                $scope.showDiscountManager = true;
                break;

        }

    }

    $scope.getProducts = function() {
        if ($scope.order_start_date && $scope.order_end_date) {
            getProductsForPeriod();
        } else {
            getAllProducts();
        }
    }

    function getProductsForPeriod() {
        Product.forPeriod($scope.order_start_date, $scope.order_end_date).success(function(response) {
            countSoldItems(response.data);
        }).error(function(response) {
            console.log("Sorry, there was an error retrieving the products");
        });
    }

    function getAllProducts() {
        Product.all().success(function(response) {
            countSoldItems(response.data);
        }).error(function(response) {
            console.log("Sorry, there was an error retrieving the products");
        });
    }

    function countSoldItems(products) {
        angular.forEach(products, function(product, idx) {
            var sold = 0;
            angular.forEach(product.orderitems, function(orderitem) {
                 sold += orderitem.quantity;
            });
            products[idx].sold = sold;
        });
        $scope.products = products;
    }

    function getAvailabilityTypes() {
        AvailabilityType.all().success(function(response) {
            $scope.availabilityTypes = response.data;
        }).error(function(response) {
            console.log("Something went wrong on our end");
        });
    }

    $scope.saveProduct = function() {
        var nanobar = new Nanobar({ bg : '#fff' });

        nanobar.go(60);

        Product.store($scope.newProduct).success(function(response) {
            $scope.getProducts();
            $scope.reset();
            nanobar.go(100);
            AlertService.broadcast('Product saved!', 'success');
        }).error(function(response) {
            nanobar.go(100);
            AlertService.broadcast('There was a problem', 'error');
        });
    }

    $scope.createProduct = function() {
        $scope.newProduct = {};
        $scope.editState = true;
        $scope.editingNew = true;

        registerAddons();
    }

    $scope.editProduct = function(product) {
        $scope.newProduct = product;
        $scope.editState = true;
        $scope.editingNew = false;

        registerAddons();
    }

    $scope.updateProduct = function() {
        var nanobar = new Nanobar({ bg : '#fff' });
        var data = $scope.newProduct;

        nanobar.go(65);

        Product.update(data.id, data).success(function(response) {
            $scope.getProducts();
            $scope.reset();
            nanobar.go(100);
            AlertService.broadcast('Product updated!', 'success');
        }).error(function(response) {
            nanobar.go(100);
            AlertService.broadcast('There was a problem.', 'error');
        });
    }

    $scope.upload = function($files, model) {
        var nanobar = new Nanobar({ bg : '#fff' });
        var file = $files[0];

        if (!file) return false;

        var data = {
            url : '/product/image',
            file : file
        }

        nanobar.go(40);

        Image.upload(data).progress(function(evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        }).success(function(response) {
            $scope.newProduct[model] = response.data;

            nanobar.go(100);
        }).error(function(response) {
            nanobar.go(100);
        });

    }

    
    $scope.reset = function() {

        $scope.newProduct = {};
        $scope.newYouImage = {};
        $scope.editState = false;
        $scope.editingNew = true;

    }

    function getTypes() {
        Product.getTypes().success(function(response) {
            $scope.types = response.data;
        }).error(function(response) {
            console.log("Sorry, types could not be retrieved");
        });
    }

    function registerAddons() {
        $scope.newProduct.addonSelection = [];

        for(var i = 0; i < $scope.products.length; i++) {
            var addon = {};
            addon.id = $scope.products[i].id;
            addon.name = $scope.products[i].name;

            // If creating a new product, it has no addons obviously...
            if (!$scope.editingNew) {
                // If selected products has addons
                if ($scope.newProduct.addons.length) {
                    for(var e = 0; e < $scope.newProduct.addons.length; e++) {
                        if ($scope.newProduct.addons[e].childId == $scope.products[i].id) {
                            addon.isAddon = true;

                            //
                            if ($scope.newProduct.addons[e].include_in_package) {
                                addon.include_in_package = true;
                            } else {
                                addon.include_in_package = false;
                            }

                            if ($scope.newProduct.addons[e].price_zero) {
                                addon.price_zero = true;
                            } else {
                                addon.price_zero = false;
                            }

                            break;

                        } else {
                            addon.isAddon = false;
                        }
                    }
                } else {
                    addon.isAddon = false;
                }
            } else {
                addon.isAddon = false;
            }
            $scope.newProduct.addonSelection.push(addon);
        }
    }

    //Orders
    /*function getOrders() {
        Order.all().success(function(response) {
            $scope.orders = response.data;
        }).error(function(response) {
            console.log(response.message);
        });
    }*/

    // You
    $scope.youImages = [];
    $scope.newYouImage = {};

    function getYouImages() {
        YouImage.all().success(function(response) {
            $scope.youImages = response.data;
            Squares.init();
        }).error(function(response) {
            console.log("There was an error getting the You images");
        });
    }
    
    $scope.uploadYouImage = function($files) {
        var file = $files[0];

        if (!file) return false;

        var data = {
            url : '/you-image/upload',
            file : file
        }

        $scope.editState = true;

        Image.upload(data).success(function(response) {
            $scope.newYouImage.image = response.data;
        }).error(function(response) {
            console.log(response.message);
        });
    }

    $scope.saveYouImage = function() {
        var nanobar = new Nanobar({ bg : '#fff' });
        nanobar.go(40);

        YouImage.save($scope.newYouImage).success(function() {
            getYouImages();
            $scope.reset();

            nanobar.go(100);
        }).error(function(response) {
            console.log(response.message);
        });
    }

    $scope.clearNewYouImage = function() {
        $scope.newYouImage = false;
    }

    // home settings
    function getHomeSettings() {
        HomeSetting.all().success(function(response) {
            $scope.homeSetting = response.data ? response.data : {};
            Squares.init();        
        }).error(function(response) {
            console.log("There was an error getting the home settings");
        });
    }

    $scope.uploadHomeImage = function($files, model) {    
        var file = $files[0];

        if (!file) return false;

        var data = {
            url : '/home-image/upload',
            file : file
        }

        $scope.editState = true;

        Image.upload(data).success(function(response) {
            console.log(model);
           $scope.homeSetting[model] = response.data;
        }).error(function(response) {
            AlertService.broadcast('Sorry, there was an error, please try again', 'error');
        });

    }

    $scope.saveHomeSetting = function() {
        var nanobar = new Nanobar({ bg : '#fff' });
        nanobar.go(40);

        HomeSetting.save($scope.homeSetting).success(function() {
            getHomeSettings();
            AlertService.broadcast('Photo was successfully updated.', 'success');
            nanobar.go(100);
        }).error(function(response) {
            console.log(response.message);
        });
    }

    $scope.resetDateFilter = function() {
        $scope.order_start_date = ''
        $scope.order_end_date = '';
        $scope.getProducts();
    }

    //Discount part
    function fetchAllDiscounts() {
        Discount.all().success(function(response) {
            $scope.discounts = response.data;
        });
    };

    fetchAllDiscounts();

    function confirmUnusedCode(data) {
        //Here is condition to more then 1 because one record obviously exists by adding new record.
        if ($scope.discounts.filter(function(row) { return row.code === data.code; }).length > 1) {
            return true;
        }
        return false;
    }

    $scope.addDiscount = function() {
        var data = {
            discount: 0,
            code: ''
        };

        $scope.discounts.push(data);
    };

    $scope.discountUpdate = function(discountIndex) {
        $scope.discounts[discountIndex].changed = false;

        var data = $scope.discounts[discountIndex];

        //Check if code is already use don't allow to store data.
        //Code is unique field and primary key.
        if (confirmUnusedCode(data)) {
            alert('This discount code is already in use. Please change code or update previous use.');
        } else {
            if (!data.created_at) {
                Discount.store(data).success(function() {
                    AlertService.broadcast('Discount added!', 'success');
                    fetchAllDiscounts();
                }).error(function(error) {
                    AlertService.broadcast('There was a problem with Discounts adding: ' + error, 'error');
                });
            } else {
                Discount.update(data.code, data).success(function() {
                    AlertService.broadcast('Discount updated!', 'success');
                    fetchAllDiscounts();
                }).error(function(error) {
                    AlertService.broadcast('There was a problem with Discounts updates: ' + error, 'error');
                });
            }

        }
    };

    $scope.getSaveUpdateButtonCaption = function(discount) {
        var buttonCaption = 'Update';

        if (!discount.created_at) {
            buttonCaption = 'Save';
        }

        return buttonCaption;
    };

    $scope.discountRemove = function(discountIndex) {
        var r = confirm('Do you want to remove this Discount?');
        if (r == true) {
            var data = $scope.discounts[discountIndex];

            if (!data.created_at) {
                $scope.discounts.slice(discountIndex);
                fetchAllDiscounts();
            } else {
                Discount.remove(data.code).success(function() {
                    AlertService.broadcast('Discount removed!', 'success');
                    fetchAllDiscounts();
                }).error(function(error) {
                    AlertService.broadcast('There was a problem with Discount remove: ' + error, 'error');
                });
            }
        }
    };

    $scope.discountRowChanged = function(discountIndex) {
        $scope.discounts[discountIndex].changed = true;
    };

    //Discount part - end

    $scope.init();

}]);




app.controller('AdminordersController', ['$scope', 'Order','$http', function($scope, Order, $http) {

	var gatkuOrder = this;
    gatkuOrder.orders = []; 
    gatkuOrder.pageno = 1; 
    gatkuOrder.itemsPerPage = 15; 
    gatkuOrder.getData = function(pageno,start_date, end_date){
        gatkuOrder.orders = [];

        var Url = "/orderall/" + gatkuOrder.itemsPerPage + "/" + pageno;
        try{
            if($scope.order_start_date){
                Url = Url + "/" + $scope.order_start_date;
            }
            if($scope.order_end_date){
                Url = Url + "/" + $scope.order_end_date;
            }
        }catch(e){

        }
        $http.get(Url).success(function(response){
            $scope.orders = response.data;
            gatkuOrder.orders = response.data;
            gatkuOrder.total_count = response.total_count;
        });
    };
    
    gatkuOrder.getData(gatkuOrder.pageno); 
    gatkuOrder.searchOrder = function(){ 
        if($scope.order_start_date){
             gatkuOrder.getData(1, $scope.order_start_date, $scope.order_end_date);    
            }else{
                alert('select start date');
            }
     };


    gatkuOrder.resetDateFilter = function() {
        $scope.order_start_date = ''
        $scope.order_end_date = '';
        gatkuOrder.getData(1, $scope.order_start_date, $scope.order_end_date);
    }
}]);




app.controller('CartBlinderController', ['$scope', 'CartService', function($scope, CartService) {


	$scope.show = false;

	$scope.hide = function() {

		CartService.hide();

	}

	$scope.$on('show', function() {

		$scope.show = true;

	});

	$scope.$on('hide', function() {

		$scope.show = false;

	});

}]);
/*
|--------------------------------------------------------------------------
| Cart Controller
|--------------------------------------------------------------------------
|
| All of the form fields are defined in the view cart.blade.php. This
| controller simply passes the data on to the backend.
| NOTE: if a field is added or subtracted, you will have to update the
| $scope.validate method to reflect the changes.
|
*/
app.controller('CartController', ['$scope', 'CartService', 'StripeService', 'Order', 'AlertService', 'Discount',
    function($scope, CartService, StripeService, Order, AlertService, Discount) {

    $scope.items = [];
    $scope.show = false;
    $scope.form = {};
    $scope.form.useBillingForShipping = true;
    $scope.status = '';
    $scope.stages = ['cart', 'checkout', 'payment', 'confirmation'];
    $scope.currentStage = $scope.stages[0];
    $scope.eligibleForDiscount = false;
    $scope.discountText = '';
    $scope.discountAmount = 0;
    $scope.enabled = true;
    $scope.blackFriday = false;
    $scope.enteredDiscountCode = '';
    $scope.discount = '';
    $scope.discountSum = 0;

    $scope.toStage = function(index) {
        Inputs.blur();

        if ($scope.validate(index) === false) return false;

        $scope.currentStage = $scope.stages[index];
    }

    $scope.getItems = function() {
        var items = CartService.getItems();

        $scope.items = items;
    }

    $scope.removeItem = function(index) {
        CartService.removeItem(index);
    }

    $scope.getDiscountFromCookies = function () {
        $scope.discount = CartService.getDiscount();
    }

    $scope.removeDiscount = function() {
        CartService.removeDiscount();
        $scope.getDiscountFromCookies();
    };

    $scope.increaseItemQuantity = function(itemIndex) {
        CartService.increaseItemQuantity(itemIndex);
    }

    $scope.decreaseItemQuantity = function(itemIndex) {
        CartService.decreaseItemQuantity(itemIndex);
    }

    $scope.increaseAddonQuantity = function(itemIndex, addonIndex) {
        CartService.increaseAddonQuantity(itemIndex, addonIndex);
    }

    $scope.decreaseAddonQuantity = function(itemIndex, addonIndex) {
        CartService.decreaseAddonQuantity(itemIndex, addonIndex);
    }

    $scope.shipping = function() {
        var shipping = 0;
        var poles = [];
        var heads = [];
        var others = [];

        if ($scope.subtotal() >= 30000) {
            return 0;
        }

        for(var i = 0; i < $scope.items.length; i++) {
            var item = $scope.items[i];

            if (item.type.slug === 'pole') {
                poles.push(item);
            } else if (item.type.slug === 'head') {
                heads.push(item);
            } else {
                others.push(item);
            }
        };
        // if black friday is true, only give free shipping to
        // orders that have poles
        if ($scope.blackFriday && poles.length > 0) {
            return 0;
        }

        if (poles.length > 0) {
            var poleShippingPrice = poles[0].type.shippingPrice;

            if (poles.length > 1) {
                shipping = poleShippingPrice * poles.length;
            } else {
                shipping = poleShippingPrice;
            }
        } else if (heads.length > 0) {
            var headShippingPrice = heads[0].type.shippingPrice;

            if (heads.length > 1) {
                shipping = headShippingPrice * (Math.ceil(heads.length / 2));
            } else {
                shipping = headShippingPrice;
            }

        } else if (others.length > 0) {
            shipping = others[0].type.shippingPrice;
        }

        return shipping;
    }

    function calculateDiscountAmountForItem(price, quantity, discount) {
        return (price * quantity) * (discount / 100);
    }

    $scope.subtotal = function() {
        var subtotal = 0;
        var discountSum = 0;

        angular.forEach($scope.items, function(value, key) {

            if ( $scope.items[key].type.slug != 'package' ) {
                var price = $scope.items[key].price;
                var quantity = $scope.items[key].quantity;

                subtotal += price * quantity;

                if ($scope.discount) {
                    discountSum += calculateDiscountAmountForItem(price, quantity, $scope.discount.discount);
                }
            }

            for(var i = 0; i < $scope.items[key].addons.length; i++) {
                var price = $scope.items[key].addons[i].price;
                var quantity = $scope.items[key].addons[i].quantity;

                subtotal += price * quantity;

                if ($scope.discount) {
                    discountSum += calculateDiscountAmountForItem(price, quantity, $scope.discount.discount);
                }
            }
        });

        $scope.discountSum = discountSum;

        return subtotal - $scope.discountSum - $scope.discounts(subtotal);
    }

    /**
     * This function will change quite a bit depending
     * on what current discounts you want plugged into the system
     *
     */
    $scope.discounts = function(subtotal) {
        var amount = 0;
        var subtotal = subtotal || false;
        var glassCheck = 0;
        var glassPrice = 0;

        if (subtotal && $scope.blackFriday) {
            $scope.discountText = 'Black Friday Discount - 20% off';
            amount = Math.ceil(((subtotal * 0.2) / 100)) * 100;
            $scope.eligibleForDiscount = true;
            $scope.discountAmount = amount;

            return amount;
        }

        if ($scope.blackFriday) return 0;

        angular.forEach($scope.items, function(value, key) {
            if($scope.items[key].type.slug === 'glass') {
                glassCheck += parseInt($scope.items[key].quantity);
                glassPrice = $scope.items[key].price;
            }

            for(var i = 0; i < $scope.items[key].addons.length; i++) {
                if ($scope.items[key].addons[i].type.slug === 'glass') glassCheck += parseInt($scope.items[key].addons[i].quantity);
            }
        });

        if (glassCheck >= 4) {
            amount = (glassPrice * 4) - 4000;
            $scope.eligibleForDiscount = true;
            $scope.discountText = '4 Glasses for $40';
        } else {
            $scope.eligibleForDiscount = false;
            $scope.discountText = '';
        }
        $scope.discountAmount = amount;

        return amount;
    }

    $scope.total = function() {
        var subtotal =  $scope.subtotal();
        var shipping = $scope.shipping();

        return subtotal + shipping;

    }

    $scope.submit = function() {

        var card = extractCardDetails();

        if ($scope.enabled === false) return false;

        $scope.enabled = false;
        AlertService.broadcast('Processing...', 'info');

        StripeService.createToken(card).then(function(token) {
            var data = {
                items : $scope.items,
                form : $scope.form,
                discount: $scope.discount,
                token : token
            }

            Order.store(data).success(function(response) {
                AlertService.broadcast('Success! Redirecting...', 'success');
                $scope.show = false;
                $scope.emptyCart();
                $scope.enabled = true;
                //window.location.replace("/thankyou");
            }).error(function(response) {
                $scope.enabled = true;
                if ('error' in response.message.jsonBody) {
                    AlertService.broadcast(response.message.jsonBody.error.message, 'error');
                } else {
                    AlertService.broadcast('Sorry, something went wrong on our end. We are fixing it soon!', 'error');
                }
            });
        });
    }

    $scope.hide = function() {
        CartService.hide();
    }

    $scope.emptyCart = function() {
        CartService.empty();
        CartService.removeDiscount();

        //Why this is twice? Remove in CartService and in CartController?
        //Use only one place for coed.
        $scope.getItems();
        $scope.removeDiscount();
    }

    $scope.validate = function(index) {

        $scope.status = '';

        if (index == 1) {
            return true;
        }

        if (index == 2) {
            if (!$scope.form.firstName) {
                $scope.status = 'Please enter a first name.';
                AlertService.broadcast('Please enter a first name', 'error');

                return false;

            }

            if (!$scope.form.lastName) {
                $scope.status = 'Please enter a last name.';
                AlertService.broadcast('Please enter a last name', 'error');

                return false;
            }

            if (!$scope.form.email) {
                $scope.status = 'Please enter an email address.';
                AlertService.broadcast('Please enter an email address', 'error');

                return false;
            }

            if (!validateEmail($scope.form.email)) {
                $scope.status = 'Please enter a valid email address.';
                AlertService.broadcast('Please enter a valid email address', 'error');

                return false;
            }

            if (!$scope.form.phone) {
                $scope.status = 'Please enter phone number.';
                AlertService.broadcast('Please enter a phone number', 'error');

                return false;

            }

            if (!$scope.form.address) {

                $scope.status = 'Please enter a street address.';
                AlertService.broadcast('Please enter a street address', 'error');

                return false;
            }

            if (!$scope.form.city) {

                $scope.status = 'Please enter a city';
                AlertService.broadcast('Please enter a city', 'error');

                return false;
            }

            if (!$scope.form.state) {

                $scope.status = 'Please enter a state';
                AlertService.broadcast('Please enter a state', 'error');

                return false

            }

            if (!$scope.form.zip) {
                $scope.status = 'Please enter a zip';
                AlertService.broadcast('Please enter a zip', 'error');

                return false
            }

            if (!$scope.form.country) {
                $scope.status = 'Please enter a country';
                AlertService.broadcast('Please enter a country', 'error');

                return false;
            }
            return true;
        }

        if (index == 3) {

            if (!$scope.card.isBillingSame) {
                if(!$scope.form.billing_address){
                    $scope.status = 'Please enter Billing Address or check Billing Address same as Shipping Address';
                    AlertService.broadcast('Please enter Billing Address or check Billing Address same as Shipping Address', 'error');

                    return false;
                }
                if(!$scope.form.billing_zip){
                    $scope.status = 'Please enter billing zip or check Billing Address same as Shipping Address';
                    AlertService.broadcast('Please enter billing zip or check Billing Address same as Shipping Address', 'error');

                    return false;
                }
            }

            var card = extractCardDetails();

            var validation = StripeService.validate(card)

            if (validation.response === false) {
                $scope.status = validation.message;
                AlertService.broadcast($scope.status, 'error');

                return false;
            } else if (validation.response) {
                $scope.status = '';

                return true;
            }
        }
    }

    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    function extractCardDetails() {
        var card = {};
        if($scope.card.isBillingSame){
            card.address_zip = $scope.form.zip;
        }else{
            card.address_zip = $scope.form.billing_zip;
        }
        card.number = $scope.card.number;
        card.exp_month = $scope.card.expiryMonth;
        card.exp_year = $scope.card.expiryYear;
        card.cvc = $scope.card.securityCode;
        card.name = $scope.form.firstName + ' ' + $scope.form.lastName;

        return card;
    }

    $scope.$on('update', function() {

        $scope.getItems();

    });

    $scope.$on('show', function() {

        $scope.show = true;

    });

    $scope.$on('hide', function() {

        $scope.show = false;

    });

    $scope.applyDiscountCode = function() {
        Discount.get($scope.enteredDiscountCode).then(function(discount) {
            $scope.discount = discount.data;
            CartService.setDiscount($scope.discount);
            $scope.total();
        }, function() {
            alert('Code seams to be not correct. There is no discount for this code.');
        });
    };

    $scope.getItems();
    $scope.getDiscountFromCookies();
}]);


app.controller('CartCountController', ['$scope', 'CartService', function($scope, CartService) {

	$scope.$on('update', function() {

		countItems();

	});

	$scope.showCart = function() {

		CartService.show();

	}

	function countItems() {

		$scope.count = CartService.count();

	}

	countItems();


}]);
app.controller('HearGoodStuffController', ['$scope', 'HearGoodStuff', function($scope, HearGoodStuff) {

	$scope.email_address = '';

	$scope.addEmailToMailingList = function() {
        HearGoodStuff.store({email: $scope.email_address})
			.success(function(response) {
                $scope.email_address = '';
            }).error(function(response) {
            	//console.log(response);
			});
	}
}]);
app.controller('MediaController', ['$scope', function($scope) {

    // Determines which page is shown first on load.
    $scope.productPage = true;
    $scope.brandPage = false;

    $scope.toProductPage = function() {

        $scope.productPage = true;
        $scope.brandPage = false;
        
        //Fixes bug where grid initiation is premature
        //to images loading.
        setTimeout(function(){Grid.init()}, 200);


    }

    $scope.toBrandPage = function() {

        $scope.productPage = false;
        $scope.brandPage = true;


    }

}]);
app.controller('MobileNavigationController', ['$scope', 'Product', 'NavigationService', function($scope, Product, NavigationService) {

	$scope.open = false;

	$scope.openAction = function() {

		NavigationService.open();

	}

	$scope.closeAction = function() {

		NavigationService.close();

	}

	$scope.$on('open', function() {

		$scope.open = true;

	});

	$scope.$on('close', function() {

		$scope.open = false;

	});

}]); 
app.controller('ProductController', ['$scope', 'Product', 'CartService', 'Size', 'AlertService', '$timeout', function($scope, Product, CartService, Size, AlertService, $timeout) {
	$scope.fullSize = true;
	$scope.loaded = false;
	$scope.productAdded = false;
	$scope.productAddedText = "Add to Cart";
	$scope.product = {};

	if (layoutType === 'pole' || layoutType === 'extra') {
		$scope.attached = true;
	} else {
		$scope.attached = false;
	}

	$scope.init = function() {
		$scope.getProduct();
	}

	$scope.getProduct = function() {
		Product.get(productId).success(function(response) {
			$scope.product = response.data;
			parseSizeableAddons();
			$scope.loaded = true;
		}).error(function(response) {
			AlertService.broadcast('Sorry, there is an error. Your page may have not rendered correctly.', 'error');
		});
	}

	$scope.addToCart = function() {
		//console.log("Attempting to add to cart");
		if ($scope.product.sizeable !== "0" && $scope.product.sizeable) {
			var sizes = verifySizeIsChecked();
			console.log("Product is sizeable");
			if (sizes.length) {
				console.log("there are sizes");
				for(var i = 0; i < sizes.length; i++) {
				 	var sizedProduct = angular.copy($scope.product);

					sizedProduct.name = sizes[i].name;
					sizedProduct.price = sizes[i].price;
					sizedProduct.shortName = sizes[i].shortName;
					sizedProduct.sizeId = sizes[i].id;

					CartService.addItem(sizedProduct);
				}
			} else {
				return false;
			}

		} else {
			//console.log("about to add item");
			CartService.addItem($scope.product);
			//console.log("added item");
		}
		$scope.productAddedTextChange();

		reset();
	}

	$scope.openCart = function() {
		CartService.show();
	}

	$scope.scrollAcross = function() {
		if ($scope.product.slug === 'g-string' || $scope.product.slug === 'black g-string') {
			PoleScroll.center();
		} else {
			PoleScroll.scrollAcross();
		}
	}

	$scope.poleScrollInit = function() {
		PoleScroll.init();
	}

	$scope.goFullSize = function() {
		setTimeout(function() {
			PoleScroll.init();
		}, 20);
	}

	function verifySizeIsChecked() {
		var checkedSizes = [];

		for(var i = 0; i < $scope.product.sizes.length; i++) {
			if ($scope.product.sizes[i].checked) {
				checkedSizes.push($scope.product.sizes[i]);
			}
		}
		return checkedSizes;
	}


	/**
	 * Currently, this method only works when one addon is
	 * sizeable. At the moment (5.22.15), the only sizeable addon
	 * is the bands. This could change in the future
	 */
	function parseSizeableAddons() {
		for(var i = 0; i < $scope.product.addons.length; i++) {
			var addon = $scope.product.addons[i];

			//Make price zero if price_zero true for packege included addons
			if (addon.price_zero) {
                addon.product.price = 0;
			}

			if (addon.product.sizeable) {

				if (addon.product.slug === 'bands') {
					var slug = $scope.product.slug + '-band';
				} else if (addon.product.slug === 'hardcore-bands') {
					var slug = $scope.product.slug + '-hardcore';
				}

				if (typeof slug !== 'undefined') {
					Size.getBySlug(slug).success(function(response) {
						addon.product.price = response.data.price;
						addon.product.sizeId = response.data.id;
					}).error(function(response) {
						$scope.product.addons.splice(i, 1);
					});	
				}

				break;
			}
		}
	}

	function reset() {
		if ($scope.product.sizeable !== "0" && $scope.product.sizeable) {
			for(var i = 0; i < $scope.product.sizes.length; i++) {
				$scope.product.sizes[i].checked = false;
			}
		} else {
			for(var i = 0; i < $scope.product.addons.length; i++) {

				//uncheck only addons if not included in package
				if (!$scope.product.addons[i].include_in_package) {
                    $scope.product.addons[i].checked = false;
				}
			}
		}
	}
	$scope.productAddedTextChange = function() {

		$scope.productAddedText = "Item Added!";

		$timeout(function() {

			$scope.productAddedText = "Add to Cart";

		}, 4000);

	}

	function productAddedAnimation() {

		$scope.productAdded = true;

		$timeout(function() {

			$scope.productAdded = false;

		}, 3000);

	}


	$scope.$on('itemAdded', function() {

		// productAddedAnimation();
		$scope.productAdded = true;

	});

	$scope.init();

}]);
app.controller('QuoteFormController', ['$scope', 'Product', '$http', 'AlertService', function($scope, Product, $http, AlertService) {

	$scope.form = {};

	$scope.poles = [];

	$scope.submitAttempted = false;

	$scope.success = false;

	function getPoles() {

		Product.getByType().success(function(response) {

			$scope.poles = response.data['poles'];

		}).error(function(response) {

			// Hides this field in the view, is not needed
			// in event of error
			$scope.hidePoleChooser = true;

		});

	}

	getPoles();


	$scope.submit = function(isValid) {

		$scope.submitAttempted = true;

		var nanobar = new Nanobar({ bg : '#fff' });
	
		if (isValid) {

			nanobar.go(60);

			$http.post('/quote', $scope.form).success(function(response) {

				$scope.success = true;

				AlertService.broadcast('Success! We will get back to you as quick as we can!', 'success');

				nanobar.go(100);

			}).error(function(response) {

				AlertService.broadcast('Sorry, something went wrong. We will fix it as soon as possible', 'error');

				nanobar.go(100);

			});

		} else {

			AlertService.broadcast('Please Fill in required fields', 'error');

		}

	}

}]);
app.controller('ShippingRequestPaymentController', ['$scope', 'AlertService', 'StripeService', 'ShippingRequest', function($scope, AlertService, StripeService, ShippingRequest) {

	$scope.card = {};
	$scope.success = false;

	if (typeof(shippingRequestId) !== undefined) {

		$scope.shippingRequestId = shippingRequestId;

	} else {

		$scope.shippingRequestId = null;

	}

	$scope.pay = function() {

		var card = extractCardDetails();

		AlertService.broadcast('Processing...', 'info');

		StripeService.createToken(card).then(function(token) {

			var data = {

				shippingRequestId : $scope.shippingRequestId,
				token : token

			}
		
			ShippingRequest.pay(data).success(function(response) {

				AlertService.broadcast('Success!', 'success');
				$scope.success = true;

			}).error(function(response) {

				if ('error' in response.message.jsonBody) {

					AlertService.broadcast(response.message.jsonBody.error.message, 'error');

				} else {

					AlertService.broadcast('Sorry, something went wrong on our end. We are fixing it soon!', 'error');					

				}

			});

		});

	}


	function extractCardDetails() {

		var card = {};

		card.number = $scope.card.number;
		card.exp_month = $scope.card.expiryMonth;
		card.exp_year = $scope.card.expiryYear;
		card.cvc = $scope.card.securityCode;

		if (typeof(shippingRequestId) !== undefined) {

			card.name = shippingRequestFullName;

		} else {

			card.name = null;

		}

		return card;

	}

}]);
app.controller('StoreController', ['$scope', 'Product', function($scope, Product) {

	$scope.heads = [];

	$scope.poles = [];

	$scope.shrinker = [];

	$scope.extras = [];

	$scope.apparel = [];

	$scope.init = function() {

		$scope.getStore();

	}

	$scope.getStore = function() {

		Product.getByType().success(function(response) {

            $scope.heads = response.data['heads'];
            $scope.poles = response.data['poles'];
            $scope.shrinker = response.data['shrinker'];
            $scope.extras1 = response.data['extras'].slice(0, 3);
            $scope.extras2 = response.data['extras'].slice(3, 7);
            $scope.extras3 = response.data['extras'].slice(7, 11);
            $scope.apparel = response.data['apparel'];
            $scope.glasses = response.data['glasses'];
            $scope.packages = response.data['packages'];

		}).error(function(response) {

			console.log("Something went wrong getting the store data");

		})

	}

	$scope.init();

}]);
app.controller('VideoController', ['$scope', '$sce', function($scope, $sce) {

	$scope.videos = [

		{
			link : '//www.youtube.com/embed/qRm0BheSR_Q',
			title : 'Spearfishing with GATKU Polespears',
			shortTitle : 'At the Bahamas',
			description : 'Video blog by Ted from Ted\'s Holdover about a hunting trip to the Bahama\'s using a GATKU Polespear.'
		},
		{
			link : '//www.youtube.com/embed/aspLQ0hPoo0',
			title : 'Break Away Setup',
			shortTitle : 'Break Away Setup',
			description : 'How to rig your own SLIP-TIP with break away system -'
		},
		{
			link : '//www.youtube.com/embed/xxbnO8oa72k',
			title : 'Carp Killers',
			shortTitle : 'Carp Killers',
			description : 'Michael Dong and Dustin McIntyre tour Lake Mead to exterminate the invasive carp. The local ecosystem thanks them. All fish were killed with GAT-KU hybrid polespears.'
		},
		{
			link : '//www.youtube.com/embed/CvRSkoTYq3s',
			title : 'GATKU Gen-2 Polespears go to Baja',
			shortTitle : 'GATKU Gone Baja',
			description : 'Ryan Gattoni takes GATKU hybrid polespears south of the border in this short video.'
		},
		{
			link : '//www.youtube.com/embed/8-eQhtrsdu8',
			title : 'Nautilus Review',
			shortTitle : 'Nautilus Review',
			description : 'Video review of the GATKU Gen 2 Hybrid Polespear by Nautilus Spearfishing.'
		},
		{
			link : '//www.youtube.com/embed/F3FEIE7rFsw',
			title : 'Spearfishing in the Exumas',
			shortTitle : 'In the Exumas',
			description : 'Hunting Tiger Groupers and a close encounter with a shark. Video by Eric Poeltl. GATKU Polespear + Slip-Tip head used.'
		}
	];

	$scope.activeVideo = {};

	$scope.init = function() {

		$scope.setActiveVideo(0);
		ResponsiveVideo.init();	

	}

	$scope.setActiveVideo = function(index) {

		var embedToBeTrusted = String($scope.videos[index].link);

		$scope.activeVideo = $scope.videos[index];
		$scope.activeVideo.link = $sce.trustAsResourceUrl(embedToBeTrusted);

	}

	$scope.init();

}]);