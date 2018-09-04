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
            name: '',
            shortName: '',
            slug: '',
            price: '',
            available: 0
        };

        console.log('AdminProductSizeModalController');

    };
}());

