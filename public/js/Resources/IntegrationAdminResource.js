//Admin Integration Resource
app.factory('IntegrationAdminResource', function($resource) {
    return $resource('/admin/integration');
});
