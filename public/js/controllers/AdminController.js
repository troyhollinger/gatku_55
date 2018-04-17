app.controller('AdminController',
    ['$scope', 'Image', 'Product', 'Discount', 'Order', 'YouImage', 'AvailabilityType', 'AlertService', 'HomeSetting',
        function($scope, Image, Product, Discount, Order, YouImage, AvailabilityType, AlertService,HomeSetting) {

    $scope.init = function() {
        $scope.show('orders');
        $scope.getProducts();
        getTypes();
        getYouImages();
        getHomeSettings();
        getAvailabilityTypes();
    }

    $scope.orders = [];
    $scope.types = [];
    $scope.availabilityTypes = [];
    $scope.products = [];
    $scope.newProduct = {};
    $scope.youImages = [];
    $scope.newYouImage = {};
    $scope.homeSetting = {};
    $scope.editState = false;
    $scope.editingNew = true;

    $scope.submitButton = 'Submit';

    $scope.show = function(section) {
        $scope.showOrders = false;
        $scope.showProducts = false;
        $scope.showYou = false;
        $scope.showVideos = false;
        $scope.showHomeSetting = false;
        $scope.showDiscountManager = false;
        $scope.reset();

        switch(section) {

            case 'orders' :
                $scope.showOrders = true;
                break;
            case 'products' : 
                $scope.showProducts = true;
                break;
            case 'you' :
                $scope.showYou = true;
                break;
            case 'videos' : 
                $scope.showVideos = true;
                break;
            case 'home-setting' : 
                $scope.showHomeSetting = true;
                break;
            case 'discount-manager' :
                $scope.showDiscountManager = true;
                break;

        }

    }

    $scope.getProducts = function() {
        if ($scope.order_start_date && $scope.order_end_date) {
            getProductsForPeriod();
        } else {
            getAllProducts();
        }
    }

    function getProductsForPeriod() {
        Product.forPeriod($scope.order_start_date, $scope.order_end_date).success(function(response) {
            countSoldItems(response.data);
        }).error(function(response) {
            console.log("Sorry, there was an error retrieving the products");
        });
    }

    function getAllProducts() {
        Product.all().success(function(response) {
            countSoldItems(response.data);
        }).error(function(response) {
            console.log("Sorry, there was an error retrieving the products");
        });
    }

    function countSoldItems(products) {
        angular.forEach(products, function(product, idx) {
            var sold = 0;
            angular.forEach(product.orderitems, function(orderitem) {
                 sold += orderitem.quantity;
            });
            products[idx].sold = sold;
        });
        $scope.products = products;
    }

    function getAvailabilityTypes() {
        AvailabilityType.all().success(function(response) {
            $scope.availabilityTypes = response.data;
        }).error(function(response) {
            console.log("Something went wrong on our end");
        });
    }

    $scope.saveProduct = function() {
        var nanobar = new Nanobar({ bg : '#fff' });

        nanobar.go(60);

        Product.store($scope.newProduct).success(function(response) {
            $scope.getProducts();
            $scope.reset();
            nanobar.go(100);
            AlertService.broadcast('Product saved!', 'success');
        }).error(function(response) {
            nanobar.go(100);
            AlertService.broadcast('There was a problem', 'error');
        });
    }

    $scope.createProduct = function() {
        $scope.newProduct = {};
        $scope.editState = true;
        $scope.editingNew = true;

        registerAddons();
    }

    $scope.editProduct = function(product) {
        $scope.newProduct = product;
        $scope.editState = true;
        $scope.editingNew = false;

        registerAddons();
    }

    $scope.updateProduct = function() {
        var nanobar = new Nanobar({ bg : '#fff' });
        var data = $scope.newProduct;

        nanobar.go(65);

        Product.update(data.id, data).success(function(response) {
            $scope.getProducts();
            $scope.reset();
            nanobar.go(100);
            AlertService.broadcast('Product updated!', 'success');
        }).error(function(response) {
            nanobar.go(100);
            AlertService.broadcast('There was a problem.', 'error');
        });
    }

    $scope.upload = function($files, model) {
        var nanobar = new Nanobar({ bg : '#fff' });
        var file = $files[0];

        if (!file) return false;

        var data = {
            url : '/product/image',
            file : file
        }

        nanobar.go(40);

        Image.upload(data).progress(function(evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        }).success(function(response) {
            $scope.newProduct[model] = response.data;

            nanobar.go(100);
        }).error(function(response) {
            nanobar.go(100);
        });

    }

    
    $scope.reset = function() {

        $scope.newProduct = {};
        $scope.newYouImage = {};
        $scope.editState = false;
        $scope.editingNew = true;

    }

    function getTypes() {
        Product.getTypes().success(function(response) {
            $scope.types = response.data;
        }).error(function(response) {
            console.log("Sorry, types could not be retrieved");
        });
    }

    function registerAddons() {
        $scope.newProduct.addonSelection = [];

        for(var i = 0; i < $scope.products.length; i++) {
            var addon = {};
            addon.id = $scope.products[i].id;
            addon.name = $scope.products[i].name;

            // If creating a new product, it has no addons obviously...
            if (!$scope.editingNew) {
                // If selected products has addons
                if ($scope.newProduct.addons.length) {
                    for(var e = 0; e < $scope.newProduct.addons.length; e++) {
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

    //Orders
    /*function getOrders() {
        Order.all().success(function(response) {
            $scope.orders = response.data;
        }).error(function(response) {
            console.log(response.message);
        });
    }*/

    // You
    $scope.youImages = [];
    $scope.newYouImage = {};

    function getYouImages() {
        YouImage.all().success(function(response) {
            $scope.youImages = response.data;
            Squares.init();
        }).error(function(response) {
            console.log("There was an error getting the You images");
        });
    }
    
    $scope.uploadYouImage = function($files) {
        var file = $files[0];

        if (!file) return false;

        var data = {
            url : '/you-image/upload',
            file : file
        }

        $scope.editState = true;

        Image.upload(data).success(function(response) {
            $scope.newYouImage.image = response.data;
        }).error(function(response) {
            console.log(response.message);
        });
    }

    $scope.saveYouImage = function() {
        var nanobar = new Nanobar({ bg : '#fff' });
        nanobar.go(40);

        YouImage.save($scope.newYouImage).success(function() {
            getYouImages();
            $scope.reset();

            nanobar.go(100);
        }).error(function(response) {
            console.log(response.message);
        });
    }

    $scope.clearNewYouImage = function() {
        $scope.newYouImage = false;
    }

    // home settings
    function getHomeSettings() {
        HomeSetting.all().success(function(response) {
            $scope.homeSetting = response.data ? response.data : {};
            Squares.init();        
        }).error(function(response) {
            console.log("There was an error getting the home settings");
        });
    }

    $scope.uploadHomeImage = function($files, model) {    
        var file = $files[0];

        if (!file) return false;

        var data = {
            url : '/home-image/upload',
            file : file
        }

        $scope.editState = true;

        Image.upload(data).success(function(response) {
            console.log(model);
           $scope.homeSetting[model] = response.data;
        }).error(function(response) {
            AlertService.broadcast('Sorry, there was an error, please try again', 'error');
        });

    }

    $scope.saveHomeSetting = function() {
        var nanobar = new Nanobar({ bg : '#fff' });
        nanobar.go(40);

        HomeSetting.save($scope.homeSetting).success(function() {
            getHomeSettings();
            AlertService.broadcast('Photo was successfully updated.', 'success');
            nanobar.go(100);
        }).error(function(response) {
            console.log(response.message);
        });
    }

    $scope.resetDateFilter = function() {
        $scope.order_start_date = ''
        $scope.order_end_date = '';
        $scope.getProducts();
    }

    //Discount part
    function fetchAllDiscounts() {
        Discount.all().success(function(response) {
            $scope.discounts = response.data;
        });
    };

    fetchAllDiscounts();

    function confirmUnusedCode(data) {
        //Here is condition to more then 1 because one record obviously exists by adding new record.
        if ($scope.discounts.filter(function(row) { return row.code === data.code; }).length > 1) {
            return true;
        }
        return false;
    }

    $scope.addDiscount = function() {
        var data = {
            discount: 0,
            code: ''
        };

        $scope.discounts.push(data);
    };

    $scope.discountUpdate = function(discountIndex) {
        $scope.discounts[discountIndex].changed = false;

        var data = $scope.discounts[discountIndex];

        //Check if code is already use don't allow to store data.
        //Code is unique field and primary key.
        if (confirmUnusedCode(data)) {
            alert('This discount code is already in use. Please change code or update previous use.');
        } else {
            if (!data.created_at) {
                Discount.store(data).success(function() {
                    AlertService.broadcast('Discount added!', 'success');
                    fetchAllDiscounts();
                }).error(function(error) {
                    AlertService.broadcast('There was a problem with Discounts adding: ' + error, 'error');
                });
            } else {
                Discount.update(data.code, data).success(function() {
                    AlertService.broadcast('Discount updated!', 'success');
                    fetchAllDiscounts();
                }).error(function(error) {
                    AlertService.broadcast('There was a problem with Discounts updates: ' + error, 'error');
                });
            }

        }
    };

    $scope.getSaveUpdateButtonCaption = function(discount) {
        var buttonCaption = 'Update';

        if (!discount.created_at) {
            buttonCaption = 'Save';
        }

        return buttonCaption;
    };

    $scope.discountRemove = function(discountIndex) {
        var r = confirm('Do you want to remove this Discount?');
        if (r == true) {
            var data = $scope.discounts[discountIndex];

            if (!data.created_at) {
                $scope.discounts.slice(discountIndex);
                fetchAllDiscounts();
            } else {
                Discount.remove(data.code).success(function() {
                    AlertService.broadcast('Discount removed!', 'success');
                    fetchAllDiscounts();
                }).error(function(error) {
                    AlertService.broadcast('There was a problem with Discount remove: ' + error, 'error');
                });
            }
        }
    };

    $scope.discountRowChanged = function(discountIndex) {
        $scope.discounts[discountIndex].changed = true;
    };

    //Discount part - end

    $scope.init();

}]);



