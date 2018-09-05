(function () {
    app.controller('AdminProductSizeModalController', AdminProductSizeModalController);

    function AdminProductSizeModalController(
        $scope,
        $uibModalInstance,
        $exceptionHandler,
        size
    ) {
        'use strict';

        var $ctrl = this;

        $ctrl.size = size || {
            id: 0,
            name: '',
            shortName: '',
            productId: 0,
            slug: '',
            price: '',
            available: 0
        };

        $ctrl.sizeSaveUpdate = function() {
            $uibModalInstance.close($ctrl.size);
        };
    };
}());

