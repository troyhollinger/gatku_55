(function () {
    app.controller('AdminProductsController', AdminProductsController);
    function AdminProductsController($scope, Product, AvailabilityType, AlertService, Image, $http, $exceptionHandler) {

        var $ctrl = this;

        $ctrl.types = [];
        $ctrl.availabilityTypes = [];
        $ctrl.products = [];
        $ctrl.newProduct = {};
        $ctrl.editState = false;
        $ctrl.editingNew = true;

        $ctrl.submitButton = 'Submit';

        $ctrl.placeholderToday = dateToYMD(new Date());

        $ctrl.getProducts = function () {
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
            $ctrl.products = products;
        }

        function getAvailabilityTypes() {
            AvailabilityType.all().then(function (response) {
                $ctrl.availabilityTypes = response.data;
            }, function (error) {
                $exceptionHandler(JSON.stringify(error));
                console.log("Something went wrong on our end");
            });
        }

        $ctrl.saveProduct = function () {
            var nanobar = new Nanobar({bg: '#fff'});

            nanobar.go(60);

            Product.store($ctrl.newProduct).then(function (response) {
                $ctrl.getProducts();
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
            $ctrl.newProduct = {};
            $ctrl.editState = true;
            $ctrl.editingNew = true;
            registerAddons();
        };

        $ctrl.editProduct = function (product) {
            $ctrl.newProduct = product;
            $ctrl.editState = true;
            $ctrl.editingNew = false;
            registerAddons();
        };

        // $ctrl.deleteProduct = function(product) {
        //
        //     var r = confirm("Do you want to delete this product?");
        //
        //     if (r === true) {
        //         Product.remove(product.id).then(function(){
        //             $ctrl.getProducts();
        //             $ctrl.reset();
        //             nanobar.go(100);
        //             AlertService.broadcast('Product deleted!', 'success');
        //         }, function (error) {
        //             $exceptionHandler(JSON.stringify(error));
        //             nanobar.go(100);
        //             AlertService.broadcast('There was a problem', 'error');
        //         });
        //     }
        // };

        $ctrl.updateProduct = function () {
            var nanobar = new Nanobar({bg: '#fff'});
            var data = $ctrl.newProduct;

            nanobar.go(65);

            Product.update(data.id, data).then(function (response) {
                $ctrl.getProducts();
                $ctrl.reset();
                nanobar.go(100);
                AlertService.broadcast('Product updated!', 'success');
            }, function (error) {
                $exceptionHandler(JSON.stringify(error));
                nanobar.go(100);
                AlertService.broadcast('There was a problem.', 'error');
            });
        };

        $ctrl.upload = function ($files, model) {
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
                $ctrl.newProduct[model] = response.data;
                nanobar.go(100);
            }, function (error) {
                $exceptionHandler(JSON.stringify(error));
                nanobar.go(100);
            });
        };

        $ctrl.reset = function () {

            $ctrl.newProduct = {};
            $ctrl.newYouImage = {};
            $ctrl.editState = false;
            $ctrl.editingNew = true;
        };

        function getTypes() {
            Product.getTypes().then(function (response) {
                $ctrl.types = response.data;
            }, function (error) {
                $exceptionHandler(JSON.stringify(error));
                console.log("Sorry, types could not be retrieved");
            });
        }

        function registerAddons() {
            $ctrl.newProduct.addonSelection = [];

            for (var i = 0; i < $ctrl.products.length; i++) {
                var addon = {};
                addon.id = $ctrl.products[i].id;
                addon.name = $ctrl.products[i].name;

                // If creating a new product, it has no addons obviously...
                if (!$ctrl.editingNew) {
                    // If selected products has addons
                    if ($ctrl.newProduct.addons.length) {
                        for (var e = 0; e < $ctrl.newProduct.addons.length; e++) {
                            if ($ctrl.newProduct.addons[e].childId == $ctrl.products[i].id) {
                                addon.isAddon = true;

                                //
                                if ($ctrl.newProduct.addons[e].include_in_package) {
                                    addon.include_in_package = true;
                                } else {
                                    addon.include_in_package = false;
                                }

                                if ($ctrl.newProduct.addons[e].price_zero) {
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
                $ctrl.newProduct.addonSelection.push(addon);
            }
        }

        $ctrl.resetDateFilter = function () {
            $scope.order_start_date = ''
            $scope.order_end_date = '';
            getAllProducts();
        };

        $ctrl.getProducts();
        getTypes();
        getAvailabilityTypes();
    }
}());

