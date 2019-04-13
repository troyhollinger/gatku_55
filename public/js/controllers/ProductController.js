(function () {
    app.controller('ProductController', ProductController);

    function ProductController($scope, Product, CartService, Size, AlertService, $timeout, $exceptionHandler) {
        $scope.fullSize = true;
        $scope.displayScrollWaterMark = false;
        $scope.loaded = false;
        $scope.productAdded = false;
        $scope.productAddedText = "Add to Cart";
        $scope.product = {};
        $scope.autoscroll = true;

        const wmdc = 'water-mark-display-count';
        const wmhp = 'water-mark-hide-period';
        const expDatePlusDays = 10;
        const countsToHide = 3;

        $scope.wmdcValue = 0;
        $scope.wmhpValue = false;

        $scope.displayWaterMark = true;


        if (layoutType === 'pole' || layoutType === 'extra') {
            $scope.attached = true;
        } else {
            $scope.attached = false;
        }

        $scope.init = function () {
            $scope.getProduct();
            $scope.manageCookiesForScrollWatermark();
        };

        $scope.getProduct = function () {
            Product.get(productId).then(function (response) {
                $scope.product = response.data;
                parseSizeableAddons();
                $scope.loaded = true;
            }, function (error) {
                $exceptionHandler(JSON.stringify(error));
                AlertService.broadcast('Sorry, there is an error. Your page may have not rendered correctly.', 'error');
            });
        };

        $scope.addToCart = function () {
            if ($scope.product.sizeable !== "0" && $scope.product.sizeable) {
                var sizes = verifySizeIsChecked();
                console.log("Product is sizeable");
                if (sizes.length) {
                    console.log("there are sizes");
                    for (var i = 0; i < sizes.length; i++) {
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
                CartService.addItem($scope.product);
            }
            $scope.productAddedTextChange();

            reset();
        };

        $scope.openCart = function () {
            CartService.show();
        };

        $scope.scrollAcross = function () {
            if ($scope.product.slug === 'g-string' || $scope.product.slug === 'black g-string') {
                PoleScroll.center();
            } else {
                PoleScroll.scrollAcross();
            }
        };

        $scope.poleScrollInit = function () {

            getPoleScrollInit();

            if ($scope.autoscroll) {
                $scope.autoscroll = false;
                $timeout(function() {
                    PoleScroll.scrollAcross(5000)
                }, 2000); //Call function after 2 sec.
            }
        };

        $scope.goFullSize = function () {
            setTimeout(function () {
                getPoleScrollInit();
            }, 20);
        };

        //Water Mark Cookies
        $scope.manageCookiesForScrollWatermark = function () {
            waterMarkPeriodHideCookie();
            waterMarkCountHideCookie();
            checkIfWaterMarkShouldBeDisplayed();
        };

        function waterMarkPeriodHideCookie() {
            $scope.wmhpValue = getCookieByName(wmhp);

            if (!$scope.wmhpValue) {
                var today = new Date(); //Today's Date
                var cookieExpDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + expDatePlusDays);
                setCookie(wmhp, true, cookieExpDate)
            }
        }

        function waterMarkCountHideCookie() {

            if (!$scope.wmhpValue) {
                deleteCookie(wmdc);
            }

            var wmdcValue = getCookieByName(wmdc);
            $scope.wmdcValue = parseInt(wmdcValue, 0);
            if ($scope.wmdcValue > 0) {
                var newWmdcValue = $scope.wmdcValue + 1;
                setCookie(wmdc, newWmdcValue);
            } else {
                setCookie(wmdc, 1);
            }
        }

        function getCookieByName(cookieName) {
            var cookieValue = false;
            var cookies = decodeURIComponent(document.cookie);
            var cookiesArray = cookies.split(';');

            cookiesArray.forEach(function (cookie) {
                var parts = cookie.split('=');
                if (parts[0].trim() == cookieName) {
                    if (parts[1] !== 'undefined') {
                        cookieValue = parts[1];
                    }
                }
            });

            return cookieValue;
        }

        function setCookie(cookieName, cookieValue, cookieExpDate, cookiePath) {
            var exp = cookieExpDate || '';
            var path = cookiePath || '/';
            document.cookie = cookieName + '=' + cookieValue + ';expires=' + exp + ';path=' + path;
        }

        function deleteCookie(cookieName) {
            document.cookie = cookieName + '=;expires=;path=/;';
        }

        function checkIfWaterMarkShouldBeDisplayed() {
            //(countsToHide -1) for correct calculation don't change
            if ($scope.wmhpValue && $scope.wmdcValue > (countsToHide -1)) {
                $scope.displayWaterMark = false;
            }
        }

        //Water Mark Cookies - end

        function getPoleScrollInit() {
            PoleScroll.init();
            $scope.displayScrollWaterMark = PoleScroll.displayScrollWaterMark();
        }

        function verifySizeIsChecked() {
            var checkedSizes = [];

            for (var i = 0; i < $scope.product.sizes.length; i++) {
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
            for (var i = 0; i < $scope.product.addons.length; i++) {
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
                        Size.getBySlug(slug).then(function (response) {
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
                        }, function (error) {
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
                for (var i = 0; i < $scope.product.sizes.length; i++) {
                    $scope.product.sizes[i].checked = false;
                }
            } else {
                for (var i = 0; i < $scope.product.addons.length; i++) {

                    //uncheck only addons if not included in package
                    if (!$scope.product.addons[i].include_in_package) {
                        $scope.product.addons[i].checked = false;
                    }
                }
            }
        }

        $scope.productAddedTextChange = function () {
            $scope.productAddedText = "Item Added!";
            $timeout(function () {
                $scope.productAddedText = "Add to Cart";
            }, 4000);
        };

        // function productAddedAnimation() {
        //     $scope.productAdded = true;
        //
        //     $timeout(function () {
        //         $scope.productAdded = false;
        //     }, 3000);
        // }

        $scope.$on('itemAdded', function () {
            // productAddedAnimation();
            $scope.productAdded = true;
        });

        $scope.init();
    }
}());
