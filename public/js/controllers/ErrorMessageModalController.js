(function () {
        app.controller('ErrorMessageModalController', ErrorMessageModalController);

        function ErrorMessageModalController($scope, $uibModalInstance, errorMessage) {
            $scope.errorMessage = errorMessage;
        }
    }
)();

