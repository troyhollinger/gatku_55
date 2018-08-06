(function () {
    app.controller('AdminShelvesController', AdminShelvesController);

    function AdminShelvesController($scope, Shelf, AlertService, $exceptionHandler) {

        var $ctrl = this;

        $ctrl.shelves = [];

        $ctrl.getAllShelves = function() {
            var promise = Shelf.all();

            promise.then(function(response) {
               $ctrl.shelves = response;
            }, function (error) {
                $exceptionHandler(JSON.stringify(error));
            });
        };

        $ctrl.getAllShelves();

        $ctrl.addDiscount = function () {
            var shelf = {
                id: 0,
                name: '',
                order: 0
            };

            $ctrl.shelves.push(shelf);
            $ctrl.updateOrder();
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
    };
}());

