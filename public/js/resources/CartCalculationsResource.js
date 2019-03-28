/**
 * Resource to get Cart Calculaions based on Cart content
 *
 */
app.factory('CartCalculationsResource', function($resource) {
    return $resource('/cart-calculations');
});
