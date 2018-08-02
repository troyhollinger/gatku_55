(function () {
    app.controller('AdminProductsController', AdminProductsController);
    function AdminProductsController($scope, Product, AvailabilityType, AlertService, Image, $http, $exceptionHandler) {

        var $ctrl = this;

        $scope.types = [];
        $scope.availabilityTypes = [];
        $scope.products = [];
        $scope.newProduct = {};
        $scope.editState = false;
        $scope.editingNew = true;

        $scope.submitButton = 'Submit';

        $ctrl.placeholderToday = dateToYMD(new Date());

        $scope.getProducts = function () {
            //This variables have to be in $scope
            if ($scope.order_start_date && $scope.order_end_date) {
                getProductsForPeriod();
            } else {
                getAllProducts();
            }
        }

        function dateToYMD(date) {
            var d = date.getDate();
            var m = date.getMonth() + 1; //Month from 0 to 11
            var y = date.getFullYear();
            return '' + y + '-' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
        }

        function getProductsForPeriod() {
            Product.forPeriod($scope.order_start_date, $scope.order_end_date).then(function (response) {
                countSoldItems(response.data);
            }, function (error) {
                $exceptionHandler(JSON.stringify(error));
                console.log("Sorry, there was an error retrieving the products");
            });
        }

        function getAllProducts() {
            Product.all().then(function (response) {
                countSoldItems(response.data);
            }, function (error) {
                $exceptionHandler(JSON.stringify(error));
                console.log("Sorry, there was an error retrieving the products");
            });
        }

        function countSoldItems(products) {
            angular.forEach(products, function (product, idx) {
                var sold = 0;
                angular.forEach(product.orderitems, function (orderitem) {
                    sold += orderitem.quantity;
                });
                products[idx].sold = sold;
            });
            $scope.products = products;
        }

        function getAvailabilityTypes() {
            AvailabilityType.all().then(function (response) {
                $scope.availabilityTypes = response.data;
            }, function (error) {
                $exceptionHandler(JSON.stringify(error));
                console.log("Something went wrong on our end");
            });
        }

        $scope.saveProduct = function () {
            var nanobar = new Nanobar({bg: '#fff'});

            nanobar.go(60);

            Product.store($scope.newProduct).then(function (response) {
                $scope.getProducts();
                $scope.reset();
                nanobar.go(100);
                AlertService.broadcast('Product saved!', 'success');
            }, function (error) {
                $exceptionHandler(JSON.stringify(error));
                nanobar.go(100);
                AlertService.broadcast('There was a problem', 'error');
            });
        };

        $scope.createProduct = function () {
            $scope.newProduct = {};
            $scope.editState = true;
            $scope.editingNew = true;
            registerAddons();
        };

        $scope.editProduct = function (product) {
            $scope.newProduct = product;
            $scope.editState = true;
            $scope.editingNew = false;
            registerAddons();
        };

        $scope.updateProduct = function () {
            var nanobar = new Nanobar({bg: '#fff'});
            var data = $scope.newProduct;

            nanobar.go(65);

            Product.update(data.id, data).then(function (response) {
                $scope.getProducts();
                $scope.reset();
                nanobar.go(100);
                AlertService.broadcast('Product updated!', 'success');
            }, function (error) {
                $exceptionHandler(JSON.stringify(error));
                nanobar.go(100);
                AlertService.broadcast('There was a problem.', 'error');
            });
        };

        $scope.upload = function ($files, model) {
            var nanobar = new Nanobar({bg: '#fff'});
            var file = $files[0];

            if (!file) return false;

            var data = {
                url: '/product/image',
                file: file
            }

            nanobar.go(40);

            Image.upload(data).progress(function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            }).then(function (response) {
                $scope.newProduct[model] = response.data;
                nanobar.go(100);
            }, function (error) {
                $exceptionHandler(JSON.stringify(error));
                nanobar.go(100);
            });
        };

        $scope.reset = function () {

            $scope.newProduct = {};
            $scope.newYouImage = {};
            $scope.editState = false;
            $scope.editingNew = true;
        };

        function getTypes() {
            Product.getTypes().then(function (response) {
                $scope.types = response.data;
            }, function (error) {
                $exceptionHandler(JSON.stringify(error));
                console.log("Sorry, types could not be retrieved");
            });
        }

        function registerAddons() {
            $scope.newProduct.addonSelection = [];

            for (var i = 0; i < $scope.products.length; i++) {
                var addon = {};
                addon.id = $scope.products[i].id;
                addon.name = $scope.products[i].name;

                // If creating a new product, it has no addons obviously...
                if (!$scope.editingNew) {
                    // If selected products has addons
                    if ($scope.newProduct.addons.length) {
                        for (var e = 0; e < $scope.newProduct.addons.length; e++) {
                            if ($scope.newProduct.addons[e].childId == $scope.products[i].id) {
                                addon.isAddon = true;

                                //
                                if ($scope.newProduct.addons[e].include_in_package) {
                                    addon.include_in_package = true;
                                } else {
                                    addon.include_in_package = false;
                                }

                                if ($scope.newProduct.addons[e].price_zero) {
                                    addon.price_zero = true;
                                } else {
                                    addon.price_zero = false;
                                }
                                break;
                            } else {
                                addon.isAddon = false;
                            }
                        }
                    } else {
                        addon.isAddon = false;
                    }
                } else {
                    addon.isAddon = false;
                }
                $scope.newProduct.addonSelection.push(addon);
            }
        }

        $ctrl.resetDateFilter = function () {
            $scope.order_start_date = ''
            $scope.order_end_date = '';
            getAllProducts();
        };

        $scope.getProducts();
        getTypes();
        getAvailabilityTypes();
    }
}());

