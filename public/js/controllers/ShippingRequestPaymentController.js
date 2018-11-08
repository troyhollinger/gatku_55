app.controller('ShippingRequestPaymentController', ['$scope', 'AlertService', 'StripeService', 'ShippingRequest', '$exceptionHandler', '$interval',
	function($scope, AlertService, StripeService, ShippingRequest, $exceptionHandler, $interval) {

	$scope.card = {};
	$scope.success = false;

	if (typeof(shippingRequestId) !== undefined) {
		$scope.shippingRequestId = shippingRequestId;
	} else {
		$scope.shippingRequestId = null;
	}

    $scope.delay = 7; //delay in sec.
    $scope.progress = 0;
    $scope.iteration = 0;

	function updateProgress() {
    	$scope.iteration++;
        $scope.progress = parseInt( (($scope.delay - $scope.iteration) / $scope.delay) * 100 );
    }

	$scope.pay = function() {

		var card = extractCardDetails();

		AlertService.broadcast('Processing...', 'info');

		StripeService.createToken(card).then(function(token) {

			var data = {
				shippingRequestId : $scope.shippingRequestId,
				token : token
			};
		
			ShippingRequest.pay(data).then(function(response) {
				AlertService.broadcast('Success!', 'success');
				$scope.success = true;

                $scope.progress = $interval(updateProgress, 1000, $scope.delay);

				setTimeout(function() {
                    window.location.replace("/#store");
				}, $scope.delay * 1000);
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
