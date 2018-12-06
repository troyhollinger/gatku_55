(function () {
    app.controller('AdminQuantitySaleReport', AdminQuantitySaleReport);

    function AdminQuantitySaleReport($scope, QuantityReportResource, AlertService, $exceptionHandler) {

        var $ctrl = this;

        $ctrl.start = null;
        $ctrl.end = null;

        QuantityReportResource.query({
            start: $ctrl.start,
            end: $ctrl.end
        }, function(response) {
            $ctrl.report = response;
        });
    };
}());

