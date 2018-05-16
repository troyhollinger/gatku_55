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









