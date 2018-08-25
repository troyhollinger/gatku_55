(function () {
    app.controller('AdminProductsController', AdminProductsController);
    function AdminProductsController(
        $scope,
        Product,
        AvailabilityType,
        AlertService,
        Shelf,
        $uibModal,
        $http,
        $exceptionHandler
    ) {

        var $ctrl = this;

        $ctrl.types = [];
        $ctrl.availabilityTypes = [];
        $ctrl.products = [];
        $ctrl.newProduct = {};
        $ctrl.editState = false;
        $ctrl.editingNew = true;

        //Products
        function getAllProducts() {
            Product.all().then(function (response) {
                $ctrl.products = response.data;
            }, function (error) {
                $exceptionHandler(JSON.stringify(error));
                console.log("Sorry, there was an error retrieving the products");
            });
        }

        getAllProducts();
        //Products - end

        //Available Types
        function getAvailabilityTypes() {
            AvailabilityType.all().then(function (response) {
                $ctrl.availabilityTypes = response.data;
            }, function (error) {
                $exceptionHandler(JSON.stringify(error));
                console.log("Something went wrong on our end");
            });
        }

        getAvailabilityTypes();
        //Available Types - end

        $ctrl.saveProduct = function () {
            var nanobar = new Nanobar({bg: '#fff'});

            nanobar.go(60);

            Product.store($ctrl.newProduct).then(function () {
                getAllProducts();
                $ctrl.reset();
                nanobar.go(100);
                AlertService.broadcast('Product saved!', 'success');
            }, function (error) {
                $exceptionHandler(JSON.stringify(error));
                nanobar.go(100);
                AlertService.broadcast('There was a problem', 'error');
            });
        };

        $ctrl.createProduct = function () {
            $ctrl.editProduct({});
        };

        $ctrl.editProduct = function (product) {
            var nanobar = new Nanobar({bg: '#fff'});

            var modalInstance = $uibModal.open({
                templateUrl: 'js/app/admin/products/modals/AdminProductModal.html',
                controller: 'AdminProductModalController',
                controllerAs: '$ctrl',
                backdrop: 'static',
                size: 'lg',
                resolve: {
                    productObject: function() {
                        return product;
                    },
                    products: function() {
                        return $ctrl.products;
                    },
                    shelves: function() {
                        return $ctrl.shelves;
                    },
                    types: function() {
                        return $ctrl.types;
                    },
                    availabilityTypes: function() {
                        return $ctrl.availabilityTypes;
                    }
                }
            });

            modalInstance.result.then(function() {
                nanobar.go(100);
                AlertService.broadcast('Product saved!', 'success');
                getAllProducts();
            });
        };

        //Shelves
        $ctrl.getAllShelves = function() {
            var promise = Shelf.all();

            promise.then(function(response) {
                $ctrl.shelves = response.data;
            }, function (error) {
                $exceptionHandler(JSON.stringify(error));
            });
        };

        $ctrl.getShelfNameForProductsTable = function(id) {
            var shelfName = 'No shelf chosen';

            angular.forEach($ctrl.shelves, function(shelf) {
                if (shelf.id === id) {
                    shelfName = shelf.name;
                }
            });

            return shelfName;
        };

        $ctrl.getAllShelves();
        //Shelves - end.

        //Types
        function getTypes() {
            Product.getTypes().then(function (response) {
                $ctrl.types = response.data;
            }, function (error) {
                $exceptionHandler(JSON.stringify(error));
                console.log("Sorry, types could not be retrieved");
            });
        }

        getTypes();
        //Types - end
    }
}());

