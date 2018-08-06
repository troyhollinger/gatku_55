(function () {
    app.controller('AdminShelvesController', AdminShelvesController);

    function AdminShelvesController($scope, AlertService, $exceptionHandler) {

        var $ctrl = this;

        $ctrl.shelve = [
            {
                id: 1,
                name: 'Shelf 1'
            },
            {
                id: 2,
                name: 'Shelf 2'
            }
        ];

        $ctrl.editShelf = function(id) {
            console.log('Edit : ' + id);
        };

        $ctrl.removeShelf = function(id) {
            console.log('Remove : ' + id);
        };
    };
}());

