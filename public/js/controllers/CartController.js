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
    function($scope,
             CartService,
             StripeService,
             Order,
             AlertService,
             Discount,
             DiscountExists,
             $exceptionHandler,
             SalesTaxResource,
             $uibModal,
             CartCalculationsResource
    ) {

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
    $scope.taxes = [];
    $scope.pickedTax = {
        state: '',
        tax: 0
    };
    $scope.sellOutOfUSA = false;
    $scope.isoCountries = isoCountries;

    //Global Discount
    $scope.global_discount_switch = homeSetting.global_discount_switch;
    $scope.global_discount_percentage = homeSetting.global_discount_percentage;
    $scope.global_discount_name = homeSetting.global_discount_name;
    //Global Discount - end

    $scope.enteredDiscountCode = '';
    $scope.discount = '';
    $scope.discountsExists = false;
    $scope.discountSum = 0;


    $scope.cartCalculations = {
        discount: 0,
        shipping: 0,
        subtotal: 0,
        tax: 0,
        total: 0
    };

    //Check is are records in discount table. If no then don't display discount input
    DiscountExists.all().then(function(response) {
        $scope.discountsExists = response.data;
    });

    $scope.toStage = function(index) {
        Inputs.blur();

        if ($scope.validate(index) === false) return false;

        $scope.getCartCalculations();
        $scope.currentStage = $scope.stages[index];
    };

    $scope.getItems = function() {
        var items = CartService.getItems();

        $scope.items = items;
    };

    $scope.removeItem = function(index) {
        CartService.removeItem(index);
        $scope.getCartCalculations();
    };

    $scope.getDiscountFromCookies = function () {
        $scope.discount = CartService.getDiscount();
    };

    $scope.removeDiscount = function() {
        CartService.removeDiscount();
        $scope.getDiscountFromCookies();
        $scope.getCartCalculations();
    };

    $scope.increaseItemQuantity = function(itemIndex) {
        CartService.increaseItemQuantity(itemIndex);
        $scope.getCartCalculations();
    };

    $scope.decreaseItemQuantity = function(itemIndex) {
        CartService.decreaseItemQuantity(itemIndex);
        $scope.getCartCalculations();
    };

    $scope.increaseAddonQuantity = function(itemIndex, addonIndex) {
        CartService.increaseAddonQuantity(itemIndex, addonIndex);
        $scope.getCartCalculations();
    };

    $scope.decreaseAddonQuantity = function(itemIndex, addonIndex) {
        CartService.decreaseAddonQuantity(itemIndex, addonIndex);
        $scope.getCartCalculations();
    };

    $scope.getCartCalculations = function() {
        var promise = CartCalculationsResource.save({
            items: $scope.items,
            discount: $scope.discount,
            tax: $scope.pickedTax
        });

        promise.$promise.then(function(response) {
            $scope.cartCalculations.discount = response.discount;
            $scope.cartCalculations.shipping = response.shipping;
            $scope.cartCalculations.subtotal = response.subtotal;
            $scope.cartCalculations.tax = response.tax;
            $scope.cartCalculations.total = response.total;
        });
    };

    $scope.setStateTaxRecord = function() {
        $scope.pickedTax = {
            state: '',
            tax: 0
        };

        if ($scope.form.state && $scope.taxes.length) {
            angular.forEach($scope.taxes, function(tax) {
                if (tax.state == $scope.form.state) {
                    $scope.pickedTax = tax;
                }
            });
        }
    };

    $scope.submit = function() {

        var card = extractCardDetails();

        if ($scope.enabled === false) return false;

        $scope.enabled = false;
        AlertService.broadcast('Processing...', 'info');

        StripeService.createToken(card).then(function (token) {
            var data = {
                items: $scope.items,
                form: $scope.form,
                discount: $scope.discount,
                token: token
            }

            Order.store(data).then(function (response) {
                AlertService.broadcast('Success! Redirecting...', 'success');
                $scope.show = false;
                $scope.emptyCart();
                $scope.enabled = true;
                window.location.replace("/thankyou");
            }, function (error) {
                $exceptionHandler(JSON.stringify(error));
                AlertService.broadcast('ERROR!', 'error');

                console.log(error);
                var errorMessage = "There was error and request can't be processed.";

                if (error.error.message) {
                    errorMessage = error.error.message;
                }

                $scope.displayErrorModal(errorMessage);
            });
        }, function(stripeServiceError) {
            $scope.displayErrorModal(stripeServiceError);
        });
    };

    $scope.displayErrorModal = function(errorMessage) {
        $uibModal.open({
            templateUrl: '/js/app/front/cart/ErrorMessageModal.html',
            controller: 'ErrorMessageModalController',
            controllerAs: '$ctrl',
            resolve: {
                errorMessage: function () {
                    return errorMessage;
                }
            }
        });
    };


    $scope.hide = function() {
        CartService.hide();
    };

    $scope.emptyCart = function() {
        CartService.removeDiscount();
        CartService.empty();

        //Update values
        $scope.getItems();
        $scope.getDiscountFromCookies();
    };

    $scope.validate = function(index) {

        $scope.status = '';

        if (index == 1) {

            //Fetch Sales Taxes
            $scope.taxes = SalesTaxResource.query();

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

            if (!$scope.card.hasOwnProperty('isBillingSame')) {
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
    };

    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };

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
        $scope.getCartCalculations();
    });

    $scope.$on('hide', function() {
        $scope.show = false;
        location.reload();
    });

    $scope.applyDiscountCode = function() {
        Discount.get($scope.enteredDiscountCode).then(function(discount) {
            $scope.discount = discount.data;
            CartService.setDiscount($scope.discount);
            $scope.getCartCalculations();
        }, function() {
            alert('Code seams to be not correct. There is no discount for this code.');
        });
    };

    $scope.getItems();
    $scope.getDiscountFromCookies();
    $scope.getCartCalculations();
});

