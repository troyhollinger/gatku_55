(function () {
    app.controller('AdminProductModalController', AdminProductModalController);

    function AdminProductModalController(
        $scope,
        Product,
        availabilityTypes,
        AlertService,
        Image,
        shelves,
        productObject,
        products,
        types,
        $uibModalInstance,
        $exceptionHandler
    ) {
        'use strict';

        var $ctrl = this;

        $ctrl.products = products;
        $ctrl.newProduct = productObject;
        if (!$ctrl.newProduct.hasOwnProperty('id')) {
            $ctrl.editingNew = true;    //This is needed for function registerAddons
        } else {
            $ctrl.editingNew = false;   //This is needed for function registerAddons
        }

        $ctrl.shelves = shelves;
        $ctrl.types = types;
        $ctrl.availabilityTypes = availabilityTypes;

        $ctrl.upload = function ($files, model) {
            var nanobar = new Nanobar({bg: '#fff'});
            var file = $files[0];

            if (!file) return false;

            var data = {
                url: '/product/image',
                file: file
            };

            nanobar.go(40);

            Image.upload(data).progress(function(evt) {
            }).then(function (response) {
                $ctrl.newProduct[model] = response.data;
                nanobar.go(100);
            }, function (error) {
                $exceptionHandler(JSON.stringify(error));
                nanobar.go(100);
            });
        };

        $ctrl.productSaveUpdate = function () {
            var nanobar = new Nanobar({bg: '#fff'});
            nanobar.go(65);

            if ($ctrl.newProduct.hasOwnProperty('id')) {
                Product.update($ctrl.newProduct.id, $ctrl.newProduct).then(function () {
                    $uibModalInstance.close($ctrl.newProduct);
                }, function (error) {
                    $exceptionHandler(JSON.stringify(error));
                    nanobar.go(100);
                    AlertService.broadcast('There was a problem.', 'error');
                });
            } else {
                Product.store($ctrl.newProduct).then(function () {
                    $uibModalInstance.close($ctrl.newProduct);
                }, function (error) {
                    $exceptionHandler(JSON.stringify(error));
                    nanobar.go(100);
                    AlertService.broadcast('There was a problem.', 'error');
                });
            }

        };

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

        registerAddons();
    };
}());
