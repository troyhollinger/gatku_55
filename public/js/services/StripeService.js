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