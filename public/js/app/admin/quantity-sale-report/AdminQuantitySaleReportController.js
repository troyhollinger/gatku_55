(function () {
    app.controller('AdminQuantitySaleReportController', AdminQuantitySaleReportController);

    function AdminQuantitySaleReportController($scope, QuantityReportResource, $exceptionHandler) {

        var $ctrl = this;

        $ctrl.start = null;
        $ctrl.end = null;

        $ctrl.totals = [];

        $ctrl.submitRequest = function() {
            QuantityReportResource.query({
                start: $ctrl.start,
                end: $ctrl.end
            }, function(response) {
                $ctrl.report = response;
                $ctrl.totals = [];
            }, function(error) {
                $exceptionHandler(JSON.stringify(error));
            });
        };

        $ctrl.getTotalsFor = function(column) {
            if ($ctrl.totals[column] && $ctrl.totals[column] != 0) {
                return $ctrl.totals[column];
            }

            if (!$ctrl.totals[column]) {
                $ctrl.totals[column] = 0;
            }

            angular.forEach($ctrl.report, function(row) {
                $ctrl.totals[column] += parseInt(row[column]);
            });

            return $ctrl.totals[column] || 0;
        };
    };
}());

