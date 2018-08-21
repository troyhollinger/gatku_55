(function () {
    app.controller('ImageModalController', ImageModalController);

    function ImageModalController(imageUrl) {
        'use strict';

        var $ctrl = this;
        $ctrl.imageUrl = imageUrl;
    }
}());

