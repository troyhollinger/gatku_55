app.factory('SalesTaxResource', function($resource) {
    return $resource(
        '/admin/sales-tax/:state',
        {state: '@state'},
        {
            update: {method: 'PUT'}
        }
    );
});