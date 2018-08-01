app.config(function($routeProvider) {

    $routeProvider
        .when('/discounts', {
            templateUrl : 'js/app/admin/discounts/AdminDiscounts.html',
            controller: 'AdminDiscountsController',
            controllerAs: '$ctrl'
        })
        .when('/home-settings', {
            templateUrl : 'js/app/admin/home-settings/AdminHomeSettings.html',
            controller: 'AdminHomeSettingsController',
            controllerAs: '$ctrl'
        })
        .when('/orders', {
            templateUrl : 'js/app/admin/orders/AdminOrders.html',
            controller: 'AdminOrdersController',
            controllerAs: '$ctrl'
        })
        .when('/products', {
            templateUrl : 'js/app/admin/products/AdminProducts.html',
            controller: 'AdminProductsController'
        })
        .when('/you', {
            templateUrl : 'js/app/admin/you/AdminYou.html',
            controller: 'AdminYouController'
        });
});
