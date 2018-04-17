app.factory('Image', ['$http', '$upload', function($http, $upload) {

    return {

        upload : function(data) {

            return $upload.upload(data);

        }

    }

}]);

app.factory('AvailabilityType', ['$http', function($http) {

    return {

        all : function() {

            return $http.get('/availability-type');

        }

    }

}]);    

app.factory('Product', ['$http', function($http) {

    return {

        all : function() {
            return $http.get('/product');
        },

        forPeriod : function(startDate, endDate) {  //consider to merge this function with all !!!
            return $http.get('/product', {
                params: {
                    start_date: startDate,
                    end_date: endDate
                }
            });
        },

        get : function(productId) {

            return $http.get('/product/get/' + productId)

        },
    
        getBySlug : function(slug) {

            return $http.get('/product/by/slug/' + slug);

        },

        store : function(data) {

            return $http.post('/product', data);

        },

        update : function(id, data) {

            return $http.put('/product/' + id, data);

        },

        getTypes : function() {

            return $http.get('/product/types');

        },

        getByType : function() {

            return $http.get('/product/by/type');

        },

        customerPhotos : function(productId) {

            return $http.get('/product/photos/' + productId);

        }

    }

}]);

app.factory('Discount', ['$http', function($http) {
    return {
        //Fetch all records from discounts table
        all : function() {
            return $http.get('/discount');
        },

        //Get one discount record with id
        get : function(code) {
            return $http.get('/discount/' + code);
        },

        //Delete one discount record with id
        remove: function(code) {
            return $http.delete('/discount/' + code);
        },

        //Add record to discounts table
        store : function(data) {
            return $http.post('/discount', data);
        },

        //Update record in discounts table
        update : function(code, data) {
            return $http.put('/discount/' + code, data);
        }
    }
}]);


app.factory('HearGoodStuff', ['$http', function($http) {
    return {
        store : function(data) {
            return $http.post('/hear-good-stuff', data);
        }
    }
}]);


app.factory('Order', ['$http', function($http) {


    return {

        all : function() {

            return $http.get('/order');

        },

        store : function(data) {

            return $http.post('/order', data);

        }

    }

}]);
app.factory('HomeSetting', ['$http', function($http) {
    return {
        all : function() {
            return $http.get('/home-setting');
        },
        save : function(data) {
            return $http.post('/home-setting', data);
        }
    }
}]);

app.factory('YouImage', ['$http', function($http) {

    return {

        all : function() {

            return $http.get('/you-image');

        },

        save : function(data) {

            return $http.post('/you-image', data);

        }

    }

}]);





app.factory('Size', ['$http', function($http) {
    return {
        getBySlug : function(slug) {
            return $http.get('/size/by/slug/' + slug);
        }
    }
}]);


app.factory('ShippingRequest', ['$http', function($http) {

    return {

        send : function(data) {

            return $http.post('/shipping-request', data);

        },

        pay : function(data) {

            return $http.post('/shipping-request/pay', data);

        }

    }

}]);


app.factory('ShippingTrack', ['$http', function($http) {


    return {

        send : function(data) {

            return $http.post('/shipping-track', data);

        }

    }

}]);

