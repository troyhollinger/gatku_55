(function () {
    app.controller('AdminShelvesController', AdminShelvesController);

    function AdminShelvesController($scope, $uibModal, AlertService, $exceptionHandler) {
        'use strict';

        var $ctrl = this;

        $ctrl.shelves = [
            {
                id: 1,
                name: 'Shelf 1',
                order: 1
            },
            {
                id: 2,
                name: 'Shelf 2',
                order: 2
            }
        ];

        $ctrl.getAllShelves = function() {
            var promise = Shelf.all();

            promise.then(function(response) {
                $ctrl.shelves = response;
            }, function (error) {
                $exceptionHandler(JSON.stringify(error));
            });
        };

        //$ctrl.getAllShelves();

        $ctrl.addDiscount = function () {

            $uibModal.open({
                templateUrl: 'js/app/admin/shelves/modals/AdminEditShelfModal.html',
                controller: 'AdminEditShelvesController',
                controllerAs: '$ctrl'
            }).result.then(function(response){
                console.log(response);
            }, function(error){
                console.log(error);
            });

            var shelf = {
                id: 3,
                name: 'Added shelf',
                order: 3
            };

            $ctrl.shelves.push(shelf);
            //$ctrl.updateOrder();
        };

        $ctrl.shelfUpdate = function(id) {

            var shelf = $ctrl.shelves[id];

            if (!shelf.created_at) {
                Shelf.store(shelf).then(function () {
                    AlertService.broadcast('Discount added!', 'success');
                    $ctrl.getAllShelves();
                }, function (error) {
                    $exceptionHandler(JSON.stringify(error));
                    AlertService.broadcast('There was a problem with adding Discount.');
                });
            } else {
                Discount.update(shelf.id, shelf).then(function () {
                    AlertService.broadcast('Shelf updated!', 'success');
                    $ctrl.getAllShelves();
                }, function (error) {
                    $exceptionHandler(JSON.stringify(error));
                    AlertService.broadcast('There was a problem with Shelf update.');
                });
            }
        };

        $ctrl.updateOrder = function() {
            var previousShelf = null;

            angular.forEach($ctrl.shelves, function(shelf) {
                if (shelf.order === 0) {
                    shelf.order = (previousShelf) ? previousShelf.order + 1 : 1;
                }

                previousShelf = shelf;
            });
        };

        $ctrl.editShelf = function(id) {
            //console.log('Edit : ' + id);

// console.log($uibModal);

            $uibModal.open({
                templateUrl: 'js/app/admin/shelves/modals/AdminEditShelfModal.html',
                controller: 'AdminEditShelvesController',
                controllerAs: '$ctrl',
                size: 'lg'
            });

            //console.log('test');
        };

        $ctrl.removeShelf = function(id) {
            console.log('Remove : ' + id);
        };
    };
}());

