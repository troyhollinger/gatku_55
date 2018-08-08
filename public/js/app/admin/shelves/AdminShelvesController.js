(function () {
    app.controller('AdminShelvesController', AdminShelvesController);

    function AdminShelvesController($scope, $uibModal, Shelf, Shelves, AlertService, $exceptionHandler) {
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

        $ctrl.updateOrder = function(shelf, direction) {

            var oldPosition = shelf.order;
            var newPosition = oldPosition + direction;

            if ($ctrl.shelves[newPosition]) {
                var replacedShelf = $ctrl.shelves[newPosition];

                shelf.order = newPosition;
                $ctrl.shelves[newPosition] = shelf;

                replacedShelf.order = oldPosition;
                $ctrl.shelves[oldPosition] = replacedShelf;

                Shelves.update($ctrl.shelves).then(function() {
                    $ctrl.getAllShelves();
                });
            }
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

                //Below is code to update order for shelf
                var shelfCounts = $ctrl.shelves.push(shelf);
                var order = shelfCounts - 1;
                shelf.order = order;

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
    };
}());

