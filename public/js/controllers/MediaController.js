app.controller('MediaController', ['$scope', function($scope) {

    // Determines which page is shown first on load.
    $scope.productPage = true;
    $scope.brandPage = false;

    $scope.toProductPage = function() {

        $scope.productPage = true;
        $scope.brandPage = false;
        
        //Fixes bug where grid initiation is premature
        //to images loading.
        setTimeout(function(){Grid.init()}, 200);


    }

    $scope.toBrandPage = function() {

        $scope.productPage = false;
        $scope.brandPage = true;


    }

}]);