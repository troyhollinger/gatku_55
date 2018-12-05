app.factory('QuantityReportResource', function($resource) {
    return $resource('/admin/quantity-report');
});