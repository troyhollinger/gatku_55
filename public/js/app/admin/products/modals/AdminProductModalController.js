(function () {
    app.controller('AdminProductModalController', AdminProductModalController);

    function AdminProductModalController(
        $scope,
        Product,
        AvailabilityType,
        AlertService,
        Image,
        Shelf,
        productObject,
        products,
        $http,
        $uibModalInstance
    ) {

        'use strict';

        var $ctrl = this;

        $ctrl.products = products;
console.log($ctrl.products);
        $ctrl.newProduct = productObject;
        if (!$ctrl.newProduct.hasOwnProperty('name')) {
            $ctrl.editingNew = true;
        } else {
            $ctrl.editingNew = false;
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

        registerAddons();
    };
}());

