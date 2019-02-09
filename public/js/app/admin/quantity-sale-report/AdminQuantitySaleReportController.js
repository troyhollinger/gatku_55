(function () {
    app.controller('AdminQuantitySaleReportController', AdminQuantitySaleReportController);

    function AdminQuantitySaleReportController($scope, QuantityReportResource, $exceptionHandler) {

        var $ctrl = this;

        $ctrl.start = null;
        $ctrl.end = null;

        $ctrl.submitRequest = function() {
            QuantityReportResource.query({
                start: $ctrl.start,
                end: $ctrl.end
            }, function(response) {
                $ctrl.report = response;
            }, function(error) {
                $exceptionHandler(JSON.stringify(error));
            });
        };
    };
}());

