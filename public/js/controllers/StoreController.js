(function () {
    app.controller('StoreController', StoreController);

    function StoreController($scope, Product, Shelves, $exceptionHandler) {

        $scope.heads = [];

        $scope.poles = [];

        $scope.shrinker = [];

        $scope.extras = [];

        $scope.apparel = [];

        $scope.init = function () {
            $scope.getStore();
            $scope.getShelves();
        };

        $scope.getStore = function () {

            // Product.getByType().then(function (response) {
            //     $scope.heads = response.data['heads'];
            //     $scope.poles = response.data['poles'];
            //     $scope.shrinker = response.data['shrinker'];
            //     $scope.extras1 = response.data['extras'].slice(0, 3);
            //     $scope.extras2 = response.data['extras'].slice(3, 7);
            //     $scope.extras3 = response.data['extras'].slice(7, 11);
            //     $scope.apparel = response.data['apparel'];
            //     $scope.glasses = response.data['glasses'];
            //     $scope.packages = response.data['packages'];
            // }, function (error) {
            //     $exceptionHandler(JSON.stringify(error));
            //     console.log("Something went wrong getting the store data.");
            // });

            Product.allAvailabel().then(function(response) {
                $scope.products = response.data;
            }, function (error) {
                $exceptionHandler(JSON.stringify(error));
                console.log("Something went wrong getting the store data.");
            });

        };

        $scope.getShelves = function () {
            Shelves.allActive().then(function (response) {
                $scope.shelves = response.data;
            });
        };

        $scope.init();
    };
})();
