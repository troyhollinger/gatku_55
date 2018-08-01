(function () {
    app.controller('AdminDiscountsController', AdminDiscountsController);

    function AdminDiscountsController($scope, Discount, AlertService, $exceptionHandler) {

        var $ctrl = this;

        //Don't move this method below. Need to be on top.
        function fetchAllDiscounts() {
            Discount.all().then(function (response) {
                $ctrl.discounts = response.data;
            }, function (error) {
                $exceptionHandler(JSON.stringify(error));
            });
        }

        fetchAllDiscounts();

        $ctrl.addDiscount = function () {
            var data = {
                discount: 0,
                code: ''
            };

            $ctrl.discounts.push(data);
        };

        $ctrl.discountUpdate = function (discountIndex) {

            $ctrl.discounts[discountIndex].changed = false;

            var data = $ctrl.discounts[discountIndex];

            //Check if code is already use don't allow to store data.
            //Code is unique field and primary key.
            if (confirmUnusedCode(data)) {
                alert('This discount code is already in use. Please change code or update previous use.');
            } else {
                if (!data.created_at) {
                    Discount.store(data).then(function () {
                        AlertService.broadcast('Discount added!', 'success');
                        fetchAllDiscounts();
                    }, function (error) {
                        $exceptionHandler(JSON.stringify(error));
                        AlertService.broadcast('There was a problem with adding Discount.');
                    });
                } else {
                    Discount.update(data.code, data).then(function () {
                        AlertService.broadcast('Discount updated!', 'success');
                        fetchAllDiscounts();
                    }, function (error) {
                        $exceptionHandler(JSON.stringify(error));
                        AlertService.broadcast('There was a problem with Discount update.');
                    });
                }

            }
        };

        $ctrl.getSaveUpdateButtonCaption = function (discount) {
            var buttonCaption = 'Update';

            if (!discount.created_at) {
                buttonCaption = 'Save';
            }

            return buttonCaption;
        };

        $ctrl.discountRemove = function (discountIndex) {
            var r = confirm('Do you want to remove this Discount?');
            if (r == true) {
                var data = $ctrl.discounts[discountIndex];

                if (!data.created_at) {
                    $ctrl.discounts.slice(discountIndex);
                    fetchAllDiscounts();
                } else {
                    Discount.remove(data.code).then(function () {
                        AlertService.broadcast('Discount removed!', 'success');
                        fetchAllDiscounts();
                    }, function (error) {
                        $exceptionHandler(JSON.stringify(error));
                        AlertService.broadcast('There was a problem with Discount removing.');
                    });
                }
            }
        };

        $ctrl.discountRowChanged = function (discountIndex) {
            $ctrl.discounts[discountIndex].changed = true;
        };

        function confirmUnusedCode(data) {
            //Here is condition to more then 1 because one record obviously exists by adding new record.
            if ($ctrl.discounts.filter(function (row) {
                return row.code === data.code;
            }).length > 1) {
                return true;
            }
            return false;
        }
    };
}());

