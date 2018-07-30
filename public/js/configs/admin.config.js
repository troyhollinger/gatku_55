app.config(function($routeProvider) {

    $routeProvider
        .when('/discounts', {
            templateUrl : 'js/app/admin/discounts/discounts.html',
            controller: 'AdminDiscountsController'
        })
        .when('/home-settings', {
            templateUrl : "js/app/admin/home-settings/home-settings.html"
        })
        .when('/orders', {
            templateUrl : 'js/app/admin/orders/orders.html',
            controller: 'AdminOrdersController'
        })
        .when('/products', {
            templateUrl : 'js/app/admin/products/products.html',
            controller: 'AdminProductsController'
        })
        .when('/videos', {
            templateUrl : "js/app/admin/videos/videos.html"
        })
        .when('/you', {
            templateUrl : "js/app/admin/you/you.html"
        })
        .otherwise({
            templateUrl: 'js/app/admin/tab-not-supported.html'
        });
})