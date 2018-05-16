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