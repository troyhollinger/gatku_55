app.config(function($routeProvider) {

    $routeProvider
        .when('/orders', {
            templateUrl : "angular-routes/orders.html"
        })
        .when('/products', {
            templateUrl : "angular-routes/products.html"
        })
        .otherwise({
            redirectTo: '/'
        });
})