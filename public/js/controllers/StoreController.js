(function () {
    app.controller('StoreController', StoreController);

    function StoreController($scope, Product, Shelves, $exceptionHandler) {

        $scope.shelves = [];

        $scope.shelfIdForProduct = shelfIdForProduct;

        $scope.start = function () {
            $scope.getStore();
            $scope.getShelves();
        };

        $scope.getThumbClass = function(product){
            return 'product-thumb-container-' + product.type.name;
        };

        $scope.getLinkClass = function(product){
            return 'product-link-container-' + product.type.name;
        };

        $scope.getStore = function () {
            Product.allAvailabel().then(function(response) {
                $scope.products = response.data;
            }, function (error) {
                $exceptionHandler(JSON.stringify(error));
                console.log("Something went wrong getting the store data.");
            });

        };

        $scope.getShelves = function () {
            Shelves.allActive().then(function (response) {
                if ($scope.shelfIdForProduct) {
                    //get first shelf for products
                    angular.forEach(response.data, function(row, idx) {
                       if (row.id == $scope.shelfIdForProduct) {
                           $scope.shelves.push(row);
                           response.data.splice(idx, 1);
                       }
                    });
                    //get rest of shelves for products
                    angular.forEach(response.data, function(row) {
                        $scope.shelves.push(row);
                    });
                } else {
                    $scope.shelves = response.data;
                }
            });
        };

        $scope.start();
    };
})();
