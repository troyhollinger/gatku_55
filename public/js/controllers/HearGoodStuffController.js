app.controller('HearGoodStuffController', [
	'$scope', 'HearGoodStuff', '$exceptionHandler',
	function($scope, HearGoodStuff, $exceptionHandler) {

	$scope.email_address = '';

	$scope.addEmailToMailingList = function() {
        HearGoodStuff.store({email: $scope.email_address})
			.then(function(response) {
                $scope.email_address = '';
            }, function(error) {
                $exceptionHandler(JSON.stringify(error));
            	console.log('Something went wrong.');
			});
	}
}]);