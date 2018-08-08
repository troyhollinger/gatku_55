(function () {
    app.controller('AdminEditShelvesController', AdminEditShelvesController);

    function AdminEditShelvesController($scope, AlertService, shelf, $uibModalInstance) {
        'use strict';

        var $ctrl = this;

        if (typeof shelf === 'undefined') {
            $ctrl.shelf = {
                id: 0,
                name: '',
                order: 0,
                hidden: 0
            };
        } else {
            $ctrl.shelf = shelf;
        }

        $ctrl.shelfSaveUpdate = function() {
            $uibModalInstance.close($ctrl.shelf);
        }
    };
}());

