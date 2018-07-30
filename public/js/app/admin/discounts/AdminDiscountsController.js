app.controller('AdminDiscountsController',
    ['$scope', 'Discount', 'AlertService', '$exceptionHandler',
        function($scope, Discount, AlertService, $exceptionHandler) {

    //Discount part
    function fetchAllDiscounts() {
        Discount.all().then(function(response) {
            $scope.discounts = response.data;
        }, function(error) {
            $exceptionHandler(JSON.stringify(error));
        });
    };

    fetchAllDiscounts();

    function confirmUnusedCode(data) {
        //Here is condition to more then 1 because one record obviously exists by adding new record.
        if ($scope.discounts.filter(function(row) { return row.code === data.code; }).length > 1) {
            return true;
        }
        return false;
    }

    $scope.addDiscount = function() {
        var data = {
            discount: 0,
            code: ''
        };

        $scope.discounts.push(data);
    };

    $scope.discountUpdate = function(discountIndex) {
        $scope.discounts[discountIndex].changed = false;

        var data = $scope.discounts[discountIndex];

        //Check if code is already use don't allow to store data.
        //Code is unique field and primary key.
        if (confirmUnusedCode(data)) {
            alert('This discount code is already in use. Please change code or update previous use.');
        } else {
            if (!data.created_at) {
                Discount.store(data).then(function() {
                    AlertService.broadcast('Discount added!', 'success');
                    fetchAllDiscounts();
                }, function(error) {
                    $exceptionHandler(JSON.stringify(error));
                    AlertService.broadcast('There was a problem with adding Discount.');
                });
            } else {
                Discount.update(data.code, data).then(function() {
                    AlertService.broadcast('Discount updated!', 'success');
                    fetchAllDiscounts();
                }, function(error) {
                    $exceptionHandler(JSON.stringify(error));
                    AlertService.broadcast('There was a problem with Discount update.');
                });
            }

        }
    };

    $scope.getSaveUpdateButtonCaption = function(discount) {
        var buttonCaption = 'Update';

        if (!discount.created_at) {
            buttonCaption = 'Save';
        }

        return buttonCaption;
    };

    $scope.discountRemove = function(discountIndex) {
        var r = confirm('Do you want to remove this Discount?');
        if (r == true) {
            var data = $scope.discounts[discountIndex];

            if (!data.created_at) {
                $scope.discounts.slice(discountIndex);
                fetchAllDiscounts();
            } else {
                Discount.remove(data.code).then(function() {
                    AlertService.broadcast('Discount removed!', 'success');
                    fetchAllDiscounts();
                }).error(function(error) {
                    $exceptionHandler(JSON.stringify(error));
                    AlertService.broadcast('There was a problem with Discount removing.');
                });
            }
        }
    };

    $scope.discountRowChanged = function(discountIndex) {
        $scope.discounts[discountIndex].changed = true;
    };

    //Discount part - end
}]);



