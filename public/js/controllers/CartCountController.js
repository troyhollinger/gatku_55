app.controller('CartCountController', ['$scope', 'CartService', function($scope, CartService) {

	$scope.$on('update', function() {

		countItems();

	});

	$scope.showCart = function() {

		CartService.show();

	}

	function countItems() {

		$scope.count = CartService.count();

	}

	countItems();


}]);