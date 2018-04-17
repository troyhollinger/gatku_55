app.factory('NavigationService', ['$rootScope', function($rootScope) {

	var NavigationService = {};

	NavigationService.open = function() {

		$rootScope.$broadcast('open');

	}

	NavigationService.close = function() {

		$rootScope.$broadcast('close');

	}

	return NavigationService;

}]);