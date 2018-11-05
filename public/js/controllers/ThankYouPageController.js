app.controller('ThankYouPageController', function ($scope, $interval, $exceptionHandler) {

    $scope.delay = 15; //delay in sec.
    $scope.progress = 0;
    $scope.iteration = 0;

    function updateProgress() {
        $scope.iteration++;
        $scope.progress = parseInt( (($scope.delay - $scope.iteration) / $scope.delay) * 100 );
    }

    $scope.progress = $interval(updateProgress, 1000, $scope.delay);

    setTimeout(function () {
        window.location.replace("/#store");
    }, $scope.delay * 1000);
});
