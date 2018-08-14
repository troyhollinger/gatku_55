(function () {
    app.controller('AdminEditShelfModalController', AdminEditShelfModalController);

    function AdminEditShelfModalController($scope, AlertService, shelf, $uibModalInstance) {
        'use strict';

        var $ctrl = this;

        if (typeof shelf === 'undefined') {
            $ctrl.shelf = {
                id: 0,
                name: '',
                order: 0,
                hidden: 0,
                name_text_align: 'left',
                name_font_style: 'normal',
                name_font_weight: 'normal'
            };
        } else {
            $ctrl.shelf = shelf;
        }

        $ctrl.text_align_options = ['left', 'right', 'center', 'justify', 'initial', 'inherit'];

        $ctrl.text_font_weight = ['normal', 'bold', 'bolder', 'lighter', 'number', 'initial', 'inherit'];

        $ctrl.text_font_style = ['normal', 'italic', 'oblique', 'initial', 'inherit'];

        $ctrl.shelfSaveUpdate = function() {
            $uibModalInstance.close($ctrl.shelf);
        }

    };
}());

