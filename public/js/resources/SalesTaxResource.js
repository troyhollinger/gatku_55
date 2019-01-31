app.factory('SalesTaxResource', function($resource) {
    return $resource('/admin/sales-tax/');
});