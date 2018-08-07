angular.module('app', [
    'ui.bootstrap'
])

    .controller('ctrl', function ($scope, $uibModal) {
        'use strict';

        $scope.openModal = function () {
            $uibModal.open({
                templateUrl: 'modal.html',
                controller: function ($scope, $uibModalInstance) {
                    $scope.ok = function () {
                        $uibModalInstance.close();
                    };

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                }
            })
        };
    });