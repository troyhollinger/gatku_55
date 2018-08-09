(function () {
    app.controller('StoreController', StoreController);

    function StoreController($scope, Product, Shelves, $exceptionHandler) {

        $scope.shortNamesForProductTypes = [
            'Head',
            'Glass',
            'Pole'
        ];

        $scope.displayLengthForProduct = [
            'Glass'
        ];

        $scope.displayShortNameExtensionForProduct = [
            'Pole'
        ];

        $scope.init = function () {
            $scope.getStore();
            $scope.getShelves();
        };

        $scope.getThumbClass = function(product){
            return 'product-thumb-container-' + product.type.name;
        };

        $scope.getLinkClass = function(product){
            return 'product-link-container-' + product.type.name;
        };

        $scope.shelfProductNameToDisplay = function(product) {
            if ($scope.shortNamesForProductTypes.indexOf(product.type.name) !== -1) {
                return product.shortName;
            }
            return product.name;
        };

        $scope.shelfProductDisplayLength = function(product) {
            if ($scope.displayLengthForProduct.indexOf(product.type.name) !== -1) {
                return product.length;
            }
            return '';
        };

        $scope.shelfProductDisplayLength = function(product) {
            if ($scope.displayShortNameExtensionForProduct.indexOf(product.type.name) !== -1) {
                return product.short_name_extension;
            }
            return '';
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
                $scope.shelves = response.data;
            });
        };

        $scope.init();
    };
})();
