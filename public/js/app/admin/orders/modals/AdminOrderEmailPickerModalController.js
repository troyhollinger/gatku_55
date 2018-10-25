(function () {
    app.controller('AdminOrderEmailPickerModalController', AdminOrderEmailPickerModalController);

    function AdminOrderEmailPickerModalController(
        $scope,
        order,
        $uibModalInstance,
        $exceptionHandler
    ) {
        'use strict';

        var $ctrl = this;

        $ctrl.emails = {
            adminEmailAdresses: [],
            customerEmailAdresses: []
        };

        function createRecord(val) {
            return {
                checked: false,
                email: val
            };
        }

        function getEmailLists() {
            angular.forEach(emailSettings, function(val, idx) {

                //admin
                if (idx.match(/admin_order_notify_email.+/g) && val) {
                    var record = createRecord(val);
                    $ctrl.emails.adminEmailAdresses.push(record);
                }

                //customer
                if (idx.match(/customer_order_notify_email.+/g) && val) {
                    var record = createRecord(val);
                    $ctrl.emails.customerEmailAdresses.push(record);
                }
            });

            //Add email to customer
            if (order.customer.email) {
                var record = createRecord(order.customer.email);
                $ctrl.emails.customerEmailAdresses.push(record);
            }
        }

        getEmailLists();

        $ctrl.sendEmails = function() {
            $uibModalInstance.close($ctrl.emails);
        };
    };
}());

