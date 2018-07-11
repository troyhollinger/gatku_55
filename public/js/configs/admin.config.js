app.config(function($routeProvider) {

    console.log('This is executed');

    $routeProvider
        .when("/admin/main", {
            templateUrl : "main.htm"
        })
        .when("/red", {
            templateUrl : "red.htm"
        })
        .when("/green", {
            templateUrl : "green.htm"
        })
        .when("/blue", {
            templateUrl : "blue.htm"
        });
});