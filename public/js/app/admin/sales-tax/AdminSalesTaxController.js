(function () {
    app.controller('AdminSalesTaxController', AdminSalesTaxController);

    function AdminSalesTaxController($scope, SalesTaxAdminResource, AlertService, $exceptionHandler) {

        var $ctrl = this;
        $ctrl.salesTaxes = [];

        //Don't move this method below
        function uploadSalesTaxes() {
            var promise = SalesTaxAdminResource.query();
            promise.$promise.then(function(response) {
                $ctrl.salesTaxes = response;
            }, function(error) {
                $exceptionHandler(JSON.stringify(error));
            });
        }

        uploadSalesTaxes();

        $ctrl.getSaveUpdateButtonCaption = function (salesTax) {
            var buttonCaption = 'Update';

            if (!salesTax.created_at) {
                buttonCaption = 'Save';
            }

            return buttonCaption;
        };

        $ctrl.salesTaxRowChanged = function (index) {
            $ctrl.salesTaxes[index].changed = true;
        };

        $ctrl.addStateTax = function () {
            var data = {
                state: '',
                tax: 0
            };

            $ctrl.salesTaxes.push(data);
        };

        var checkIfValueMatchPattern = function(value) {
            var result = value.state.match(/^[a-zA-Z0-9\s]*$/g);
            return result;
        };

        $ctrl.salesTaxUpdate = function (index) {

            $ctrl.salesTaxes[index].changed = false;

            var data = $ctrl.salesTaxes[index];

            if (!checkIfValueMatchPattern(data)) {
                alert('State name incorrect. Allowed only: [a-zA-Z0-9 space]. Please fix state name and save again.');
                return;
            }

            //Check if state is already. If in use then don't allow to store data.
            //State is unique field and primary key.
            if (confirmUnusedState(data)) {
                alert('This Tax State / Country is already in use. Please change State / Country.');
            } else {
                if (!data.created_at) {
                    SalesTaxAdminResource.save({data: data}).$promise.then(function () {
                        AlertService.broadcast('Tax added!', 'success');
                        uploadSalesTaxes();
                    }, function (error) {
                        $exceptionHandler(JSON.stringify(error));
                        AlertService.broadcast('There was a problem with adding Tax.');
                    });
                } else {
                    SalesTaxAdminResource.update({state: data.state, data: data}).$promise.then(function () {
                        AlertService.broadcast('Tax updated!', 'success');
                        uploadSalesTaxes();
                    }, function (error) {
                        $exceptionHandler(JSON.stringify(error));
                        AlertService.broadcast('There was a problem with Tax update.');
                    });
                }

            }
        };

        $ctrl.salesTaxRemove = function (index) {
            var r = confirm('Do you want to remove this Tax?');
            if (r == true) {
                var data = $ctrl.salesTaxes[index];

                if (!data.created_at) {
                    $ctrl.salesTaxes.slice(index);
                    uploadSalesTaxes();
                } else {
                    SalesTaxAdminResource.remove({state: data.state}).$promise.then(function () {
                        AlertService.broadcast('Tax removed!', 'success');
                        uploadSalesTaxes();
                    }, function (error) {
                        $exceptionHandler(JSON.stringify(error));
                        AlertService.broadcast('There was a problem with Tax removing.');
                    });
                }
            }
        };

        function confirmUnusedState(data) {
            //Here is condition to more then 1 because one record obviously exists by adding new record.
            if ($ctrl.salesTaxes.filter(function (row) {
                return row.state === data.state;
            }).length > 1) {
                return true;
            }
            return false;
        }
    };
}());

