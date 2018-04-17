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