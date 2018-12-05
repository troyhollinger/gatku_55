(function () {
    app.controller('AdminQuantitySaleReport', AdminQuantitySaleReport);

    function AdminQuantitySaleReport($scope, QuantityReportResource, AlertService, $exceptionHandler) {

        var $ctrl = this;

        QuantityReportResource.query({}, function(response) {
            $ctrl.report = response;
        });
    };
}());

