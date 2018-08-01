(function() {
    app.controller('AdminMainController', AdminMainController);

    function AdminMainController($scope) {

        $scope.adminLogout = function() {
            var r = confirm("Do you want to logout?");

            if (r === true) {
                window.location.replace('/logout');
            }
        };
    };
}());

