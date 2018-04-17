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