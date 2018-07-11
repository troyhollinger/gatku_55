
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
        var dec = options.decode || tryDecodeURIComponent;
        var enc = options.encode || encodeURIComponent;

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
              } else if (options.expirationUnit === 'milliseconds') {
                options.expires.setMilliseconds(options.expires.getMilliseconds() + expiresFor);
              } else {
                options.expires.setDate(options.expires.getDate() + expiresFor);
              }
            } else {
              options.expires.setDate(options.expires.getDate() + expiresFor);
            }
          }
          return ($document[0].cookie = [
            enc(key),
            '=',
            enc(value),
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
            value = dec(cookie.substring(pos + 1));
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
 * @license AngularJS v1.7.2
 * (c) 2010-2018 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, angular) {'use strict';

var ELEMENT_NODE = 1;
var COMMENT_NODE = 8;

var ADD_CLASS_SUFFIX = '-add';
var REMOVE_CLASS_SUFFIX = '-remove';
var EVENT_CLASS_PREFIX = 'ng-';
var ACTIVE_CLASS_SUFFIX = '-active';
var PREPARE_CLASS_SUFFIX = '-prepare';

var NG_ANIMATE_CLASSNAME = 'ng-animate';
var NG_ANIMATE_CHILDREN_DATA = '$$ngAnimateChildren';

// Detect proper transitionend/animationend event names.
var CSS_PREFIX = '', TRANSITION_PROP, TRANSITIONEND_EVENT, ANIMATION_PROP, ANIMATIONEND_EVENT;

// If unprefixed events are not supported but webkit-prefixed are, use the latter.
// Otherwise, just use W3C names, browsers not supporting them at all will just ignore them.
// Note: Chrome implements `window.onwebkitanimationend` and doesn't implement `window.onanimationend`
// but at the same time dispatches the `animationend` event and not `webkitAnimationEnd`.
// Register both events in case `window.onanimationend` is not supported because of that,
// do the same for `transitionend` as Safari is likely to exhibit similar behavior.
// Also, the only modern browser that uses vendor prefixes for transitions/keyframes is webkit
// therefore there is no reason to test anymore for other vendor prefixes:
// http://caniuse.com/#search=transition
if ((window.ontransitionend === undefined) && (window.onwebkittransitionend !== undefined)) {
  CSS_PREFIX = '-webkit-';
  TRANSITION_PROP = 'WebkitTransition';
  TRANSITIONEND_EVENT = 'webkitTransitionEnd transitionend';
} else {
  TRANSITION_PROP = 'transition';
  TRANSITIONEND_EVENT = 'transitionend';
}

if ((window.onanimationend === undefined) && (window.onwebkitanimationend !== undefined)) {
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
var TIMING_KEY = 'TimingFunction';
var ANIMATION_ITERATION_COUNT_KEY = 'IterationCount';
var ANIMATION_PLAYSTATE_KEY = 'PlayState';
var SAFE_FAST_FORWARD_DURATION_VALUE = 9999;

var ANIMATION_DELAY_PROP = ANIMATION_PROP + DELAY_KEY;
var ANIMATION_DURATION_PROP = ANIMATION_PROP + DURATION_KEY;
var TRANSITION_DELAY_PROP = TRANSITION_PROP + DELAY_KEY;
var TRANSITION_DURATION_PROP = TRANSITION_PROP + DURATION_KEY;

var ngMinErr = angular.$$minErr('ng');
function assertArg(arg, name, reason) {
  if (!arg) {
    throw ngMinErr('areq', 'Argument \'{0}\' is {1}', (name || '?'), (reason || 'required'));
  }
  return arg;
}

function mergeClasses(a,b) {
  if (!a && !b) return '';
  if (!a) return b;
  if (!b) return a;
  if (isArray(a)) a = a.join(' ');
  if (isArray(b)) b = b.join(' ');
  return a + ' ' + b;
}

function packageStyles(options) {
  var styles = {};
  if (options && (options.to || options.from)) {
    styles.to = options.to;
    styles.from = options.from;
  }
  return styles;
}

function pendClasses(classes, fix, isPrefix) {
  var className = '';
  classes = isArray(classes)
      ? classes
      : classes && isString(classes) && classes.length
          ? classes.split(/\s+/)
          : [];
  forEach(classes, function(klass, i) {
    if (klass && klass.length > 0) {
      className += (i > 0) ? ' ' : '';
      className += isPrefix ? fix + klass
                            : klass + fix;
    }
  });
  return className;
}

function removeFromArray(arr, val) {
  var index = arr.indexOf(val);
  if (val >= 0) {
    arr.splice(index, 1);
  }
}

function stripCommentsFromElement(element) {
  if (element instanceof jqLite) {
    switch (element.length) {
      case 0:
        return element;

      case 1:
        // there is no point of stripping anything if the element
        // is the only element within the jqLite wrapper.
        // (it's important that we retain the element instance.)
        if (element[0].nodeType === ELEMENT_NODE) {
          return element;
        }
        break;

      default:
        return jqLite(extractElementNode(element));
    }
  }

  if (element.nodeType === ELEMENT_NODE) {
    return jqLite(element);
  }
}

function extractElementNode(element) {
  if (!element[0]) return element;
  for (var i = 0; i < element.length; i++) {
    var elm = element[i];
    if (elm.nodeType === ELEMENT_NODE) {
      return elm;
    }
  }
}

function $$addClass($$jqLite, element, className) {
  forEach(element, function(elm) {
    $$jqLite.addClass(elm, className);
  });
}

function $$removeClass($$jqLite, element, className) {
  forEach(element, function(elm) {
    $$jqLite.removeClass(elm, className);
  });
}

function applyAnimationClassesFactory($$jqLite) {
  return function(element, options) {
    if (options.addClass) {
      $$addClass($$jqLite, element, options.addClass);
      options.addClass = null;
    }
    if (options.removeClass) {
      $$removeClass($$jqLite, element, options.removeClass);
      options.removeClass = null;
    }
  };
}

function prepareAnimationOptions(options) {
  options = options || {};
  if (!options.$$prepared) {
    var domOperation = options.domOperation || noop;
    options.domOperation = function() {
      options.$$domOperationFired = true;
      domOperation();
      domOperation = noop;
    };
    options.$$prepared = true;
  }
  return options;
}

function applyAnimationStyles(element, options) {
  applyAnimationFromStyles(element, options);
  applyAnimationToStyles(element, options);
}

function applyAnimationFromStyles(element, options) {
  if (options.from) {
    element.css(options.from);
    options.from = null;
  }
}

function applyAnimationToStyles(element, options) {
  if (options.to) {
    element.css(options.to);
    options.to = null;
  }
}

function mergeAnimationDetails(element, oldAnimation, newAnimation) {
  var target = oldAnimation.options || {};
  var newOptions = newAnimation.options || {};

  var toAdd = (target.addClass || '') + ' ' + (newOptions.addClass || '');
  var toRemove = (target.removeClass || '') + ' ' + (newOptions.removeClass || '');
  var classes = resolveElementClasses(element.attr('class'), toAdd, toRemove);

  if (newOptions.preparationClasses) {
    target.preparationClasses = concatWithSpace(newOptions.preparationClasses, target.preparationClasses);
    delete newOptions.preparationClasses;
  }

  // noop is basically when there is no callback; otherwise something has been set
  var realDomOperation = target.domOperation !== noop ? target.domOperation : null;

  extend(target, newOptions);

  // TODO(matsko or sreeramu): proper fix is to maintain all animation callback in array and call at last,but now only leave has the callback so no issue with this.
  if (realDomOperation) {
    target.domOperation = realDomOperation;
  }

  if (classes.addClass) {
    target.addClass = classes.addClass;
  } else {
    target.addClass = null;
  }

  if (classes.removeClass) {
    target.removeClass = classes.removeClass;
  } else {
    target.removeClass = null;
  }

  oldAnimation.addClass = target.addClass;
  oldAnimation.removeClass = target.removeClass;

  return target;
}

function resolveElementClasses(existing, toAdd, toRemove) {
  var ADD_CLASS = 1;
  var REMOVE_CLASS = -1;

  var flags = {};
  existing = splitClassesToLookup(existing);

  toAdd = splitClassesToLookup(toAdd);
  forEach(toAdd, function(value, key) {
    flags[key] = ADD_CLASS;
  });

  toRemove = splitClassesToLookup(toRemove);
  forEach(toRemove, function(value, key) {
    flags[key] = flags[key] === ADD_CLASS ? null : REMOVE_CLASS;
  });

  var classes = {
    addClass: '',
    removeClass: ''
  };

  forEach(flags, function(val, klass) {
    var prop, allow;
    if (val === ADD_CLASS) {
      prop = 'addClass';
      allow = !existing[klass] || existing[klass + REMOVE_CLASS_SUFFIX];
    } else if (val === REMOVE_CLASS) {
      prop = 'removeClass';
      allow = existing[klass] || existing[klass + ADD_CLASS_SUFFIX];
    }
    if (allow) {
      if (classes[prop].length) {
        classes[prop] += ' ';
      }
      classes[prop] += klass;
    }
  });

  function splitClassesToLookup(classes) {
    if (isString(classes)) {
      classes = classes.split(' ');
    }

    var obj = {};
    forEach(classes, function(klass) {
      // sometimes the split leaves empty string values
      // incase extra spaces were applied to the options
      if (klass.length) {
        obj[klass] = true;
      }
    });
    return obj;
  }

  return classes;
}

function getDomNode(element) {
  return (element instanceof jqLite) ? element[0] : element;
}

function applyGeneratedPreparationClasses(element, event, options) {
  var classes = '';
  if (event) {
    classes = pendClasses(event, EVENT_CLASS_PREFIX, true);
  }
  if (options.addClass) {
    classes = concatWithSpace(classes, pendClasses(options.addClass, ADD_CLASS_SUFFIX));
  }
  if (options.removeClass) {
    classes = concatWithSpace(classes, pendClasses(options.removeClass, REMOVE_CLASS_SUFFIX));
  }
  if (classes.length) {
    options.preparationClasses = classes;
    element.addClass(classes);
  }
}

function clearGeneratedClasses(element, options) {
  if (options.preparationClasses) {
    element.removeClass(options.preparationClasses);
    options.preparationClasses = null;
  }
  if (options.activeClasses) {
    element.removeClass(options.activeClasses);
    options.activeClasses = null;
  }
}

function blockTransitions(node, duration) {
  // we use a negative delay value since it performs blocking
  // yet it doesn't kill any existing transitions running on the
  // same element which makes this safe for class-based animations
  var value = duration ? '-' + duration + 's' : '';
  applyInlineStyle(node, [TRANSITION_DELAY_PROP, value]);
  return [TRANSITION_DELAY_PROP, value];
}

function blockKeyframeAnimations(node, applyBlock) {
  var value = applyBlock ? 'paused' : '';
  var key = ANIMATION_PROP + ANIMATION_PLAYSTATE_KEY;
  applyInlineStyle(node, [key, value]);
  return [key, value];
}

function applyInlineStyle(node, styleTuple) {
  var prop = styleTuple[0];
  var value = styleTuple[1];
  node.style[prop] = value;
}

function concatWithSpace(a,b) {
  if (!a) return b;
  if (!b) return a;
  return a + ' ' + b;
}

var $$rAFSchedulerFactory = ['$$rAF', function($$rAF) {
  var queue, cancelFn;

  function scheduler(tasks) {
    // we make a copy since RAFScheduler mutates the state
    // of the passed in array variable and this would be difficult
    // to track down on the outside code
    queue = queue.concat(tasks);
    nextTick();
  }

  queue = scheduler.queue = [];

  /* waitUntilQuiet does two things:
   * 1. It will run the FINAL `fn` value only when an uncanceled RAF has passed through
   * 2. It will delay the next wave of tasks from running until the quiet `fn` has run.
   *
   * The motivation here is that animation code can request more time from the scheduler
   * before the next wave runs. This allows for certain DOM properties such as classes to
   * be resolved in time for the next animation to run.
   */
  scheduler.waitUntilQuiet = function(fn) {
    if (cancelFn) cancelFn();

    cancelFn = $$rAF(function() {
      cancelFn = null;
      fn();
      nextTick();
    });
  };

  return scheduler;

  function nextTick() {
    if (!queue.length) return;

    var items = queue.shift();
    for (var i = 0; i < items.length; i++) {
      items[i]();
    }

    if (!cancelFn) {
      $$rAF(function() {
        if (!cancelFn) nextTick();
      });
    }
  }
}];

/**
 * @ngdoc directive
 * @name ngAnimateChildren
 * @restrict AE
 * @element ANY
 *
 * @description
 *
 * ngAnimateChildren allows you to specify that children of this element should animate even if any
 * of the children's parents are currently animating. By default, when an element has an active `enter`, `leave`, or `move`
 * (structural) animation, child elements that also have an active structural animation are not animated.
 *
 * Note that even if `ngAnimateChildren` is set, no child animations will run when the parent element is removed from the DOM (`leave` animation).
 *
 *
 * @param {string} ngAnimateChildren If the value is empty, `true` or `on`,
 *     then child animations are allowed. If the value is `false`, child animations are not allowed.
 *
 * @example
 * <example module="ngAnimateChildren" name="ngAnimateChildren" deps="angular-animate.js" animations="true">
     <file name="index.html">
       <div ng-controller="MainController as main">
         <label>Show container? <input type="checkbox" ng-model="main.enterElement" /></label>
         <label>Animate children? <input type="checkbox" ng-model="main.animateChildren" /></label>
         <hr>
         <div ng-animate-children="{{main.animateChildren}}">
           <div ng-if="main.enterElement" class="container">
             List of items:
             <div ng-repeat="item in [0, 1, 2, 3]" class="item">Item {{item}}</div>
           </div>
         </div>
       </div>
     </file>
     <file name="animations.css">

      .container.ng-enter,
      .container.ng-leave {
        transition: all ease 1.5s;
      }

      .container.ng-enter,
      .container.ng-leave-active {
        opacity: 0;
      }

      .container.ng-leave,
      .container.ng-enter-active {
        opacity: 1;
      }

      .item {
        background: firebrick;
        color: #FFF;
        margin-bottom: 10px;
      }

      .item.ng-enter,
      .item.ng-leave {
        transition: transform 1.5s ease;
      }

      .item.ng-enter {
        transform: translateX(50px);
      }

      .item.ng-enter-active {
        transform: translateX(0);
      }
    </file>
    <file name="script.js">
      angular.module('ngAnimateChildren', ['ngAnimate'])
        .controller('MainController', function MainController() {
          this.animateChildren = false;
          this.enterElement = false;
        });
    </file>
  </example>
 */
var $$AnimateChildrenDirective = ['$interpolate', function($interpolate) {
  return {
    link: function(scope, element, attrs) {
      var val = attrs.ngAnimateChildren;
      if (isString(val) && val.length === 0) { //empty attribute
        element.data(NG_ANIMATE_CHILDREN_DATA, true);
      } else {
        // Interpolate and set the value, so that it is available to
        // animations that run right after compilation
        setData($interpolate(val)(scope));
        attrs.$observe('ngAnimateChildren', setData);
      }

      function setData(value) {
        value = value === 'on' || value === 'true';
        element.data(NG_ANIMATE_CHILDREN_DATA, value);
      }
    }
  };
}];

/* exported $AnimateCssProvider */

var ANIMATE_TIMER_KEY = '$$animateCss';

/**
 * @ngdoc service
 * @name $animateCss
 * @kind object
 *
 * @description
 * The `$animateCss` service is a useful utility to trigger customized CSS-based transitions/keyframes
 * from a JavaScript-based animation or directly from a directive. The purpose of `$animateCss` is NOT
 * to side-step how `$animate` and ngAnimate work, but the goal is to allow pre-existing animations or
 * directives to create more complex animations that can be purely driven using CSS code.
 *
 * Note that only browsers that support CSS transitions and/or keyframe animations are capable of
 * rendering animations triggered via `$animateCss` (bad news for IE9 and lower).
 *
 * ## General Use
 * Once again, `$animateCss` is designed to be used inside of a registered JavaScript animation that
 * is powered by ngAnimate. It is possible to use `$animateCss` directly inside of a directive, however,
 * any automatic control over cancelling animations and/or preventing animations from being run on
 * child elements will not be handled by AngularJS. For this to work as expected, please use `$animate` to
 * trigger the animation and then setup a JavaScript animation that injects `$animateCss` to trigger
 * the CSS animation.
 *
 * The example below shows how we can create a folding animation on an element using `ng-if`:
 *
 * ```html
 * <!-- notice the `fold-animation` CSS class -->
 * <div ng-if="onOff" class="fold-animation">
 *   This element will go BOOM
 * </div>
 * <button ng-click="onOff=true">Fold In</button>
 * ```
 *
 * Now we create the **JavaScript animation** that will trigger the CSS transition:
 *
 * ```js
 * ngModule.animation('.fold-animation', ['$animateCss', function($animateCss) {
 *   return {
 *     enter: function(element, doneFn) {
 *       var height = element[0].offsetHeight;
 *       return $animateCss(element, {
 *         from: { height:'0px' },
 *         to: { height:height + 'px' },
 *         duration: 1 // one second
 *       });
 *     }
 *   }
 * }]);
 * ```
 *
 * ## More Advanced Uses
 *
 * `$animateCss` is the underlying code that ngAnimate uses to power **CSS-based animations** behind the scenes. Therefore CSS hooks
 * like `.ng-EVENT`, `.ng-EVENT-active`, `.ng-EVENT-stagger` are all features that can be triggered using `$animateCss` via JavaScript code.
 *
 * This also means that just about any combination of adding classes, removing classes, setting styles, dynamically setting a keyframe animation,
 * applying a hardcoded duration or delay value, changing the animation easing or applying a stagger animation are all options that work with
 * `$animateCss`. The service itself is smart enough to figure out the combination of options and examine the element styling properties in order
 * to provide a working animation that will run in CSS.
 *
 * The example below showcases a more advanced version of the `.fold-animation` from the example above:
 *
 * ```js
 * ngModule.animation('.fold-animation', ['$animateCss', function($animateCss) {
 *   return {
 *     enter: function(element, doneFn) {
 *       var height = element[0].offsetHeight;
 *       return $animateCss(element, {
 *         addClass: 'red large-text pulse-twice',
 *         easing: 'ease-out',
 *         from: { height:'0px' },
 *         to: { height:height + 'px' },
 *         duration: 1 // one second
 *       });
 *     }
 *   }
 * }]);
 * ```
 *
 * Since we're adding/removing CSS classes then the CSS transition will also pick those up:
 *
 * ```css
 * /&#42; since a hardcoded duration value of 1 was provided in the JavaScript animation code,
 * the CSS classes below will be transitioned despite them being defined as regular CSS classes &#42;/
 * .red { background:red; }
 * .large-text { font-size:20px; }
 *
 * /&#42; we can also use a keyframe animation and $animateCss will make it work alongside the transition &#42;/
 * .pulse-twice {
 *   animation: 0.5s pulse linear 2;
 *   -webkit-animation: 0.5s pulse linear 2;
 * }
 *
 * @keyframes pulse {
 *   from { transform: scale(0.5); }
 *   to { transform: scale(1.5); }
 * }
 *
 * @-webkit-keyframes pulse {
 *   from { -webkit-transform: scale(0.5); }
 *   to { -webkit-transform: scale(1.5); }
 * }
 * ```
 *
 * Given this complex combination of CSS classes, styles and options, `$animateCss` will figure everything out and make the animation happen.
 *
 * ## How the Options are handled
 *
 * `$animateCss` is very versatile and intelligent when it comes to figuring out what configurations to apply to the element to ensure the animation
 * works with the options provided. Say for example we were adding a class that contained a keyframe value and we wanted to also animate some inline
 * styles using the `from` and `to` properties.
 *
 * ```js
 * var animator = $animateCss(element, {
 *   from: { background:'red' },
 *   to: { background:'blue' }
 * });
 * animator.start();
 * ```
 *
 * ```css
 * .rotating-animation {
 *   animation:0.5s rotate linear;
 *   -webkit-animation:0.5s rotate linear;
 * }
 *
 * @keyframes rotate {
 *   from { transform: rotate(0deg); }
 *   to { transform: rotate(360deg); }
 * }
 *
 * @-webkit-keyframes rotate {
 *   from { -webkit-transform: rotate(0deg); }
 *   to { -webkit-transform: rotate(360deg); }
 * }
 * ```
 *
 * The missing pieces here are that we do not have a transition set (within the CSS code nor within the `$animateCss` options) and the duration of the animation is
 * going to be detected from what the keyframe styles on the CSS class are. In this event, `$animateCss` will automatically create an inline transition
 * style matching the duration detected from the keyframe style (which is present in the CSS class that is being added) and then prepare both the transition
 * and keyframe animations to run in parallel on the element. Then when the animation is underway the provided `from` and `to` CSS styles will be applied
 * and spread across the transition and keyframe animation.
 *
 * ## What is returned
 *
 * `$animateCss` works in two stages: a preparation phase and an animation phase. Therefore when `$animateCss` is first called it will NOT actually
 * start the animation. All that is going on here is that the element is being prepared for the animation (which means that the generated CSS classes are
 * added and removed on the element). Once `$animateCss` is called it will return an object with the following properties:
 *
 * ```js
 * var animator = $animateCss(element, { ... });
 * ```
 *
 * Now what do the contents of our `animator` variable look like:
 *
 * ```js
 * {
 *   // starts the animation
 *   start: Function,
 *
 *   // ends (aborts) the animation
 *   end: Function
 * }
 * ```
 *
 * To actually start the animation we need to run `animation.start()` which will then return a promise that we can hook into to detect when the animation ends.
 * If we choose not to run the animation then we MUST run `animation.end()` to perform a cleanup on the element (since some CSS classes and styles may have been
 * applied to the element during the preparation phase). Note that all other properties such as duration, delay, transitions and keyframes are just properties
 * and that changing them will not reconfigure the parameters of the animation.
 *
 * ### runner.done() vs runner.then()
 * It is documented that `animation.start()` will return a promise object and this is true, however, there is also an additional method available on the
 * runner called `.done(callbackFn)`. The done method works the same as `.finally(callbackFn)`, however, it does **not trigger a digest to occur**.
 * Therefore, for performance reasons, it's always best to use `runner.done(callback)` instead of `runner.then()`, `runner.catch()` or `runner.finally()`
 * unless you really need a digest to kick off afterwards.
 *
 * Keep in mind that, to make this easier, ngAnimate has tweaked the JS animations API to recognize when a runner instance is returned from $animateCss
 * (so there is no need to call `runner.done(doneFn)` inside of your JavaScript animation code).
 * Check the {@link ngAnimate.$animateCss#usage animation code above} to see how this works.
 *
 * @param {DOMElement} element the element that will be animated
 * @param {object} options the animation-related options that will be applied during the animation
 *
 * * `event` - The DOM event (e.g. enter, leave, move). When used, a generated CSS class of `ng-EVENT` and `ng-EVENT-active` will be applied
 * to the element during the animation. Multiple events can be provided when spaces are used as a separator. (Note that this will not perform any DOM operation.)
 * * `structural` - Indicates that the `ng-` prefix will be added to the event class. Setting to `false` or omitting will turn `ng-EVENT` and
 * `ng-EVENT-active` in `EVENT` and `EVENT-active`. Unused if `event` is omitted.
 * * `easing` - The CSS easing value that will be applied to the transition or keyframe animation (or both).
 * * `transitionStyle` - The raw CSS transition style that will be used (e.g. `1s linear all`).
 * * `keyframeStyle` - The raw CSS keyframe animation style that will be used (e.g. `1s my_animation linear`).
 * * `from` - The starting CSS styles (a key/value object) that will be applied at the start of the animation.
 * * `to` - The ending CSS styles (a key/value object) that will be applied across the animation via a CSS transition.
 * * `addClass` - A space separated list of CSS classes that will be added to the element and spread across the animation.
 * * `removeClass` - A space separated list of CSS classes that will be removed from the element and spread across the animation.
 * * `duration` - A number value representing the total duration of the transition and/or keyframe (note that a value of 1 is 1000ms). If a value of `0`
 * is provided then the animation will be skipped entirely.
 * * `delay` - A number value representing the total delay of the transition and/or keyframe (note that a value of 1 is 1000ms). If a value of `true` is
 * used then whatever delay value is detected from the CSS classes will be mirrored on the elements styles (e.g. by setting delay true then the style value
 * of the element will be `transition-delay: DETECTED_VALUE`). Using `true` is useful when you want the CSS classes and inline styles to all share the same
 * CSS delay value.
 * * `stagger` - A numeric time value representing the delay between successively animated elements
 * ({@link ngAnimate#css-staggering-animations Click here to learn how CSS-based staggering works in ngAnimate.})
 * * `staggerIndex` - The numeric index representing the stagger item (e.g. a value of 5 is equal to the sixth item in the stagger; therefore when a
 *   `stagger` option value of `0.1` is used then there will be a stagger delay of `600ms`)
 * * `applyClassesEarly` - Whether or not the classes being added or removed will be used when detecting the animation. This is set by `$animate` when enter/leave/move animations are fired to ensure that the CSS classes are resolved in time. (Note that this will prevent any transitions from occurring on the classes being added and removed.)
 * * `cleanupStyles` - Whether or not the provided `from` and `to` styles will be removed once
 *    the animation is closed. This is useful for when the styles are used purely for the sake of
 *    the animation and do not have a lasting visual effect on the element (e.g. a collapse and open animation).
 *    By default this value is set to `false`.
 *
 * @return {object} an object with start and end methods and details about the animation.
 *
 * * `start` - The method to start the animation. This will return a `Promise` when called.
 * * `end` - This method will cancel the animation and remove all applied CSS classes and styles.
 */
var ONE_SECOND = 1000;

var ELAPSED_TIME_MAX_DECIMAL_PLACES = 3;
var CLOSING_TIME_BUFFER = 1.5;

var DETECT_CSS_PROPERTIES = {
  transitionDuration:      TRANSITION_DURATION_PROP,
  transitionDelay:         TRANSITION_DELAY_PROP,
  transitionProperty:      TRANSITION_PROP + PROPERTY_KEY,
  animationDuration:       ANIMATION_DURATION_PROP,
  animationDelay:          ANIMATION_DELAY_PROP,
  animationIterationCount: ANIMATION_PROP + ANIMATION_ITERATION_COUNT_KEY
};

var DETECT_STAGGER_CSS_PROPERTIES = {
  transitionDuration:      TRANSITION_DURATION_PROP,
  transitionDelay:         TRANSITION_DELAY_PROP,
  animationDuration:       ANIMATION_DURATION_PROP,
  animationDelay:          ANIMATION_DELAY_PROP
};

function getCssKeyframeDurationStyle(duration) {
  return [ANIMATION_DURATION_PROP, duration + 's'];
}

function getCssDelayStyle(delay, isKeyframeAnimation) {
  var prop = isKeyframeAnimation ? ANIMATION_DELAY_PROP : TRANSITION_DELAY_PROP;
  return [prop, delay + 's'];
}

function computeCssStyles($window, element, properties) {
  var styles = Object.create(null);
  var detectedStyles = $window.getComputedStyle(element) || {};
  forEach(properties, function(formalStyleName, actualStyleName) {
    var val = detectedStyles[formalStyleName];
    if (val) {
      var c = val.charAt(0);

      // only numerical-based values have a negative sign or digit as the first value
      if (c === '-' || c === '+' || c >= 0) {
        val = parseMaxTime(val);
      }

      // by setting this to null in the event that the delay is not set or is set directly as 0
      // then we can still allow for negative values to be used later on and not mistake this
      // value for being greater than any other negative value.
      if (val === 0) {
        val = null;
      }
      styles[actualStyleName] = val;
    }
  });

  return styles;
}

function parseMaxTime(str) {
  var maxValue = 0;
  var values = str.split(/\s*,\s*/);
  forEach(values, function(value) {
    // it's always safe to consider only second values and omit `ms` values since
    // getComputedStyle will always handle the conversion for us
    if (value.charAt(value.length - 1) === 's') {
      value = value.substring(0, value.length - 1);
    }
    value = parseFloat(value) || 0;
    maxValue = maxValue ? Math.max(value, maxValue) : value;
  });
  return maxValue;
}

function truthyTimingValue(val) {
  return val === 0 || val != null;
}

function getCssTransitionDurationStyle(duration, applyOnlyDuration) {
  var style = TRANSITION_PROP;
  var value = duration + 's';
  if (applyOnlyDuration) {
    style += DURATION_KEY;
  } else {
    value += ' linear all';
  }
  return [style, value];
}

function createLocalCacheLookup() {
  var cache = Object.create(null);
  return {
    flush: function() {
      cache = Object.create(null);
    },

    count: function(key) {
      var entry = cache[key];
      return entry ? entry.total : 0;
    },

    get: function(key) {
      var entry = cache[key];
      return entry && entry.value;
    },

    put: function(key, value) {
      if (!cache[key]) {
        cache[key] = { total: 1, value: value };
      } else {
        cache[key].total++;
      }
    }
  };
}

// we do not reassign an already present style value since
// if we detect the style property value again we may be
// detecting styles that were added via the `from` styles.
// We make use of `isDefined` here since an empty string
// or null value (which is what getPropertyValue will return
// for a non-existing style) will still be marked as a valid
// value for the style (a falsy value implies that the style
// is to be removed at the end of the animation). If we had a simple
// "OR" statement then it would not be enough to catch that.
function registerRestorableStyles(backup, node, properties) {
  forEach(properties, function(prop) {
    backup[prop] = isDefined(backup[prop])
        ? backup[prop]
        : node.style.getPropertyValue(prop);
  });
}

var $AnimateCssProvider = ['$animateProvider', /** @this */ function($animateProvider) {
  var gcsLookup = createLocalCacheLookup();
  var gcsStaggerLookup = createLocalCacheLookup();

  this.$get = ['$window', '$$jqLite', '$$AnimateRunner', '$timeout',
               '$$forceReflow', '$sniffer', '$$rAFScheduler', '$$animateQueue',
       function($window,   $$jqLite,   $$AnimateRunner,   $timeout,
                $$forceReflow,   $sniffer,   $$rAFScheduler, $$animateQueue) {

    var applyAnimationClasses = applyAnimationClassesFactory($$jqLite);

    var parentCounter = 0;
    function gcsHashFn(node, extraClasses) {
      var KEY = '$$ngAnimateParentKey';
      var parentNode = node.parentNode;
      var parentID = parentNode[KEY] || (parentNode[KEY] = ++parentCounter);
      return parentID + '-' + node.getAttribute('class') + '-' + extraClasses;
    }

    function computeCachedCssStyles(node, className, cacheKey, properties) {
      var timings = gcsLookup.get(cacheKey);

      if (!timings) {
        timings = computeCssStyles($window, node, properties);
        if (timings.animationIterationCount === 'infinite') {
          timings.animationIterationCount = 1;
        }
      }

      // we keep putting this in multiple times even though the value and the cacheKey are the same
      // because we're keeping an internal tally of how many duplicate animations are detected.
      gcsLookup.put(cacheKey, timings);
      return timings;
    }

    function computeCachedCssStaggerStyles(node, className, cacheKey, properties) {
      var stagger;

      // if we have one or more existing matches of matching elements
      // containing the same parent + CSS styles (which is how cacheKey works)
      // then staggering is possible
      if (gcsLookup.count(cacheKey) > 0) {
        stagger = gcsStaggerLookup.get(cacheKey);

        if (!stagger) {
          var staggerClassName = pendClasses(className, '-stagger');

          $$jqLite.addClass(node, staggerClassName);

          stagger = computeCssStyles($window, node, properties);

          // force the conversion of a null value to zero incase not set
          stagger.animationDuration = Math.max(stagger.animationDuration, 0);
          stagger.transitionDuration = Math.max(stagger.transitionDuration, 0);

          $$jqLite.removeClass(node, staggerClassName);

          gcsStaggerLookup.put(cacheKey, stagger);
        }
      }

      return stagger || {};
    }

    var rafWaitQueue = [];
    function waitUntilQuiet(callback) {
      rafWaitQueue.push(callback);
      $$rAFScheduler.waitUntilQuiet(function() {
        gcsLookup.flush();
        gcsStaggerLookup.flush();

        // DO NOT REMOVE THIS LINE OR REFACTOR OUT THE `pageWidth` variable.
        // PLEASE EXAMINE THE `$$forceReflow` service to understand why.
        var pageWidth = $$forceReflow();

        // we use a for loop to ensure that if the queue is changed
        // during this looping then it will consider new requests
        for (var i = 0; i < rafWaitQueue.length; i++) {
          rafWaitQueue[i](pageWidth);
        }
        rafWaitQueue.length = 0;
      });
    }

    function computeTimings(node, className, cacheKey) {
      var timings = computeCachedCssStyles(node, className, cacheKey, DETECT_CSS_PROPERTIES);
      var aD = timings.animationDelay;
      var tD = timings.transitionDelay;
      timings.maxDelay = aD && tD
          ? Math.max(aD, tD)
          : (aD || tD);
      timings.maxDuration = Math.max(
          timings.animationDuration * timings.animationIterationCount,
          timings.transitionDuration);

      return timings;
    }

    return function init(element, initialOptions) {
      // all of the animation functions should create
      // a copy of the options data, however, if a
      // parent service has already created a copy then
      // we should stick to using that
      var options = initialOptions || {};
      if (!options.$$prepared) {
        options = prepareAnimationOptions(copy(options));
      }

      var restoreStyles = {};
      var node = getDomNode(element);
      if (!node
          || !node.parentNode
          || !$$animateQueue.enabled()) {
        return closeAndReturnNoopAnimator();
      }

      var temporaryStyles = [];
      var classes = element.attr('class');
      var styles = packageStyles(options);
      var animationClosed;
      var animationPaused;
      var animationCompleted;
      var runner;
      var runnerHost;
      var maxDelay;
      var maxDelayTime;
      var maxDuration;
      var maxDurationTime;
      var startTime;
      var events = [];

      if (options.duration === 0 || (!$sniffer.animations && !$sniffer.transitions)) {
        return closeAndReturnNoopAnimator();
      }

      var method = options.event && isArray(options.event)
            ? options.event.join(' ')
            : options.event;

      var isStructural = method && options.structural;
      var structuralClassName = '';
      var addRemoveClassName = '';

      if (isStructural) {
        structuralClassName = pendClasses(method, EVENT_CLASS_PREFIX, true);
      } else if (method) {
        structuralClassName = method;
      }

      if (options.addClass) {
        addRemoveClassName += pendClasses(options.addClass, ADD_CLASS_SUFFIX);
      }

      if (options.removeClass) {
        if (addRemoveClassName.length) {
          addRemoveClassName += ' ';
        }
        addRemoveClassName += pendClasses(options.removeClass, REMOVE_CLASS_SUFFIX);
      }

      // there may be a situation where a structural animation is combined together
      // with CSS classes that need to resolve before the animation is computed.
      // However this means that there is no explicit CSS code to block the animation
      // from happening (by setting 0s none in the class name). If this is the case
      // we need to apply the classes before the first rAF so we know to continue if
      // there actually is a detected transition or keyframe animation
      if (options.applyClassesEarly && addRemoveClassName.length) {
        applyAnimationClasses(element, options);
      }

      var preparationClasses = [structuralClassName, addRemoveClassName].join(' ').trim();
      var fullClassName = classes + ' ' + preparationClasses;
      var activeClasses = pendClasses(preparationClasses, ACTIVE_CLASS_SUFFIX);
      var hasToStyles = styles.to && Object.keys(styles.to).length > 0;
      var containsKeyframeAnimation = (options.keyframeStyle || '').length > 0;

      // there is no way we can trigger an animation if no styles and
      // no classes are being applied which would then trigger a transition,
      // unless there a is raw keyframe value that is applied to the element.
      if (!containsKeyframeAnimation
           && !hasToStyles
           && !preparationClasses) {
        return closeAndReturnNoopAnimator();
      }

      var cacheKey, stagger;
      if (options.stagger > 0) {
        var staggerVal = parseFloat(options.stagger);
        stagger = {
          transitionDelay: staggerVal,
          animationDelay: staggerVal,
          transitionDuration: 0,
          animationDuration: 0
        };
      } else {
        cacheKey = gcsHashFn(node, fullClassName);
        stagger = computeCachedCssStaggerStyles(node, preparationClasses, cacheKey, DETECT_STAGGER_CSS_PROPERTIES);
      }

      if (!options.$$skipPreparationClasses) {
        $$jqLite.addClass(element, preparationClasses);
      }

      var applyOnlyDuration;

      if (options.transitionStyle) {
        var transitionStyle = [TRANSITION_PROP, options.transitionStyle];
        applyInlineStyle(node, transitionStyle);
        temporaryStyles.push(transitionStyle);
      }

      if (options.duration >= 0) {
        applyOnlyDuration = node.style[TRANSITION_PROP].length > 0;
        var durationStyle = getCssTransitionDurationStyle(options.duration, applyOnlyDuration);

        // we set the duration so that it will be picked up by getComputedStyle later
        applyInlineStyle(node, durationStyle);
        temporaryStyles.push(durationStyle);
      }

      if (options.keyframeStyle) {
        var keyframeStyle = [ANIMATION_PROP, options.keyframeStyle];
        applyInlineStyle(node, keyframeStyle);
        temporaryStyles.push(keyframeStyle);
      }

      var itemIndex = stagger
          ? options.staggerIndex >= 0
              ? options.staggerIndex
              : gcsLookup.count(cacheKey)
          : 0;

      var isFirst = itemIndex === 0;

      // this is a pre-emptive way of forcing the setup classes to be added and applied INSTANTLY
      // without causing any combination of transitions to kick in. By adding a negative delay value
      // it forces the setup class' transition to end immediately. We later then remove the negative
      // transition delay to allow for the transition to naturally do it's thing. The beauty here is
      // that if there is no transition defined then nothing will happen and this will also allow
      // other transitions to be stacked on top of each other without any chopping them out.
      if (isFirst && !options.skipBlocking) {
        blockTransitions(node, SAFE_FAST_FORWARD_DURATION_VALUE);
      }

      var timings = computeTimings(node, fullClassName, cacheKey);
      var relativeDelay = timings.maxDelay;
      maxDelay = Math.max(relativeDelay, 0);
      maxDuration = timings.maxDuration;

      var flags = {};
      flags.hasTransitions          = timings.transitionDuration > 0;
      flags.hasAnimations           = timings.animationDuration > 0;
      flags.hasTransitionAll        = flags.hasTransitions && timings.transitionProperty === 'all';
      flags.applyTransitionDuration = hasToStyles && (
                                        (flags.hasTransitions && !flags.hasTransitionAll)
                                         || (flags.hasAnimations && !flags.hasTransitions));
      flags.applyAnimationDuration  = options.duration && flags.hasAnimations;
      flags.applyTransitionDelay    = truthyTimingValue(options.delay) && (flags.applyTransitionDuration || flags.hasTransitions);
      flags.applyAnimationDelay     = truthyTimingValue(options.delay) && flags.hasAnimations;
      flags.recalculateTimingStyles = addRemoveClassName.length > 0;

      if (flags.applyTransitionDuration || flags.applyAnimationDuration) {
        maxDuration = options.duration ? parseFloat(options.duration) : maxDuration;

        if (flags.applyTransitionDuration) {
          flags.hasTransitions = true;
          timings.transitionDuration = maxDuration;
          applyOnlyDuration = node.style[TRANSITION_PROP + PROPERTY_KEY].length > 0;
          temporaryStyles.push(getCssTransitionDurationStyle(maxDuration, applyOnlyDuration));
        }

        if (flags.applyAnimationDuration) {
          flags.hasAnimations = true;
          timings.animationDuration = maxDuration;
          temporaryStyles.push(getCssKeyframeDurationStyle(maxDuration));
        }
      }

      if (maxDuration === 0 && !flags.recalculateTimingStyles) {
        return closeAndReturnNoopAnimator();
      }

      if (options.delay != null) {
        var delayStyle;
        if (typeof options.delay !== 'boolean') {
          delayStyle = parseFloat(options.delay);
          // number in options.delay means we have to recalculate the delay for the closing timeout
          maxDelay = Math.max(delayStyle, 0);
        }

        if (flags.applyTransitionDelay) {
          temporaryStyles.push(getCssDelayStyle(delayStyle));
        }

        if (flags.applyAnimationDelay) {
          temporaryStyles.push(getCssDelayStyle(delayStyle, true));
        }
      }

      // we need to recalculate the delay value since we used a pre-emptive negative
      // delay value and the delay value is required for the final event checking. This
      // property will ensure that this will happen after the RAF phase has passed.
      if (options.duration == null && timings.transitionDuration > 0) {
        flags.recalculateTimingStyles = flags.recalculateTimingStyles || isFirst;
      }

      maxDelayTime = maxDelay * ONE_SECOND;
      maxDurationTime = maxDuration * ONE_SECOND;
      if (!options.skipBlocking) {
        flags.blockTransition = timings.transitionDuration > 0;
        flags.blockKeyframeAnimation = timings.animationDuration > 0 &&
                                       stagger.animationDelay > 0 &&
                                       stagger.animationDuration === 0;
      }

      if (options.from) {
        if (options.cleanupStyles) {
          registerRestorableStyles(restoreStyles, node, Object.keys(options.from));
        }
        applyAnimationFromStyles(element, options);
      }

      if (flags.blockTransition || flags.blockKeyframeAnimation) {
        applyBlocking(maxDuration);
      } else if (!options.skipBlocking) {
        blockTransitions(node, false);
      }

      // TODO(matsko): for 1.5 change this code to have an animator object for better debugging
      return {
        $$willAnimate: true,
        end: endFn,
        start: function() {
          if (animationClosed) return;

          runnerHost = {
            end: endFn,
            cancel: cancelFn,
            resume: null, //this will be set during the start() phase
            pause: null
          };

          runner = new $$AnimateRunner(runnerHost);

          waitUntilQuiet(start);

          // we don't have access to pause/resume the animation
          // since it hasn't run yet. AnimateRunner will therefore
          // set noop functions for resume and pause and they will
          // later be overridden once the animation is triggered
          return runner;
        }
      };

      function endFn() {
        close();
      }

      function cancelFn() {
        close(true);
      }

      function close(rejected) {
        // if the promise has been called already then we shouldn't close
        // the animation again
        if (animationClosed || (animationCompleted && animationPaused)) return;
        animationClosed = true;
        animationPaused = false;

        if (!options.$$skipPreparationClasses) {
          $$jqLite.removeClass(element, preparationClasses);
        }
        $$jqLite.removeClass(element, activeClasses);

        blockKeyframeAnimations(node, false);
        blockTransitions(node, false);

        forEach(temporaryStyles, function(entry) {
          // There is only one way to remove inline style properties entirely from elements.
          // By using `removeProperty` this works, but we need to convert camel-cased CSS
          // styles down to hyphenated values.
          node.style[entry[0]] = '';
        });

        applyAnimationClasses(element, options);
        applyAnimationStyles(element, options);

        if (Object.keys(restoreStyles).length) {
          forEach(restoreStyles, function(value, prop) {
            if (value) {
              node.style.setProperty(prop, value);
            } else {
              node.style.removeProperty(prop);
            }
          });
        }

        // the reason why we have this option is to allow a synchronous closing callback
        // that is fired as SOON as the animation ends (when the CSS is removed) or if
        // the animation never takes off at all. A good example is a leave animation since
        // the element must be removed just after the animation is over or else the element
        // will appear on screen for one animation frame causing an overbearing flicker.
        if (options.onDone) {
          options.onDone();
        }

        if (events && events.length) {
          // Remove the transitionend / animationend listener(s)
          element.off(events.join(' '), onAnimationProgress);
        }

        //Cancel the fallback closing timeout and remove the timer data
        var animationTimerData = element.data(ANIMATE_TIMER_KEY);
        if (animationTimerData) {
          $timeout.cancel(animationTimerData[0].timer);
          element.removeData(ANIMATE_TIMER_KEY);
        }

        // if the preparation function fails then the promise is not setup
        if (runner) {
          runner.complete(!rejected);
        }
      }

      function applyBlocking(duration) {
        if (flags.blockTransition) {
          blockTransitions(node, duration);
        }

        if (flags.blockKeyframeAnimation) {
          blockKeyframeAnimations(node, !!duration);
        }
      }

      function closeAndReturnNoopAnimator() {
        runner = new $$AnimateRunner({
          end: endFn,
          cancel: cancelFn
        });

        // should flush the cache animation
        waitUntilQuiet(noop);
        close();

        return {
          $$willAnimate: false,
          start: function() {
            return runner;
          },
          end: endFn
        };
      }

      function onAnimationProgress(event) {
        event.stopPropagation();
        var ev = event.originalEvent || event;

        if (ev.target !== node) {
          // Since TransitionEvent / AnimationEvent bubble up,
          // we have to ignore events by finished child animations
          return;
        }

        // we now always use `Date.now()` due to the recent changes with
        // event.timeStamp in Firefox, Webkit and Chrome (see #13494 for more info)
        var timeStamp = ev.$manualTimeStamp || Date.now();

        /* Firefox (or possibly just Gecko) likes to not round values up
         * when a ms measurement is used for the animation */
        var elapsedTime = parseFloat(ev.elapsedTime.toFixed(ELAPSED_TIME_MAX_DECIMAL_PLACES));

        /* $manualTimeStamp is a mocked timeStamp value which is set
         * within browserTrigger(). This is only here so that tests can
         * mock animations properly. Real events fallback to event.timeStamp,
         * or, if they don't, then a timeStamp is automatically created for them.
         * We're checking to see if the timeStamp surpasses the expected delay,
         * but we're using elapsedTime instead of the timeStamp on the 2nd
         * pre-condition since animationPauseds sometimes close off early */
        if (Math.max(timeStamp - startTime, 0) >= maxDelayTime && elapsedTime >= maxDuration) {
          // we set this flag to ensure that if the transition is paused then, when resumed,
          // the animation will automatically close itself since transitions cannot be paused.
          animationCompleted = true;
          close();
        }
      }

      function start() {
        if (animationClosed) return;
        if (!node.parentNode) {
          close();
          return;
        }

        // even though we only pause keyframe animations here the pause flag
        // will still happen when transitions are used. Only the transition will
        // not be paused since that is not possible. If the animation ends when
        // paused then it will not complete until unpaused or cancelled.
        var playPause = function(playAnimation) {
          if (!animationCompleted) {
            animationPaused = !playAnimation;
            if (timings.animationDuration) {
              var value = blockKeyframeAnimations(node, animationPaused);
              if (animationPaused) {
                temporaryStyles.push(value);
              } else {
                removeFromArray(temporaryStyles, value);
              }
            }
          } else if (animationPaused && playAnimation) {
            animationPaused = false;
            close();
          }
        };

        // checking the stagger duration prevents an accidentally cascade of the CSS delay style
        // being inherited from the parent. If the transition duration is zero then we can safely
        // rely that the delay value is an intentional stagger delay style.
        var maxStagger = itemIndex > 0
                         && ((timings.transitionDuration && stagger.transitionDuration === 0) ||
                            (timings.animationDuration && stagger.animationDuration === 0))
                         && Math.max(stagger.animationDelay, stagger.transitionDelay);
        if (maxStagger) {
          $timeout(triggerAnimationStart,
                   Math.floor(maxStagger * itemIndex * ONE_SECOND),
                   false);
        } else {
          triggerAnimationStart();
        }

        // this will decorate the existing promise runner with pause/resume methods
        runnerHost.resume = function() {
          playPause(true);
        };

        runnerHost.pause = function() {
          playPause(false);
        };

        function triggerAnimationStart() {
          // just incase a stagger animation kicks in when the animation
          // itself was cancelled entirely
          if (animationClosed) return;

          applyBlocking(false);

          forEach(temporaryStyles, function(entry) {
            var key = entry[0];
            var value = entry[1];
            node.style[key] = value;
          });

          applyAnimationClasses(element, options);
          $$jqLite.addClass(element, activeClasses);

          if (flags.recalculateTimingStyles) {
            fullClassName = node.getAttribute('class') + ' ' + preparationClasses;
            cacheKey = gcsHashFn(node, fullClassName);

            timings = computeTimings(node, fullClassName, cacheKey);
            relativeDelay = timings.maxDelay;
            maxDelay = Math.max(relativeDelay, 0);
            maxDuration = timings.maxDuration;

            if (maxDuration === 0) {
              close();
              return;
            }

            flags.hasTransitions = timings.transitionDuration > 0;
            flags.hasAnimations = timings.animationDuration > 0;
          }

          if (flags.applyAnimationDelay) {
            relativeDelay = typeof options.delay !== 'boolean' && truthyTimingValue(options.delay)
                  ? parseFloat(options.delay)
                  : relativeDelay;

            maxDelay = Math.max(relativeDelay, 0);
            timings.animationDelay = relativeDelay;
            delayStyle = getCssDelayStyle(relativeDelay, true);
            temporaryStyles.push(delayStyle);
            node.style[delayStyle[0]] = delayStyle[1];
          }

          maxDelayTime = maxDelay * ONE_SECOND;
          maxDurationTime = maxDuration * ONE_SECOND;

          if (options.easing) {
            var easeProp, easeVal = options.easing;
            if (flags.hasTransitions) {
              easeProp = TRANSITION_PROP + TIMING_KEY;
              temporaryStyles.push([easeProp, easeVal]);
              node.style[easeProp] = easeVal;
            }
            if (flags.hasAnimations) {
              easeProp = ANIMATION_PROP + TIMING_KEY;
              temporaryStyles.push([easeProp, easeVal]);
              node.style[easeProp] = easeVal;
            }
          }

          if (timings.transitionDuration) {
            events.push(TRANSITIONEND_EVENT);
          }

          if (timings.animationDuration) {
            events.push(ANIMATIONEND_EVENT);
          }

          startTime = Date.now();
          var timerTime = maxDelayTime + CLOSING_TIME_BUFFER * maxDurationTime;
          var endTime = startTime + timerTime;

          var animationsData = element.data(ANIMATE_TIMER_KEY) || [];
          var setupFallbackTimer = true;
          if (animationsData.length) {
            var currentTimerData = animationsData[0];
            setupFallbackTimer = endTime > currentTimerData.expectedEndTime;
            if (setupFallbackTimer) {
              $timeout.cancel(currentTimerData.timer);
            } else {
              animationsData.push(close);
            }
          }

          if (setupFallbackTimer) {
            var timer = $timeout(onAnimationExpired, timerTime, false);
            animationsData[0] = {
              timer: timer,
              expectedEndTime: endTime
            };
            animationsData.push(close);
            element.data(ANIMATE_TIMER_KEY, animationsData);
          }

          if (events.length) {
            element.on(events.join(' '), onAnimationProgress);
          }

          if (options.to) {
            if (options.cleanupStyles) {
              registerRestorableStyles(restoreStyles, node, Object.keys(options.to));
            }
            applyAnimationToStyles(element, options);
          }
        }

        function onAnimationExpired() {
          var animationsData = element.data(ANIMATE_TIMER_KEY);

          // this will be false in the event that the element was
          // removed from the DOM (via a leave animation or something
          // similar)
          if (animationsData) {
            for (var i = 1; i < animationsData.length; i++) {
              animationsData[i]();
            }
            element.removeData(ANIMATE_TIMER_KEY);
          }
        }
      }
    };
  }];
}];

var $$AnimateCssDriverProvider = ['$$animationProvider', /** @this */ function($$animationProvider) {
  $$animationProvider.drivers.push('$$animateCssDriver');

  var NG_ANIMATE_SHIM_CLASS_NAME = 'ng-animate-shim';
  var NG_ANIMATE_ANCHOR_CLASS_NAME = 'ng-anchor';

  var NG_OUT_ANCHOR_CLASS_NAME = 'ng-anchor-out';
  var NG_IN_ANCHOR_CLASS_NAME = 'ng-anchor-in';

  function isDocumentFragment(node) {
    return node.parentNode && node.parentNode.nodeType === 11;
  }

  this.$get = ['$animateCss', '$rootScope', '$$AnimateRunner', '$rootElement', '$sniffer', '$$jqLite', '$document',
       function($animateCss,   $rootScope,   $$AnimateRunner,   $rootElement,   $sniffer,   $$jqLite,   $document) {

    // only browsers that support these properties can render animations
    if (!$sniffer.animations && !$sniffer.transitions) return noop;

    var bodyNode = $document[0].body;
    var rootNode = getDomNode($rootElement);

    var rootBodyElement = jqLite(
      // this is to avoid using something that exists outside of the body
      // we also special case the doc fragment case because our unit test code
      // appends the $rootElement to the body after the app has been bootstrapped
      isDocumentFragment(rootNode) || bodyNode.contains(rootNode) ? rootNode : bodyNode
    );

    return function initDriverFn(animationDetails) {
      return animationDetails.from && animationDetails.to
          ? prepareFromToAnchorAnimation(animationDetails.from,
                                         animationDetails.to,
                                         animationDetails.classes,
                                         animationDetails.anchors)
          : prepareRegularAnimation(animationDetails);
    };

    function filterCssClasses(classes) {
      //remove all the `ng-` stuff
      return classes.replace(/\bng-\S+\b/g, '');
    }

    function getUniqueValues(a, b) {
      if (isString(a)) a = a.split(' ');
      if (isString(b)) b = b.split(' ');
      return a.filter(function(val) {
        return b.indexOf(val) === -1;
      }).join(' ');
    }

    function prepareAnchoredAnimation(classes, outAnchor, inAnchor) {
      var clone = jqLite(getDomNode(outAnchor).cloneNode(true));
      var startingClasses = filterCssClasses(getClassVal(clone));

      outAnchor.addClass(NG_ANIMATE_SHIM_CLASS_NAME);
      inAnchor.addClass(NG_ANIMATE_SHIM_CLASS_NAME);

      clone.addClass(NG_ANIMATE_ANCHOR_CLASS_NAME);

      rootBodyElement.append(clone);

      var animatorIn, animatorOut = prepareOutAnimation();

      // the user may not end up using the `out` animation and
      // only making use of the `in` animation or vice-versa.
      // In either case we should allow this and not assume the
      // animation is over unless both animations are not used.
      if (!animatorOut) {
        animatorIn = prepareInAnimation();
        if (!animatorIn) {
          return end();
        }
      }

      var startingAnimator = animatorOut || animatorIn;

      return {
        start: function() {
          var runner;

          var currentAnimation = startingAnimator.start();
          currentAnimation.done(function() {
            currentAnimation = null;
            if (!animatorIn) {
              animatorIn = prepareInAnimation();
              if (animatorIn) {
                currentAnimation = animatorIn.start();
                currentAnimation.done(function() {
                  currentAnimation = null;
                  end();
                  runner.complete();
                });
                return currentAnimation;
              }
            }
            // in the event that there is no `in` animation
            end();
            runner.complete();
          });

          runner = new $$AnimateRunner({
            end: endFn,
            cancel: endFn
          });

          return runner;

          function endFn() {
            if (currentAnimation) {
              currentAnimation.end();
            }
          }
        }
      };

      function calculateAnchorStyles(anchor) {
        var styles = {};

        var coords = getDomNode(anchor).getBoundingClientRect();

        // we iterate directly since safari messes up and doesn't return
        // all the keys for the coords object when iterated
        forEach(['width','height','top','left'], function(key) {
          var value = coords[key];
          switch (key) {
            case 'top':
              value += bodyNode.scrollTop;
              break;
            case 'left':
              value += bodyNode.scrollLeft;
              break;
          }
          styles[key] = Math.floor(value) + 'px';
        });
        return styles;
      }

      function prepareOutAnimation() {
        var animator = $animateCss(clone, {
          addClass: NG_OUT_ANCHOR_CLASS_NAME,
          delay: true,
          from: calculateAnchorStyles(outAnchor)
        });

        // read the comment within `prepareRegularAnimation` to understand
        // why this check is necessary
        return animator.$$willAnimate ? animator : null;
      }

      function getClassVal(element) {
        return element.attr('class') || '';
      }

      function prepareInAnimation() {
        var endingClasses = filterCssClasses(getClassVal(inAnchor));
        var toAdd = getUniqueValues(endingClasses, startingClasses);
        var toRemove = getUniqueValues(startingClasses, endingClasses);

        var animator = $animateCss(clone, {
          to: calculateAnchorStyles(inAnchor),
          addClass: NG_IN_ANCHOR_CLASS_NAME + ' ' + toAdd,
          removeClass: NG_OUT_ANCHOR_CLASS_NAME + ' ' + toRemove,
          delay: true
        });

        // read the comment within `prepareRegularAnimation` to understand
        // why this check is necessary
        return animator.$$willAnimate ? animator : null;
      }

      function end() {
        clone.remove();
        outAnchor.removeClass(NG_ANIMATE_SHIM_CLASS_NAME);
        inAnchor.removeClass(NG_ANIMATE_SHIM_CLASS_NAME);
      }
    }

    function prepareFromToAnchorAnimation(from, to, classes, anchors) {
      var fromAnimation = prepareRegularAnimation(from, noop);
      var toAnimation = prepareRegularAnimation(to, noop);

      var anchorAnimations = [];
      forEach(anchors, function(anchor) {
        var outElement = anchor['out'];
        var inElement = anchor['in'];
        var animator = prepareAnchoredAnimation(classes, outElement, inElement);
        if (animator) {
          anchorAnimations.push(animator);
        }
      });

      // no point in doing anything when there are no elements to animate
      if (!fromAnimation && !toAnimation && anchorAnimations.length === 0) return;

      return {
        start: function() {
          var animationRunners = [];

          if (fromAnimation) {
            animationRunners.push(fromAnimation.start());
          }

          if (toAnimation) {
            animationRunners.push(toAnimation.start());
          }

          forEach(anchorAnimations, function(animation) {
            animationRunners.push(animation.start());
          });

          var runner = new $$AnimateRunner({
            end: endFn,
            cancel: endFn // CSS-driven animations cannot be cancelled, only ended
          });

          $$AnimateRunner.all(animationRunners, function(status) {
            runner.complete(status);
          });

          return runner;

          function endFn() {
            forEach(animationRunners, function(runner) {
              runner.end();
            });
          }
        }
      };
    }

    function prepareRegularAnimation(animationDetails) {
      var element = animationDetails.element;
      var options = animationDetails.options || {};

      if (animationDetails.structural) {
        options.event = animationDetails.event;
        options.structural = true;
        options.applyClassesEarly = true;

        // we special case the leave animation since we want to ensure that
        // the element is removed as soon as the animation is over. Otherwise
        // a flicker might appear or the element may not be removed at all
        if (animationDetails.event === 'leave') {
          options.onDone = options.domOperation;
        }
      }

      // We assign the preparationClasses as the actual animation event since
      // the internals of $animateCss will just suffix the event token values
      // with `-active` to trigger the animation.
      if (options.preparationClasses) {
        options.event = concatWithSpace(options.event, options.preparationClasses);
      }

      var animator = $animateCss(element, options);

      // the driver lookup code inside of $$animation attempts to spawn a
      // driver one by one until a driver returns a.$$willAnimate animator object.
      // $animateCss will always return an object, however, it will pass in
      // a flag as a hint as to whether an animation was detected or not
      return animator.$$willAnimate ? animator : null;
    }
  }];
}];

// TODO(matsko): use caching here to speed things up for detection
// TODO(matsko): add documentation
//  by the time...

var $$AnimateJsProvider = ['$animateProvider', /** @this */ function($animateProvider) {
  this.$get = ['$injector', '$$AnimateRunner', '$$jqLite',
       function($injector,   $$AnimateRunner,   $$jqLite) {

    var applyAnimationClasses = applyAnimationClassesFactory($$jqLite);
         // $animateJs(element, 'enter');
    return function(element, event, classes, options) {
      var animationClosed = false;

      // the `classes` argument is optional and if it is not used
      // then the classes will be resolved from the element's className
      // property as well as options.addClass/options.removeClass.
      if (arguments.length === 3 && isObject(classes)) {
        options = classes;
        classes = null;
      }

      options = prepareAnimationOptions(options);
      if (!classes) {
        classes = element.attr('class') || '';
        if (options.addClass) {
          classes += ' ' + options.addClass;
        }
        if (options.removeClass) {
          classes += ' ' + options.removeClass;
        }
      }

      var classesToAdd = options.addClass;
      var classesToRemove = options.removeClass;

      // the lookupAnimations function returns a series of animation objects that are
      // matched up with one or more of the CSS classes. These animation objects are
      // defined via the module.animation factory function. If nothing is detected then
      // we don't return anything which then makes $animation query the next driver.
      var animations = lookupAnimations(classes);
      var before, after;
      if (animations.length) {
        var afterFn, beforeFn;
        if (event === 'leave') {
          beforeFn = 'leave';
          afterFn = 'afterLeave'; // TODO(matsko): get rid of this
        } else {
          beforeFn = 'before' + event.charAt(0).toUpperCase() + event.substr(1);
          afterFn = event;
        }

        if (event !== 'enter' && event !== 'move') {
          before = packageAnimations(element, event, options, animations, beforeFn);
        }
        after  = packageAnimations(element, event, options, animations, afterFn);
      }

      // no matching animations
      if (!before && !after) return;

      function applyOptions() {
        options.domOperation();
        applyAnimationClasses(element, options);
      }

      function close() {
        animationClosed = true;
        applyOptions();
        applyAnimationStyles(element, options);
      }

      var runner;

      return {
        $$willAnimate: true,
        end: function() {
          if (runner) {
            runner.end();
          } else {
            close();
            runner = new $$AnimateRunner();
            runner.complete(true);
          }
          return runner;
        },
        start: function() {
          if (runner) {
            return runner;
          }

          runner = new $$AnimateRunner();
          var closeActiveAnimations;
          var chain = [];

          if (before) {
            chain.push(function(fn) {
              closeActiveAnimations = before(fn);
            });
          }

          if (chain.length) {
            chain.push(function(fn) {
              applyOptions();
              fn(true);
            });
          } else {
            applyOptions();
          }

          if (after) {
            chain.push(function(fn) {
              closeActiveAnimations = after(fn);
            });
          }

          runner.setHost({
            end: function() {
              endAnimations();
            },
            cancel: function() {
              endAnimations(true);
            }
          });

          $$AnimateRunner.chain(chain, onComplete);
          return runner;

          function onComplete(success) {
            close(success);
            runner.complete(success);
          }

          function endAnimations(cancelled) {
            if (!animationClosed) {
              (closeActiveAnimations || noop)(cancelled);
              onComplete(cancelled);
            }
          }
        }
      };

      function executeAnimationFn(fn, element, event, options, onDone) {
        var args;
        switch (event) {
          case 'animate':
            args = [element, options.from, options.to, onDone];
            break;

          case 'setClass':
            args = [element, classesToAdd, classesToRemove, onDone];
            break;

          case 'addClass':
            args = [element, classesToAdd, onDone];
            break;

          case 'removeClass':
            args = [element, classesToRemove, onDone];
            break;

          default:
            args = [element, onDone];
            break;
        }

        args.push(options);

        var value = fn.apply(fn, args);
        if (value) {
          if (isFunction(value.start)) {
            value = value.start();
          }

          if (value instanceof $$AnimateRunner) {
            value.done(onDone);
          } else if (isFunction(value)) {
            // optional onEnd / onCancel callback
            return value;
          }
        }

        return noop;
      }

      function groupEventedAnimations(element, event, options, animations, fnName) {
        var operations = [];
        forEach(animations, function(ani) {
          var animation = ani[fnName];
          if (!animation) return;

          // note that all of these animations will run in parallel
          operations.push(function() {
            var runner;
            var endProgressCb;

            var resolved = false;
            var onAnimationComplete = function(rejected) {
              if (!resolved) {
                resolved = true;
                (endProgressCb || noop)(rejected);
                runner.complete(!rejected);
              }
            };

            runner = new $$AnimateRunner({
              end: function() {
                onAnimationComplete();
              },
              cancel: function() {
                onAnimationComplete(true);
              }
            });

            endProgressCb = executeAnimationFn(animation, element, event, options, function(result) {
              var cancelled = result === false;
              onAnimationComplete(cancelled);
            });

            return runner;
          });
        });

        return operations;
      }

      function packageAnimations(element, event, options, animations, fnName) {
        var operations = groupEventedAnimations(element, event, options, animations, fnName);
        if (operations.length === 0) {
          var a, b;
          if (fnName === 'beforeSetClass') {
            a = groupEventedAnimations(element, 'removeClass', options, animations, 'beforeRemoveClass');
            b = groupEventedAnimations(element, 'addClass', options, animations, 'beforeAddClass');
          } else if (fnName === 'setClass') {
            a = groupEventedAnimations(element, 'removeClass', options, animations, 'removeClass');
            b = groupEventedAnimations(element, 'addClass', options, animations, 'addClass');
          }

          if (a) {
            operations = operations.concat(a);
          }
          if (b) {
            operations = operations.concat(b);
          }
        }

        if (operations.length === 0) return;

        // TODO(matsko): add documentation
        return function startAnimation(callback) {
          var runners = [];
          if (operations.length) {
            forEach(operations, function(animateFn) {
              runners.push(animateFn());
            });
          }

          if (runners.length) {
            $$AnimateRunner.all(runners, callback);
          }  else {
            callback();
          }

          return function endFn(reject) {
            forEach(runners, function(runner) {
              if (reject) {
                runner.cancel();
              } else {
                runner.end();
              }
            });
          };
        };
      }
    };

    function lookupAnimations(classes) {
      classes = isArray(classes) ? classes : classes.split(' ');
      var matches = [], flagMap = {};
      for (var i = 0; i < classes.length; i++) {
        var klass = classes[i],
            animationFactory = $animateProvider.$$registeredAnimations[klass];
        if (animationFactory && !flagMap[klass]) {
          matches.push($injector.get(animationFactory));
          flagMap[klass] = true;
        }
      }
      return matches;
    }
  }];
}];

var $$AnimateJsDriverProvider = ['$$animationProvider', /** @this */ function($$animationProvider) {
  $$animationProvider.drivers.push('$$animateJsDriver');
  this.$get = ['$$animateJs', '$$AnimateRunner', function($$animateJs, $$AnimateRunner) {
    return function initDriverFn(animationDetails) {
      if (animationDetails.from && animationDetails.to) {
        var fromAnimation = prepareAnimation(animationDetails.from);
        var toAnimation = prepareAnimation(animationDetails.to);
        if (!fromAnimation && !toAnimation) return;

        return {
          start: function() {
            var animationRunners = [];

            if (fromAnimation) {
              animationRunners.push(fromAnimation.start());
            }

            if (toAnimation) {
              animationRunners.push(toAnimation.start());
            }

            $$AnimateRunner.all(animationRunners, done);

            var runner = new $$AnimateRunner({
              end: endFnFactory(),
              cancel: endFnFactory()
            });

            return runner;

            function endFnFactory() {
              return function() {
                forEach(animationRunners, function(runner) {
                  // at this point we cannot cancel animations for groups just yet. 1.5+
                  runner.end();
                });
              };
            }

            function done(status) {
              runner.complete(status);
            }
          }
        };
      } else {
        return prepareAnimation(animationDetails);
      }
    };

    function prepareAnimation(animationDetails) {
      // TODO(matsko): make sure to check for grouped animations and delegate down to normal animations
      var element = animationDetails.element;
      var event = animationDetails.event;
      var options = animationDetails.options;
      var classes = animationDetails.classes;
      return $$animateJs(element, event, classes, options);
    }
  }];
}];

var NG_ANIMATE_ATTR_NAME = 'data-ng-animate';
var NG_ANIMATE_PIN_DATA = '$ngAnimatePin';
var $$AnimateQueueProvider = ['$animateProvider', /** @this */ function($animateProvider) {
  var PRE_DIGEST_STATE = 1;
  var RUNNING_STATE = 2;
  var ONE_SPACE = ' ';

  var rules = this.rules = {
    skip: [],
    cancel: [],
    join: []
  };

  function makeTruthyCssClassMap(classString) {
    if (!classString) {
      return null;
    }

    var keys = classString.split(ONE_SPACE);
    var map = Object.create(null);

    forEach(keys, function(key) {
      map[key] = true;
    });
    return map;
  }

  function hasMatchingClasses(newClassString, currentClassString) {
    if (newClassString && currentClassString) {
      var currentClassMap = makeTruthyCssClassMap(currentClassString);
      return newClassString.split(ONE_SPACE).some(function(className) {
        return currentClassMap[className];
      });
    }
  }

  function isAllowed(ruleType, currentAnimation, previousAnimation) {
    return rules[ruleType].some(function(fn) {
      return fn(currentAnimation, previousAnimation);
    });
  }

  function hasAnimationClasses(animation, and) {
    var a = (animation.addClass || '').length > 0;
    var b = (animation.removeClass || '').length > 0;
    return and ? a && b : a || b;
  }

  rules.join.push(function(newAnimation, currentAnimation) {
    // if the new animation is class-based then we can just tack that on
    return !newAnimation.structural && hasAnimationClasses(newAnimation);
  });

  rules.skip.push(function(newAnimation, currentAnimation) {
    // there is no need to animate anything if no classes are being added and
    // there is no structural animation that will be triggered
    return !newAnimation.structural && !hasAnimationClasses(newAnimation);
  });

  rules.skip.push(function(newAnimation, currentAnimation) {
    // why should we trigger a new structural animation if the element will
    // be removed from the DOM anyway?
    return currentAnimation.event === 'leave' && newAnimation.structural;
  });

  rules.skip.push(function(newAnimation, currentAnimation) {
    // if there is an ongoing current animation then don't even bother running the class-based animation
    return currentAnimation.structural && currentAnimation.state === RUNNING_STATE && !newAnimation.structural;
  });

  rules.cancel.push(function(newAnimation, currentAnimation) {
    // there can never be two structural animations running at the same time
    return currentAnimation.structural && newAnimation.structural;
  });

  rules.cancel.push(function(newAnimation, currentAnimation) {
    // if the previous animation is already running, but the new animation will
    // be triggered, but the new animation is structural
    return currentAnimation.state === RUNNING_STATE && newAnimation.structural;
  });

  rules.cancel.push(function(newAnimation, currentAnimation) {
    // cancel the animation if classes added / removed in both animation cancel each other out,
    // but only if the current animation isn't structural

    if (currentAnimation.structural) return false;

    var nA = newAnimation.addClass;
    var nR = newAnimation.removeClass;
    var cA = currentAnimation.addClass;
    var cR = currentAnimation.removeClass;

    // early detection to save the global CPU shortage :)
    if ((isUndefined(nA) && isUndefined(nR)) || (isUndefined(cA) && isUndefined(cR))) {
      return false;
    }

    return hasMatchingClasses(nA, cR) || hasMatchingClasses(nR, cA);
  });

  this.$get = ['$$rAF', '$rootScope', '$rootElement', '$document', '$$Map',
               '$$animation', '$$AnimateRunner', '$templateRequest', '$$jqLite', '$$forceReflow',
               '$$isDocumentHidden',
       function($$rAF,   $rootScope,   $rootElement,   $document,   $$Map,
                $$animation,   $$AnimateRunner,   $templateRequest,   $$jqLite,   $$forceReflow,
                $$isDocumentHidden) {

    var activeAnimationsLookup = new $$Map();
    var disabledElementsLookup = new $$Map();
    var animationsEnabled = null;

    function postDigestTaskFactory() {
      var postDigestCalled = false;
      return function(fn) {
        // we only issue a call to postDigest before
        // it has first passed. This prevents any callbacks
        // from not firing once the animation has completed
        // since it will be out of the digest cycle.
        if (postDigestCalled) {
          fn();
        } else {
          $rootScope.$$postDigest(function() {
            postDigestCalled = true;
            fn();
          });
        }
      };
    }

    // Wait until all directive and route-related templates are downloaded and
    // compiled. The $templateRequest.totalPendingRequests variable keeps track of
    // all of the remote templates being currently downloaded. If there are no
    // templates currently downloading then the watcher will still fire anyway.
    var deregisterWatch = $rootScope.$watch(
      function() { return $templateRequest.totalPendingRequests === 0; },
      function(isEmpty) {
        if (!isEmpty) return;
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
            // we check for null directly in the event that the application already called
            // .enabled() with whatever arguments that it provided it with
            if (animationsEnabled === null) {
              animationsEnabled = true;
            }
          });
        });
      }
    );

    var callbackRegistry = Object.create(null);

    // remember that the `customFilter`/`classNameFilter` are set during the
    // provider/config stage therefore we can optimize here and setup helper functions
    var customFilter = $animateProvider.customFilter();
    var classNameFilter = $animateProvider.classNameFilter();
    var returnTrue = function() { return true; };

    var isAnimatableByFilter = customFilter || returnTrue;
    var isAnimatableClassName = !classNameFilter ? returnTrue : function(node, options) {
      var className = [node.getAttribute('class'), options.addClass, options.removeClass].join(' ');
      return classNameFilter.test(className);
    };

    var applyAnimationClasses = applyAnimationClassesFactory($$jqLite);

    function normalizeAnimationDetails(element, animation) {
      return mergeAnimationDetails(element, animation, {});
    }

    // IE9-11 has no method "contains" in SVG element and in Node.prototype. Bug #10259.
    var contains = window.Node.prototype.contains || /** @this */ function(arg) {
      // eslint-disable-next-line no-bitwise
      return this === arg || !!(this.compareDocumentPosition(arg) & 16);
    };

    function findCallbacks(targetParentNode, targetNode, event) {
      var matches = [];
      var entries = callbackRegistry[event];
      if (entries) {
        forEach(entries, function(entry) {
          if (contains.call(entry.node, targetNode)) {
            matches.push(entry.callback);
          } else if (event === 'leave' && contains.call(entry.node, targetParentNode)) {
            matches.push(entry.callback);
          }
        });
      }

      return matches;
    }

    function filterFromRegistry(list, matchContainer, matchCallback) {
      var containerNode = extractElementNode(matchContainer);
      return list.filter(function(entry) {
        var isMatch = entry.node === containerNode &&
                        (!matchCallback || entry.callback === matchCallback);
        return !isMatch;
      });
    }

    function cleanupEventListeners(phase, node) {
      if (phase === 'close' && !node.parentNode) {
        // If the element is not attached to a parentNode, it has been removed by
        // the domOperation, and we can safely remove the event callbacks
        $animate.off(node);
      }
    }

    var $animate = {
      on: function(event, container, callback) {
        var node = extractElementNode(container);
        callbackRegistry[event] = callbackRegistry[event] || [];
        callbackRegistry[event].push({
          node: node,
          callback: callback
        });

        // Remove the callback when the element is removed from the DOM
        jqLite(container).on('$destroy', function() {
          var animationDetails = activeAnimationsLookup.get(node);

          if (!animationDetails) {
            // If there's an animation ongoing, the callback calling code will remove
            // the event listeners. If we'd remove here, the callbacks would be removed
            // before the animation ends
            $animate.off(event, container, callback);
          }
        });
      },

      off: function(event, container, callback) {
        if (arguments.length === 1 && !isString(arguments[0])) {
          container = arguments[0];
          for (var eventType in callbackRegistry) {
            callbackRegistry[eventType] = filterFromRegistry(callbackRegistry[eventType], container);
          }

          return;
        }

        var entries = callbackRegistry[event];
        if (!entries) return;

        callbackRegistry[event] = arguments.length === 1
            ? null
            : filterFromRegistry(entries, container, callback);
      },

      pin: function(element, parentElement) {
        assertArg(isElement(element), 'element', 'not an element');
        assertArg(isElement(parentElement), 'parentElement', 'not an element');
        element.data(NG_ANIMATE_PIN_DATA, parentElement);
      },

      push: function(element, event, options, domOperation) {
        options = options || {};
        options.domOperation = domOperation;
        return queueAnimation(element, event, options);
      },

      // this method has four signatures:
      //  () - global getter
      //  (bool) - global setter
      //  (element) - element getter
      //  (element, bool) - element setter<F37>
      enabled: function(element, bool) {
        var argCount = arguments.length;

        if (argCount === 0) {
          // () - Global getter
          bool = !!animationsEnabled;
        } else {
          var hasElement = isElement(element);

          if (!hasElement) {
            // (bool) - Global setter
            bool = animationsEnabled = !!element;
          } else {
            var node = getDomNode(element);

            if (argCount === 1) {
              // (element) - Element getter
              bool = !disabledElementsLookup.get(node);
            } else {
              // (element, bool) - Element setter
              disabledElementsLookup.set(node, !bool);
            }
          }
        }

        return bool;
      }
    };

    return $animate;

    function queueAnimation(originalElement, event, initialOptions) {
      // we always make a copy of the options since
      // there should never be any side effects on
      // the input data when running `$animateCss`.
      var options = copy(initialOptions);

      var element = stripCommentsFromElement(originalElement);
      var node = getDomNode(element);
      var parentNode = node && node.parentNode;

      options = prepareAnimationOptions(options);

      // we create a fake runner with a working promise.
      // These methods will become available after the digest has passed
      var runner = new $$AnimateRunner();

      // this is used to trigger callbacks in postDigest mode
      var runInNextPostDigestOrNow = postDigestTaskFactory();

      if (isArray(options.addClass)) {
        options.addClass = options.addClass.join(' ');
      }

      if (options.addClass && !isString(options.addClass)) {
        options.addClass = null;
      }

      if (isArray(options.removeClass)) {
        options.removeClass = options.removeClass.join(' ');
      }

      if (options.removeClass && !isString(options.removeClass)) {
        options.removeClass = null;
      }

      if (options.from && !isObject(options.from)) {
        options.from = null;
      }

      if (options.to && !isObject(options.to)) {
        options.to = null;
      }

      // If animations are hard-disabled for the whole application there is no need to continue.
      // There are also situations where a directive issues an animation for a jqLite wrapper that
      // contains only comment nodes. In this case, there is no way we can perform an animation.
      if (!animationsEnabled ||
          !node ||
          !isAnimatableByFilter(node, event, initialOptions) ||
          !isAnimatableClassName(node, options)) {
        close();
        return runner;
      }

      var isStructural = ['enter', 'move', 'leave'].indexOf(event) >= 0;

      var documentHidden = $$isDocumentHidden();

      // This is a hard disable of all animations the element itself, therefore  there is no need to
      // continue further past this point if not enabled
      // Animations are also disabled if the document is currently hidden (page is not visible
      // to the user), because browsers slow down or do not flush calls to requestAnimationFrame
      var skipAnimations = documentHidden || disabledElementsLookup.get(node);
      var existingAnimation = (!skipAnimations && activeAnimationsLookup.get(node)) || {};
      var hasExistingAnimation = !!existingAnimation.state;

      // there is no point in traversing the same collection of parent ancestors if a followup
      // animation will be run on the same element that already did all that checking work
      if (!skipAnimations && (!hasExistingAnimation || existingAnimation.state !== PRE_DIGEST_STATE)) {
        skipAnimations = !areAnimationsAllowed(node, parentNode, event);
      }

      if (skipAnimations) {
        // Callbacks should fire even if the document is hidden (regression fix for issue #14120)
        if (documentHidden) notifyProgress(runner, event, 'start');
        close();
        if (documentHidden) notifyProgress(runner, event, 'close');
        return runner;
      }

      if (isStructural) {
        closeChildAnimations(node);
      }

      var newAnimation = {
        structural: isStructural,
        element: element,
        event: event,
        addClass: options.addClass,
        removeClass: options.removeClass,
        close: close,
        options: options,
        runner: runner
      };

      if (hasExistingAnimation) {
        var skipAnimationFlag = isAllowed('skip', newAnimation, existingAnimation);
        if (skipAnimationFlag) {
          if (existingAnimation.state === RUNNING_STATE) {
            close();
            return runner;
          } else {
            mergeAnimationDetails(element, existingAnimation, newAnimation);
            return existingAnimation.runner;
          }
        }
        var cancelAnimationFlag = isAllowed('cancel', newAnimation, existingAnimation);
        if (cancelAnimationFlag) {
          if (existingAnimation.state === RUNNING_STATE) {
            // this will end the animation right away and it is safe
            // to do so since the animation is already running and the
            // runner callback code will run in async
            existingAnimation.runner.end();
          } else if (existingAnimation.structural) {
            // this means that the animation is queued into a digest, but
            // hasn't started yet. Therefore it is safe to run the close
            // method which will call the runner methods in async.
            existingAnimation.close();
          } else {
            // this will merge the new animation options into existing animation options
            mergeAnimationDetails(element, existingAnimation, newAnimation);

            return existingAnimation.runner;
          }
        } else {
          // a joined animation means that this animation will take over the existing one
          // so an example would involve a leave animation taking over an enter. Then when
          // the postDigest kicks in the enter will be ignored.
          var joinAnimationFlag = isAllowed('join', newAnimation, existingAnimation);
          if (joinAnimationFlag) {
            if (existingAnimation.state === RUNNING_STATE) {
              normalizeAnimationDetails(element, newAnimation);
            } else {
              applyGeneratedPreparationClasses(element, isStructural ? event : null, options);

              event = newAnimation.event = existingAnimation.event;
              options = mergeAnimationDetails(element, existingAnimation, newAnimation);

              //we return the same runner since only the option values of this animation will
              //be fed into the `existingAnimation`.
              return existingAnimation.runner;
            }
          }
        }
      } else {
        // normalization in this case means that it removes redundant CSS classes that
        // already exist (addClass) or do not exist (removeClass) on the element
        normalizeAnimationDetails(element, newAnimation);
      }

      // when the options are merged and cleaned up we may end up not having to do
      // an animation at all, therefore we should check this before issuing a post
      // digest callback. Structural animations will always run no matter what.
      var isValidAnimation = newAnimation.structural;
      if (!isValidAnimation) {
        // animate (from/to) can be quickly checked first, otherwise we check if any classes are present
        isValidAnimation = (newAnimation.event === 'animate' && Object.keys(newAnimation.options.to || {}).length > 0)
                            || hasAnimationClasses(newAnimation);
      }

      if (!isValidAnimation) {
        close();
        clearElementAnimationState(node);
        return runner;
      }

      // the counter keeps track of cancelled animations
      var counter = (existingAnimation.counter || 0) + 1;
      newAnimation.counter = counter;

      markElementAnimationState(node, PRE_DIGEST_STATE, newAnimation);

      $rootScope.$$postDigest(function() {
        // It is possible that the DOM nodes inside `originalElement` have been replaced. This can
        // happen if the animated element is a transcluded clone and also has a `templateUrl`
        // directive on it. Therefore, we must recreate `element` in order to interact with the
        // actual DOM nodes.
        // Note: We still need to use the old `node` for certain things, such as looking up in
        //       HashMaps where it was used as the key.

        element = stripCommentsFromElement(originalElement);

        var animationDetails = activeAnimationsLookup.get(node);
        var animationCancelled = !animationDetails;
        animationDetails = animationDetails || {};

        // if addClass/removeClass is called before something like enter then the
        // registered parent element may not be present. The code below will ensure
        // that a final value for parent element is obtained
        var parentElement = element.parent() || [];

        // animate/structural/class-based animations all have requirements. Otherwise there
        // is no point in performing an animation. The parent node must also be set.
        var isValidAnimation = parentElement.length > 0
                                && (animationDetails.event === 'animate'
                                    || animationDetails.structural
                                    || hasAnimationClasses(animationDetails));

        // this means that the previous animation was cancelled
        // even if the follow-up animation is the same event
        if (animationCancelled || animationDetails.counter !== counter || !isValidAnimation) {
          // if another animation did not take over then we need
          // to make sure that the domOperation and options are
          // handled accordingly
          if (animationCancelled) {
            applyAnimationClasses(element, options);
            applyAnimationStyles(element, options);
          }

          // if the event changed from something like enter to leave then we do
          // it, otherwise if it's the same then the end result will be the same too
          if (animationCancelled || (isStructural && animationDetails.event !== event)) {
            options.domOperation();
            runner.end();
          }

          // in the event that the element animation was not cancelled or a follow-up animation
          // isn't allowed to animate from here then we need to clear the state of the element
          // so that any future animations won't read the expired animation data.
          if (!isValidAnimation) {
            clearElementAnimationState(node);
          }

          return;
        }

        // this combined multiple class to addClass / removeClass into a setClass event
        // so long as a structural event did not take over the animation
        event = !animationDetails.structural && hasAnimationClasses(animationDetails, true)
            ? 'setClass'
            : animationDetails.event;

        markElementAnimationState(node, RUNNING_STATE);
        var realRunner = $$animation(element, event, animationDetails.options);

        // this will update the runner's flow-control events based on
        // the `realRunner` object.
        runner.setHost(realRunner);
        notifyProgress(runner, event, 'start', {});

        realRunner.done(function(status) {
          close(!status);
          var animationDetails = activeAnimationsLookup.get(node);
          if (animationDetails && animationDetails.counter === counter) {
            clearElementAnimationState(node);
          }
          notifyProgress(runner, event, 'close', {});
        });
      });

      return runner;

      function notifyProgress(runner, event, phase, data) {
        runInNextPostDigestOrNow(function() {
          var callbacks = findCallbacks(parentNode, node, event);
          if (callbacks.length) {
            // do not optimize this call here to RAF because
            // we don't know how heavy the callback code here will
            // be and if this code is buffered then this can
            // lead to a performance regression.
            $$rAF(function() {
              forEach(callbacks, function(callback) {
                callback(element, phase, data);
              });
              cleanupEventListeners(phase, node);
            });
          } else {
            cleanupEventListeners(phase, node);
          }
        });
        runner.progress(event, phase, data);
      }

      function close(reject) {
        clearGeneratedClasses(element, options);
        applyAnimationClasses(element, options);
        applyAnimationStyles(element, options);
        options.domOperation();
        runner.complete(!reject);
      }
    }

    function closeChildAnimations(node) {
      var children = node.querySelectorAll('[' + NG_ANIMATE_ATTR_NAME + ']');
      forEach(children, function(child) {
        var state = parseInt(child.getAttribute(NG_ANIMATE_ATTR_NAME), 10);
        var animationDetails = activeAnimationsLookup.get(child);
        if (animationDetails) {
          switch (state) {
            case RUNNING_STATE:
              animationDetails.runner.end();
              /* falls through */
            case PRE_DIGEST_STATE:
              activeAnimationsLookup.delete(child);
              break;
          }
        }
      });
    }

    function clearElementAnimationState(node) {
      node.removeAttribute(NG_ANIMATE_ATTR_NAME);
      activeAnimationsLookup.delete(node);
    }

    /**
     * This fn returns false if any of the following is true:
     * a) animations on any parent element are disabled, and animations on the element aren't explicitly allowed
     * b) a parent element has an ongoing structural animation, and animateChildren is false
     * c) the element is not a child of the body
     * d) the element is not a child of the $rootElement
     */
    function areAnimationsAllowed(node, parentNode, event) {
      var bodyNode = $document[0].body;
      var rootNode = getDomNode($rootElement);

      var bodyNodeDetected = (node === bodyNode) || node.nodeName === 'HTML';
      var rootNodeDetected = (node === rootNode);
      var parentAnimationDetected = false;
      var elementDisabled = disabledElementsLookup.get(node);
      var animateChildren;

      var parentHost = jqLite.data(node, NG_ANIMATE_PIN_DATA);
      if (parentHost) {
        parentNode = getDomNode(parentHost);
      }

      while (parentNode) {
        if (!rootNodeDetected) {
          // AngularJS doesn't want to attempt to animate elements outside of the application
          // therefore we need to ensure that the rootElement is an ancestor of the current element
          rootNodeDetected = (parentNode === rootNode);
        }

        if (parentNode.nodeType !== ELEMENT_NODE) {
          // no point in inspecting the #document element
          break;
        }

        var details = activeAnimationsLookup.get(parentNode) || {};
        // either an enter, leave or move animation will commence
        // therefore we can't allow any animations to take place
        // but if a parent animation is class-based then that's ok
        if (!parentAnimationDetected) {
          var parentNodeDisabled = disabledElementsLookup.get(parentNode);

          if (parentNodeDisabled === true && elementDisabled !== false) {
            // disable animations if the user hasn't explicitly enabled animations on the
            // current element
            elementDisabled = true;
            // element is disabled via parent element, no need to check anything else
            break;
          } else if (parentNodeDisabled === false) {
            elementDisabled = false;
          }
          parentAnimationDetected = details.structural;
        }

        if (isUndefined(animateChildren) || animateChildren === true) {
          var value = jqLite.data(parentNode, NG_ANIMATE_CHILDREN_DATA);
          if (isDefined(value)) {
            animateChildren = value;
          }
        }

        // there is no need to continue traversing at this point
        if (parentAnimationDetected && animateChildren === false) break;

        if (!bodyNodeDetected) {
          // we also need to ensure that the element is or will be a part of the body element
          // otherwise it is pointless to even issue an animation to be rendered
          bodyNodeDetected = (parentNode === bodyNode);
        }

        if (bodyNodeDetected && rootNodeDetected) {
          // If both body and root have been found, any other checks are pointless,
          // as no animation data should live outside the application
          break;
        }

        if (!rootNodeDetected) {
          // If `rootNode` is not detected, check if `parentNode` is pinned to another element
          parentHost = jqLite.data(parentNode, NG_ANIMATE_PIN_DATA);
          if (parentHost) {
            // The pin target element becomes the next parent element
            parentNode = getDomNode(parentHost);
            continue;
          }
        }

        parentNode = parentNode.parentNode;
      }

      var allowAnimation = (!parentAnimationDetected || animateChildren) && elementDisabled !== true;
      return allowAnimation && rootNodeDetected && bodyNodeDetected;
    }

    function markElementAnimationState(node, state, details) {
      details = details || {};
      details.state = state;

      node.setAttribute(NG_ANIMATE_ATTR_NAME, state);

      var oldValue = activeAnimationsLookup.get(node);
      var newValue = oldValue
          ? extend(oldValue, details)
          : details;
      activeAnimationsLookup.set(node, newValue);
    }
  }];
}];

/* exported $$AnimationProvider */

var $$AnimationProvider = ['$animateProvider', /** @this */ function($animateProvider) {
  var NG_ANIMATE_REF_ATTR = 'ng-animate-ref';

  var drivers = this.drivers = [];

  var RUNNER_STORAGE_KEY = '$$animationRunner';

  function setRunner(element, runner) {
    element.data(RUNNER_STORAGE_KEY, runner);
  }

  function removeRunner(element) {
    element.removeData(RUNNER_STORAGE_KEY);
  }

  function getRunner(element) {
    return element.data(RUNNER_STORAGE_KEY);
  }

  this.$get = ['$$jqLite', '$rootScope', '$injector', '$$AnimateRunner', '$$Map', '$$rAFScheduler',
       function($$jqLite,   $rootScope,   $injector,   $$AnimateRunner,   $$Map,   $$rAFScheduler) {

    var animationQueue = [];
    var applyAnimationClasses = applyAnimationClassesFactory($$jqLite);

    function sortAnimations(animations) {
      var tree = { children: [] };
      var i, lookup = new $$Map();

      // this is done first beforehand so that the map
      // is filled with a list of the elements that will be animated
      for (i = 0; i < animations.length; i++) {
        var animation = animations[i];
        lookup.set(animation.domNode, animations[i] = {
          domNode: animation.domNode,
          fn: animation.fn,
          children: []
        });
      }

      for (i = 0; i < animations.length; i++) {
        processNode(animations[i]);
      }

      return flatten(tree);

      function processNode(entry) {
        if (entry.processed) return entry;
        entry.processed = true;

        var elementNode = entry.domNode;
        var parentNode = elementNode.parentNode;
        lookup.set(elementNode, entry);

        var parentEntry;
        while (parentNode) {
          parentEntry = lookup.get(parentNode);
          if (parentEntry) {
            if (!parentEntry.processed) {
              parentEntry = processNode(parentEntry);
            }
            break;
          }
          parentNode = parentNode.parentNode;
        }

        (parentEntry || tree).children.push(entry);
        return entry;
      }

      function flatten(tree) {
        var result = [];
        var queue = [];
        var i;

        for (i = 0; i < tree.children.length; i++) {
          queue.push(tree.children[i]);
        }

        var remainingLevelEntries = queue.length;
        var nextLevelEntries = 0;
        var row = [];

        for (i = 0; i < queue.length; i++) {
          var entry = queue[i];
          if (remainingLevelEntries <= 0) {
            remainingLevelEntries = nextLevelEntries;
            nextLevelEntries = 0;
            result.push(row);
            row = [];
          }
          row.push(entry.fn);
          entry.children.forEach(function(childEntry) {
            nextLevelEntries++;
            queue.push(childEntry);
          });
          remainingLevelEntries--;
        }

        if (row.length) {
          result.push(row);
        }

        return result;
      }
    }

    // TODO(matsko): document the signature in a better way
    return function(element, event, options) {
      options = prepareAnimationOptions(options);
      var isStructural = ['enter', 'move', 'leave'].indexOf(event) >= 0;

      // there is no animation at the current moment, however
      // these runner methods will get later updated with the
      // methods leading into the driver's end/cancel methods
      // for now they just stop the animation from starting
      var runner = new $$AnimateRunner({
        end: function() { close(); },
        cancel: function() { close(true); }
      });

      if (!drivers.length) {
        close();
        return runner;
      }

      setRunner(element, runner);

      var classes = mergeClasses(element.attr('class'), mergeClasses(options.addClass, options.removeClass));
      var tempClasses = options.tempClasses;
      if (tempClasses) {
        classes += ' ' + tempClasses;
        options.tempClasses = null;
      }

      var prepareClassName;
      if (isStructural) {
        prepareClassName = 'ng-' + event + PREPARE_CLASS_SUFFIX;
        $$jqLite.addClass(element, prepareClassName);
      }

      animationQueue.push({
        // this data is used by the postDigest code and passed into
        // the driver step function
        element: element,
        classes: classes,
        event: event,
        structural: isStructural,
        options: options,
        beforeStart: beforeStart,
        close: close
      });

      element.on('$destroy', handleDestroyedElement);

      // we only want there to be one function called within the post digest
      // block. This way we can group animations for all the animations that
      // were apart of the same postDigest flush call.
      if (animationQueue.length > 1) return runner;

      $rootScope.$$postDigest(function() {
        var animations = [];
        forEach(animationQueue, function(entry) {
          // the element was destroyed early on which removed the runner
          // form its storage. This means we can't animate this element
          // at all and it already has been closed due to destruction.
          if (getRunner(entry.element)) {
            animations.push(entry);
          } else {
            entry.close();
          }
        });

        // now any future animations will be in another postDigest
        animationQueue.length = 0;

        var groupedAnimations = groupAnimations(animations);
        var toBeSortedAnimations = [];

        forEach(groupedAnimations, function(animationEntry) {
          toBeSortedAnimations.push({
            domNode: getDomNode(animationEntry.from ? animationEntry.from.element : animationEntry.element),
            fn: function triggerAnimationStart() {
              // it's important that we apply the `ng-animate` CSS class and the
              // temporary classes before we do any driver invoking since these
              // CSS classes may be required for proper CSS detection.
              animationEntry.beforeStart();

              var startAnimationFn, closeFn = animationEntry.close;

              // in the event that the element was removed before the digest runs or
              // during the RAF sequencing then we should not trigger the animation.
              var targetElement = animationEntry.anchors
                  ? (animationEntry.from.element || animationEntry.to.element)
                  : animationEntry.element;

              if (getRunner(targetElement)) {
                var operation = invokeFirstDriver(animationEntry);
                if (operation) {
                  startAnimationFn = operation.start;
                }
              }

              if (!startAnimationFn) {
                closeFn();
              } else {
                var animationRunner = startAnimationFn();
                animationRunner.done(function(status) {
                  closeFn(!status);
                });
                updateAnimationRunners(animationEntry, animationRunner);
              }
            }
          });
        });

        // we need to sort each of the animations in order of parent to child
        // relationships. This ensures that the child classes are applied at the
        // right time.
        $$rAFScheduler(sortAnimations(toBeSortedAnimations));
      });

      return runner;

      // TODO(matsko): change to reference nodes
      function getAnchorNodes(node) {
        var SELECTOR = '[' + NG_ANIMATE_REF_ATTR + ']';
        var items = node.hasAttribute(NG_ANIMATE_REF_ATTR)
              ? [node]
              : node.querySelectorAll(SELECTOR);
        var anchors = [];
        forEach(items, function(node) {
          var attr = node.getAttribute(NG_ANIMATE_REF_ATTR);
          if (attr && attr.length) {
            anchors.push(node);
          }
        });
        return anchors;
      }

      function groupAnimations(animations) {
        var preparedAnimations = [];
        var refLookup = {};
        forEach(animations, function(animation, index) {
          var element = animation.element;
          var node = getDomNode(element);
          var event = animation.event;
          var enterOrMove = ['enter', 'move'].indexOf(event) >= 0;
          var anchorNodes = animation.structural ? getAnchorNodes(node) : [];

          if (anchorNodes.length) {
            var direction = enterOrMove ? 'to' : 'from';

            forEach(anchorNodes, function(anchor) {
              var key = anchor.getAttribute(NG_ANIMATE_REF_ATTR);
              refLookup[key] = refLookup[key] || {};
              refLookup[key][direction] = {
                animationID: index,
                element: jqLite(anchor)
              };
            });
          } else {
            preparedAnimations.push(animation);
          }
        });

        var usedIndicesLookup = {};
        var anchorGroups = {};
        forEach(refLookup, function(operations, key) {
          var from = operations.from;
          var to = operations.to;

          if (!from || !to) {
            // only one of these is set therefore we can't have an
            // anchor animation since all three pieces are required
            var index = from ? from.animationID : to.animationID;
            var indexKey = index.toString();
            if (!usedIndicesLookup[indexKey]) {
              usedIndicesLookup[indexKey] = true;
              preparedAnimations.push(animations[index]);
            }
            return;
          }

          var fromAnimation = animations[from.animationID];
          var toAnimation = animations[to.animationID];
          var lookupKey = from.animationID.toString();
          if (!anchorGroups[lookupKey]) {
            var group = anchorGroups[lookupKey] = {
              structural: true,
              beforeStart: function() {
                fromAnimation.beforeStart();
                toAnimation.beforeStart();
              },
              close: function() {
                fromAnimation.close();
                toAnimation.close();
              },
              classes: cssClassesIntersection(fromAnimation.classes, toAnimation.classes),
              from: fromAnimation,
              to: toAnimation,
              anchors: [] // TODO(matsko): change to reference nodes
            };

            // the anchor animations require that the from and to elements both have at least
            // one shared CSS class which effectively marries the two elements together to use
            // the same animation driver and to properly sequence the anchor animation.
            if (group.classes.length) {
              preparedAnimations.push(group);
            } else {
              preparedAnimations.push(fromAnimation);
              preparedAnimations.push(toAnimation);
            }
          }

          anchorGroups[lookupKey].anchors.push({
            'out': from.element, 'in': to.element
          });
        });

        return preparedAnimations;
      }

      function cssClassesIntersection(a,b) {
        a = a.split(' ');
        b = b.split(' ');
        var matches = [];

        for (var i = 0; i < a.length; i++) {
          var aa = a[i];
          if (aa.substring(0,3) === 'ng-') continue;

          for (var j = 0; j < b.length; j++) {
            if (aa === b[j]) {
              matches.push(aa);
              break;
            }
          }
        }

        return matches.join(' ');
      }

      function invokeFirstDriver(animationDetails) {
        // we loop in reverse order since the more general drivers (like CSS and JS)
        // may attempt more elements, but custom drivers are more particular
        for (var i = drivers.length - 1; i >= 0; i--) {
          var driverName = drivers[i];
          var factory = $injector.get(driverName);
          var driver = factory(animationDetails);
          if (driver) {
            return driver;
          }
        }
      }

      function beforeStart() {
        element.addClass(NG_ANIMATE_CLASSNAME);
        if (tempClasses) {
          $$jqLite.addClass(element, tempClasses);
        }
        if (prepareClassName) {
          $$jqLite.removeClass(element, prepareClassName);
          prepareClassName = null;
        }
      }

      function updateAnimationRunners(animation, newRunner) {
        if (animation.from && animation.to) {
          update(animation.from.element);
          update(animation.to.element);
        } else {
          update(animation.element);
        }

        function update(element) {
          var runner = getRunner(element);
          if (runner) runner.setHost(newRunner);
        }
      }

      function handleDestroyedElement() {
        var runner = getRunner(element);
        if (runner && (event !== 'leave' || !options.$$domOperationFired)) {
          runner.end();
        }
      }

      function close(rejected) {
        element.off('$destroy', handleDestroyedElement);
        removeRunner(element);

        applyAnimationClasses(element, options);
        applyAnimationStyles(element, options);
        options.domOperation();

        if (tempClasses) {
          $$jqLite.removeClass(element, tempClasses);
        }

        element.removeClass(NG_ANIMATE_CLASSNAME);
        runner.complete(!rejected);
      }
    };
  }];
}];

/**
 * @ngdoc directive
 * @name ngAnimateSwap
 * @restrict A
 * @scope
 *
 * @description
 *
 * ngAnimateSwap is a animation-oriented directive that allows for the container to
 * be removed and entered in whenever the associated expression changes. A
 * common usecase for this directive is a rotating banner or slider component which
 * contains one image being present at a time. When the active image changes
 * then the old image will perform a `leave` animation and the new element
 * will be inserted via an `enter` animation.
 *
 * @animations
 * | Animation                        | Occurs                               |
 * |----------------------------------|--------------------------------------|
 * | {@link ng.$animate#enter enter}  | when the new element is inserted to the DOM  |
 * | {@link ng.$animate#leave leave}  | when the old element is removed from the DOM |
 *
 * @example
 * <example name="ngAnimateSwap-directive" module="ngAnimateSwapExample"
 *          deps="angular-animate.js"
 *          animations="true" fixBase="true">
 *   <file name="index.html">
 *     <div class="container" ng-controller="AppCtrl">
 *       <div ng-animate-swap="number" class="cell swap-animation" ng-class="colorClass(number)">
 *         {{ number }}
 *       </div>
 *     </div>
 *   </file>
 *   <file name="script.js">
 *     angular.module('ngAnimateSwapExample', ['ngAnimate'])
 *       .controller('AppCtrl', ['$scope', '$interval', function($scope, $interval) {
 *         $scope.number = 0;
 *         $interval(function() {
 *           $scope.number++;
 *         }, 1000);
 *
 *         var colors = ['red','blue','green','yellow','orange'];
 *         $scope.colorClass = function(number) {
 *           return colors[number % colors.length];
 *         };
 *       }]);
 *   </file>
 *  <file name="animations.css">
 *  .container {
 *    height:250px;
 *    width:250px;
 *    position:relative;
 *    overflow:hidden;
 *    border:2px solid black;
 *  }
 *  .container .cell {
 *    font-size:150px;
 *    text-align:center;
 *    line-height:250px;
 *    position:absolute;
 *    top:0;
 *    left:0;
 *    right:0;
 *    border-bottom:2px solid black;
 *  }
 *  .swap-animation.ng-enter, .swap-animation.ng-leave {
 *    transition:0.5s linear all;
 *  }
 *  .swap-animation.ng-enter {
 *    top:-250px;
 *  }
 *  .swap-animation.ng-enter-active {
 *    top:0px;
 *  }
 *  .swap-animation.ng-leave {
 *    top:0px;
 *  }
 *  .swap-animation.ng-leave-active {
 *    top:250px;
 *  }
 *  .red { background:red; }
 *  .green { background:green; }
 *  .blue { background:blue; }
 *  .yellow { background:yellow; }
 *  .orange { background:orange; }
 *  </file>
 * </example>
 */
var ngAnimateSwapDirective = ['$animate', function($animate) {
  return {
    restrict: 'A',
    transclude: 'element',
    terminal: true,
    priority: 600, // we use 600 here to ensure that the directive is caught before others
    link: function(scope, $element, attrs, ctrl, $transclude) {
      var previousElement, previousScope;
      scope.$watchCollection(attrs.ngAnimateSwap || attrs['for'], function(value) {
        if (previousElement) {
          $animate.leave(previousElement);
        }
        if (previousScope) {
          previousScope.$destroy();
          previousScope = null;
        }
        if (value || value === 0) {
          $transclude(function(clone, childScope) {
            previousElement = clone;
            previousScope = childScope;
            $animate.enter(clone, null, $element);
          });
        }
      });
    }
  };
}];

/**
 * @ngdoc module
 * @name ngAnimate
 * @description
 *
 * The `ngAnimate` module provides support for CSS-based animations (keyframes and transitions) as well as JavaScript-based animations via
 * callback hooks. Animations are not enabled by default, however, by including `ngAnimate` the animation hooks are enabled for an AngularJS app.
 *
 * ## Usage
 * Simply put, there are two ways to make use of animations when ngAnimate is used: by using **CSS** and **JavaScript**. The former works purely based
 * using CSS (by using matching CSS selectors/styles) and the latter triggers animations that are registered via `module.animation()`. For
 * both CSS and JS animations the sole requirement is to have a matching `CSS class` that exists both in the registered animation and within
 * the HTML element that the animation will be triggered on.
 *
 * ## Directive Support
 * The following directives are "animation aware":
 *
 * | Directive                                                                     | Supported Animations                                                      |
 * |-------------------------------------------------------------------------------|---------------------------------------------------------------------------|
 * | {@link ng.directive:form#animations form / ngForm}                            | add and remove ({@link ng.directive:form#css-classes various classes})    |
 * | {@link ngAnimate.directive:ngAnimateSwap#animations ngAnimateSwap}            | enter and leave                                                           |
 * | {@link ng.directive:ngClass#animations ngClass / {{class&#125;&#8203;&#125;}  | add and remove                                                            |
 * | {@link ng.directive:ngClassEven#animations ngClassEven}                       | add and remove                                                            |
 * | {@link ng.directive:ngClassOdd#animations ngClassOdd}                         | add and remove                                                            |
 * | {@link ng.directive:ngHide#animations ngHide}                                 | add and remove (the `ng-hide` class)                                      |
 * | {@link ng.directive:ngIf#animations ngIf}                                     | enter and leave                                                           |
 * | {@link ng.directive:ngInclude#animations ngInclude}                           | enter and leave                                                           |
 * | {@link module:ngMessages#animations ngMessage / ngMessageExp}                 | enter and leave                                                           |
 * | {@link module:ngMessages#animations ngMessages}                               | add and remove (the `ng-active`/`ng-inactive` classes)                    |
 * | {@link ng.directive:ngModel#animations ngModel}                               | add and remove ({@link ng.directive:ngModel#css-classes various classes}) |
 * | {@link ng.directive:ngRepeat#animations ngRepeat}                             | enter, leave, and move                                                    |
 * | {@link ng.directive:ngShow#animations ngShow}                                 | add and remove (the `ng-hide` class)                                      |
 * | {@link ng.directive:ngSwitch#animations ngSwitch}                             | enter and leave                                                           |
 * | {@link ngRoute.directive:ngView#animations ngView}                            | enter and leave                                                           |
 *
 * (More information can be found by visiting the documentation associated with each directive.)
 *
 * For a full breakdown of the steps involved during each animation event, refer to the
 * {@link ng.$animate `$animate` API docs}.
 *
 * ## CSS-based Animations
 *
 * CSS-based animations with ngAnimate are unique since they require no JavaScript code at all. By using a CSS class that we reference between our HTML
 * and CSS code we can create an animation that will be picked up by AngularJS when an underlying directive performs an operation.
 *
 * The example below shows how an `enter` animation can be made possible on an element using `ng-if`:
 *
 * ```html
 * <div ng-if="bool" class="fade">
 *    Fade me in out
 * </div>
 * <button ng-click="bool=true">Fade In!</button>
 * <button ng-click="bool=false">Fade Out!</button>
 * ```
 *
 * Notice the CSS class **fade**? We can now create the CSS transition code that references this class:
 *
 * ```css
 * /&#42; The starting CSS styles for the enter animation &#42;/
 * .fade.ng-enter {
 *   transition:0.5s linear all;
 *   opacity:0;
 * }
 *
 * /&#42; The finishing CSS styles for the enter animation &#42;/
 * .fade.ng-enter.ng-enter-active {
 *   opacity:1;
 * }
 * ```
 *
 * The key thing to remember here is that, depending on the animation event (which each of the directives above trigger depending on what's going on) two
 * generated CSS classes will be applied to the element; in the example above we have `.ng-enter` and `.ng-enter-active`. For CSS transitions, the transition
 * code **must** be defined within the starting CSS class (in this case `.ng-enter`). The destination class is what the transition will animate towards.
 *
 * If for example we wanted to create animations for `leave` and `move` (ngRepeat triggers move) then we can do so using the same CSS naming conventions:
 *
 * ```css
 * /&#42; now the element will fade out before it is removed from the DOM &#42;/
 * .fade.ng-leave {
 *   transition:0.5s linear all;
 *   opacity:1;
 * }
 * .fade.ng-leave.ng-leave-active {
 *   opacity:0;
 * }
 * ```
 *
 * We can also make use of **CSS Keyframes** by referencing the keyframe animation within the starting CSS class:
 *
 * ```css
 * /&#42; there is no need to define anything inside of the destination
 * CSS class since the keyframe will take charge of the animation &#42;/
 * .fade.ng-leave {
 *   animation: my_fade_animation 0.5s linear;
 *   -webkit-animation: my_fade_animation 0.5s linear;
 * }
 *
 * @keyframes my_fade_animation {
 *   from { opacity:1; }
 *   to { opacity:0; }
 * }
 *
 * @-webkit-keyframes my_fade_animation {
 *   from { opacity:1; }
 *   to { opacity:0; }
 * }
 * ```
 *
 * Feel free also mix transitions and keyframes together as well as any other CSS classes on the same element.
 *
 * ### CSS Class-based Animations
 *
 * Class-based animations (animations that are triggered via `ngClass`, `ngShow`, `ngHide` and some other directives) have a slightly different
 * naming convention. Class-based animations are basic enough that a standard transition or keyframe can be referenced on the class being added
 * and removed.
 *
 * For example if we wanted to do a CSS animation for `ngHide` then we place an animation on the `.ng-hide` CSS class:
 *
 * ```html
 * <div ng-show="bool" class="fade">
 *   Show and hide me
 * </div>
 * <button ng-click="bool=!bool">Toggle</button>
 *
 * <style>
 * .fade.ng-hide {
 *   transition:0.5s linear all;
 *   opacity:0;
 * }
 * </style>
 * ```
 *
 * All that is going on here with ngShow/ngHide behind the scenes is the `.ng-hide` class is added/removed (when the hidden state is valid). Since
 * ngShow and ngHide are animation aware then we can match up a transition and ngAnimate handles the rest.
 *
 * In addition the addition and removal of the CSS class, ngAnimate also provides two helper methods that we can use to further decorate the animation
 * with CSS styles.
 *
 * ```html
 * <div ng-class="{on:onOff}" class="highlight">
 *   Highlight this box
 * </div>
 * <button ng-click="onOff=!onOff">Toggle</button>
 *
 * <style>
 * .highlight {
 *   transition:0.5s linear all;
 * }
 * .highlight.on-add {
 *   background:white;
 * }
 * .highlight.on {
 *   background:yellow;
 * }
 * .highlight.on-remove {
 *   background:black;
 * }
 * </style>
 * ```
 *
 * We can also make use of CSS keyframes by placing them within the CSS classes.
 *
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
 *   transition: 1s linear all;
 *   opacity:0;
 * }
 * .my-animation.ng-enter-stagger {
 *   /&#42; this will have a 100ms delay between each successive leave animation &#42;/
 *   transition-delay: 0.1s;
 *
 *   /&#42; As of 1.4.4, this must always be set: it signals ngAnimate
 *     to not accidentally inherit a delay property from another CSS class &#42;/
 *   transition-duration: 0s;
 *
 *   /&#42; if you are using animations instead of transitions you should configure as follows:
 *     animation-delay: 0.1s;
 *     animation-duration: 0s; &#42;/
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
 * will also be reset if one or more animation frames have passed since the multiple calls to `$animate` were fired.
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
 * window.requestAnimationFrame(function() {
 *   //stagger has reset itself
 *   $animate.leave(kids[5]); //stagger index=0
 *   $animate.leave(kids[6]); //stagger index=1
 *
 *   $scope.$digest();
 * });
 * ```
 *
 * Stagger animations are currently only supported within CSS-defined animations.
 *
 * ### The `ng-animate` CSS class
 *
 * When ngAnimate is animating an element it will apply the `ng-animate` CSS class to the element for the duration of the animation.
 * This is a temporary CSS class and it will be removed once the animation is over (for both JavaScript and CSS-based animations).
 *
 * Therefore, animations can be applied to an element using this temporary class directly via CSS.
 *
 * ```css
 * .zipper.ng-animate {
 *   transition:0.5s linear all;
 * }
 * .zipper.ng-enter {
 *   opacity:0;
 * }
 * .zipper.ng-enter.ng-enter-active {
 *   opacity:1;
 * }
 * .zipper.ng-leave {
 *   opacity:1;
 * }
 * .zipper.ng-leave.ng-leave-active {
 *   opacity:0;
 * }
 * ```
 *
 * (Note that the `ng-animate` CSS class is reserved and it cannot be applied on an element directly since ngAnimate will always remove
 * the CSS class once an animation has completed.)
 *
 *
 * ### The `ng-[event]-prepare` class
 *
 * This is a special class that can be used to prevent unwanted flickering / flash of content before
 * the actual animation starts. The class is added as soon as an animation is initialized, but removed
 * before the actual animation starts (after waiting for a $digest).
 * It is also only added for *structural* animations (`enter`, `move`, and `leave`).
 *
 * In practice, flickering can appear when nesting elements with structural animations such as `ngIf`
 * into elements that have class-based animations such as `ngClass`.
 *
 * ```html
 * <div ng-class="{red: myProp}">
 *   <div ng-class="{blue: myProp}">
 *     <div class="message" ng-if="myProp"></div>
 *   </div>
 * </div>
 * ```
 *
 * It is possible that during the `enter` animation, the `.message` div will be briefly visible before it starts animating.
 * In that case, you can add styles to the CSS that make sure the element stays hidden before the animation starts:
 *
 * ```css
 * .message.ng-enter-prepare {
 *   opacity: 0;
 * }
 * ```
 *
 * ### Animating between value changes
 *
 * Sometimes you need to animate between different expression states, whose values
 * don't necessary need to be known or referenced in CSS styles.
 * Unless possible with another {@link ngAnimate#directive-support "animation aware" directive},
 * that specific use case can always be covered with {@link ngAnimate.directive:ngAnimateSwap} as
 * can be seen in {@link ngAnimate.directive:ngAnimateSwap#examples this example}.
 *
 * Note that {@link ngAnimate.directive:ngAnimateSwap} is a *structural directive*, which means it
 * creates a new instance of the element (including any other/child directives it may have) and
 * links it to a new scope every time *swap* happens. In some cases this might not be desirable
 * (e.g. for performance reasons, or when you wish to retain internal state on the original
 * element instance).
 *
 * ## JavaScript-based Animations
 *
 * ngAnimate also allows for animations to be consumed by JavaScript code. The approach is similar to CSS-based animations (where there is a shared
 * CSS class that is referenced in our HTML code) but in addition we need to register the JavaScript animation on the module. By making use of the
 * `module.animation()` module function we can register the animation.
 *
 * Let's see an example of a enter/leave animation using `ngRepeat`:
 *
 * ```html
 * <div ng-repeat="item in items" class="slide">
 *   {{ item }}
 * </div>
 * ```
 *
 * See the **slide** CSS class? Let's use that class to define an animation that we'll structure in our module code by using `module.animation`:
 *
 * ```js
 * myModule.animation('.slide', [function() {
 *   return {
 *     // make note that other events (like addClass/removeClass)
 *     // have different function input parameters
 *     enter: function(element, doneFn) {
 *       jQuery(element).fadeIn(1000, doneFn);
 *
 *       // remember to call doneFn so that AngularJS
 *       // knows that the animation has concluded
 *     },
 *
 *     move: function(element, doneFn) {
 *       jQuery(element).fadeIn(1000, doneFn);
 *     },
 *
 *     leave: function(element, doneFn) {
 *       jQuery(element).fadeOut(1000, doneFn);
 *     }
 *   }
 * }]);
 * ```
 *
 * The nice thing about JS-based animations is that we can inject other services and make use of advanced animation libraries such as
 * greensock.js and velocity.js.
 *
 * If our animation code class-based (meaning that something like `ngClass`, `ngHide` and `ngShow` triggers it) then we can still define
 * our animations inside of the same registered animation, however, the function input arguments are a bit different:
 *
 * ```html
 * <div ng-class="color" class="colorful">
 *   this box is moody
 * </div>
 * <button ng-click="color='red'">Change to red</button>
 * <button ng-click="color='blue'">Change to blue</button>
 * <button ng-click="color='green'">Change to green</button>
 * ```
 *
 * ```js
 * myModule.animation('.colorful', [function() {
 *   return {
 *     addClass: function(element, className, doneFn) {
 *       // do some cool animation and call the doneFn
 *     },
 *     removeClass: function(element, className, doneFn) {
 *       // do some cool animation and call the doneFn
 *     },
 *     setClass: function(element, addedClass, removedClass, doneFn) {
 *       // do some cool animation and call the doneFn
 *     }
 *   }
 * }]);
 * ```
 *
 * ## CSS + JS Animations Together
 *
 * AngularJS 1.4 and higher has taken steps to make the amalgamation of CSS and JS animations more flexible. However, unlike earlier versions of AngularJS,
 * defining CSS and JS animations to work off of the same CSS class will not work anymore. Therefore the example below will only result in **JS animations taking
 * charge of the animation**:
 *
 * ```html
 * <div ng-if="bool" class="slide">
 *   Slide in and out
 * </div>
 * ```
 *
 * ```js
 * myModule.animation('.slide', [function() {
 *   return {
 *     enter: function(element, doneFn) {
 *       jQuery(element).slideIn(1000, doneFn);
 *     }
 *   }
 * }]);
 * ```
 *
 * ```css
 * .slide.ng-enter {
 *   transition:0.5s linear all;
 *   transform:translateY(-100px);
 * }
 * .slide.ng-enter.ng-enter-active {
 *   transform:translateY(0);
 * }
 * ```
 *
 * Does this mean that CSS and JS animations cannot be used together? Do JS-based animations always have higher priority? We can make up for the
 * lack of CSS animations by using the `$animateCss` service to trigger our own tweaked-out, CSS-based animations directly from
 * our own JS-based animation code:
 *
 * ```js
 * myModule.animation('.slide', ['$animateCss', function($animateCss) {
 *   return {
 *     enter: function(element) {
*        // this will trigger `.slide.ng-enter` and `.slide.ng-enter-active`.
 *       return $animateCss(element, {
 *         event: 'enter',
 *         structural: true
 *       });
 *     }
 *   }
 * }]);
 * ```
 *
 * The nice thing here is that we can save bandwidth by sticking to our CSS-based animation code and we don't need to rely on a 3rd-party animation framework.
 *
 * The `$animateCss` service is very powerful since we can feed in all kinds of extra properties that will be evaluated and fed into a CSS transition or
 * keyframe animation. For example if we wanted to animate the height of an element while adding and removing classes then we can do so by providing that
 * data into `$animateCss` directly:
 *
 * ```js
 * myModule.animation('.slide', ['$animateCss', function($animateCss) {
 *   return {
 *     enter: function(element) {
 *       return $animateCss(element, {
 *         event: 'enter',
 *         structural: true,
 *         addClass: 'maroon-setting',
 *         from: { height:0 },
 *         to: { height: 200 }
 *       });
 *     }
 *   }
 * }]);
 * ```
 *
 * Now we can fill in the rest via our transition CSS code:
 *
 * ```css
 * /&#42; the transition tells ngAnimate to make the animation happen &#42;/
 * .slide.ng-enter { transition:0.5s linear all; }
 *
 * /&#42; this extra CSS class will be absorbed into the transition
 * since the $animateCss code is adding the class &#42;/
 * .maroon-setting { background:red; }
 * ```
 *
 * And `$animateCss` will figure out the rest. Just make sure to have the `done()` callback fire the `doneFn` function to signal when the animation is over.
 *
 * To learn more about what's possible be sure to visit the {@link ngAnimate.$animateCss $animateCss service}.
 *
 * ## Animation Anchoring (via `ng-animate-ref`)
 *
 * ngAnimate in AngularJS 1.4 comes packed with the ability to cross-animate elements between
 * structural areas of an application (like views) by pairing up elements using an attribute
 * called `ng-animate-ref`.
 *
 * Let's say for example we have two views that are managed by `ng-view` and we want to show
 * that there is a relationship between two components situated in within these views. By using the
 * `ng-animate-ref` attribute we can identify that the two components are paired together and we
 * can then attach an animation, which is triggered when the view changes.
 *
 * Say for example we have the following template code:
 *
 * ```html
 * <!-- index.html -->
 * <div ng-view class="view-animation">
 * </div>
 *
 * <!-- home.html -->
 * <a href="#/banner-page">
 *   <img src="./banner.jpg" class="banner" ng-animate-ref="banner">
 * </a>
 *
 * <!-- banner-page.html -->
 * <img src="./banner.jpg" class="banner" ng-animate-ref="banner">
 * ```
 *
 * Now, when the view changes (once the link is clicked), ngAnimate will examine the
 * HTML contents to see if there is a match reference between any components in the view
 * that is leaving and the view that is entering. It will scan both the view which is being
 * removed (leave) and inserted (enter) to see if there are any paired DOM elements that
 * contain a matching ref value.
 *
 * The two images match since they share the same ref value. ngAnimate will now create a
 * transport element (which is a clone of the first image element) and it will then attempt
 * to animate to the position of the second image element in the next view. For the animation to
 * work a special CSS class called `ng-anchor` will be added to the transported element.
 *
 * We can now attach a transition onto the `.banner.ng-anchor` CSS class and then
 * ngAnimate will handle the entire transition for us as well as the addition and removal of
 * any changes of CSS classes between the elements:
 *
 * ```css
 * .banner.ng-anchor {
 *   /&#42; this animation will last for 1 second since there are
 *          two phases to the animation (an `in` and an `out` phase) &#42;/
 *   transition:0.5s linear all;
 * }
 * ```
 *
 * We also **must** include animations for the views that are being entered and removed
 * (otherwise anchoring wouldn't be possible since the new view would be inserted right away).
 *
 * ```css
 * .view-animation.ng-enter, .view-animation.ng-leave {
 *   transition:0.5s linear all;
 *   position:fixed;
 *   left:0;
 *   top:0;
 *   width:100%;
 * }
 * .view-animation.ng-enter {
 *   transform:translateX(100%);
 * }
 * .view-animation.ng-leave,
 * .view-animation.ng-enter.ng-enter-active {
 *   transform:translateX(0%);
 * }
 * .view-animation.ng-leave.ng-leave-active {
 *   transform:translateX(-100%);
 * }
 * ```
 *
 * Now we can jump back to the anchor animation. When the animation happens, there are two stages that occur:
 * an `out` and an `in` stage. The `out` stage happens first and that is when the element is animated away
 * from its origin. Once that animation is over then the `in` stage occurs which animates the
 * element to its destination. The reason why there are two animations is to give enough time
 * for the enter animation on the new element to be ready.
 *
 * The example above sets up a transition for both the in and out phases, but we can also target the out or
 * in phases directly via `ng-anchor-out` and `ng-anchor-in`.
 *
 * ```css
 * .banner.ng-anchor-out {
 *   transition: 0.5s linear all;
 *
 *   /&#42; the scale will be applied during the out animation,
 *          but will be animated away when the in animation runs &#42;/
 *   transform: scale(1.2);
 * }
 *
 * .banner.ng-anchor-in {
 *   transition: 1s linear all;
 * }
 * ```
 *
 *
 *
 *
 * ### Anchoring Demo
 *
  <example module="anchoringExample"
           name="anchoringExample"
           id="anchoringExample"
           deps="angular-animate.js;angular-route.js"
           animations="true">
    <file name="index.html">
      <a href="#!/">Home</a>
      <hr />
      <div class="view-container">
        <div ng-view class="view"></div>
      </div>
    </file>
    <file name="script.js">
      angular.module('anchoringExample', ['ngAnimate', 'ngRoute'])
        .config(['$routeProvider', function($routeProvider) {
          $routeProvider.when('/', {
            templateUrl: 'home.html',
            controller: 'HomeController as home'
          });
          $routeProvider.when('/profile/:id', {
            templateUrl: 'profile.html',
            controller: 'ProfileController as profile'
          });
        }])
        .run(['$rootScope', function($rootScope) {
          $rootScope.records = [
            { id: 1, title: 'Miss Beulah Roob' },
            { id: 2, title: 'Trent Morissette' },
            { id: 3, title: 'Miss Ava Pouros' },
            { id: 4, title: 'Rod Pouros' },
            { id: 5, title: 'Abdul Rice' },
            { id: 6, title: 'Laurie Rutherford Sr.' },
            { id: 7, title: 'Nakia McLaughlin' },
            { id: 8, title: 'Jordon Blanda DVM' },
            { id: 9, title: 'Rhoda Hand' },
            { id: 10, title: 'Alexandrea Sauer' }
          ];
        }])
        .controller('HomeController', [function() {
          //empty
        }])
        .controller('ProfileController', ['$rootScope', '$routeParams',
            function ProfileController($rootScope, $routeParams) {
          var index = parseInt($routeParams.id, 10);
          var record = $rootScope.records[index - 1];

          this.title = record.title;
          this.id = record.id;
        }]);
    </file>
    <file name="home.html">
      <h2>Welcome to the home page</h1>
      <p>Please click on an element</p>
      <a class="record"
         ng-href="#!/profile/{{ record.id }}"
         ng-animate-ref="{{ record.id }}"
         ng-repeat="record in records">
        {{ record.title }}
      </a>
    </file>
    <file name="profile.html">
      <div class="profile record" ng-animate-ref="{{ profile.id }}">
        {{ profile.title }}
      </div>
    </file>
    <file name="animations.css">
      .record {
        display:block;
        font-size:20px;
      }
      .profile {
        background:black;
        color:white;
        font-size:100px;
      }
      .view-container {
        position:relative;
      }
      .view-container > .view.ng-animate {
        position:absolute;
        top:0;
        left:0;
        width:100%;
        min-height:500px;
      }
      .view.ng-enter, .view.ng-leave,
      .record.ng-anchor {
        transition:0.5s linear all;
      }
      .view.ng-enter {
        transform:translateX(100%);
      }
      .view.ng-enter.ng-enter-active, .view.ng-leave {
        transform:translateX(0%);
      }
      .view.ng-leave.ng-leave-active {
        transform:translateX(-100%);
      }
      .record.ng-anchor-out {
        background:red;
      }
    </file>
  </example>
 *
 * ### How is the element transported?
 *
 * When an anchor animation occurs, ngAnimate will clone the starting element and position it exactly where the starting
 * element is located on screen via absolute positioning. The cloned element will be placed inside of the root element
 * of the application (where ng-app was defined) and all of the CSS classes of the starting element will be applied. The
 * element will then animate into the `out` and `in` animations and will eventually reach the coordinates and match
 * the dimensions of the destination element. During the entire animation a CSS class of `.ng-animate-shim` will be applied
 * to both the starting and destination elements in order to hide them from being visible (the CSS styling for the class
 * is: `visibility:hidden`). Once the anchor reaches its destination then it will be removed and the destination element
 * will become visible since the shim class will be removed.
 *
 * ### How is the morphing handled?
 *
 * CSS Anchoring relies on transitions and keyframes and the internal code is intelligent enough to figure out
 * what CSS classes differ between the starting element and the destination element. These different CSS classes
 * will be added/removed on the anchor element and a transition will be applied (the transition that is provided
 * in the anchor class). Long story short, ngAnimate will figure out what classes to add and remove which will
 * make the transition of the element as smooth and automatic as possible. Be sure to use simple CSS classes that
 * do not rely on DOM nesting structure so that the anchor element appears the same as the starting element (since
 * the cloned element is placed inside of root element which is likely close to the body element).
 *
 * Note that if the root element is on the `<html>` element then the cloned node will be placed inside of body.
 *
 *
 * ## Using $animate in your directive code
 *
 * So far we've explored how to feed in animations into an AngularJS application, but how do we trigger animations within our own directives in our application?
 * By injecting the `$animate` service into our directive code, we can trigger structural and class-based hooks which can then be consumed by animations. Let's
 * imagine we have a greeting box that shows and hides itself when the data changes
 *
 * ```html
 * <greeting-box active="onOrOff">Hi there</greeting-box>
 * ```
 *
 * ```js
 * ngModule.directive('greetingBox', ['$animate', function($animate) {
 *   return function(scope, element, attrs) {
 *     attrs.$observe('active', function(value) {
 *       value ? $animate.addClass(element, 'on') : $animate.removeClass(element, 'on');
 *     });
 *   });
 * }]);
 * ```
 *
 * Now the `on` CSS class is added and removed on the greeting box component. Now if we add a CSS class on top of the greeting box element
 * in our HTML code then we can trigger a CSS or JS animation to happen.
 *
 * ```css
 * /&#42; normally we would create a CSS class to reference on the element &#42;/
 * greeting-box.on { transition:0.5s linear all; background:green; color:white; }
 * ```
 *
 * The `$animate` service contains a variety of other methods like `enter`, `leave`, `animate` and `setClass`. To learn more about what's
 * possible be sure to visit the {@link ng.$animate $animate service API page}.
 *
 *
 * ## Callbacks and Promises
 *
 * When `$animate` is called it returns a promise that can be used to capture when the animation has ended. Therefore if we were to trigger
 * an animation (within our directive code) then we can continue performing directive and scope related activities after the animation has
 * ended by chaining onto the returned promise that animation method returns.
 *
 * ```js
 * // somewhere within the depths of the directive
 * $animate.enter(element, parent).then(function() {
 *   //the animation has completed
 * });
 * ```
 *
 * (Note that earlier versions of AngularJS prior to v1.4 required the promise code to be wrapped using `$scope.$apply(...)`. This is not the case
 * anymore.)
 *
 * In addition to the animation promise, we can also make use of animation-related callbacks within our directives and controller code by registering
 * an event listener using the `$animate` service. Let's say for example that an animation was triggered on our view
 * routing controller to hook into that:
 *
 * ```js
 * ngModule.controller('HomePageController', ['$animate', function($animate) {
 *   $animate.on('enter', ngViewElement, function(element) {
 *     // the animation for this route has completed
 *   }]);
 * }])
 * ```
 *
 * (Note that you will need to trigger a digest within the callback to get AngularJS to notice any scope-related changes.)
 */

var copy;
var extend;
var forEach;
var isArray;
var isDefined;
var isElement;
var isFunction;
var isObject;
var isString;
var isUndefined;
var jqLite;
var noop;

/**
 * @ngdoc service
 * @name $animate
 * @kind object
 *
 * @description
 * The ngAnimate `$animate` service documentation is the same for the core `$animate` service.
 *
 * Click here {@link ng.$animate to learn more about animations with `$animate`}.
 */
angular.module('ngAnimate', [], function initAngularHelpers() {
  // Access helpers from AngularJS core.
  // Do it inside a `config` block to ensure `window.angular` is available.
  noop        = angular.noop;
  copy        = angular.copy;
  extend      = angular.extend;
  jqLite      = angular.element;
  forEach     = angular.forEach;
  isArray     = angular.isArray;
  isString    = angular.isString;
  isObject    = angular.isObject;
  isUndefined = angular.isUndefined;
  isDefined   = angular.isDefined;
  isFunction  = angular.isFunction;
  isElement   = angular.isElement;
})
  .info({ angularVersion: '1.7.2' })
  .directive('ngAnimateSwap', ngAnimateSwapDirective)

  .directive('ngAnimateChildren', $$AnimateChildrenDirective)
  .factory('$$rAFScheduler', $$rAFSchedulerFactory)

  .provider('$$animateQueue', $$AnimateQueueProvider)
  .provider('$$animation', $$AnimationProvider)

  .provider('$animateCss', $AnimateCssProvider)
  .provider('$$animateCssDriver', $$AnimateCssDriverProvider)

  .provider('$$animateJs', $$AnimateJsProvider)
  .provider('$$animateJsDriver', $$AnimateJsDriverProvider);


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
 * @license AngularJS v1.3.20
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

function nodeName_(element) {
  return angular.lowercase(element.nodeName || (element[0] && element[0].nodeName));
}

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
    var originalEvent = event.originalEvent || event;
    var touches = originalEvent.touches && originalEvent.touches.length ? originalEvent.touches : [originalEvent];
    var e = (originalEvent.changedTouches && originalEvent.changedTouches[0]) || touches[0];

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

/* global ngTouch: false,
  nodeName_: false
*/

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
    if (nodeName_(event.target) === 'label') {
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
    event.target && event.target.blur && event.target.blur();
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

      // Use jQuery originalEvent
      var originalEvent = event.originalEvent || event;
      var touches = originalEvent.touches && originalEvent.touches.length ? originalEvent.touches : [originalEvent];
      var e = touches[0];
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

      // Use jQuery originalEvent
      var originalEvent = event.originalEvent || event;
      var touches = (originalEvent.changedTouches && originalEvent.changedTouches.length) ?
          originalEvent.changedTouches :
          ((originalEvent.touches && originalEvent.touches.length) ? originalEvent.touches : [originalEvent]);
      var e = touches[0];
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

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.angularCreditCards = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
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

},{}],2:[function(_dereq_,module,exports){
var sentence = _dereq_('sentence-case');

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

},{"sentence-case":3}],3:[function(_dereq_,module,exports){
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

},{}],4:[function(_dereq_,module,exports){
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

},{}],5:[function(_dereq_,module,exports){
'use strict';

exports.types = _dereq_('./types');

},{"./types":7}],6:[function(_dereq_,module,exports){
'use strict';

var extend = _dereq_('xtend/mutable');

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

},{"xtend/mutable":4}],7:[function(_dereq_,module,exports){
'use strict';

var Type = _dereq_('./type');

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

},{"./type":6}],8:[function(_dereq_,module,exports){
'use strict'

module.exports = (function (array) {
  return function luhn (number) {
    if (!number) return false
    var length = number.length
    var bit = 1
    var sum = 0
    var value

    while (length) {
      value = parseInt(number.charAt(--length), 10)
      sum += (bit ^= 1) ? array[value] : value
    }

    return !!sum && sum % 10 === 0
  }
}([0, 2, 4, 6, 8, 1, 3, 5, 7, 9]))

},{}],9:[function(_dereq_,module,exports){
'use strict'

var camel = _dereq_('camel-case')
var luhn = _dereq_('fast-luhn')

exports.types = _dereq_('creditcards-types').types

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

},{"camel-case":2,"creditcards-types":5,"fast-luhn":8}],10:[function(_dereq_,module,exports){
'use strict'

var camel = _dereq_('camel-case')
var card = _dereq_('./card')

var cvcRegex = /^\d{3,4}$/

exports.isValid = function (cvc, type) {
  if (typeof cvc !== 'string') return false
  if (!cvcRegex.test(cvc)) return false
  if (!type) return true
  return card.types[camel(type)].cvcLength === cvc.length
}

},{"./card":9,"camel-case":2}],11:[function(_dereq_,module,exports){
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

},{}],12:[function(_dereq_,module,exports){
'use strict'

var card = exports.card = _dereq_('./card')
var cvc = exports.cvc = _dereq_('./cvc')
var expiration = exports.expiration = _dereq_('./expiration')

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

},{"./card":9,"./cvc":10,"./expiration":11}],13:[function(_dereq_,module,exports){
var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var slice = Array.prototype.slice;
var toStr = Object.prototype.toString;
var funcType = '[object Function]';

module.exports = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr.call(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slice.call(arguments, 1);

    var binder = function () {
        if (this instanceof bound) {
            var result = target.apply(
                this,
                args.concat(slice.call(arguments))
            );
            if (Object(result) === result) {
                return result;
            }
            return this;
        } else {
            return target.apply(
                that,
                args.concat(slice.call(arguments))
            );
        }
    };

    var boundLength = Math.max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs.push('$' + i);
    }

    var bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};


},{}],14:[function(_dereq_,module,exports){
'use strict'

var cvc = _dereq_('creditcards').cvc
var bind = _dereq_('function-bind')

module.exports = factory

factory.$inject = ['$parse']
function factory ($parse) {
  return {
    restrict: 'A',
    require: 'ngModel',
    compile: function (element, attributes) {
      attributes.$set('maxlength', 4)
      attributes.$set('pattern', '[0-9]*')
      attributes.$set('xAutocompletetype', 'cc-csc')

      return function (scope, element, attributes, ngModel) {
        ngModel.$validators.ccCvc = function (value) {
          return cvc.isValid(value, $parse(attributes.ccType)(scope))
        }

        if (attributes.ccType) {
          scope.$watch(attributes.ccType, bind.call(ngModel.$validate, ngModel))
        }
      }
    }
  }
}

},{"creditcards":12,"function-bind":13}],15:[function(_dereq_,module,exports){
'use strict'

var expiration = _dereq_('creditcards').expiration
var month = expiration.month
var year = expiration.year
var ap = _dereq_('ap')

exports = module.exports = function ccExp () {
  return {
    restrict: 'AE',
    require: 'ccExp',
    controller: CcExpController,
    link: function (scope, element, attributes, ccExp) {
      ccExp.$watch()
    }
  }
}

CcExpController.$inject = ['$scope', '$element']
function CcExpController ($scope, $element) {
  var nullFormCtrl = {
    $setValidity: noop
  }
  var parentForm = $element.inheritedData('$formController') || nullFormCtrl
  var ngModel = {
    year: {},
    month: {}
  }

  this.setMonth = function (monthCtrl) {
    ngModel.month = monthCtrl
  }
  this.setYear = function (yearCtrl) {
    ngModel.year = yearCtrl
  }

  function setValidity (exp) {
    var expMonth = exp.month
    var expYear = exp.year
    var valid = !!expMonth && !!expYear && !expiration.isPast(expMonth, expYear)
    parentForm.$setValidity('ccExp', valid, $element)
  }

  this.$watch = function $watchExp () {
    $scope.$watch(function watchExp () {
      return {
        month: ngModel.month.$modelValue,
        year: ngModel.year.$modelValue
      }
    }, setValidity, true)
  }
}

var nullCcExp = {
  setMonth: noop,
  setYear: noop
}

exports.month = function ccExpMonth () {
  return {
    restrict: 'A',
    require: ['ngModel', '^?ccExp'],
    compile: function (element, attributes) {
      attributes.$set('maxlength', 2)
      attributes.$set('pattern', '[0-9]*')
      attributes.$set('xAutocompletetype', 'cc-exp-month')

      return function (scope, element, attributes, controllers) {
        var ngModel = controllers[0]
        var ccExp = controllers[1] || nullCcExp

        ccExp.setMonth(ngModel)
        ngModel.$parsers.unshift(month.parse)
        ngModel.$validators.ccExpMonth = month.isValid
      }
    }
  }
}

exports.year = function ccExpYear () {
  return {
    restrict: 'A',
    require: ['ngModel', '^?ccExp'],
    compile: function (element, attributes) {
      var fullYear = attributes.fullYear !== undefined

      attributes.$set('maxlength', fullYear ? 4 : 2)
      attributes.$set('pattern', '[0-9]*')
      attributes.$set('xAutocompletetype', 'cc-exp-year')

      return function (scope, element, attributes, controllers) {
        var ngModel = controllers[0]
        var ccExp = controllers[1] || nullCcExp

        ccExp.setYear(ngModel)

        ngModel.$parsers.unshift(ap.partialRight(year.parse, !fullYear))

        ngModel.$formatters.unshift(function formatExpYear (value) {
          return value ? year.format(value, !fullYear) : ''
        })

        ngModel.$validators.ccExpYear = function validateExpYear (value) {
          return year.isValid(value) && !year.isPast(value)
        }
      }
    }
  }
}

function noop () {}

},{"ap":1,"creditcards":12}],16:[function(_dereq_,module,exports){
'use strict'

var card = _dereq_('creditcards').card

module.exports = factory

factory.$inject = ['$parse']
function factory ($parse) {
  return {
    restrict: 'A',
    require: ['ngModel', 'ccNumber'],
    controller: function () {
      this.type = null
      this.eagerType = null
    },
    compile: function ($element, $attributes) {
      $attributes.$set('pattern', '[0-9]*')
      $attributes.$set('xAutocompletetype', 'cc-number')

      return function ($scope, $element, $attributes, controllers) {
        var ngModel = controllers[0]
        var ccNumber = controllers[1]

        $scope.$watch($attributes.ngModel, function (number) {
          ngModel.$ccType = ccNumber.type = card.type(number)
        })

        function $viewValue () {
          return ngModel.$viewValue
        }

        if ($attributes.ccEagerType != null) {
          $scope.$watch($viewValue, function eagerTypeCheck (number) {
            if (!number) return
            number = card.parse(number)
            ngModel.$ccEagerType = ccNumber.eagerType = card.type(number, true)
          })
        }

        if ($attributes.ccType) {
          $scope.$watch($attributes.ccType, function () {
            ngModel.$validate()
          })
        }

        if ($attributes.ccFormat != null) {
          $scope.$watch($viewValue, function formatInput (input, previous) {
            if (!input) return
            var element = $element[0]
            var formatted = card.format(card.parse(input))

            ngModel.$setViewValue(formatted)
            var selectionEnd = element.selectionEnd
            ngModel.$render()
            if (formatted && !formatted.charAt(selectionEnd - 1).trim()) {
              if (previous && previous.length < input.length) {
                selectionEnd++
              } else {
                selectionEnd--
              }
            }
            element.setSelectionRange(selectionEnd, selectionEnd)
          })
        }

        ngModel.$parsers.unshift(card.parse)

        ngModel.$validators.ccNumber = function validateCcNumber (number) {
          return card.isValid(number)
        }

        ngModel.$validators.ccNumberType = function validateCcNumberType (number) {
          return card.isValid(number, $parse($attributes.ccType)($scope))
        }
      }
    }
  }
}

},{"creditcards":12}],17:[function(_dereq_,module,exports){
(function (global){
'use strict'

var angular = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null)
var creditcards = _dereq_('creditcards')
var number = _dereq_('./number')
var cvc = _dereq_('./cvc')
var expiration = _dereq_('./expiration')

module.exports = angular
  .module('credit-cards', [])
  .value('creditcards', creditcards)
  .directive('ccNumber', number)
  .directive('ccExp', expiration)
  .directive('ccExpMonth', expiration.month)
  .directive('ccExpYear', expiration.year)
  .directive('ccCvc', cvc)
  .name

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./cvc":14,"./expiration":15,"./number":16,"creditcards":12}]},{},[17])(17)
});
/**
 * @license AngularJS v1.7.2
 * (c) 2010-2018 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, angular) {'use strict';

/* global shallowCopy: true */

/**
 * Creates a shallow copy of an object, an array or a primitive.
 *
 * Assumes that there are no proto properties for objects.
 */
function shallowCopy(src, dst) {
  if (isArray(src)) {
    dst = dst || [];

    for (var i = 0, ii = src.length; i < ii; i++) {
      dst[i] = src[i];
    }
  } else if (isObject(src)) {
    dst = dst || {};

    for (var key in src) {
      if (!(key.charAt(0) === '$' && key.charAt(1) === '$')) {
        dst[key] = src[key];
      }
    }
  }

  return dst || src;
}

/* global shallowCopy: false */

// `isArray` and `isObject` are necessary for `shallowCopy()` (included via `src/shallowCopy.js`).
// They are initialized inside the `$RouteProvider`, to ensure `window.angular` is available.
var isArray;
var isObject;
var isDefined;
var noop;

/**
 * @ngdoc module
 * @name ngRoute
 * @description
 *
 * The `ngRoute` module provides routing and deeplinking services and directives for AngularJS apps.
 *
 * ## Example
 * See {@link ngRoute.$route#examples $route} for an example of configuring and using `ngRoute`.
 *
 */
/* global -ngRouteModule */
var ngRouteModule = angular.
  module('ngRoute', []).
  info({ angularVersion: '1.7.2' }).
  provider('$route', $RouteProvider).
  // Ensure `$route` will be instantiated in time to capture the initial `$locationChangeSuccess`
  // event (unless explicitly disabled). This is necessary in case `ngView` is included in an
  // asynchronously loaded template.
  run(instantiateRoute);
var $routeMinErr = angular.$$minErr('ngRoute');
var isEagerInstantiationEnabled;


/**
 * @ngdoc provider
 * @name $routeProvider
 * @this
 *
 * @description
 *
 * Used for configuring routes.
 *
 * ## Example
 * See {@link ngRoute.$route#examples $route} for an example of configuring and using `ngRoute`.
 *
 * ## Dependencies
 * Requires the {@link ngRoute `ngRoute`} module to be installed.
 */
function $RouteProvider() {
  isArray = angular.isArray;
  isObject = angular.isObject;
  isDefined = angular.isDefined;
  noop = angular.noop;

  function inherit(parent, extra) {
    return angular.extend(Object.create(parent), extra);
  }

  var routes = {};

  /**
   * @ngdoc method
   * @name $routeProvider#when
   *
   * @param {string} path Route path (matched against `$location.path`). If `$location.path`
   *    contains redundant trailing slash or is missing one, the route will still match and the
   *    `$location.path` will be updated to add or drop the trailing slash to exactly match the
   *    route definition.
   *
   *    * `path` can contain named groups starting with a colon: e.g. `:name`. All characters up
   *        to the next slash are matched and stored in `$routeParams` under the given `name`
   *        when the route matches.
   *    * `path` can contain named groups starting with a colon and ending with a star:
   *        e.g.`:name*`. All characters are eagerly stored in `$routeParams` under the given `name`
   *        when the route matches.
   *    * `path` can contain optional named groups with a question mark: e.g.`:name?`.
   *
   *    For example, routes like `/color/:color/largecode/:largecode*\/edit` will match
   *    `/color/brown/largecode/code/with/slashes/edit` and extract:
   *
   *    * `color: brown`
   *    * `largecode: code/with/slashes`.
   *
   *
   * @param {Object} route Mapping information to be assigned to `$route.current` on route
   *    match.
   *
   *    Object properties:
   *
   *    - `controller` – `{(string|Function)=}` – Controller fn that should be associated with
   *      newly created scope or the name of a {@link angular.Module#controller registered
   *      controller} if passed as a string.
   *    - `controllerAs` – `{string=}` – An identifier name for a reference to the controller.
   *      If present, the controller will be published to scope under the `controllerAs` name.
   *    - `template` – `{(string|Function)=}` – html template as a string or a function that
   *      returns an html template as a string which should be used by {@link
   *      ngRoute.directive:ngView ngView} or {@link ng.directive:ngInclude ngInclude} directives.
   *      This property takes precedence over `templateUrl`.
   *
   *      If `template` is a function, it will be called with the following parameters:
   *
   *      - `{Array.<Object>}` - route parameters extracted from the current
   *        `$location.path()` by applying the current route
   *
   *      One of `template` or `templateUrl` is required.
   *
   *    - `templateUrl` – `{(string|Function)=}` – path or function that returns a path to an html
   *      template that should be used by {@link ngRoute.directive:ngView ngView}.
   *
   *      If `templateUrl` is a function, it will be called with the following parameters:
   *
   *      - `{Array.<Object>}` - route parameters extracted from the current
   *        `$location.path()` by applying the current route
   *
   *      One of `templateUrl` or `template` is required.
   *
   *    - `resolve` - `{Object.<string, Function>=}` - An optional map of dependencies which should
   *      be injected into the controller. If any of these dependencies are promises, the router
   *      will wait for them all to be resolved or one to be rejected before the controller is
   *      instantiated.
   *      If all the promises are resolved successfully, the values of the resolved promises are
   *      injected and {@link ngRoute.$route#$routeChangeSuccess $routeChangeSuccess} event is
   *      fired. If any of the promises are rejected the
   *      {@link ngRoute.$route#$routeChangeError $routeChangeError} event is fired.
   *      For easier access to the resolved dependencies from the template, the `resolve` map will
   *      be available on the scope of the route, under `$resolve` (by default) or a custom name
   *      specified by the `resolveAs` property (see below). This can be particularly useful, when
   *      working with {@link angular.Module#component components} as route templates.<br />
   *      <div class="alert alert-warning">
   *        **Note:** If your scope already contains a property with this name, it will be hidden
   *        or overwritten. Make sure, you specify an appropriate name for this property, that
   *        does not collide with other properties on the scope.
   *      </div>
   *      The map object is:
   *
   *      - `key` – `{string}`: a name of a dependency to be injected into the controller.
   *      - `factory` - `{string|Function}`: If `string` then it is an alias for a service.
   *        Otherwise if function, then it is {@link auto.$injector#invoke injected}
   *        and the return value is treated as the dependency. If the result is a promise, it is
   *        resolved before its value is injected into the controller. Be aware that
   *        `ngRoute.$routeParams` will still refer to the previous route within these resolve
   *        functions.  Use `$route.current.params` to access the new route parameters, instead.
   *
   *    - `resolveAs` - `{string=}` - The name under which the `resolve` map will be available on
   *      the scope of the route. If omitted, defaults to `$resolve`.
   *
   *    - `redirectTo` – `{(string|Function)=}` – value to update
   *      {@link ng.$location $location} path with and trigger route redirection.
   *
   *      If `redirectTo` is a function, it will be called with the following parameters:
   *
   *      - `{Object.<string>}` - route parameters extracted from the current
   *        `$location.path()` by applying the current route templateUrl.
   *      - `{string}` - current `$location.path()`
   *      - `{Object}` - current `$location.search()`
   *
   *      The custom `redirectTo` function is expected to return a string which will be used
   *      to update `$location.url()`. If the function throws an error, no further processing will
   *      take place and the {@link ngRoute.$route#$routeChangeError $routeChangeError} event will
   *      be fired.
   *
   *      Routes that specify `redirectTo` will not have their controllers, template functions
   *      or resolves called, the `$location` will be changed to the redirect url and route
   *      processing will stop. The exception to this is if the `redirectTo` is a function that
   *      returns `undefined`. In this case the route transition occurs as though there was no
   *      redirection.
   *
   *    - `resolveRedirectTo` – `{Function=}` – a function that will (eventually) return the value
   *      to update {@link ng.$location $location} URL with and trigger route redirection. In
   *      contrast to `redirectTo`, dependencies can be injected into `resolveRedirectTo` and the
   *      return value can be either a string or a promise that will be resolved to a string.
   *
   *      Similar to `redirectTo`, if the return value is `undefined` (or a promise that gets
   *      resolved to `undefined`), no redirection takes place and the route transition occurs as
   *      though there was no redirection.
   *
   *      If the function throws an error or the returned promise gets rejected, no further
   *      processing will take place and the
   *      {@link ngRoute.$route#$routeChangeError $routeChangeError} event will be fired.
   *
   *      `redirectTo` takes precedence over `resolveRedirectTo`, so specifying both on the same
   *      route definition, will cause the latter to be ignored.
   *
   *    - `[reloadOnUrl=true]` - `{boolean=}` - reload route when any part of the URL changes
   *      (inluding the path) even if the new URL maps to the same route.
   *
   *      If the option is set to `false` and the URL in the browser changes, but the new URL maps
   *      to the same route, then a `$routeUpdate` event is broadcasted on the root scope (without
   *      reloading the route).
   *
   *    - `[reloadOnSearch=true]` - `{boolean=}` - reload route when only `$location.search()`
   *      or `$location.hash()` changes.
   *
   *      If the option is set to `false` and the URL in the browser changes, then a `$routeUpdate`
   *      event is broadcasted on the root scope (without reloading the route).
   *
   *      <div class="alert alert-warning">
   *        **Note:** This option has no effect if `reloadOnUrl` is set to `false`.
   *      </div>
   *
   *    - `[caseInsensitiveMatch=false]` - `{boolean=}` - match routes without being case sensitive
   *
   *      If the option is set to `true`, then the particular route can be matched without being
   *      case sensitive
   *
   * @returns {Object} self
   *
   * @description
   * Adds a new route definition to the `$route` service.
   */
  this.when = function(path, route) {
    //copy original route object to preserve params inherited from proto chain
    var routeCopy = shallowCopy(route);
    if (angular.isUndefined(routeCopy.reloadOnUrl)) {
      routeCopy.reloadOnUrl = true;
    }
    if (angular.isUndefined(routeCopy.reloadOnSearch)) {
      routeCopy.reloadOnSearch = true;
    }
    if (angular.isUndefined(routeCopy.caseInsensitiveMatch)) {
      routeCopy.caseInsensitiveMatch = this.caseInsensitiveMatch;
    }
    routes[path] = angular.extend(
      routeCopy,
      path && pathRegExp(path, routeCopy)
    );

    // create redirection for trailing slashes
    if (path) {
      var redirectPath = (path[path.length - 1] === '/')
            ? path.substr(0, path.length - 1)
            : path + '/';

      routes[redirectPath] = angular.extend(
        {redirectTo: path},
        pathRegExp(redirectPath, routeCopy)
      );
    }

    return this;
  };

  /**
   * @ngdoc property
   * @name $routeProvider#caseInsensitiveMatch
   * @description
   *
   * A boolean property indicating if routes defined
   * using this provider should be matched using a case insensitive
   * algorithm. Defaults to `false`.
   */
  this.caseInsensitiveMatch = false;

   /**
    * @param path {string} path
    * @param opts {Object} options
    * @return {?Object}
    *
    * @description
    * Normalizes the given path, returning a regular expression
    * and the original path.
    *
    * Inspired by pathRexp in visionmedia/express/lib/utils.js.
    */
  function pathRegExp(path, opts) {
    var insensitive = opts.caseInsensitiveMatch,
        ret = {
          originalPath: path,
          regexp: path
        },
        keys = ret.keys = [];

    path = path
      .replace(/([().])/g, '\\$1')
      .replace(/(\/)?:(\w+)(\*\?|[?*])?/g, function(_, slash, key, option) {
        var optional = (option === '?' || option === '*?') ? '?' : null;
        var star = (option === '*' || option === '*?') ? '*' : null;
        keys.push({ name: key, optional: !!optional });
        slash = slash || '';
        return ''
          + (optional ? '' : slash)
          + '(?:'
          + (optional ? slash : '')
          + (star && '(.+?)' || '([^/]+)')
          + (optional || '')
          + ')'
          + (optional || '');
      })
      .replace(/([/$*])/g, '\\$1');

    ret.regexp = new RegExp('^' + path + '$', insensitive ? 'i' : '');
    return ret;
  }

  /**
   * @ngdoc method
   * @name $routeProvider#otherwise
   *
   * @description
   * Sets route definition that will be used on route change when no other route definition
   * is matched.
   *
   * @param {Object|string} params Mapping information to be assigned to `$route.current`.
   * If called with a string, the value maps to `redirectTo`.
   * @returns {Object} self
   */
  this.otherwise = function(params) {
    if (typeof params === 'string') {
      params = {redirectTo: params};
    }
    this.when(null, params);
    return this;
  };

  /**
   * @ngdoc method
   * @name $routeProvider#eagerInstantiationEnabled
   * @kind function
   *
   * @description
   * Call this method as a setter to enable/disable eager instantiation of the
   * {@link ngRoute.$route $route} service upon application bootstrap. You can also call it as a
   * getter (i.e. without any arguments) to get the current value of the
   * `eagerInstantiationEnabled` flag.
   *
   * Instantiating `$route` early is necessary for capturing the initial
   * {@link ng.$location#$locationChangeStart $locationChangeStart} event and navigating to the
   * appropriate route. Usually, `$route` is instantiated in time by the
   * {@link ngRoute.ngView ngView} directive. Yet, in cases where `ngView` is included in an
   * asynchronously loaded template (e.g. in another directive's template), the directive factory
   * might not be called soon enough for `$route` to be instantiated _before_ the initial
   * `$locationChangeSuccess` event is fired. Eager instantiation ensures that `$route` is always
   * instantiated in time, regardless of when `ngView` will be loaded.
   *
   * The default value is true.
   *
   * **Note**:<br />
   * You may want to disable the default behavior when unit-testing modules that depend on
   * `ngRoute`, in order to avoid an unexpected request for the default route's template.
   *
   * @param {boolean=} enabled - If provided, update the internal `eagerInstantiationEnabled` flag.
   *
   * @returns {*} The current value of the `eagerInstantiationEnabled` flag if used as a getter or
   *     itself (for chaining) if used as a setter.
   */
  isEagerInstantiationEnabled = true;
  this.eagerInstantiationEnabled = function eagerInstantiationEnabled(enabled) {
    if (isDefined(enabled)) {
      isEagerInstantiationEnabled = enabled;
      return this;
    }

    return isEagerInstantiationEnabled;
  };


  this.$get = ['$rootScope',
               '$location',
               '$routeParams',
               '$q',
               '$injector',
               '$templateRequest',
               '$sce',
               '$browser',
      function($rootScope, $location, $routeParams, $q, $injector, $templateRequest, $sce, $browser) {

    /**
     * @ngdoc service
     * @name $route
     * @requires $location
     * @requires $routeParams
     *
     * @property {Object} current Reference to the current route definition.
     * The route definition contains:
     *
     *   - `controller`: The controller constructor as defined in the route definition.
     *   - `locals`: A map of locals which is used by {@link ng.$controller $controller} service for
     *     controller instantiation. The `locals` contain
     *     the resolved values of the `resolve` map. Additionally the `locals` also contain:
     *
     *     - `$scope` - The current route scope.
     *     - `$template` - The current route template HTML.
     *
     *     The `locals` will be assigned to the route scope's `$resolve` property. You can override
     *     the property name, using `resolveAs` in the route definition. See
     *     {@link ngRoute.$routeProvider $routeProvider} for more info.
     *
     * @property {Object} routes Object with all route configuration Objects as its properties.
     *
     * @description
     * `$route` is used for deep-linking URLs to controllers and views (HTML partials).
     * It watches `$location.url()` and tries to map the path to an existing route definition.
     *
     * Requires the {@link ngRoute `ngRoute`} module to be installed.
     *
     * You can define routes through {@link ngRoute.$routeProvider $routeProvider}'s API.
     *
     * The `$route` service is typically used in conjunction with the
     * {@link ngRoute.directive:ngView `ngView`} directive and the
     * {@link ngRoute.$routeParams `$routeParams`} service.
     *
     * @example
     * This example shows how changing the URL hash causes the `$route` to match a route against the
     * URL, and the `ngView` pulls in the partial.
     *
     * <example name="$route-service" module="ngRouteExample"
     *          deps="angular-route.js" fixBase="true">
     *   <file name="index.html">
     *     <div ng-controller="MainController">
     *       Choose:
     *       <a href="Book/Moby">Moby</a> |
     *       <a href="Book/Moby/ch/1">Moby: Ch1</a> |
     *       <a href="Book/Gatsby">Gatsby</a> |
     *       <a href="Book/Gatsby/ch/4?key=value">Gatsby: Ch4</a> |
     *       <a href="Book/Scarlet">Scarlet Letter</a><br/>
     *
     *       <div ng-view></div>
     *
     *       <hr />
     *
     *       <pre>$location.path() = {{$location.path()}}</pre>
     *       <pre>$route.current.templateUrl = {{$route.current.templateUrl}}</pre>
     *       <pre>$route.current.params = {{$route.current.params}}</pre>
     *       <pre>$route.current.scope.name = {{$route.current.scope.name}}</pre>
     *       <pre>$routeParams = {{$routeParams}}</pre>
     *     </div>
     *   </file>
     *
     *   <file name="book.html">
     *     controller: {{name}}<br />
     *     Book Id: {{params.bookId}}<br />
     *   </file>
     *
     *   <file name="chapter.html">
     *     controller: {{name}}<br />
     *     Book Id: {{params.bookId}}<br />
     *     Chapter Id: {{params.chapterId}}
     *   </file>
     *
     *   <file name="script.js">
     *     angular.module('ngRouteExample', ['ngRoute'])
     *
     *      .controller('MainController', function($scope, $route, $routeParams, $location) {
     *          $scope.$route = $route;
     *          $scope.$location = $location;
     *          $scope.$routeParams = $routeParams;
     *      })
     *
     *      .controller('BookController', function($scope, $routeParams) {
     *          $scope.name = 'BookController';
     *          $scope.params = $routeParams;
     *      })
     *
     *      .controller('ChapterController', function($scope, $routeParams) {
     *          $scope.name = 'ChapterController';
     *          $scope.params = $routeParams;
     *      })
     *
     *     .config(function($routeProvider, $locationProvider) {
     *       $routeProvider
     *        .when('/Book/:bookId', {
     *         templateUrl: 'book.html',
     *         controller: 'BookController',
     *         resolve: {
     *           // I will cause a 1 second delay
     *           delay: function($q, $timeout) {
     *             var delay = $q.defer();
     *             $timeout(delay.resolve, 1000);
     *             return delay.promise;
     *           }
     *         }
     *       })
     *       .when('/Book/:bookId/ch/:chapterId', {
     *         templateUrl: 'chapter.html',
     *         controller: 'ChapterController'
     *       });
     *
     *       // configure html5 to get links working on jsfiddle
     *       $locationProvider.html5Mode(true);
     *     });
     *
     *   </file>
     *
     *   <file name="protractor.js" type="protractor">
     *     it('should load and compile correct template', function() {
     *       element(by.linkText('Moby: Ch1')).click();
     *       var content = element(by.css('[ng-view]')).getText();
     *       expect(content).toMatch(/controller: ChapterController/);
     *       expect(content).toMatch(/Book Id: Moby/);
     *       expect(content).toMatch(/Chapter Id: 1/);
     *
     *       element(by.partialLinkText('Scarlet')).click();
     *
     *       content = element(by.css('[ng-view]')).getText();
     *       expect(content).toMatch(/controller: BookController/);
     *       expect(content).toMatch(/Book Id: Scarlet/);
     *     });
     *   </file>
     * </example>
     */

    /**
     * @ngdoc event
     * @name $route#$routeChangeStart
     * @eventType broadcast on root scope
     * @description
     * Broadcasted before a route change. At this  point the route services starts
     * resolving all of the dependencies needed for the route change to occur.
     * Typically this involves fetching the view template as well as any dependencies
     * defined in `resolve` route property. Once  all of the dependencies are resolved
     * `$routeChangeSuccess` is fired.
     *
     * The route change (and the `$location` change that triggered it) can be prevented
     * by calling `preventDefault` method of the event. See {@link ng.$rootScope.Scope#$on}
     * for more details about event object.
     *
     * @param {Object} angularEvent Synthetic event object.
     * @param {Route} next Future route information.
     * @param {Route} current Current route information.
     */

    /**
     * @ngdoc event
     * @name $route#$routeChangeSuccess
     * @eventType broadcast on root scope
     * @description
     * Broadcasted after a route change has happened successfully.
     * The `resolve` dependencies are now available in the `current.locals` property.
     *
     * {@link ngRoute.directive:ngView ngView} listens for the directive
     * to instantiate the controller and render the view.
     *
     * @param {Object} angularEvent Synthetic event object.
     * @param {Route} current Current route information.
     * @param {Route|Undefined} previous Previous route information, or undefined if current is
     * first route entered.
     */

    /**
     * @ngdoc event
     * @name $route#$routeChangeError
     * @eventType broadcast on root scope
     * @description
     * Broadcasted if a redirection function fails or any redirection or resolve promises are
     * rejected.
     *
     * @param {Object} angularEvent Synthetic event object
     * @param {Route} current Current route information.
     * @param {Route} previous Previous route information.
     * @param {Route} rejection The thrown error or the rejection reason of the promise. Usually
     * the rejection reason is the error that caused the promise to get rejected.
     */

    /**
     * @ngdoc event
     * @name $route#$routeUpdate
     * @eventType broadcast on root scope
     * @description
     * Broadcasted if the same instance of a route (including template, controller instance,
     * resolved dependencies, etc.) is being reused. This can happen if either `reloadOnSearch` or
     * `reloadOnUrl` has been set to `false`.
     *
     * @param {Object} angularEvent Synthetic event object
     * @param {Route} current Current/previous route information.
     */

    var forceReload = false,
        preparedRoute,
        preparedRouteIsUpdateOnly,
        $route = {
          routes: routes,

          /**
           * @ngdoc method
           * @name $route#reload
           *
           * @description
           * Causes `$route` service to reload the current route even if
           * {@link ng.$location $location} hasn't changed.
           *
           * As a result of that, {@link ngRoute.directive:ngView ngView}
           * creates new scope and reinstantiates the controller.
           */
          reload: function() {
            forceReload = true;

            var fakeLocationEvent = {
              defaultPrevented: false,
              preventDefault: function fakePreventDefault() {
                this.defaultPrevented = true;
                forceReload = false;
              }
            };

            $rootScope.$evalAsync(function() {
              prepareRoute(fakeLocationEvent);
              if (!fakeLocationEvent.defaultPrevented) commitRoute();
            });
          },

          /**
           * @ngdoc method
           * @name $route#updateParams
           *
           * @description
           * Causes `$route` service to update the current URL, replacing
           * current route parameters with those specified in `newParams`.
           * Provided property names that match the route's path segment
           * definitions will be interpolated into the location's path, while
           * remaining properties will be treated as query params.
           *
           * @param {!Object<string, string>} newParams mapping of URL parameter names to values
           */
          updateParams: function(newParams) {
            if (this.current && this.current.$$route) {
              newParams = angular.extend({}, this.current.params, newParams);
              $location.path(interpolate(this.current.$$route.originalPath, newParams));
              // interpolate modifies newParams, only query params are left
              $location.search(newParams);
            } else {
              throw $routeMinErr('norout', 'Tried updating route with no current route');
            }
          }
        };

    $rootScope.$on('$locationChangeStart', prepareRoute);
    $rootScope.$on('$locationChangeSuccess', commitRoute);

    return $route;

    /////////////////////////////////////////////////////

    /**
     * @param on {string} current url
     * @param route {Object} route regexp to match the url against
     * @return {?Object}
     *
     * @description
     * Check if the route matches the current url.
     *
     * Inspired by match in
     * visionmedia/express/lib/router/router.js.
     */
    function switchRouteMatcher(on, route) {
      var keys = route.keys,
          params = {};

      if (!route.regexp) return null;

      var m = route.regexp.exec(on);
      if (!m) return null;

      for (var i = 1, len = m.length; i < len; ++i) {
        var key = keys[i - 1];

        var val = m[i];

        if (key && val) {
          params[key.name] = val;
        }
      }
      return params;
    }

    function prepareRoute($locationEvent) {
      var lastRoute = $route.current;

      preparedRoute = parseRoute();
      preparedRouteIsUpdateOnly = isNavigationUpdateOnly(preparedRoute, lastRoute);

      if (!preparedRouteIsUpdateOnly && (lastRoute || preparedRoute)) {
        if ($rootScope.$broadcast('$routeChangeStart', preparedRoute, lastRoute).defaultPrevented) {
          if ($locationEvent) {
            $locationEvent.preventDefault();
          }
        }
      }
    }

    function commitRoute() {
      var lastRoute = $route.current;
      var nextRoute = preparedRoute;

      if (preparedRouteIsUpdateOnly) {
        lastRoute.params = nextRoute.params;
        angular.copy(lastRoute.params, $routeParams);
        $rootScope.$broadcast('$routeUpdate', lastRoute);
      } else if (nextRoute || lastRoute) {
        forceReload = false;
        $route.current = nextRoute;

        var nextRoutePromise = $q.resolve(nextRoute);

        $browser.$$incOutstandingRequestCount();

        nextRoutePromise.
          then(getRedirectionData).
          then(handlePossibleRedirection).
          then(function(keepProcessingRoute) {
            return keepProcessingRoute && nextRoutePromise.
              then(resolveLocals).
              then(function(locals) {
                // after route change
                if (nextRoute === $route.current) {
                  if (nextRoute) {
                    nextRoute.locals = locals;
                    angular.copy(nextRoute.params, $routeParams);
                  }
                  $rootScope.$broadcast('$routeChangeSuccess', nextRoute, lastRoute);
                }
              });
          }).catch(function(error) {
            if (nextRoute === $route.current) {
              $rootScope.$broadcast('$routeChangeError', nextRoute, lastRoute, error);
            }
          }).finally(function() {
            // Because `commitRoute()` is called from a `$rootScope.$evalAsync` block (see
            // `$locationWatch`), this `$$completeOutstandingRequest()` call will not cause
            // `outstandingRequestCount` to hit zero.  This is important in case we are redirecting
            // to a new route which also requires some asynchronous work.

            $browser.$$completeOutstandingRequest(noop);
          });
      }
    }

    function getRedirectionData(route) {
      var data = {
        route: route,
        hasRedirection: false
      };

      if (route) {
        if (route.redirectTo) {
          if (angular.isString(route.redirectTo)) {
            data.path = interpolate(route.redirectTo, route.params);
            data.search = route.params;
            data.hasRedirection = true;
          } else {
            var oldPath = $location.path();
            var oldSearch = $location.search();
            var newUrl = route.redirectTo(route.pathParams, oldPath, oldSearch);

            if (angular.isDefined(newUrl)) {
              data.url = newUrl;
              data.hasRedirection = true;
            }
          }
        } else if (route.resolveRedirectTo) {
          return $q.
            resolve($injector.invoke(route.resolveRedirectTo)).
            then(function(newUrl) {
              if (angular.isDefined(newUrl)) {
                data.url = newUrl;
                data.hasRedirection = true;
              }

              return data;
            });
        }
      }

      return data;
    }

    function handlePossibleRedirection(data) {
      var keepProcessingRoute = true;

      if (data.route !== $route.current) {
        keepProcessingRoute = false;
      } else if (data.hasRedirection) {
        var oldUrl = $location.url();
        var newUrl = data.url;

        if (newUrl) {
          $location.
            url(newUrl).
            replace();
        } else {
          newUrl = $location.
            path(data.path).
            search(data.search).
            replace().
            url();
        }

        if (newUrl !== oldUrl) {
          // Exit out and don't process current next value,
          // wait for next location change from redirect
          keepProcessingRoute = false;
        }
      }

      return keepProcessingRoute;
    }

    function resolveLocals(route) {
      if (route) {
        var locals = angular.extend({}, route.resolve);
        angular.forEach(locals, function(value, key) {
          locals[key] = angular.isString(value) ?
              $injector.get(value) :
              $injector.invoke(value, null, null, key);
        });
        var template = getTemplateFor(route);
        if (angular.isDefined(template)) {
          locals['$template'] = template;
        }
        return $q.all(locals);
      }
    }

    function getTemplateFor(route) {
      var template, templateUrl;
      if (angular.isDefined(template = route.template)) {
        if (angular.isFunction(template)) {
          template = template(route.params);
        }
      } else if (angular.isDefined(templateUrl = route.templateUrl)) {
        if (angular.isFunction(templateUrl)) {
          templateUrl = templateUrl(route.params);
        }
        if (angular.isDefined(templateUrl)) {
          route.loadedTemplateUrl = $sce.valueOf(templateUrl);
          template = $templateRequest(templateUrl);
        }
      }
      return template;
    }

    /**
     * @returns {Object} the current active route, by matching it against the URL
     */
    function parseRoute() {
      // Match a route
      var params, match;
      angular.forEach(routes, function(route, path) {
        if (!match && (params = switchRouteMatcher($location.path(), route))) {
          match = inherit(route, {
            params: angular.extend({}, $location.search(), params),
            pathParams: params});
          match.$$route = route;
        }
      });
      // No route matched; fallback to "otherwise" route
      return match || routes[null] && inherit(routes[null], {params: {}, pathParams:{}});
    }

    /**
     * @param {Object} newRoute - The new route configuration (as returned by `parseRoute()`).
     * @param {Object} oldRoute - The previous route configuration (as returned by `parseRoute()`).
     * @returns {boolean} Whether this is an "update-only" navigation, i.e. the URL maps to the same
     *                    route and it can be reused (based on the config and the type of change).
     */
    function isNavigationUpdateOnly(newRoute, oldRoute) {
      // IF this is not a forced reload
      return !forceReload
          // AND both `newRoute`/`oldRoute` are defined
          && newRoute && oldRoute
          // AND they map to the same Route Definition Object
          && (newRoute.$$route === oldRoute.$$route)
          // AND `reloadOnUrl` is disabled
          && (!newRoute.reloadOnUrl
              // OR `reloadOnSearch` is disabled
              || (!newRoute.reloadOnSearch
                  // AND both routes have the same path params
                  && angular.equals(newRoute.pathParams, oldRoute.pathParams)
              )
          );
    }

    /**
     * @returns {string} interpolation of the redirect path with the parameters
     */
    function interpolate(string, params) {
      var result = [];
      angular.forEach((string || '').split(':'), function(segment, i) {
        if (i === 0) {
          result.push(segment);
        } else {
          var segmentMatch = segment.match(/(\w+)(?:[?*])?(.*)/);
          var key = segmentMatch[1];
          result.push(params[key]);
          result.push(segmentMatch[2] || '');
          delete params[key];
        }
      });
      return result.join('');
    }
  }];
}

instantiateRoute.$inject = ['$injector'];
function instantiateRoute($injector) {
  if (isEagerInstantiationEnabled) {
    // Instantiate `$route`
    $injector.get('$route');
  }
}

ngRouteModule.provider('$routeParams', $RouteParamsProvider);


/**
 * @ngdoc service
 * @name $routeParams
 * @requires $route
 * @this
 *
 * @description
 * The `$routeParams` service allows you to retrieve the current set of route parameters.
 *
 * Requires the {@link ngRoute `ngRoute`} module to be installed.
 *
 * The route parameters are a combination of {@link ng.$location `$location`}'s
 * {@link ng.$location#search `search()`} and {@link ng.$location#path `path()`}.
 * The `path` parameters are extracted when the {@link ngRoute.$route `$route`} path is matched.
 *
 * In case of parameter name collision, `path` params take precedence over `search` params.
 *
 * The service guarantees that the identity of the `$routeParams` object will remain unchanged
 * (but its properties will likely change) even when a route change occurs.
 *
 * Note that the `$routeParams` are only updated *after* a route change completes successfully.
 * This means that you cannot rely on `$routeParams` being correct in route resolve functions.
 * Instead you can use `$route.current.params` to access the new route's parameters.
 *
 * @example
 * ```js
 *  // Given:
 *  // URL: http://server.com/index.html#/Chapter/1/Section/2?search=moby
 *  // Route: /Chapter/:chapterId/Section/:sectionId
 *  //
 *  // Then
 *  $routeParams ==> {chapterId:'1', sectionId:'2', search:'moby'}
 * ```
 */
function $RouteParamsProvider() {
  this.$get = function() { return {}; };
}

ngRouteModule.directive('ngView', ngViewFactory);
ngRouteModule.directive('ngView', ngViewFillContentFactory);


/**
 * @ngdoc directive
 * @name ngView
 * @restrict ECA
 *
 * @description
 * `ngView` is a directive that complements the {@link ngRoute.$route $route} service by
 * including the rendered template of the current route into the main layout (`index.html`) file.
 * Every time the current route changes, the included view changes with it according to the
 * configuration of the `$route` service.
 *
 * Requires the {@link ngRoute `ngRoute`} module to be installed.
 *
 * @animations
 * | Animation                        | Occurs                              |
 * |----------------------------------|-------------------------------------|
 * | {@link ng.$animate#enter enter}  | when the new element is inserted to the DOM |
 * | {@link ng.$animate#leave leave}  | when the old element is removed from to the DOM  |
 *
 * The enter and leave animation occur concurrently.
 *
 * @scope
 * @priority 400
 * @param {string=} onload Expression to evaluate whenever the view updates.
 *
 * @param {string=} autoscroll Whether `ngView` should call {@link ng.$anchorScroll
 *                  $anchorScroll} to scroll the viewport after the view is updated.
 *
 *                  - If the attribute is not set, disable scrolling.
 *                  - If the attribute is set without value, enable scrolling.
 *                  - Otherwise enable scrolling only if the `autoscroll` attribute value evaluated
 *                    as an expression yields a truthy value.
 * @example
    <example name="ngView-directive" module="ngViewExample"
             deps="angular-route.js;angular-animate.js"
             animations="true" fixBase="true">
      <file name="index.html">
        <div ng-controller="MainCtrl as main">
          Choose:
          <a href="Book/Moby">Moby</a> |
          <a href="Book/Moby/ch/1">Moby: Ch1</a> |
          <a href="Book/Gatsby">Gatsby</a> |
          <a href="Book/Gatsby/ch/4?key=value">Gatsby: Ch4</a> |
          <a href="Book/Scarlet">Scarlet Letter</a><br/>

          <div class="view-animate-container">
            <div ng-view class="view-animate"></div>
          </div>
          <hr />

          <pre>$location.path() = {{main.$location.path()}}</pre>
          <pre>$route.current.templateUrl = {{main.$route.current.templateUrl}}</pre>
          <pre>$route.current.params = {{main.$route.current.params}}</pre>
          <pre>$routeParams = {{main.$routeParams}}</pre>
        </div>
      </file>

      <file name="book.html">
        <div>
          controller: {{book.name}}<br />
          Book Id: {{book.params.bookId}}<br />
        </div>
      </file>

      <file name="chapter.html">
        <div>
          controller: {{chapter.name}}<br />
          Book Id: {{chapter.params.bookId}}<br />
          Chapter Id: {{chapter.params.chapterId}}
        </div>
      </file>

      <file name="animations.css">
        .view-animate-container {
          position:relative;
          height:100px!important;
          background:white;
          border:1px solid black;
          height:40px;
          overflow:hidden;
        }

        .view-animate {
          padding:10px;
        }

        .view-animate.ng-enter, .view-animate.ng-leave {
          transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 1.5s;

          display:block;
          width:100%;
          border-left:1px solid black;

          position:absolute;
          top:0;
          left:0;
          right:0;
          bottom:0;
          padding:10px;
        }

        .view-animate.ng-enter {
          left:100%;
        }
        .view-animate.ng-enter.ng-enter-active {
          left:0;
        }
        .view-animate.ng-leave.ng-leave-active {
          left:-100%;
        }
      </file>

      <file name="script.js">
        angular.module('ngViewExample', ['ngRoute', 'ngAnimate'])
          .config(['$routeProvider', '$locationProvider',
            function($routeProvider, $locationProvider) {
              $routeProvider
                .when('/Book/:bookId', {
                  templateUrl: 'book.html',
                  controller: 'BookCtrl',
                  controllerAs: 'book'
                })
                .when('/Book/:bookId/ch/:chapterId', {
                  templateUrl: 'chapter.html',
                  controller: 'ChapterCtrl',
                  controllerAs: 'chapter'
                });

              $locationProvider.html5Mode(true);
          }])
          .controller('MainCtrl', ['$route', '$routeParams', '$location',
            function MainCtrl($route, $routeParams, $location) {
              this.$route = $route;
              this.$location = $location;
              this.$routeParams = $routeParams;
          }])
          .controller('BookCtrl', ['$routeParams', function BookCtrl($routeParams) {
            this.name = 'BookCtrl';
            this.params = $routeParams;
          }])
          .controller('ChapterCtrl', ['$routeParams', function ChapterCtrl($routeParams) {
            this.name = 'ChapterCtrl';
            this.params = $routeParams;
          }]);

      </file>

      <file name="protractor.js" type="protractor">
        it('should load and compile correct template', function() {
          element(by.linkText('Moby: Ch1')).click();
          var content = element(by.css('[ng-view]')).getText();
          expect(content).toMatch(/controller: ChapterCtrl/);
          expect(content).toMatch(/Book Id: Moby/);
          expect(content).toMatch(/Chapter Id: 1/);

          element(by.partialLinkText('Scarlet')).click();

          content = element(by.css('[ng-view]')).getText();
          expect(content).toMatch(/controller: BookCtrl/);
          expect(content).toMatch(/Book Id: Scarlet/);
        });
      </file>
    </example>
 */


/**
 * @ngdoc event
 * @name ngView#$viewContentLoaded
 * @eventType emit on the current ngView scope
 * @description
 * Emitted every time the ngView content is reloaded.
 */
ngViewFactory.$inject = ['$route', '$anchorScroll', '$animate'];
function ngViewFactory($route, $anchorScroll, $animate) {
  return {
    restrict: 'ECA',
    terminal: true,
    priority: 400,
    transclude: 'element',
    link: function(scope, $element, attr, ctrl, $transclude) {
        var currentScope,
            currentElement,
            previousLeaveAnimation,
            autoScrollExp = attr.autoscroll,
            onloadExp = attr.onload || '';

        scope.$on('$routeChangeSuccess', update);
        update();

        function cleanupLastView() {
          if (previousLeaveAnimation) {
            $animate.cancel(previousLeaveAnimation);
            previousLeaveAnimation = null;
          }

          if (currentScope) {
            currentScope.$destroy();
            currentScope = null;
          }
          if (currentElement) {
            previousLeaveAnimation = $animate.leave(currentElement);
            previousLeaveAnimation.done(function(response) {
              if (response !== false) previousLeaveAnimation = null;
            });
            currentElement = null;
          }
        }

        function update() {
          var locals = $route.current && $route.current.locals,
              template = locals && locals.$template;

          if (angular.isDefined(template)) {
            var newScope = scope.$new();
            var current = $route.current;

            // Note: This will also link all children of ng-view that were contained in the original
            // html. If that content contains controllers, ... they could pollute/change the scope.
            // However, using ng-view on an element with additional content does not make sense...
            // Note: We can't remove them in the cloneAttchFn of $transclude as that
            // function is called before linking the content, which would apply child
            // directives to non existing elements.
            var clone = $transclude(newScope, function(clone) {
              $animate.enter(clone, null, currentElement || $element).done(function onNgViewEnter(response) {
                if (response !== false && angular.isDefined(autoScrollExp)
                  && (!autoScrollExp || scope.$eval(autoScrollExp))) {
                  $anchorScroll();
                }
              });
              cleanupLastView();
            });

            currentElement = clone;
            currentScope = current.scope = newScope;
            currentScope.$emit('$viewContentLoaded');
            currentScope.$eval(onloadExp);
          } else {
            cleanupLastView();
          }
        }
    }
  };
}

// This directive is called during the $transclude call of the first `ngView` directive.
// It will replace and compile the content of the element with the loaded template.
// We need this directive so that the element content is already filled when
// the link function of another directive on the same element as ngView
// is called.
ngViewFillContentFactory.$inject = ['$compile', '$controller', '$route'];
function ngViewFillContentFactory($compile, $controller, $route) {
  return {
    restrict: 'ECA',
    priority: -400,
    link: function(scope, $element) {
      var current = $route.current,
          locals = current.locals;

      $element.html(locals.$template);

      var link = $compile($element.contents());

      if (current.controller) {
        locals.$scope = scope;
        var controller = $controller(current.controller, locals);
        if (current.controllerAs) {
          scope[current.controllerAs] = controller;
        }
        $element.data('$ngControllerController', controller);
        $element.children().data('$ngControllerController', controller);
      }
      scope[current.resolveAs || '$resolve'] = locals;

      link(scope);
    }
  };
}


})(window, window.angular);

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

//Bugsnag Error Handler for AngularJS - See: https://docs.bugsnag.com/platforms/browsers/angular/#legacy-angular-support
//Remember to register for AngularJS applications.
angular
    .module('exceptionOverride', [])
    .factory('$exceptionHandler', function () {
        return function (exception, cause) {
            bugsnagClient.notify(exception, {
                beforeSend: function (report) {
                    report.updateMetaData('angular', { cause: cause })
                }
            })
        }
    })


var app = angular.module('gatku', [
	'angularFileUpload',
	'ipCookie',
    'ngAnimate',
    'ngRoute',
	'angular-stripe',
	'ngTouch',
	'credit-cards',
	'checklist-model',
	'angularUtils.directives.dirPagination',
	'exceptionOverride' //register 'Bugsnag Error Handler' for AngularJS Gatku App. See code above.
]);

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




app.directive('hoverCard', [
    '$compile', '$window', 'Product', '$filter', '$exceptionHandler',
    function($compile, $window, Product, $filter, $exceptionHandler) {

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
                Product.getBySlug(attrs.slug).then(function(response) {
                    $scope.product = response.data;
                    $scope.productFetched = true;
                    $scope.positionCard();
                }, function(error) {
                    $exceptionHandler(JSON.stringify(error));
                    console.log('Something went wrong.');
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
                Product.customerPhotos(attrs.productId).then(function(response) {
                    $scope.photos = response.data;
                    Squares.init();
                }, function(error) {
                    $exceptionHandler(JSON.stringify(error));
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

                ShippingRequest.send(data).then(function(response) {
                    $scope.order.shipping = response.data;
                    $scope.open = false;
                    nanobar.go(100);
                    AlertService.broadcast('Shipping Request Sent!', 'success');
                }, function(error) {
                    $exceptionHandler(JSON.stringify(error));
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

                ShippingTrack.send(data).then(function(response) {
                    $scope.order.tracking = response.data;
                    $scope.open = false;
                    shippingTrackPanel.remove();
                    nanobar.go(100);
                    AlertService.broadcast('Tracking Number set!', 'success');
                }, function(error) {
                    $exceptionHandler(JSON.stringify(error));
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
        Cookie.remove('discount', { path : '/' });
        $rootScope.$broadcast('update');
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

app.factory('DiscountExists', ['$http', function($http) {
    return {
        //Fetch all records from discounts table
        all : function() {
            return $http.get('/discounts-exists');
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

app.config(function($routeProvider) {

    console.log('This is executed');

    $routeProvider
        .when("/admin/main", {
            templateUrl : "main.htm"
        })
        .when("/red", {
            templateUrl : "red.htm"
        })
        .when("/green", {
            templateUrl : "green.htm"
        })
        .when("/blue", {
            templateUrl : "blue.htm"
        });
});
app.controller('AdminController',
    ['$scope', 'Image', 'Product', 'Discount', 'Order', 'YouImage', 'AvailabilityType', 'AlertService', 'HomeSetting', '$exceptionHandler',
        function($scope, Image, Product, Discount, Order, YouImage, AvailabilityType, AlertService, HomeSetting, $exceptionHandler) {

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
        Product.forPeriod($scope.order_start_date, $scope.order_end_date).then(function(response) {
            countSoldItems(response.data);
        }, function(error) {
            $exceptionHandler(JSON.stringify(error));
            console.log("Sorry, there was an error retrieving the products");
        });
    }

    function getAllProducts() {
        Product.all().then(function(response) {
            countSoldItems(response.data);
        }, function(error) {
            $exceptionHandler(JSON.stringify(error));
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
        AvailabilityType.all().then(function(response) {
            $scope.availabilityTypes = response.data;
        }, function(error) {
            $exceptionHandler(JSON.stringify(error));
            console.log("Something went wrong on our end");
        });
    }

    $scope.saveProduct = function() {
        var nanobar = new Nanobar({ bg : '#fff' });

        nanobar.go(60);

        Product.store($scope.newProduct).then(function(response) {
            $scope.getProducts();
            $scope.reset();
            nanobar.go(100);
            AlertService.broadcast('Product saved!', 'success');
        }, function(error) {
            $exceptionHandler(JSON.stringify(error));
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

        Product.update(data.id, data).then(function(response) {
            $scope.getProducts();
            $scope.reset();
            nanobar.go(100);
            AlertService.broadcast('Product updated!', 'success');
        }, function(error) {
            $exceptionHandler(JSON.stringify(error));
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
        }).then(function(response) {
            $scope.newProduct[model] = response.data;
            nanobar.go(100);
        }, function(error) {
            $exceptionHandler(JSON.stringify(error));
            nanobar.go(100);
        });
    };
    
    $scope.reset = function() {

        $scope.newProduct = {};
        $scope.newYouImage = {};
        $scope.editState = false;
        $scope.editingNew = true;

    }

    function getTypes() {
        Product.getTypes().then(function(response) {
            $scope.types = response.data;
        }, function(error) {
            $exceptionHandler(JSON.stringify(error));
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
        Order.all().then(function(response) {
            $scope.orders = response.data;
        }, function(error) {
            $exceptionHandler(JSON.stringify(error));
            console.log(response.message);
        });
    }*/

    // You
    $scope.youImages = [];
    $scope.newYouImage = {};

    function getYouImages() {
        YouImage.all().then(function(response) {
            $scope.youImages = response.data;
            Squares.init();
        }, function(error) {
            $exceptionHandler(JSON.stringify(error));
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

        Image.upload(data).then(function(response) {
            $scope.newYouImage.image = response.data;
        }, function(error) {
            $exceptionHandler(JSON.stringify(error));
            console.log('Something went wrong.');
        });
    }

    $scope.saveYouImage = function() {
        var nanobar = new Nanobar({ bg : '#fff' });
        nanobar.go(40);

        YouImage.save($scope.newYouImage).then(function() {
            getYouImages();
            $scope.reset();
            nanobar.go(100);
        }, function(error) {
            $exceptionHandler(JSON.stringify(error));
            console.log('Something went wrong.');
        });
    }

    $scope.clearNewYouImage = function() {
        $scope.newYouImage = false;
    }

    // home settings
    function getHomeSettings() {
        HomeSetting.all().then(function(response) {
            $scope.homeSetting = response.data ? response.data : {};
            Squares.init();        
        }, function(error) {
            $exceptionHandler(JSON.stringify(error));
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

        Image.upload(data).then(function(response) {
            console.log(model);
           $scope.homeSetting[model] = response.data;
        }, function(error) {
            $exceptionHandler(JSON.stringify(error));
            AlertService.broadcast('Sorry, there was an error, please try again', 'error');
        });

    }

    $scope.saveHomeSetting = function() {
        var nanobar = new Nanobar({ bg : '#fff' });
        nanobar.go(40);

        HomeSetting.save($scope.homeSetting).then(function() {
            getHomeSettings();
            AlertService.broadcast('Photo was successfully updated.', 'success');
            nanobar.go(100);
        }, function(error) {
            $exceptionHandler(JSON.stringify(error));
            console.log('Something went wrong.');
        });
    }

    $scope.resetDateFilter = function() {
        $scope.order_start_date = ''
        $scope.order_end_date = '';
        $scope.getProducts();
    }

    //Discount part
    function fetchAllDiscounts() {
        Discount.all().then(function(response) {
            $scope.discounts = response.data;
        }, function(error) {
            $exceptionHandler(JSON.stringify(error));
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
                Discount.store(data).then(function() {
                    AlertService.broadcast('Discount added!', 'success');
                    fetchAllDiscounts();
                }, function(error) {
                    $exceptionHandler(JSON.stringify(error));
                    AlertService.broadcast('There was a problem with adding Discount.');
                });
            } else {
                Discount.update(data.code, data).then(function() {
                    AlertService.broadcast('Discount updated!', 'success');
                    fetchAllDiscounts();
                }, function(error) {
                    $exceptionHandler(JSON.stringify(error));
                    AlertService.broadcast('There was a problem with Discount update.');
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
                Discount.remove(data.code).then(function() {
                    AlertService.broadcast('Discount removed!', 'success');
                    fetchAllDiscounts();
                }).error(function(error) {
                    $exceptionHandler(JSON.stringify(error));
                    AlertService.broadcast('There was a problem with Discount removing.');
                });
            }
        }
    };

    $scope.discountRowChanged = function(discountIndex) {
        $scope.discounts[discountIndex].changed = true;
    };

    //Discount part - end

    $scope.adminLogout = function() {
        window.location.replace('/logout');
    };

    $scope.init();

}]);




app.controller('AdminordersController', [
    '$scope', 'Order','$http', '$exceptionHandler',
    function($scope, Order, $http, $exceptionHandler) {

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
        $http.get(Url).then(function(response){
            $scope.orders = response.data.orders;
            gatkuOrder.orders = response.data.orders;
            gatkuOrder.total_count = response.total_count;
        }, function(error) {
            $exceptionHandler(JSON.stringify(error));
            console.log('Something went wrong.');
        });
    };
    
    gatkuOrder.getData(gatkuOrder.pageno);
    gatkuOrder.searchOrder = function () {
        if ($scope.order_start_date) {
            gatkuOrder.getData(1, $scope.order_start_date, $scope.order_end_date);
        } else {
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
app.controller('CartController',
    ['$scope', 'CartService', 'StripeService', 'Order', 'AlertService', 'Discount', 'DiscountExists', '$exceptionHandler',
    function($scope, CartService, StripeService, Order, AlertService, Discount, DiscountExists, $exceptionHandler) {

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
    $scope.discountsExists = false;
    $scope.discountSum = 0;

    //Check is are records in discount table. If no then don't display discount input
    DiscountExists.all().then(function(response) {
        $scope.discountsExists = response.data;
    });

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

            Order.store(data).then(function(response) {
                AlertService.broadcast('Success! Redirecting...', 'success');
                $scope.show = false;
                $scope.emptyCart();
                $scope.enabled = true;
                //window.location.replace("/thankyou");
            }, function(error) {
                $exceptionHandler(JSON.stringify(error));
                AlertService.broadcast('Sorry, something went wrong on our end. We are fixing it soon!', 'error');
                console.log('Something went wrong.');
            });
        });
    }

    $scope.hide = function() {
        CartService.hide();
    }

    $scope.emptyCart = function() {
        CartService.removeDiscount();
        CartService.empty();

        //Update values
        $scope.getItems();
        $scope.getDiscountFromCookies();
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
app.controller('HearGoodStuffController', [
	'$scope', 'HearGoodStuff', '$exceptionHandler',
	function($scope, HearGoodStuff, $exceptionHandler) {

	$scope.email_address = '';

	$scope.addEmailToMailingList = function() {
        HearGoodStuff.store({email: $scope.email_address})
			.then(function(response) {
                $scope.email_address = '';
            }, function(error) {
                $exceptionHandler(JSON.stringify(error));
            	console.log('Something went wrong.');
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
app.controller('ProductController', [
	'$scope', 'Product', 'CartService', 'Size', 'AlertService', '$timeout', '$exceptionHandler',
	function($scope, Product, CartService, Size, AlertService, $timeout, $exceptionHandler) {
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
		Product.get(productId).then(function(response) {
			$scope.product = response.data;
			parseSizeableAddons();
			$scope.loaded = true;
		}, function(error) {
            $exceptionHandler(JSON.stringify(error));
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
					Size.getBySlug(slug).then(function(response) {
						if (typeof response === 'object') {
                            if (response.data) {
                                if (response.data.hasOwnProperty('price')) {
                                    addon.product.price = response.data.price;
                                }
                                if (response.data.hasOwnProperty('id')) {
                                    addon.product.sizeId = response.data.id;
                                }
                            }
						}
					}, function(error) {
                        $exceptionHandler(JSON.stringify(error));
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
app.controller('QuoteFormController', [
	'$scope', 'Product', '$http', 'AlertService', '$exceptionHandler',
	function($scope, Product, $http, AlertService, $exceptionHandler) {

	$scope.form = {};

	$scope.poles = [];

	$scope.submitAttempted = false;

	$scope.success = false;

	function getPoles() {

		Product.getByType().then(function(response) {
			$scope.poles = response.data['poles'];
		}, function(error) {
			// Hides this field in the view, is not needed
			// in event of error
            $exceptionHandler(JSON.stringify(error));
			$scope.hidePoleChooser = true;
		});

	}

	getPoles();


	$scope.submit = function(isValid) {

		$scope.submitAttempted = true;

		var nanobar = new Nanobar({ bg : '#fff' });
	
		if (isValid) {

			nanobar.go(60);

			$http.post('/quote', $scope.form).then(function(response) {
				$scope.success = true;
				AlertService.broadcast('Success! We will get back to you as quick as we can!', 'success');
				nanobar.go(100);
			}, function(error) {
                $exceptionHandler(JSON.stringify(error));
				AlertService.broadcast('Sorry, something went wrong. We will fix it as soon as possible', 'error');
				nanobar.go(100);
			});

		} else {

			AlertService.broadcast('Please Fill in required fields', 'error');

		}

	}

}]);
app.controller('ShippingRequestPaymentController', ['$scope', 'AlertService', 'StripeService', 'ShippingRequest', '$exceptionHandler',
	function($scope, AlertService, StripeService, ShippingRequest, $exceptionHandler) {

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
			};
		
			ShippingRequest.pay(data).success(function(response) {
				AlertService.broadcast('Success!', 'success');
				$scope.success = true;
			}).error(function(error) {
                $exceptionHandler(JSON.stringify(error));
				AlertService.broadcast('Sorry, something went wrong on our end. We are fixing it soon!', 'error');
			});
		});
	};

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

app.controller('StoreController', [
	'$scope', 'Product', '$exceptionHandler',
	function($scope, Product, $exceptionHandler) {

	$scope.heads = [];

	$scope.poles = [];

	$scope.shrinker = [];

	$scope.extras = [];

	$scope.apparel = [];

	$scope.init = function() {

		$scope.getStore();

	}

	$scope.getStore = function() {

		Product.getByType().then(function(response) {
            $scope.heads = response.data['heads'];
            $scope.poles = response.data['poles'];
            $scope.shrinker = response.data['shrinker'];
            $scope.extras1 = response.data['extras'].slice(0, 3);
            $scope.extras2 = response.data['extras'].slice(3, 7);
            $scope.extras3 = response.data['extras'].slice(7, 11);
            $scope.apparel = response.data['apparel'];
            $scope.glasses = response.data['glasses'];
            $scope.packages = response.data['packages'];
		}, function(error) {
            $exceptionHandler(JSON.stringify(error));
			console.log("Something went wrong getting the store data.");
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