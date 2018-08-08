(function () {
    app.controller('AdminShelvesController', AdminShelvesController);

    function AdminShelvesController($scope, $uibModal, Shelf, AlertService, $exceptionHandler) {
        'use strict';

        var $ctrl = this;

        $ctrl.getAllShelves = function() {
            var promise = Shelf.all();

            promise.then(function(response) {
                $ctrl.shelves = response.data;
            }, function (error) {
                $exceptionHandler(JSON.stringify(error));
            });
        };

        $ctrl.getAllShelves();

        $ctrl.updateOrder = function() {
            var previousShelf = null;

            angular.forEach($ctrl.shelves, function(shelf) {
                if (shelf.order === 0) {
                    shelf.order = (previousShelf) ? previousShelf.order + 1 : 1;
                }

                previousShelf = shelf;
            });
        };

        $ctrl.editAddShelf = function(shelf) {

            var modalInstance = $uibModal.open({
                templateUrl: 'js/app/admin/shelves/modals/AdminEditShelfModal.html',
                controller: 'AdminEditShelvesController',
                controllerAs: '$ctrl',
                backdrop: 'static',
                resolve: {
                    shelf: function() {
                        return shelf;
                    }
                }
            });

            modalInstance.result.then(function(updatedShelf) {
                $ctrl.shelfSaveUpdate(updatedShelf);
            });
        };

        $ctrl.shelfSaveUpdate = function(shelf) {
            if (!shelf.created_at) {
                Shelf.store(shelf).then(function () {
                    AlertService.broadcast('Discount added!', 'success');
                    $ctrl.getAllShelves();
                }, function (error) {
                    $exceptionHandler(JSON.stringify(error));
                    AlertService.broadcast('There was a problem with adding Discount.');
                });
            } else {
                Shelf.update(shelf.id, shelf).then(function () {
                    AlertService.broadcast('Shelf updated!', 'success');
                    $ctrl.getAllShelves();
                }, function (error) {
                    $exceptionHandler(JSON.stringify(error));
                    AlertService.broadcast('There was a problem with Shelf update.');
                });
            }
        };

        $ctrl.removeShelf = function(shelf) {
console.log('Remove : ' + shelf);
        };
    };
}());

