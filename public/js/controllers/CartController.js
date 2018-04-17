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

