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